import { NextResponse } from 'next/server';
import { AutoTokenizer, AutoModelForSequenceClassification } from '@transformers';
import * as torch from 'torch';
import { google } from 'googleapis';
import { Counter } from 'collections';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import * as dotenv from 'dotenv';
import re from 're';

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const model_name = "distilbert-base-uncased-finetuned-sst-2-english";
const tokenizer = AutoTokenizer.from_pretrained(model_name);
const model = AutoModelForSequenceClassification.from_pretrained(model_name);

const analyzeSentiment = async (text) => {
  const inputs = tokenizer(text, { return_tensors: "pt", truncation: true, padding: true });
  const outputs = await model(inputs);
  const probabilities = torch.softmax(outputs.logits, -1);
  const sentiment = probabilities[0][1].item() > probabilities[0][0].item() ? "positive" : "negative";
  return sentiment;
};

const extractVideoId = (url) => {
  const match = re.search(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/, url);
  return match ? match[1] : null;
};

const getVideoStats = async (videoId) => {
  const youtube = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });
  const response = await youtube.videos.list({ part: "statistics,snippet", id: videoId });
  
  if (response.data.items.length) {
    const item = response.data.items[0];
    const stats = item.statistics;
    const snippet = item.snippet;
    return {
      title: snippet.title,
      views: stats.viewCount,
      likes: stats.likeCount || 'N/A',
      comments: stats.commentCount,
    };
  }
  return null;
};

const getVideoComments = async (videoId, maxResults = 100) => {
  const youtube = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });
  const comments = [];
  
  let request = await youtube.commentThreads.list({
    part: "snippet",
    videoId,
    maxResults,
  });
  
  while (request && comments.length < maxResults) {
    const response = await request;
    
    response.data.items.forEach(item => {
      const comment = item.snippet.topLevelComment.snippet.textDisplay;
      comments.push(comment);
    });
    
    request = response.nextPageToken ? youtube.commentThreads.list({
      part: "snippet",
      videoId,
      maxResults,
      pageToken: response.nextPageToken,
    }) : null;
  }
  
  return comments.slice(0, maxResults);
};

const createSentimentGraph = async (sentiments) => {
  const counts = new Counter(sentiments);
  
  const chartCallback = (ChartJS) => {
    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
    ChartJS.defaults.global.legend.display = false;
  };
  
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600, chartCallback });
  
  const configuration = {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Sentiment Count',
        data: Object.values(counts),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  
  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  return imageBuffer.toString('base64');
};

export async function POST(request) {
  const { video_url } = await request.json();
  
  const video_id = extractVideoId(video_url);
  if (!video_id) {
    return NextResponse.json({ error: 'Invalid YouTube URL' });
  }
  
  const video_stats = await getVideoStats(video_id);
  if (!video_stats) {
    return NextResponse.json({ error: 'Could not fetch video statistics' });
  }
  
  const comments = await getVideoComments(video_id);
  const sentiments = await Promise.all(comments.map(comment => analyzeSentiment(comment)));
  
  const sentiment_counts = new Counter(sentiments);
  const overall_sentiment = sentiment_counts['positive'] > sentiment_counts['negative'] ? "positive" : "negative";
  
  const graph = await createSentimentGraph(sentiments);
  
  return NextResponse.json({
    video_stats,
    sentiment_counts,
    overall_sentiment,
    graph
  });
}
