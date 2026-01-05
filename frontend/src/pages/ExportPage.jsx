import React, { useEffect, useState } from 'react';
import { Sparkles, Download, Check, Copy, Share2, ArrowLeft, Maximize2, FileImage } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';
import logoImg from "../assets/visura-logo.png";

export default function ExportPage() {
  const [selectedFormat, setSelectedFormat] = useState('youtube');
  const [selectedQuality, setSelectedQuality] = useState('high');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [thumbnailData, setThumbnailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = location.state || {};
  const { initial } = location.state || {};

  //for testing puropse
  //const projectId = "695929021fe6753600753899";



  if(!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Project ID Found</h1>
          <p className="text-gray-400">Please generate a thumbnail first before exporting.</p>
        </div>
      </div>
    );
  }

  const formats = [
    { 
      id: 'youtube', 
      name: 'YouTube Thumbnail', 
      size: '1280 x 720', 
      aspect: '16:9',
      icon: '📺'
    },
    { 
      id: 'shorts', 
      name: 'YouTube Shorts', 
      size: '1080 x 1920', 
      aspect: '9:16',
      icon: '📱'
    },
    { 
      id: 'reels', 
      name: 'Instagram Reels', 
      size: '1080 x 1920', 
      aspect: '9:16',
      icon: '📷'
    },
    { 
      id: 'custom', 
      name: 'Custom Size', 
      size: 'Enter dimensions', 
      aspect: 'Custom',
      icon: '⚙️'
    }
  ];

  const qualityOptions = [
    { id: 'high', name: 'High Quality', size: '~2MB', desc: 'Best for YouTube uploads' },
    { id: 'medium', name: 'Medium Quality', size: '~800KB', desc: 'Balanced size & quality' },
    { id: 'low', name: 'Low Quality', size: '~300KB', desc: 'Smaller file size' }
  ];

  //get the project details using the projectId
  const fetchProjectDetails = async (projectId) => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.PROJECT_OUTPUT(projectId),
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setThumbnailData(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch project details.");
      setLoading(false);
      return null;
    }
  }

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(
        API_ENDPOINTS.CHECK_LOGIN,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data.loggedIn && data.user) {
        setUserData(data.user);
      }
    } catch (error) {
      return
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails(projectId);
    }
    fetchUserData();
  }, [projectId]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.get(
        API_ENDPOINTS.LOGOUT,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // Get the orientation from the thumbnail data
  const orientation = thumbnailData?.data?.[0]?.resolution || 'landscape';
  const imageUrl = thumbnailData?.data?.[0]?.url;

  // Download handler
  const handleDownload = async () => {
    if (!imageUrl) {
      toast.error("No image available to download");
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `thumbnail_${projectId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Thumbnail downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download thumbnail");
    }
  };

  // Copy handler - Copy image to clipboard
  const handleCopy = async () => {
    if (!imageUrl) {
      toast.error("No image available to copy");
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      toast.success("Image copied to clipboard!");
    } catch (error) {
      // Fallback: copy URL instead
      try {
        await navigator.clipboard.writeText(imageUrl);
        toast.success("Image URL copied to clipboard!");
      } catch (fallbackError) {
        toast.error("Failed to copy image");
      }
    }
  };

  // Share handler - Use Web Share API
  const handleShare = async () => {
    if (!imageUrl) {
      toast.error("No image available to share");
      return;
    }

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `thumbnail_${projectId}.png`, { type: blob.type });
        
        await navigator.share({
          title: 'Generated Thumbnail',
          text: 'Check out this AI-generated thumbnail!',
          files: [file]
        });
        
        toast.success("Shared successfully!");
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(imageUrl);
        toast.success("Link copied to clipboard! (Share not supported on this browser)");
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        toast.error("Failed to share");
      }
    }
  };

  // Update selected format based on orientation
  useEffect(() => {
    if (orientation === 'landscape') {
      setSelectedFormat('youtube');
    } else if (orientation === 'portrait') {
      setSelectedFormat('shorts');
    }
  }, [orientation]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#0D1117]/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img
          onClick={() => navigate('/')}
                        src={logoImg}
                        alt="Visura Logo"
                        className="h-7 cursor-pointer"
                      />
          
          <div className="flex items-center gap-4">
            <button
            onClick={() => navigate('/thumbnail-generation')}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 text-gray-400 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Generator</span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                {initial && typeof initial === 'string' ? initial.toUpperCase() : 'U'}
              </button>
              
              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#161B22] border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-800">
                    <p className="text-sm font-semibold truncate">{userData?.name || "User"}</p>
                    <p className="text-xs text-gray-400 truncate">{userData?.email || ""}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#0D1117] transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="space-y-6 w-full">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Export Your Thumbnail</h1>
                  <p className="text-gray-400 text-sm sm:text-base">Choose your format and download</p>
                </div>
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-gray-800 rounded-xl hover:bg-[#1c2128] transition whitespace-nowrap"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{isFullScreen ? 'Exit' : 'Full Screen'}</span>
                </button>
              </div>

              {/* Main Preview */}
              <div className={`bg-[#161B22] rounded-2xl border border-gray-800 ${isFullScreen ? 'fixed inset-0 z-50 m-0 rounded-none p-8' : 'p-4 sm:p-6 lg:p-8'}`}>
                <div className={`relative ${isFullScreen ? 'h-full' : 'min-h-[400px]'} flex flex-col items-center justify-center`}>
                  {/* Close button for fullscreen */}
                  {isFullScreen && (
                    <button 
                      onClick={() => setIsFullScreen(false)}
                      className="absolute top-4 right-4 z-10 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 transition"
                    >
                      <span className="text-sm font-semibold">Exit Full Screen</span>
                    </button>
                  )}
                  
                  {/* Preview Image Container */}
                  <div className={`relative ${isFullScreen ? 'w-full h-full flex items-center justify-center' : 'w-full'}`}>
                    {/* Preview Image */}
                    <div className={`
                      ${orientation === 'landscape' ? 'aspect-video' : 'aspect-[9/16]'} 
                      ${isFullScreen 
                        ? orientation === 'landscape' 
                          ? 'w-[90%] max-w-[95vw]' 
                          : 'h-[90%] max-h-[90vh]'
                        : orientation === 'landscape'
                          ? 'w-full'
                          : 'w-full max-w-sm'
                      } 
                      mx-auto bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl overflow-hidden border border-purple-500/30 flex items-center justify-center relative
                    `}>
                      {loading ? (
                        <div className="text-gray-400 text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-2"></div>
                          <p className="text-sm">Loading thumbnail...</p>
                        </div>
                      ) : imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt="Generated thumbnail" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <FileImage className={`${isFullScreen ? 'w-32 h-32' : 'w-20 h-20 sm:w-28 sm:h-28'} text-gray-600 mx-auto mb-2`} />
                          <p className="text-sm text-gray-500">No thumbnail available</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Format Badge */}
                    {!isFullScreen && imageUrl && (
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-xs sm:text-sm font-semibold border border-gray-700/50">
                        {orientation === 'landscape' ? '16:9' : '9:16'}
                      </div>
                    )}
                  </div>
                </div>

                
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button 
                  onClick={handleCopy}
                  disabled={!imageUrl || loading}
                  className={`px-3 sm:px-4 py-3 bg-[#161B22] border border-gray-800 rounded-xl hover:bg-[#1c2128] transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${(!imageUrl || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Copy</span>
                </button>
                <button 
                  onClick={handleShare}
                  disabled={!imageUrl || loading}
                  className={`px-3 sm:px-4 py-3 bg-[#161B22] border border-gray-800 rounded-xl hover:bg-[#1c2128] transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${(!imageUrl || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Share</span>
                </button>
                
              </div>
              {/* Download Button */}
              <button 
                onClick={handleDownload}
                disabled={!imageUrl || loading}
                className={`w-full px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center justify-center gap-3 ${(!imageUrl || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className="w-5 h-5" />
                {loading ? 'Loading...' : 'Download Thumbnail'}
              </button>

              <p className="text-center text-xs sm:text-sm text-gray-400">
                By downloading, you agree to our <a href="#" className="text-purple-400 hover:underline">Terms of Use</a>
              </p>

              {/* Alternative Actions */}
              <div className="pt-4 border-t border-gray-800">
                <button className="w-full px-4 py-3 text-gray-400 hover:text-white transition text-sm">
                  Generate New Thumbnail Instead
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
  );
}