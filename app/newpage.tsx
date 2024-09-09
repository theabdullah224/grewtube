'use client';

import { useState } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_url: videoUrl }),
    });

    const result = await res.json();
    setAnalysisResult(result);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">YouTube Video Sentiment Analyzer</h1>
      <form onSubmit={handleAnalyze} className="mb-8">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
          Analyze
        </button>
      </form>

      {analysisResult && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
          <p><strong>Title:</strong> {analysisResult.video_stats.title}</p>
          <p><strong>Views:</strong> {analysisResult.video_stats.views}</p>
          <p><strong>Likes:</strong> {analysisResult.video_stats.likes}</p>
          <p><strong>Comments:</strong> {analysisResult.video_stats.comments}</p>
          <p><strong>Overall Sentiment:</strong> {analysisResult.overall_sentiment}</p>
          <img src={`data:image/png;base64,${analysisResult.graph}`} alt="Sentiment Graph" />
        </div>
      )}
    </div>
  );
}
