import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/* =====================================================
   HELPERS
===================================================== */

const isYouTube = (url = "") =>
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)/i.test(
    url,
  );

const isVimeo = (url = "") =>
  /(?:vimeo\.com\/|player\.vimeo\.com\/)/i.test(url);

const isVideoUrl = (url = "") => isYouTube(url) || isVimeo(url);

const getYouTubeThumbnail = (url = "") => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&/]+)/i,
  );

  if (!match) {
    return "/default_thumb.png";
  }

  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
};

/* =====================================================
   WORK SECTION
===================================================== */

const WorkSection = () => {
  const [projects, setProjects] = useState([]);
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  // Which project's video gallery is open
  const [activeIndex, setActiveIndex] = useState(null);

  // Which gallery video is currently playing
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);

  // References for scrolling to opened gallery
  const videoRefs = useRef([]);

  /* ===================================================
     FETCH PROJECTS + VIDEOS
  =================================================== */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsSnapshot, videosSnapshot] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "videos")),
        ]);

        const projectList = projectsSnapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const videoList = videosSnapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setProjects(projectList);
        setVideos(videoList);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ===================================================
     SCROLL TO VIDEO GALLERY
  =================================================== */

  useEffect(() => {
    if (activeIndex !== null && videoRefs.current[activeIndex]) {
      setTimeout(() => {
        videoRefs.current[activeIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 150);
    }
  }, [activeIndex]);

  /* ===================================================
     TOGGLE VIDEO GALLERY
  =================================================== */

  const toggleProjectVideos = (index) => {
    setActiveIndex((currentIndex) => (currentIndex === index ? null : index));

    // Stop gallery video when closing/changing gallery
    setPlayingVideoIndex(null);
  };

  /* ===================================================
     OPEN VIDEO GALLERY
  =================================================== */

  const openProjectVideos = (index) => {
    setActiveIndex(index);
    setPlayingVideoIndex(null);
  };

  /* ===================================================
     GET PROJECT MEDIA
  =================================================== */

  const getProjectMedia = (project) => {
    const mediaType = project.mediaType || (project.imageUrl ? "image" : "url");

    if (mediaType === "url") {
      return project.mediaUrl || project.link || "";
    }

    return project.mediaUrl || project.imageUrl || "";
  };

  /* ===================================================
     GET PROJECT VIDEOS
  =================================================== */

  const getProjectVideos = (projectId) => {
    return videos
      .filter((video) => video.projectId === projectId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return (
      <section
        id="work"
        className="bg-[#1a1a1a] py-20 text-white px-4 md:px-10 lg:px-20"
      >
        <div className="text-center text-gray-500">Loading projects...</div>
      </section>
    );
  }

  /* ===================================================
     MAIN
  =================================================== */

  return (
    <section
      id="work"
      className="bg-[#1a1a1a] py-20 text-white px-4 md:px-10 lg:px-20"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="text-center mb-14">
        <span className="text-xs text-gray-400 border border-gray-600 px-3 py-1 rounded-full">
          Work
        </span>

        <h2 className="text-2xl mt-4 text-gray-300 font-medium">
          Some of the noteworthy projects I have built:
        </h2>
      </div>

      {/* =================================================
          PROJECTS
      ================================================= */}

      {projects.length === 0 ? (
        <div className="text-center text-gray-500">No projects available.</div>
      ) : (
        <div className="flex flex-col gap-12 max-w-6xl mx-auto">
          {projects.map((project, index) => {
            const projectMedia = getProjectMedia(project);

            const projectVideos = getProjectVideos(project.id);

            const mediaType =
              project.mediaType || (project.imageUrl ? "image" : "url");

            const mediaIsVideo =
              mediaType === "url" && isVideoUrl(projectMedia);

            const mediaIsExternalLink =
              mediaType === "url" && projectMedia && !mediaIsVideo;

            return (
              <div key={project.id}>
                {/* =================================
                      PROJECT CARD
                  ================================= */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } bg-[#1c1c1c] rounded-xl overflow-hidden`}
                >
  
                    <div
                    className={`md:w-1/2 w-full bg-[#3d3d40] flex items-center justify-center p-6  ${
                      projectVideos.length > 0 && !mediaIsExternalLink
                        ? "cursor-pointer"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        projectVideos.length > 0 &&
                        !mediaIsVideo &&
                        !mediaIsExternalLink
                      ) {
                        toggleProjectVideos(index);
                      }
                    }}
                  >
                    {/* =========================
                          MAIN PROJECT VIDEO
                      ========================= */}

                    {mediaIsVideo ? (
                      <div
                        className="w-full aspect-video rounded-lg overflow-hidden bg-black"
                        onClick={(e) => {
                          if (projectVideos.length > 0) {
                            openProjectVideos(index);
                          }
                        }}
                      >
                        <ReactPlayer
                          url={projectMedia}
                          width="100%"
                          height="100%"
                          controls
                          light={
                            isYouTube(projectMedia)
                              ? getYouTubeThumbnail(projectMedia)
                              : true
                          }
                          playIcon={
                            <div className="w-14 h-14 rounded-full bg-black/70 text-black flex items-center justify-center text-xl">
                              ▶
                            </div>
                          }
                        />
                      </div>
                    ) : mediaIsExternalLink ? (
                      /* =========================
                           NORMAL URL
                        ========================= */

                      <a
                        href={projectMedia}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full aspect-video rounded-lg bg-[#232323] border border-zinc-700 hover:border-zinc-500 transition flex flex-col items-center justify-center gap-3 text-center p-6"
                      >
                        <span className="text-4xl">↗</span>

                        {/* <span className="text-sm text-gray-300">
                          View Project
                        </span> */}

                        <span className="text-xs text-gray-500 break-all max-w-full">
                          {projectMedia}
                        </span>
                      </a>
                    ) : projectMedia ? (
                      /* =========================
                           PROJECT IMAGE
                        ========================= */

                      <div className="relative w-full">
                        <img
                          src={projectMedia}
                          alt={project.title}
                          className="rounded-lg object-contain max-h-[300px] w-full"
                        />

                        {/* IMAGE CLICK HINT */}
                      </div>
                    ) : (
                      /* =========================
                           NO MEDIA
                        ========================= */

                      <div className="rounded-lg w-full aspect-video bg-[#232323] flex items-center justify-center text-gray-500">
                        No Media
                      </div>
                    )}
                  </div>

                  {/* ===============================
                        PROJECT DESCRIPTION
                    =============================== */}

                  <div className="md:w-1/2 w-full bg-[#232323] p-6 flex flex-col justify-center">
                    <h3 className="text-white text-xl font-semibold mb-2">
                      {project.title}
                    </h3>

                    <p className="text-sm text-gray-300 mb-4">
                      {project.description}
                    </p>

                    {/* =========================
                          TAGS
                      ========================= */}

                    {Array.isArray(project.tags) && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, i) => (
                          <span
                            key={`${tag}-${i}`}
                            className="bg-[#333] text-sm text-gray-300 px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* =========================
                          NORMAL PROJECT LINK
                      ========================= */}

                    {/* {project.link &&
                      project.link !== "#" &&
                      project.link !== projectMedia && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-blue-400 hover:underline mb-3 inline-block"
                        >
                          View Project ↗
                        </a>
                      )} */}

                    {/* =========================
                          VIDEO GALLERY BUTTON
                      ========================= */}

                    {projectVideos.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleProjectVideos(index)}
                        className="text-sm text-blue-400 hover:underline flex items-center gap-1 w-fit"
                      >
                        <span>🎬</span>

                        {activeIndex === index
                          ? "Hide Videos"
                          : `Watch Videos (${projectVideos.length})`}
                      </button>
                    )}
                  </div>
                </motion.div>

                {/* =================================
                      VIDEO GALLERY
                  ================================= */}

                {activeIndex === index && projectVideos.length > 0 && (
                  <div
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-[#111] p-6 rounded-xl"
                  >
                    {projectVideos.map((video, videoIndex) => (
                      <div
                        key={video.id}
                        className={`relative w-full ${
                          project.title.toLowerCase().includes("short")
                            ? "aspect-[9/16]"
                            : "aspect-video"
                        } bg-[#333] rounded-lg overflow-hidden`}
                      >
                        {/* =================================
                                  PLAYING VIDEO
                              ================================= */}

                        {playingVideoIndex === videoIndex ? (
                          <ReactPlayer
                            url={video.url}
                            width="100%"
                            height="100%"
                            controls
                            playing
                          />
                        ) : isYouTube(video.url) ? (
                          /* =================================
                                   YOUTUBE THUMBNAIL
                                ================================= */

                          <div className="relative w-full h-full">
                            <img
                              src={getYouTubeThumbnail(video.url)}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />

                            {/* =========================
                                      PLAY BUTTON
                                  ========================= */}

                            <button
                              type="button"
                              onClick={() => {
                                setPlayingVideoIndex(videoIndex);
                              }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition">
                                ▶
                              </div>
                            </button>
                          </div>
                        ) : isVimeo(video.url) ? (
                          /* =================================
                                   VIMEO PREVIEW
                                ================================= */

                          <ReactPlayer
                            url={video.url}
                            width="100%"
                            height="100%"
                            light
                            controls
                            playIcon={
                              <div className="w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition">
                                ▶
                              </div>
                            }
                          />
                        ) : (
                          /* =================================
                                   OTHER VIDEO URL
                                ================================= */

                          <ReactPlayer
                            url={video.url}
                            width="100%"
                            height="100%"
                            light
                            controls
                            playIcon={
                              <div className="w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition">
                                ▶
                              </div>
                            }
                          />
                        )}

                        {/* =========================
                                  VIDEO TITLE
                              ========================= */}

                        {/* <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-2 text-xs text-white truncate pointer-events-none">
                          {video.title}
                        </div> */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default WorkSection;
