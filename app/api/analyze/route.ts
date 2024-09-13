import { NextRequest, NextResponse } from 'next/server';
import * as tf from '@tensorflow/tfjs';


const sentimentModelUrl = 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json';
let model: tf.LayersModel | null = null;


const loadModel = async () => {
  if (!model) {
    console.log('Loading sentiment model...');
    try {
      await tf.ready();
      tf.disposeVariables();
      
      model = await tf.loadLayersModel(sentimentModelUrl);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      model = null;
    }
  }
  return model;
};

const apiKey = process.env.YOUTUBE_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl } = body;

    console.log('Received video URL:', videoUrl);

    if (!videoUrl) {
      return NextResponse.json({ error: 'Missing video URL' }, { status: 400 });
    }

    const videoId = extractYoutubeVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL. Please provide a valid YouTube video URL.' }, { status: 400 });
    }

    console.log('Extracted video ID:', videoId);


    const loadedModel = await loadModel();
    if (!loadedModel) {
      console.error('Failed to load sentiment model');
      return NextResponse.json({ error: 'Failed to load sentiment model' }, { status: 500 });
    }

    const videoDetails = await fetchVideoDetails(videoId);
    if (!videoDetails) {
      return NextResponse.json({ error: 'Failed to fetch video details' }, { status: 500 });
    }
    console.log('Video Title:', videoDetails.title);
    console.log('Video Description:', videoDetails.description);
    console.log('Views:', videoDetails.views);
    console.log('Likes:', videoDetails.likes);


    const descriptionSentiment = await analyzeSentiment(loadedModel, videoDetails.description);


    const { positiveCommentCount, negativeCommentCount } = await analyzeCommentsSentiment(loadedModel, videoId);

    return NextResponse.json({
      title: videoDetails.title,
      views: videoDetails.views,
      likes: videoDetails.likes,
      sentiment: descriptionSentiment,
      positiveCommentCount,
      negativeCommentCount
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}


function extractYoutubeVideoId(url: string): string | null {
  const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


async function fetchVideoDetails(videoId: string) {
  try {
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${apiKey}`;
    const response = await fetch(youtubeApiUrl);
    const data = await response.json();

    if (data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    

    return {
      title: video.snippet.title,
      description: video.snippet.description,
      views: video.statistics.viewCount,
      likes: video.statistics.likeCount,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
}


async function analyzeCommentsSentiment(model: tf.LayersModel, videoId: string) {
  try {
    const youtubeCommentsApiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?videoId=${videoId}&part=snippet&maxResults=100&key=${apiKey}`;
    const response = await fetch(youtubeCommentsApiUrl);
    const data = await response.json();

    let positiveCommentCount = 0;
    let negativeCommentCount = 0;

    for (const item of data.items) {
      const comment = item.snippet.topLevelComment.snippet.textDisplay;
      const sentiment = await analyzeSentiment(model, comment);

      if (sentiment === 'positive') {
        positiveCommentCount++;
      } else {
        negativeCommentCount++;
      }
    }

    return { positiveCommentCount, negativeCommentCount };
  } catch (error) {
    console.error('Error fetching or analyzing comments:', error);
    return { positiveCommentCount: 0, negativeCommentCount: 0 };
  }
}

async function analyzeSentiment(model: tf.LayersModel, text: string) {
  try {
    const processedInput = preprocessTextForSentiment(text);
    const prediction = model.predict(processedInput) as tf.Tensor;
    const sentimentScore = prediction.dataSync()[0];
    return sentimentScore > 0.5 ? 'positive' : 'negative';
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return 'unknown';
  }
}


function preprocessTextForSentiment(text: string): tf.Tensor {

  const tokens = text.split(' ').map(word => word.length); 

  const MAX_TOKENS = 100;
  if (tokens.length < MAX_TOKENS) {
    while (tokens.length < MAX_TOKENS) {
      tokens.push(0); 
    }
  } else if (tokens.length > MAX_TOKENS) {
    tokens.length = MAX_TOKENS; 
  }

  return tf.tensor2d([tokens], [1, MAX_TOKENS]);
}
