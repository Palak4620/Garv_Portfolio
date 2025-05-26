import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const VideoGallery = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const videoList = [
    {
      title: 'Showreel Full',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      title: 'Showreel YouTube',
      url: 'https://vimeo.com/76979871',
    },
    {
      title: 'Animation Edit 1',
      url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    },
    {
      title: 'Social Media Promo',
      url: 'https://vimeo.com/22439234',
    },
    {
      title: 'Product Showcase',
      url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    },
    {
      title: 'Event Highlights',
      url: 'https://vimeo.com/146022717',
    }
  ];

  return (
    <div className="p-4">
      <div className="flex items-start gap-6 bg-[#1f1f1f] p-6 rounded-xl">
        <img
          src="https://i.imgur.com/S0C3vHv.jpg"
          alt="Showreel Cover"
          className="w-[300px] h-[180px] object-cover rounded-lg"
        />
        <div className="text-white">
          <h2 className="text-2xl font-semibold mb-2">Video Editing Showreel</h2>
          <p className="text-sm text-gray-300">
            This Showreel highlights my skills, showcasing variety of styles from quick cuts to cinematic sequences.
            I craft engaging and dynamic edits, animations and designs which combined together can be a game changer.
            Be it promotions, social media content or product showcases, I got you covered..
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">After Effects</span>
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">Premiere Pro</span>
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">Illustrator</span>
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">Photoshop</span>
          </div>
          <button
            onClick={() => setShowGallery(!showGallery)}
            className="mt-4 text-blue-400 hover:underline text-sm"
          >
            🎬 Watch Video
          </button>
        </div>
      </div>

      {showGallery && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-black p-6 rounded-xl">
          {videoList.map((video, index) => (
            <div key={index} className="w-full h-[200px] bg-gray-800 rounded-lg overflow-hidden">
              {activeVideo === index ? (
                <ReactPlayer url={video.url} width="100%" height="100%" controls playing />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-sm cursor-pointer hover:bg-gray-700"
                  onClick={() => setActiveVideo(index)}
                >
                  {video.title}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
