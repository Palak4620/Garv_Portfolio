import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link, useLocation, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { db } from "./firebase";
import Header from "./Header";
import FooterSection from "./FooterSection";
import bgLogo from "./Garv_logo_enhanched.png";

const projectMap = {
  "promo-videos": "Promo Videos",
  "logo-animations": "Logo Animations",
  "short-form-content": "Short-form Content",
};

const isYouTube = (url = "") =>
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)/i.test(
    url,
  );

const isVimeo = (url = "") =>
  /(?:vimeo\.com\/|player\.vimeo\.com\/)/i.test(url);

const getYouTubeThumbnail = (url = "") => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&/]+)/i,
  );

  if (!match) return "";

  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
};

function ProjectPage() {
  const { slug } = useParams();
  const location = useLocation();

  // -----------------------------------------
  // Determine which project page is being shown
  // -----------------------------------------

  let actualSlug = slug;

  // /motiondesign and /motiongraphics
  // should show the same content as /works/promo-videos

  if (
    location.pathname === "/motiondesign" ||
    location.pathname === "/motiongraphics"
  ) {
    actualSlug = "promo-videos";
  }

  const projectTitle = projectMap[actualSlug];

  const [project, setProject] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    const fetchProjectVideos = async () => {
      try {
        setLoading(true);

        const [projectsSnapshot, videosSnapshot] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "videos")),
        ]);

        const projectList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const foundProject = projectList.find(
          (item) =>
            item.title?.trim().toLowerCase() ===
            projectTitle?.trim().toLowerCase(),
        );

        if (!foundProject) {
          setProject(null);
          setVideos([]);
          return;
        }

        setProject(foundProject);

        const projectVideos = videosSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((video) => video.projectId === foundProject.id)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setVideos(projectVideos);
      } catch (error) {
        console.error("Error fetching project videos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectTitle) {
      fetchProjectVideos();
    } else {
      setLoading(false);
    }
  }, [projectTitle]);

  // Short-form page should use vertical videos
  const isShortForm = actualSlug === "short-form-content";

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading videos...</p>
      </div>
    );
  }

  // -----------------------------------------
  // Page Not Found
  // -----------------------------------------

  if (!projectTitle) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-semibold mb-4">Page Not Found</h1>

        <Link to="/" className="text-blue-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  // -----------------------------------------
  // Page
  // -----------------------------------------

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-hidden relative">
      <Header />

      <main className="relative px-4 pb-16 md:px-20 max-w-8xl mx-auto overflow-hidden">
        {/* ================= BACKGROUND LOGO ================= */}

        <div
          className="
            absolute
            top-0
            h-[490px]
            w-[210%]
            pointer-events-none
            opacity-10
            right-[-400px]
            sm:right-[-200px]
            md:right-[-450px]
          "
        >
          <img
            src={bgLogo}
            alt="Background G Logo"
            className="h-full object-cover ml-auto"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* ================= PAGE TITLE ================= */}

          <div className="text-center pb-14">
            <h1 className="text-4xl md:text-5xl font-semibold mt-5">
              {projectTitle}
            </h1>

            {project?.description && (
              <p className="max-w-2xl mx-auto mt-5 text-gray-400">
                {project.description}
              </p>
            )}
          </div>

          {/* ================= VIDEOS ================= */}

          {videos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No videos available yet.</p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${
                isShortForm ? "max-w-5xl mx-auto" : ""
              }`}
            >
              {videos.map((video, index) => {
                const isPlaying = playingVideo === index;

                return (
                  <div key={video.id} className="group">
                    {/* VIDEO CONTAINER */}

                    <div
                      className={`relative w-full ${
                        isShortForm ? "aspect-[9/16]" : "aspect-video"
                      } bg-[#252525] rounded-xl overflow-hidden`}
                    >
                      {/* PLAYING VIDEO */}

                      {isPlaying ? (
                        <ReactPlayer
                          url={video.url}
                          width="100%"
                          height="100%"
                          controls
                          playing
                        />
                      ) : isYouTube(video.url) ? (
                        /* YOUTUBE */

                        <button
                          type="button"
                          onClick={() => setPlayingVideo(index)}
                          className="relative w-full h-full block"
                        >
                          <img
                            src={getYouTubeThumbnail(video.url)}
                            alt={video.title}
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition">
                            <div className="w-14 h-14 rounded-full bg-white/50 text-white flex items-center justify-center text-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              ▶
                            </div>
                          </div>
                        </button>
                      ) : isVimeo(video.url) ? (
                        /* VIMEO */

                        <div className="w-full h-full">
                          <ReactPlayer
                            url={video.url}
                            width="100%"
                            height="100%"
                            controls
                            light
                          />
                        </div>
                      ) : (
                        /* OTHER URL */

                        <a
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-full flex items-center justify-center bg-[#252525] text-blue-400 hover:text-blue-300"
                        >
                          Open Video ↗
                        </a>
                      )}
                    </div>

                    {/* VIDEO TITLE */}

                    <h2 className="text-lg font-medium mt-4">{video.title}</h2>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}

export default ProjectPage;
