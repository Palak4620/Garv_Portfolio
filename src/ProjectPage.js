import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link, useLocation, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { db } from "./firebase";
import Header from "./Header";
import FooterSection from "./FooterSection";
import bgLogo from "./Garv_logo_enhanched.png";

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

/*
  Converts:

  "promo-videos"
  "/promo-videos"
  "Promo Videos"

  into a clean comparable value.
*/
const normalizeSlug = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
};

const generateSlug = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/* =========================================================
   PROJECT PAGE
========================================================= */

function ProjectPage() {
  const { slug } = useParams();
  const location = useLocation();

  const [project, setProject] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);

  /* =======================================================
     GET CURRENT URL
  ======================================================= */

  const getCurrentRoute = () => {
    const pathname = location.pathname;

    /*
      /works/promo-videos
      becomes:
      promo-videos
    */

    if (pathname.startsWith("/works/")) {
      return normalizeSlug(pathname.replace("/works/", ""));
    }

    /*
      /motiondesign
      /motiongraphics

      becomes:
      motiondesign
      motiongraphics
    */

    return normalizeSlug(pathname);
  };

  /* =======================================================
     FETCH PROJECT + VIDEOS
  ======================================================= */

  useEffect(() => {
    const fetchProjectVideos = async () => {
      try {
        setLoading(true);

        const [projectsSnapshot, videosSnapshot] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "videos")),
        ]);

        /* ================================================
           PROJECTS
        ================================================ */

        const projectList = projectsSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        /* ================================================
           VIDEOS
        ================================================ */

        const videoList = videosSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        /* ================================================
           CURRENT ROUTE
        ================================================ */

        const currentRoute = getCurrentRoute();

        console.log("Current project route:", currentRoute);

        console.log("Projects from Firestore:", projectList);

        /* ================================================
           FIND PROJECT

           Match URL with:

           1. project.slug

           OR

           2. project.aliases
        ================================================ */
        const foundProject = projectList.find((item) => {
          // 1. Explicit slug from Firestore
          const projectSlug = normalizeSlug(item.slug || "");

          // 2. Aliases from Firestore
          const aliases = Array.isArray(item.aliases)
            ? item.aliases.map((alias) => normalizeSlug(alias))
            : [];

          // 3. Generate slug from title
          const generatedSlug = generateSlug(item.title || "");

          // 4. Firestore document ID
          const documentId = normalizeSlug(item.id || "");

          console.log("Checking project:", item.title, {
            documentId,
            slug: projectSlug,
            generatedSlug,
            aliases,
            currentRoute,
          });

          return (
            // Explicit slug
            projectSlug === currentRoute ||
            // Additional URLs
            aliases.includes(currentRoute) ||
            // Old projects without slug
            (!projectSlug && generatedSlug === currentRoute) ||
            // Firestore document ID
            documentId === currentRoute
          );
        });
        /* ================================================
           PROJECT NOT FOUND
        ================================================ */

        if (!foundProject) {
          console.log("No project found for route:", currentRoute);

          setProject(null);
          setVideos([]);

          return;
        }

        console.log("Found project:", foundProject);

        setProject(foundProject);

        /* ================================================
           GET VIDEOS USING PROJECT ID

           This is important.

           Videos are NOT connected using
           project title.

           They are connected using:

           video.projectId === project.id
        ================================================ */

        const projectVideos = videoList
          .filter((video) => video.projectId === foundProject.id)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        console.log("Videos for project:", projectVideos);

        setVideos(projectVideos);
      } catch (error) {
        console.error("Error fetching project videos:", error);

        setProject(null);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectVideos();
  }, [location.pathname]);

  /* =======================================================
     SHORT FORM DETECTION
  ======================================================= */

  /*
    We don't use the project TITLE here.

    This makes it independent from the title.

    If you rename:

    Short-form Content
    ->
    Social Media Reels

    then slug remains:

    short-form-content

    and the vertical layout continues.
  */

  const isShortForm =
    normalizeSlug(project?.slug || "") === "short-form-content";

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading videos...</p>
      </div>
    );
  }

  /* =======================================================
     PAGE NOT FOUND
  ======================================================= */

  if (!project) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-semibold mb-4">Page Not Found</h1>

        <p className="text-gray-500 mb-6 text-center">
          No project is configured for this URL.
        </p>

        <Link to="/" className="text-blue-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-hidden relative">
      <Header />

      <main className="relative px-4 pb-16 md:px-20 max-w-8xl mx-auto overflow-hidden">
        {/* =================================================
            BACKGROUND LOGO
        ================================================= */}

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
          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <div className="text-center pb-14">
            <h1 className="text-4xl md:text-5xl font-semibold mt-5">
              {project.title}
            </h1>

            {project.description && (
              <p className="max-w-2xl mx-auto mt-5 text-gray-400">
                {project.description}
              </p>
            )}
          </div>

          {/* =================================================
              VIDEOS
          ================================================= */}

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
                    {/* ===================================
                          VIDEO CONTAINER
                      =================================== */}

                    <div
                      className={`relative w-full ${
                        isShortForm ? "aspect-[9/16]" : "aspect-video"
                      } bg-[#252525] rounded-xl overflow-hidden`}
                    >
                      {/* =================================
                            PLAYING VIDEO
                        ================================= */}

                      {isPlaying ? (
                        <ReactPlayer
                          url={video.url}
                          width="100%"
                          height="100%"
                          controls
                          playing
                        />
                      ) : isYouTube(video.url) ? (
                        /* =================================
                             YOUTUBE
                          ================================= */

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

                          {/* HOVER OVERLAY */}

                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                            <div className="w-14 h-14 rounded-full bg-black/50 text-white flex items-center justify-center text-xl shadow-lg opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                              ▶
                            </div>
                          </div>
                        </button>
                      ) : isVimeo(video.url) ? (
                        /* =================================
                             VIMEO
                          ================================= */

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
                        /* =================================
                             OTHER URL
                          ================================= */

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

                    {/* ===================================
                          VIDEO TITLE
                      =================================== */}

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
