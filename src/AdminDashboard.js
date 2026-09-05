import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";

const isYouTube = (url = "") =>
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)/i.test(
    url,
  );

const getYouTubeThumbnail = (url = "") => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&/]+)/i,
  );

  if (!match) return "";

  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
};

/* =========================================================
   CLOUDINARY CONFIG
========================================================= */

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

/* =========================================================
   COMMON CLASSES
========================================================= */

const inputClass =
  "w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white";

const buttonClass = "px-5 py-3 rounded-lg transition disabled:opacity-50";

/* =========================================================
   CLOUDINARY HELPERS
========================================================= */

const validateImageFile = (file) => {
  if (!file) return true;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    alert("Only JPG, JPEG and PNG images are allowed.");
    return false;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    alert("Image size must be 5 MB or less.");
    return false;
  }

  return true;
};

const uploadImageToCloudinary = async (file) => {
  if (!file) return "";

  if (!validateImageFile(file)) {
    throw new Error("Invalid image file.");
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary configuration is missing. Check your .env file.",
    );
  }

  const formData = new FormData();

  formData.append("file", file);

  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary upload error:", data);

    throw new Error(data.error?.message || "Image upload failed.");
  }

  return data.secure_url;
};

/* =========================================================
   MODAL
========================================================= */

function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* =========================================================
   MEDIA TYPE BUTTONS
========================================================= */

function MediaTypeButtons({ value, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        type="button"
        onClick={() => onChange("image")}
        className={`flex-1 px-4 py-3 rounded-lg border transition ${
          value === "image"
            ? "bg-white text-black border-white"
            : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
        }`}
      >
        Image
      </button>

      <button
        type="button"
        onClick={() => onChange("url")}
        className={`flex-1 px-4 py-3 rounded-lg border transition ${
          value === "url"
            ? "bg-white text-black border-white"
            : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
        }`}
      >
        URL
      </button>
    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard() {
  /* =======================================================
     DATA
  ======================================================= */

  const [projects, setProjects] = useState([]);

  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     PROJECT STATES
  ======================================================= */

  const [showAddProject, setShowAddProject] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [savingProject, setSavingProject] = useState(false);

  const [updatingProject, setUpdatingProject] = useState(false);

  /* ADD PROJECT */

  const [projectTitle, setProjectTitle] = useState("");

  const [projectDescription, setProjectDescription] = useState("");

  const [projectTags, setProjectTags] = useState("");

  const [projectMediaType, setProjectMediaType] = useState("image");

  const [projectImageFile, setProjectImageFile] = useState(null);

  const [projectMediaUrl, setProjectMediaUrl] = useState("");

  const [projectLink, setProjectLink] = useState("");

  /* EDIT PROJECT */

  const [editProjectTitle, setEditProjectTitle] = useState("");

  const [editProjectDescription, setEditProjectDescription] = useState("");

  const [editProjectTags, setEditProjectTags] = useState("");

  const [editProjectMediaType, setEditProjectMediaType] = useState("image");

  const [editProjectImageUrl, setEditProjectImageUrl] = useState("");

  const [editProjectImageFile, setEditProjectImageFile] = useState(null);

  const [editProjectMediaUrl, setEditProjectMediaUrl] = useState("");

  const [editProjectLink, setEditProjectLink] = useState("");

  /* =======================================================
     VIDEO STATES
  ======================================================= */

  const [showAddVideo, setShowAddVideo] = useState(false);

  const [editingVideo, setEditingVideo] = useState(null);

  const [savingVideo, setSavingVideo] = useState(false);

  const [updatingVideo, setUpdatingVideo] = useState(false);

  const [selectedProject, setSelectedProject] = useState("");

  const [videoTitle, setVideoTitle] = useState("");

  const [videoUrl, setVideoUrl] = useState("");

  const [editVideoTitle, setEditVideoTitle] = useState("");

  const [editVideoUrl, setEditVideoUrl] = useState("");

  const [editVideoProject, setEditVideoProject] = useState("");

  /* =======================================================
     FETCH DATA
  ======================================================= */

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

        if (projectList.length > 0) {
          setSelectedProject(projectList[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);

        alert("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =======================================================
     PROJECT FORM HELPERS
  ======================================================= */

  const resetProjectForm = () => {
    setProjectTitle("");
    setProjectDescription("");
    setProjectTags("");
    setProjectMediaType("image");
    setProjectImageFile(null);
    setProjectMediaUrl("");
    setProjectLink("");
  };

  const openEditProject = (project) => {
    setEditingProject(project);

    setEditProjectTitle(project.title || "");

    setEditProjectDescription(project.description || "");

    setEditProjectTags(
      Array.isArray(project.tags) ? project.tags.join(", ") : "",
    );

    const mediaType = project.mediaType || (project.mediaUrl ? "url" : "image");

    setEditProjectMediaType(mediaType);

    setEditProjectImageUrl(project.imageUrl || "");

    setEditProjectImageFile(null);

    setEditProjectMediaUrl(project.mediaUrl || "");

    setEditProjectLink(project.link || "");
  };

  const closeEditProject = () => {
    setEditingProject(null);

    setEditProjectTitle("");
    setEditProjectDescription("");
    setEditProjectTags("");
    setEditProjectMediaType("image");
    setEditProjectImageUrl("");
    setEditProjectImageFile(null);
    setEditProjectMediaUrl("");
    setEditProjectLink("");
  };

  /* =======================================================
     ADD PROJECT
  ======================================================= */

  const handleAddProject = async (e) => {
    e.preventDefault();

    if (!projectTitle.trim() || !projectDescription.trim()) {
      alert("Project title and description are required.");

      return;
    }

    if (projectMediaType === "image" && !projectImageFile) {
      alert("Please select an image.");

      return;
    }

    if (projectMediaType === "url" && !projectMediaUrl.trim()) {
      alert("Please enter a URL.");

      return;
    }

    if (projectImageFile && !validateImageFile(projectImageFile)) {
      return;
    }

    try {
      setSavingProject(true);

      const tags = projectTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      let imageUrl = "";
      let mediaUrl = "";

      if (projectMediaType === "image") {
        imageUrl = await uploadImageToCloudinary(projectImageFile);

        mediaUrl = imageUrl;
      } else {
        mediaUrl = projectMediaUrl.trim();
      }

      const projectData = {
        title: projectTitle.trim(),

        description: projectDescription.trim(),

        tags,

        mediaType: projectMediaType,

        mediaUrl,

        imageUrl,

        link: projectLink.trim(),

        order: projects.length,

        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "projects"), projectData);

      const newProject = {
        id: docRef.id,
        ...projectData,
      };

      setProjects((prev) => [...prev, newProject]);

      resetProjectForm();

      setShowAddProject(false);
    } catch (error) {
      console.error("Error adding project:", error);

      alert(error.message || "Failed to add project.");
    } finally {
      setSavingProject(false);
    }
  };

  /* =======================================================
     UPDATE PROJECT
  ======================================================= */

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    if (!editingProject) {
      return;
    }

    if (!editProjectTitle.trim() || !editProjectDescription.trim()) {
      alert("Project title and description are required.");

      return;
    }

    if (
      editProjectMediaType === "image" &&
      !editProjectImageFile &&
      !editProjectImageUrl.trim()
    ) {
      alert("Please select an image.");

      return;
    }

    if (editProjectMediaType === "url" && !editProjectMediaUrl.trim()) {
      alert("Please enter a URL.");

      return;
    }

    if (editProjectImageFile && !validateImageFile(editProjectImageFile)) {
      return;
    }

    try {
      setUpdatingProject(true);

      const tags = editProjectTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      let imageUrl = "";
      let mediaUrl = "";

      if (editProjectMediaType === "image") {
        if (editProjectImageFile) {
          imageUrl = await uploadImageToCloudinary(editProjectImageFile);
        } else {
          imageUrl = editProjectImageUrl.trim();
        }

        mediaUrl = imageUrl;
      } else {
        mediaUrl = editProjectMediaUrl.trim();

        imageUrl = "";
      }

      const updatedData = {
        title: editProjectTitle.trim(),

        description: editProjectDescription.trim(),

        tags,

        mediaType: editProjectMediaType,

        mediaUrl,

        imageUrl,

        link: editProjectLink.trim(),
      };

      await updateDoc(doc(db, "projects", editingProject.id), updatedData);

      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingProject.id
            ? {
                ...project,
                ...updatedData,
              }
            : project,
        ),
      );

      closeEditProject();
    } catch (error) {
      console.error("Error updating project:", error);

      alert(error.message || "Failed to update project.");
    } finally {
      setUpdatingProject(false);
    }
  };

  /* =======================================================
     DELETE PROJECT
  ======================================================= */

  const handleDeleteProject = async (projectId) => {
    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      return;
    }

    const projectVideos = videos.filter(
      (video) => video.projectId === projectId,
    );

    const confirmDelete = window.confirm(
      `Delete "${project.title}"?\n\nThis will also delete all videos inside this project.`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDoc(doc(db, "projects", projectId));

      await Promise.all(
        projectVideos.map((video) => deleteDoc(doc(db, "videos", video.id))),
      );

      const remainingProjects = projects
        .filter((item) => item.id !== projectId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      await Promise.all(
        remainingProjects.map((project, index) =>
          updateDoc(doc(db, "projects", project.id), {
            order: index,
          }),
        ),
      );

      setProjects(
        remainingProjects.map((project, index) => ({
          ...project,
          order: index,
        })),
      );

      setVideos((prev) =>
        prev.filter((video) => video.projectId !== projectId),
      );

      if (selectedProject === projectId) {
        setSelectedProject(remainingProjects[0]?.id || "");
      }
    } catch (error) {
      console.error("Error deleting project:", error);

      alert("Failed to delete project.");
    }
  };

  /* =======================================================
     REORDER PROJECTS
  ======================================================= */

  const handleReorderProject = async (projectId, direction) => {
    const sortedProjects = [...projects].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );

    const currentIndex = sortedProjects.findIndex(
      (project) => project.id === projectId,
    );

    if (currentIndex === -1) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sortedProjects.length) {
      return;
    }

    const reorderedProjects = [...sortedProjects];

    [reorderedProjects[currentIndex], reorderedProjects[newIndex]] = [
      reorderedProjects[newIndex],
      reorderedProjects[currentIndex],
    ];

    try {
      await Promise.all(
        reorderedProjects.map((project, index) =>
          updateDoc(doc(db, "projects", project.id), {
            order: index,
          }),
        ),
      );

      setProjects(
        reorderedProjects.map((project, index) => ({
          ...project,
          order: index,
        })),
      );
    } catch (error) {
      console.error("Error reordering projects:", error);

      alert("Failed to reorder projects.");
    }
  };

  /* =======================================================
     OPEN ADD VIDEO
  ======================================================= */

  const openAddVideo = (projectId = "") => {
    setEditingVideo(null);

    setVideoTitle("");
    setVideoUrl("");

    setSelectedProject(projectId || projects[0]?.id || "");

    setShowAddVideo(true);
  };

  /* =======================================================
     ADD VIDEO
  ======================================================= */

  const handleAddVideo = async (e) => {
    e.preventDefault();

    if (!videoTitle.trim() || !videoUrl.trim() || !selectedProject) {
      alert("Project, video title and video URL are required.");

      return;
    }

    try {
      setSavingVideo(true);

      const projectVideos = videos
        .filter((video) => video.projectId === selectedProject)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const videoData = {
        projectId: selectedProject,

        title: videoTitle.trim(),

        url: videoUrl.trim(),

        order: projectVideos.length,

        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "videos"), videoData);

      setVideos((prev) => [
        ...prev,
        {
          id: docRef.id,
          ...videoData,
        },
      ]);

      setVideoTitle("");
      setVideoUrl("");
      setShowAddVideo(false);
    } catch (error) {
      console.error("Error adding video:", error);

      alert("Failed to add video.");
    } finally {
      setSavingVideo(false);
    }
  };

  /* =======================================================
     OPEN EDIT VIDEO
  ======================================================= */

  const openEditVideo = (video) => {
    setShowAddVideo(false);

    setEditingVideo(video);

    setEditVideoTitle(video.title || "");

    setEditVideoUrl(video.url || "");

    setEditVideoProject(video.projectId || "");
  };

  const closeEditVideo = () => {
    setEditingVideo(null);

    setEditVideoTitle("");
    setEditVideoUrl("");
    setEditVideoProject("");
  };

  /* =======================================================
     UPDATE VIDEO
  ======================================================= */

  const handleUpdateVideo = async (e) => {
    e.preventDefault();

    if (!editingVideo) {
      return;
    }

    if (!editVideoTitle.trim() || !editVideoUrl.trim() || !editVideoProject) {
      alert("Project, video title and video URL are required.");

      return;
    }

    try {
      setUpdatingVideo(true);

      const oldProjectId = editingVideo.projectId;

      const newProjectId = editVideoProject;

      let newOrder = editingVideo.order ?? 0;

      if (oldProjectId !== newProjectId) {
        const newProjectVideos = videos.filter(
          (video) =>
            video.projectId === newProjectId && video.id !== editingVideo.id,
        );

        newOrder = newProjectVideos.length;

        const oldProjectVideos = videos
          .filter(
            (video) =>
              video.projectId === oldProjectId && video.id !== editingVideo.id,
          )
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        await Promise.all(
          oldProjectVideos.map((video, index) =>
            updateDoc(doc(db, "videos", video.id), {
              order: index,
            }),
          ),
        );
      }

      const updatedVideoData = {
        title: editVideoTitle.trim(),

        url: editVideoUrl.trim(),

        projectId: newProjectId,

        order: newOrder,
      };

      await updateDoc(doc(db, "videos", editingVideo.id), updatedVideoData);

      setVideos((prev) =>
        prev.map((video) =>
          video.id === editingVideo.id
            ? {
                ...video,
                ...updatedVideoData,
              }
            : video,
        ),
      );

      closeEditVideo();
    } catch (error) {
      console.error("Error updating video:", error);

      alert("Failed to update video.");
    } finally {
      setUpdatingVideo(false);
    }
  };

  /* =======================================================
     DELETE VIDEO
  ======================================================= */

  const handleDeleteVideo = async (videoId) => {
    const videoToDelete = videos.find((video) => video.id === videoId);

    if (!videoToDelete) {
      return;
    }

    const confirmDelete = window.confirm(`Delete "${videoToDelete.title}"?`);

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDoc(doc(db, "videos", videoId));

      const remainingProjectVideos = videos
        .filter((video) => video.id !== videoId)
        .filter((video) => video.projectId === videoToDelete.projectId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      await Promise.all(
        remainingProjectVideos.map((video, index) =>
          updateDoc(doc(db, "videos", video.id), {
            order: index,
          }),
        ),
      );

      setVideos((prev) =>
        prev
          .filter((video) => video.id !== videoId)
          .map((video) => {
            if (video.projectId !== videoToDelete.projectId) {
              return video;
            }

            const index = remainingProjectVideos.findIndex(
              (item) => item.id === video.id,
            );

            return {
              ...video,
              order: index,
            };
          }),
      );
    } catch (error) {
      console.error("Error deleting video:", error);

      alert("Failed to delete video.");
    }
  };

  /* =======================================================
     REORDER VIDEOS
  ======================================================= */

  const handleReorderVideo = async (projectId, videoId, direction) => {
    const projectVideos = videos
      .filter((video) => video.projectId === projectId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const currentIndex = projectVideos.findIndex(
      (video) => video.id === videoId,
    );

    if (currentIndex === -1) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= projectVideos.length) {
      return;
    }

    const reorderedVideos = [...projectVideos];

    [reorderedVideos[currentIndex], reorderedVideos[newIndex]] = [
      reorderedVideos[newIndex],
      reorderedVideos[currentIndex],
    ];

    try {
      await Promise.all(
        reorderedVideos.map((video, index) =>
          updateDoc(doc(db, "videos", video.id), {
            order: index,
          }),
        ),
      );

      setVideos((prev) => {
        const otherVideos = prev.filter(
          (video) => video.projectId !== projectId,
        );

        return [
          ...otherVideos,
          ...reorderedVideos.map((video, index) => ({
            ...video,
            order: index,
          })),
        ];
      });
    } catch (error) {
      console.error("Error reordering videos:", error);

      alert("Failed to reorder videos.");
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    try {
      await signOut(auth);

      window.location.href = "/admin";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <p className="text-zinc-400 mt-1">Manage your portfolio</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
          >
            Logout
          </button>
        </div>

        {/* PROJECT HEADER */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Projects</h2>

            <p className="text-zinc-500 text-sm mt-1">
              Manage projects, details and videos
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetProjectForm();
              setShowAddProject(true);
            }}
            className="px-5 py-2 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition"
          >
            + Add Project
          </button>
        </div>

        {/* PROJECT LIST */}

        {loading ? (
          <div className="text-zinc-400">Loading dashboard...</div>
        ) : projects.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
            <p className="text-zinc-400 mb-5">No projects found.</p>

            <button
              type="button"
              onClick={() => {
                resetProjectForm();
                setShowAddProject(true);
              }}
              className="px-5 py-2 rounded-lg bg-white text-black font-semibold"
            >
              + Add Your First Project
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {[...projects]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((project, projectIndex) => {
                const projectVideos = videos
                  .filter((video) => video.projectId === project.id)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                return (
                  <div
                    key={project.id}
                    className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800"
                  >
                    {/* PROJECT TOP */}

                    <div className="flex flex-col lg:flex-row gap-5 justify-between">
                      {/* PROJECT INFORMATION */}

                      <div className="flex gap-4 min-w-0">
                        {/* MEDIA PREVIEW */}

                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-24 h-20 object-cover rounded-lg bg-zinc-800 shrink-0"
                          />
                        ) : project.mediaUrl && isYouTube(project.mediaUrl) ? (
                          <img
                            src={getYouTubeThumbnail(project.mediaUrl)}
                            alt={project.title}
                            className="w-24 h-20 object-cover rounded-lg bg-zinc-800 shrink-0"
                          />
                        ) : project.mediaUrl ? (
                          <div className="w-24 h-20 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-xs text-center px-2 shrink-0">
                            URL
                          </div>
                        ) : (
                          <div className="w-24 h-20 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs shrink-0">
                            No Media
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="text-xl font-semibold">
                            {project.title}
                          </h3>

                          <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
                            {project.description}
                          </p>

                          {Array.isArray(project.tags) &&
                            project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {project.tags.map((tag, index) => (
                                  <span
                                    key={`${tag}-${index}`}
                                    className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex items-start gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleReorderProject(project.id, "up")}
                          disabled={projectIndex === 0}
                          className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 transition"
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleReorderProject(project.id, "down")
                          }
                          disabled={projectIndex === projects.length - 1}
                          className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 transition"
                        >
                          ↓
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditProject(project)}
                          className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* PROJECT LINK */}

                    {/* {project.link &&
                        project.link !==
                          "#" && (
                          <div className="mt-4">
                            <a
                              href={
                                project.link
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-zinc-400 hover:text-white underline"
                            >
                              View Project Link ↗
                            </a>
                          </div>
                        )} */}

                    {/* VIDEOS HEADER */}

                    <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="font-semibold">Videos</h4>

                        <p className="text-zinc-500 text-sm">
                          {projectVideos.length}{" "}
                          {projectVideos.length === 1 ? "video" : "videos"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => openAddVideo(project.id)}
                        className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
                      >
                        + Add Video
                      </button>
                    </div>

                    {/* VIDEO LIST */}

                    {projectVideos.length === 0 ? (
                      <p className="text-zinc-500 text-sm mt-4">
                        No videos added yet.
                      </p>
                    ) : (
                      <div className="space-y-3 mt-4">
                        {projectVideos.map((video, videoIndex) => (
                          <div
                            key={video.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-800 rounded-xl px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="font-medium">{video.title}</p>

                              <p className="text-sm text-zinc-500 truncate max-w-2xl mt-1">
                                {video.url}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => openEditVideo(video)}
                                className="text-blue-400 hover:text-blue-300 px-2 py-1"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleReorderVideo(project.id, video.id, "up")
                                }
                                disabled={videoIndex === 0}
                                className="text-zinc-400 hover:text-white disabled:opacity-20 px-2 py-1"
                              >
                                ↑
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleReorderVideo(
                                    project.id,
                                    video.id,
                                    "down",
                                  )
                                }
                                disabled={
                                  videoIndex === projectVideos.length - 1
                                }
                                className="text-zinc-400 hover:text-white disabled:opacity-20 px-2 py-1"
                              >
                                ↓
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteVideo(video.id)}
                                className="text-red-400 hover:text-red-300 px-2 py-1"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* =====================================================
          ADD PROJECT MODAL
      ===================================================== */}

      {showAddProject && (
        <Modal
          title="Add New Project"
          onClose={() => {
            if (!savingProject) {
              setShowAddProject(false);
            }
          }}
        >
          <form onSubmit={handleAddProject} className="space-y-5">
            {/* TITLE */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Project Title
              </label>

              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter project title"
                required
                className={inputClass}
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Description
              </label>

              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={5}
                required
                placeholder="Enter project description"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* TAGS */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">Tags</label>

              <input
                type="text"
                value={projectTags}
                onChange={(e) => setProjectTags(e.target.value)}
                placeholder="After Effects, Premiere Pro"
                className={inputClass}
              />

              <p className="text-xs text-zinc-500 mt-1">
                Separate tags using commas.
              </p>
            </div>

            {/* =================================================
                PROJECT MEDIA
            ================================================= */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Project Media
              </label>

              <MediaTypeButtons
                value={projectMediaType}
                onChange={setProjectMediaType}
              />

              {projectMediaType === "image" ? (
                <>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;

                      if (file && validateImageFile(file)) {
                        setProjectImageFile(file);
                      } else {
                        e.target.value = "";

                        setProjectImageFile(null);
                      }
                    }}
                    className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black file:font-medium`}
                  />

                  {projectImageFile && (
                    <p className="text-xs text-zinc-400 mt-2">
                      Selected: {projectImageFile.name}
                    </p>
                  )}

                  <p className="text-xs text-zinc-500 mt-1">
                    JPG, JPEG or PNG only • Maximum 5 MB
                  </p>
                </>
              ) : (
                <>
                  <input
                    type="url"
                    value={projectMediaUrl}
                    onChange={(e) => setProjectMediaUrl(e.target.value)}
                    placeholder="https://youtu.be/... or https://vimeo.com/..."
                    required
                    className={inputClass}
                  />

                  <p className="text-xs text-zinc-500 mt-1">
                    YouTube/Vimeo URLs will play on the portfolio. Other URLs
                    can open as external links.
                  </p>
                </>
              )}
            </div>

            {/* PROJECT LINK */}

            {/* <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Project Link
              </label>

              <input
                type="url"
                value={
                  projectLink
                }
                onChange={(e) =>
                  setProjectLink(
                    e.target.value
                  )
                }
                placeholder="https://..."
                className={
                  inputClass
                }
              />

              <p className="text-xs text-zinc-500 mt-1">
                Optional. Existing project link field.
              </p>
            </div> */}

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                disabled={savingProject}
                className={`${buttonClass} bg-zinc-800 hover:bg-zinc-700`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingProject}
                className={`${buttonClass} bg-white text-black font-semibold hover:bg-zinc-200`}
              >
                {savingProject ? "Uploading & Saving..." : "Save Project"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =====================================================
          EDIT PROJECT MODAL
      ===================================================== */}

      {editingProject && (
        <Modal
          title="Edit Project"
          onClose={() => {
            if (!updatingProject) {
              closeEditProject();
            }
          }}
        >
          <form onSubmit={handleUpdateProject} className="space-y-5">
            {/* TITLE */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Project Title
              </label>

              <input
                type="text"
                value={editProjectTitle}
                onChange={(e) => setEditProjectTitle(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Description
              </label>

              <textarea
                value={editProjectDescription}
                onChange={(e) => setEditProjectDescription(e.target.value)}
                rows={5}
                required
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* TAGS */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">Tags</label>

              <input
                type="text"
                value={editProjectTags}
                onChange={(e) => setEditProjectTags(e.target.value)}
                placeholder="After Effects, Premiere Pro"
                className={inputClass}
              />

              <p className="text-xs text-zinc-500 mt-1">
                Separate tags using commas.
              </p>
            </div>

            {/* =================================================
                PROJECT MEDIA
            ================================================= */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Project Media
              </label>

              <MediaTypeButtons
                value={editProjectMediaType}
                onChange={setEditProjectMediaType}
              />

              {editProjectMediaType === "image" ? (
                <>
                  {editProjectImageUrl && (
                    <div className="mb-3">
                      <p className="text-xs text-zinc-500 mb-2">
                        Current Image
                      </p>

                      <img
                        src={editProjectImageUrl}
                        alt="Current project"
                        className="w-40 h-24 object-cover rounded-lg bg-zinc-800"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;

                      if (file && validateImageFile(file)) {
                        setEditProjectImageFile(file);
                      } else {
                        e.target.value = "";

                        setEditProjectImageFile(null);
                      }
                    }}
                    className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black file:font-medium`}
                  />

                  {editProjectImageFile && (
                    <p className="text-xs text-zinc-400 mt-2">
                      New image selected: {editProjectImageFile.name}
                    </p>
                  )}

                  <p className="text-xs text-zinc-500 mt-1">
                    JPG, JPEG or PNG only • Maximum 5 MB
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    Leave empty to keep the current image.
                  </p>
                </>
              ) : (
                <>
                  {editProjectMediaUrl && (
                    <div className="mb-3">
                      <p className="text-xs text-zinc-500 mb-2">Current URL</p>

                      <p className="text-sm text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 break-all">
                        {editProjectMediaUrl}
                      </p>
                    </div>
                  )}

                  <input
                    type="url"
                    value={editProjectMediaUrl}
                    onChange={(e) => setEditProjectMediaUrl(e.target.value)}
                    placeholder="https://youtu.be/... or https://vimeo.com/..."
                    required
                    className={inputClass}
                  />

                  <p className="text-xs text-zinc-500 mt-1">
                    YouTube/Vimeo URLs will play on the portfolio. Other URLs
                    can open as external links.
                  </p>
                </>
              )}
            </div>

            {/* PROJECT LINK */}

            {/* <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Project Link
              </label>

              <input
                type="url"
                value={
                  editProjectLink
                }
                onChange={(e) =>
                  setEditProjectLink(
                    e.target.value
                  )
                }
                placeholder="https://..."
                className={
                  inputClass
                }
              />

              <p className="text-xs text-zinc-500 mt-1">
                Optional. Existing project link field.
              </p>
            </div> */}

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeEditProject}
                disabled={updatingProject}
                className={`${buttonClass} bg-zinc-800 hover:bg-zinc-700`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updatingProject}
                className={`${buttonClass} bg-white text-black font-semibold hover:bg-zinc-200`}
              >
                {updatingProject ? "Uploading & Updating..." : "Update Project"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =====================================================
          ADD VIDEO MODAL
      ===================================================== */}

      {showAddVideo && (
        <Modal
          title="Add New Video"
          onClose={() => {
            if (!savingVideo) {
              setShowAddVideo(false);
            }
          }}
        >
          <form onSubmit={handleAddVideo} className="space-y-5">
            {/* PROJECT */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Project
              </label>

              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Select Project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* VIDEO TITLE */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Video Title
              </label>

              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter video title"
                required
                className={inputClass}
              />
            </div>

            {/* VIDEO URL */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                YouTube / Vimeo URL
              </label>

              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtu.be/..."
                required
                className={inputClass}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddVideo(false)}
                disabled={savingVideo}
                className={`${buttonClass} bg-zinc-800 hover:bg-zinc-700`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingVideo}
                className={`${buttonClass} bg-white text-black font-semibold hover:bg-zinc-200`}
              >
                {savingVideo ? "Saving..." : "Save Video"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =====================================================
          EDIT VIDEO MODAL
      ===================================================== */}

      {editingVideo && (
        <Modal
          title="Edit Video"
          onClose={() => {
            if (!updatingVideo) {
              closeEditVideo();
            }
          }}
        >
          <form onSubmit={handleUpdateVideo} className="space-y-5">
            {/* PROJECT */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Project
              </label>

              <select
                value={editVideoProject}
                onChange={(e) => setEditVideoProject(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Select Project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* VIDEO TITLE */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Video Title
              </label>

              <input
                type="text"
                value={editVideoTitle}
                onChange={(e) => setEditVideoTitle(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            {/* VIDEO URL */}

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Video URL
              </label>

              <input
                type="url"
                value={editVideoUrl}
                onChange={(e) => setEditVideoUrl(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeEditVideo}
                disabled={updatingVideo}
                className={`${buttonClass} bg-zinc-800 hover:bg-zinc-700`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updatingVideo}
                className={`${buttonClass} bg-white text-black font-semibold hover:bg-zinc-200`}
              >
                {updatingVideo ? "Updating..." : "Update Video"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AdminDashboard;
