import React, { useEffect, useState } from "react";
import logoImg from "../assets/visura-logo.png";
import { ArrowLeft, FileImage } from 'lucide-react';
import toast from "react-hot-toast";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate, useLocation } from "react-router-dom";


const HistoryPage = () => {

    //Store all thumbnails
    const [thumbnails, setThumbnails] = useState([]);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const {initial} = location.state || {};

    //Fetch the thumbnail history
    const fetchThumbnails = async () => {
        try{
            //call api using axios
            const {data} = await axios.get(API_ENDPOINTS.USER_ALL_THUMBNAILS, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
        );

        setThumbnails(data.data);
        }
        catch(error){
            toast.error("Failed to fetch thumbnail history");
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
            return;
        }
    };

    useEffect(() => {
        fetchThumbnails();
        fetchUserData();
    }, [])

    const onViewClick = (projectId)  => {
      navigate('/export', {state: {projectId: projectId, initial: initial}});
    }

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


  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#0D1117]/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src={logoImg} alt="Visura Logo" className="h-7" />

          <div className="flex items-center gap-4">
            <button 
            onClick={() => navigate('/thumbnail-generation')}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Generator</span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                {initial ? initial.toUpperCase() : 'U'}
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

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Thumbnail History
            </h1>
            <p className="text-xl text-gray-400">
              Get all your previously generated thumbnails in one place.
            </p>
          </div>

          <div className="space-y-6">
            {thumbnails.length === 0 ? (
              <div className="bg-[#161B22] rounded-2xl p-12 border border-gray-800 text-center">
                <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h2 className="text-2xl font-semibold mb-2 text-gray-400">No thumbnails yet</h2>
                <p className="text-gray-500">Your generated thumbnails will appear here</p>
              </div>
            ) : (
              thumbnails.map((thumbnail) => (
                <div key={thumbnail._id} className="bg-[#161B22] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition">
                  <div className="flex items-center gap-6">
                    {/* Thumbnail small preview */}
                    <div className="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-gray-800">
                      <img 
                        src={thumbnail.url} 
                        alt={'Thumbnail'} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Thumbnail title and date */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold mb-2 truncate">
                        {thumbnail.title || 'Untitled'}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {new Date(thumbnail.createdAt || thumbnail.generatedAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* View button */}
                    <div className="flex-shrink-0">
                      <button 
                      onClick={() => onViewClick(thumbnail.projectId)}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium transition">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default HistoryPage;
