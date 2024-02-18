"use client";
import React, { useState, useEffect } from "react";

const HomePage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<any>();
  const [metadataLoaded, setMetadataLoaded] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handleOptimizeClick = async () => {
    setLoading(false);
    try {
      const response = await fetch("/api/extractAudio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setMetadata(data.metadata);
        setMetadataLoaded(true);
      } else {
        console.error("Failed to optimize metadata");
      }
    } catch (error) {
      console.error("Error optimizing metadata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-indigo-700 text-white">
      <h1 className="text-3xl font-bold mb-4">YouTube Metadata Optimizer</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={videoUrl}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
          placeholder="Enter YouTube video URL"
        />
        <button
          onClick={handleOptimizeClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
        >
          {loading ? "Loading..." : "Optimize"}
        </button>
      </div>
      {metadataLoaded && metadata && (
        <div className="bg-white bg-opacity-10 p-4 m-[5rem] rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{metadata}</h2>
        </div>
      )}
    </div>
  );
};

export default HomePage;
