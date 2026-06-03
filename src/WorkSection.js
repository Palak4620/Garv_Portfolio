import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import Gaming_Edits from "./icons/Gaming_Edits.jpg";
import Promo from "./icons/Promo.png";
import Shorts from "./icons/Shorts.png";
// import Website from "./icons/Website.png";
import Showreel from "./icons/Showreel.png";
import Logo_Title_Animation from "./icons/Logo_Title_Animation.png";

// Helper to determine if a video is Vimeo
const isVimeo = (url) => url.includes("vimeo.com");

// Extract YouTube thumbnail
const getYouTubeThumbnail = (url) => {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/.*v=)([^?&]+)/);
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }
  return "/default_thumb.png";
};

// Video sets for each project
const videoMap = {
  0: [{ title: "Showreel 1", url: "https://youtu.be/3VM-ayBwYMY?si=-C8_78CAFuoNoReV" }],

  1: [
    { title: "Promo Video", url: "https://youtu.be/9qKOWWM_bzM" },
    {
      title: "Promo Video",
      url: "https://youtu.be/gA13t1-zdVM?si=vrNmYhctbLYva4Pe",
    },
    {
      title: "Promo Video",
      url: "https://youtu.be/h2wzcmeoHuA?si=--qCOdepj3_2TKZn",
    },
  ],
  2: [
    { title: "Logo Title Animation 1", url: "https://youtu.be/x5cykILO1Rw" },
    {
      title: "Logo Title Animation 2",
      url: "https://youtu.be/oDUVk-K2CiA?si=4hDvJ8dJ9iMFgJ8h",
    },
    { title: "Logo Title Animation 3", url: "https://youtu.be/fOLtinr477s" },
  ],
  3: [
    { title: "Short 1", url: "https://youtu.be/TQjYB0Yhspc?feature=shared" },
    { title: "Short 2", url: "https://youtu.be/OK3fMbiNwqE?si=EGFN02R3DmyUnoA8" },
    { title: "Short 3", url: "https://youtu.be/npJXLGYymMM?si=jbbZQKiqyGco42Is" },
  ],

  // 4: [
  //   { title: "Website Walkthrough1", url: "https://youtu.be/XQVTTvxBRb0" },
  //   { title: "Website Walkthrough2", url: "https://youtu.be/LXRg-eyfXso" },
  // ],
  5: [
    { title: "Gameplay 1", url: "https://youtu.be/nKFBvgwh-PA?feature=shared" },
    { title: "Gameplay 2", url: "https://youtu.be/m0RQO5EcLzE?feature=shared" },
    { title: "Gameplay 3", url: "https://youtu.be/UfUu4MJPbdk?feature=shared" },
    { title: "Gameplay 4", url: "https://youtu.be/AZik4nyVT3g?feature=shared" },
    { title: "Gameplay 5", url: "https://youtu.be/PaSXRX57FoI?feature=shared" },
    {
      title: "Gameplay 6",
      url: "https://youtu.be/H3Ol5ovAGz0?si=vKYzjWFAUB30hrCu",
    },
  ],
};

const projects = [
  {
    title: "Portfolio Showreel",
    description:
      "This Showreel highlights my motion design expertise blending sleek animations, dynamic compositions, and diverse styles from clean minimalism to cinematic storytelling. I craft visually engaging and impactful motion graphics that elevate brands and ideas. Whether it’s promotional videos, social media visuals, or product showcases, I’ve got you covered.",
    tags: ["After Effects", "Premiere Pro", "Illustrator", "Photoshop"],
    image: Showreel,
    link: "https://vimeo.com/837125126?share=copy",
  },
  {
    title: "Promo Videos",
    description:
      "These Promo Videos offers a cinematic look into the information of the products showcased, from game trailer to websites walkthrough. These videos brings a cinematic experience and builds excitement and anticipation for the release of the product.",
    tags: ["After Effects", "Premiere Pro", "Illustrator", "Photoshop"],
    image: Promo,
    link: "#",
  },
  {
    title: " Logo Animations",
    description:
      "These logo animations crafted for brands and creators, focus on dynamic visuals, smooth transitions, and impactful reveals to elevate brand identity. From minimal animations to bold cinematic styles, everything is covered.",
    tags: ["After Effects", "Premiere Pro", "Illustrator", "Photoshop"],
    image: Logo_Title_Animation,
    link: "#",
  },

  {
    title: "Short-form Content",
    description:
      "These short-form content edits made for content creators and brands, focuses on eye catchy visuals, strategic storytelling, and on-brand messaging to boost reach and engagement. From trendy edits to unique styles, everything is covered.",
    tags: ["After Effects", "Premiere Pro", "Illustrator", "Photoshop"],
    image: Shorts,
    link: "https://drive.google.com/folder/xyz",
  },

  // {
  //   title: "Website Animations",
  //   description:
  //     "These animations made for offers walkthrough to the website's functionality and layout, guiding users to features, menu options and interaction. These animations provide user-friendly navigation through engaging visuals, allowing viewers to explore core functions intuitively.",
  //   tags: ["After Effects", "Premiere Pro", "Illustrator", "Photoshop"],
  //   image: Website,
  //   link: "https://drive.google.com/folder/abc",
  // },
  {
    title: "Gaming Video Edits",
    description:
      "Expertly edited gaming montages showcasing high-energy action, memorable plays, and thrilling sequences. These short, impactful videos are optimized for social media, featuring smooth transitions, energetic pacing, and well-timed effects to boost engagement.",
    tags: ["After Effects", "Premiere Pro", "Illustrator", "Photoshop"],
    image: Gaming_Edits,
    link: "https://www.youtube.com/playlist?list=PLsdfcb42cePHPBmKUAFAUolbANN1DMgug",
  },
];

const WorkSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    if (activeIndex !== null && videoRefs.current[activeIndex]) {
      setTimeout(() => {
        videoRefs.current[activeIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 100);
    }
  }, [activeIndex]);

  return (
    <section
      id="work"
      className="bg-[#1a1a1a] py-20 text-white px-4 md:px-10 lg:px-20"
    >
      <div className="text-center mb-14">
        <span className="text-xs text-gray-400 border border-gray-600 px-3 py-1 rounded-full">
          Work
        </span>
        <h2 className="text-2xl mt-4 text-gray-300 font-medium">
          Some of the noteworthy projects I have built:
        </h2>
      </div>

      <div className="flex flex-col gap-12 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <div key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } bg-[#1c1c1c] rounded-xl overflow-hidden`}
            >
              {/* Clickable Image */}
              <div
                className="md:w-1/2 w-full bg-[#3d3d40] flex items-center justify-center p-6 cursor-pointer"
                onClick={() => {
                  setActiveIndex(activeIndex === index ? null : index);
                  setPlayingVideoIndex(null);
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="rounded-lg object-contain max-h-[300px] w-full"
                />
              </div>

              {/* Description */}
              <div className="md:w-1/2 w-full bg-[#232323] p-6 flex flex-col justify-center">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-[#333] text-sm text-gray-300 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveIndex(activeIndex === index ? null : index);
                    setPlayingVideoIndex(null);
                  }}
                  className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>🎬</span>{" "}
                  {activeIndex === index ? "Hide Videos" : "Watch Videos"}
                </button>
              </div>
            </motion.div>

            {/* Video Gallery */}
            {activeIndex === index && (
              <div
                ref={(el) => (videoRefs.current[index] = el)}
                className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-[#111] p-6 rounded-xl"
              >
                {videoMap[index]?.map((video, vidIndex) => (
                  <div
                    key={vidIndex}
                    className={`relative w-full ${
                      index === 3 ? "aspect-[9/16]" : "aspect-video"
                    } bg-[#333] rounded-lg overflow-hidden cursor-pointer hover:opacity-80`}
                    onClick={() => setPlayingVideoIndex(vidIndex)}
                  >
                    {playingVideoIndex === vidIndex ? (
                      <ReactPlayer
                        url={video.url}
                        width="100%"
                        height="100%"
                        controls
                        playing
                        style={{ objectFit: "cover" }}
                      />
                    ) : isVimeo(video.url) ? (
                      <iframe
                        src={video.url}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        title={video.title}
                        className="w-full h-full object-cover rounded-lg"
                      ></iframe>
                    ) : (
                      <img
                        src={getYouTubeThumbnail(video.url)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkSection;
