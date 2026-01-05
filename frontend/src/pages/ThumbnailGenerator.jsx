import React, { useEffect, useState } from "react";
import {
  Upload,
  Wand2,
  FileImage,
  Zap,
  Plus,
  X,
  Check,
  Menu,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import toast from "react-hot-toast";
import { getRuns } from "../services/CheckStatus.js";
import { useNavigate } from "react-router-dom";
import {BeatLoader} from "react-spinners";
import logoImg from "../assets/visura-logo.png";

export default function ThumbnailGenerator() {
  const [title, setTitle] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [logoPosition, setLogoPosition] = useState("top-left");
  const [subjectPosition, setSubjectPosition] = useState("center");
  const [orientation, setOrientation] = useState("landscape");
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [selectedReference, setSelectedReference] = useState(null);
  const [themes, setThemes] = useState([]);
  const [submitBtnText, setSubmitBtnText] = useState("Generate My Thumbnail");
  const [userPlan, setUserPlan] = useState("free");
  const [promptEnhanceBtnText, setPromptEnhanceBtnText] = useState("Enhance This Prompt with AI ⚡");

  const navigate = useNavigate();


  // const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetType, setAssetType] = useState("subject"); // 'subject', 'logo', or 'reference'
  const [isDragging, setIsDragging] = useState(false);
  const [previousAssets, setPreviousAssets] = useState([{}]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);


  const location = useLocation();
  const [userData, setUserData] = useState(location.state?.userData || null);
  const [credits, setCredits] = useState(userData?.credits || 0);
  const [initial, setInitial] = useState("U");


  // Fetch current user data to get updated credits
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
        setCredits(data.user.credits);
        setUserPlan(data.user.plan);
        setInitial(data.user?.name ? data.user.name.charAt(0).toUpperCase() : "U");
      } else {
        // if user is not logged in redirect to login page
        toast.error("Please login to continue");
        navigate('/login');
        return;
      }
    } catch (error) {
      // If error (like 401), redirect to login
      toast.error("Please login to continue");
      navigate('/login');
    }
  };

  const getStyles = async () => {
    try{
      const {data} = await axios.get(
        API_ENDPOINTS.STYLES,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        setThemes(data.presets);


    }
    catch(error){
      return
    }
  };



  const uploadAsset = async (file) => {
    try {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append("image", file); // 'image' matches the field name in backend route
      formData.append("type", assetType);

      const { data } = await axios.post(API_ENDPOINTS.ASSETS, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      // Optionally update the UI with the newly uploaded asset
      if (assetType === "logo") {
        setSelectedLogo(data.asset);
      } else if (assetType === "subject") {
        setSelectedSubject(data.asset);
      } else if (assetType === "reference") {
        setSelectedReference(data.asset);
      }

      // Close modal if it's open
      setShowAssetModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to upload asset");
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.ASSETS, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        setPreviousAssets(data.assets);
        getStyles();
        fetchUserData(); // Fetch fresh user data to sync credits

      } catch (error) {
        // If fetching assets fails (likely not authenticated), redirect to login
        toast.error("Please login to continue");
        navigate('/login');
      }
    };

    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCredits = async (userId, amount) => {
    try {
      const { data } = await axios.post(
        API_ENDPOINTS.UPDATE_CREDITS,
        { userId, amount },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    } catch (error) {
      return
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user data is loaded
    if (!userData) {
      setSubmitBtnText("Generate My Thumbnail");
      return toast.error("User data not loaded. Please refresh the page.");
    }

    if(credits <= 0 && userPlan !== 'premium'){
      setSubmitBtnText("Generate My Thumbnail");
      return toast.error("You don't have enough credits");
    }

    // Validation
    if (!title || !selectedTheme || !prompt) {
      setSubmitBtnText("Generate My Thumbnail");
      return toast.error("Please fill in all required fields");
    }

    try {
      // Handle successful form submission
      //Create project
      const { data } = await axios.post(
        API_ENDPOINTS.PROJECTS,
        {
          title,
          orientation,
          inputPrompt: prompt,
          logo: selectedLogo?._id || null,
          logoPosition: selectedLogo ? logoPosition : null,
          subject: selectedSubject?._id || null,
          subjectPosition: selectedSubject ? subjectPosition : null,
          reference: selectedReference?._id || null,
          styleId: selectedTheme,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      toast.success("Project created successfully!");

      //generate thumbnail
      try{
      //Project id
      const projectId = data.project._id;

      //Start generating the thumbnail
      const generateImgOp = await axios.post(
        API_ENDPOINTS.GENERATE_IMAGE,
        {
          projectId: projectId
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      //Inngest id
      const inngestId = generateImgOp.data.data.ids[0];


      //Checking inngest run status
      let pollAttempts = 0;
      const maxAttempts = 60; // Max 2 minutes of polling (60 * 2 seconds)
      
      while(pollAttempts < maxAttempts){
        try {
          const runStatus = await getRuns(inngestId);
          
          if(runStatus && runStatus[0]?.status === 'Completed') {
            toast.success('Thumbnail generated successfully!');

            //update credits
            // Optimistically update UI
            setCredits(credits - 1);
            
            // Update credits in database
            await updateCredits(userData._id, -1);
            
            // // Fetch fresh user data to ensure sync
            // await fetchUserData();


            // navigate to export page and pass projectId
            navigate('/export', {state: {projectId: projectId, initial: initial}});

            // //for testing purpose
            // navigate('/export', {state: {projectId: "695929021fe6753600753899"}});

            break;

          }
          if(runStatus && (runStatus[0]?.status === 'Cancelled' || runStatus[0]?.status === 'Failed')) {
            toast.error('Thumbnail generation failed');
            setSubmitBtnText("Generate My Thumbnail");
            break;
          }
        } catch (statusError) {
          // If Inngest dev server is not running, show a helpful message
          if (statusError.message.includes("Inngest dev server")) {
            toast.error("Cannot check generation status. Make sure Inngest dev server is running (npm run inngest:dev)");
            break;
          }
          // Don't break on network errors, retry
          setSubmitBtnText("Generate My Thumbnail");
        }

        pollAttempts++;
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      if (pollAttempts >= maxAttempts) {
        toast.error("Generation status check timed out. Check your projects page later.");
        setSubmitBtnText("Generate My Thumbnail");
      }



    }catch(error) {
      toast.error(error.response?.data?.message || "Failed to generate thumbnail");
      setSubmitBtnText("Generate My Thumbnail");
    }
      
      // Optionally navigate to project details or reset form
      // navigate(`/projects/${data.project._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
      setSubmitBtnText("Generate My Thumbnail");
    }
  };

  const enhancePrompt = async (prompt) => {
    if(userPlan !== 'premium'){
      return toast.error("Prompt enhancement is available for Premium users only. Please upgrade your plan.");
    }

    try {

      if(!prompt){
        return;
      }

      const {data} = await axios.post(
        API_ENDPOINTS.ENHANCE_PROMPT,
        { prompt },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      setPrompt(data.enhancedPrompt);
      setPromptEnhanceBtnText("Enhance This Prompt with AI ⚡");
    }
    catch(error){
      return toast.error("Failed to enhance prompt");
    }
  }

  // Open asset modal
  const openAssetModal = (type) => {
    if(userPlan !== 'premium'){
      return toast.error("Assets are available for Premium users only. Please upgrade your plan.");
    }
    setAssetType(type);
    setShowAssetModal(true);
  };

  // Select asset from modal
  const selectAsset = (asset) => {
    if (assetType === "logo") {
      setSelectedLogo(asset);
    } else if (assetType === "subject") {
      setSelectedSubject(asset);
    } else if (assetType === "reference") {
      setSelectedReference(asset);
    }
    setShowAssetModal(false);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Add upload logic here
      toast.error("Drag & Drop upload is not implemented yet. Please use the click to upload option.");
    }
  };

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
  const positions = [
    { id: "top-left", name: "Top Left" },
    { id: "top-center", name: "Top Center" },
    { id: "top-right", name: "Top Right" },
    { id: "center-left", name: "Center Left" },
    { id: "center", name: "Center" },
    { id: "center-right", name: "Center Right" },
    { id: "bottom-left", name: "Bottom Left" },
    { id: "bottom-center", name: "Bottom Center" },
    { id: "bottom-right", name: "Bottom Right" },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Asset Selection Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[#161B22] rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg sm:text-2xl font-bold mb-1">
                  Select {assetType === "logo" ? "Logo" : assetType === "subject" ? "Subject Image" : "Reference Thumbnail"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  Choose from previously uploaded assets or upload a new one
                </p>
              </div>
              <button
                onClick={() => setShowAssetModal(false)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0D1117] hover:bg-gray-800 rounded-xl flex items-center justify-center transition ml-2 flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Upload New Section */}
            <div className="p-4 sm:p-6 border-b border-gray-800">
              <label
                className={`block border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer transition ${
                  isDragging
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-gray-700 hover:border-purple-500/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      uploadAsset(file);
                    }
                  }}
                />
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <p className="text-sm sm:text-base font-semibold mb-2">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  PNG, JPG up to {assetType === "logo" ? "5MB" : "10MB"}
                </p>
              </label>
            </div>

            {/* Previously Uploaded Assets */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-gray-300">
                Previously Uploaded
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {previousAssets
                  .filter((asset) => asset.type === assetType)
                  .map((asset) => (
                    <button
                      key={asset._id || asset.id}
                      onClick={() => selectAsset(asset)}
                      className="group relative aspect-square bg-[#0D1117] rounded-xl border-2 border-gray-800 hover:border-purple-500 transition overflow-hidden"
                    >
                      {/* Actual Image */}
                      {asset.url ? (
                        <img
                          src={asset.url}
                          alt={asset.filename || 'Asset'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileImage className="w-12 h-12 text-gray-600" />
                        </div>
                      )}

                      {/* Selection Indicator */}
                      <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition flex">
                        <Check className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
              </div>

              {previousAssets.filter((asset) => asset.type === assetType)
                .length === 0 && (
                <div className="text-center py-12">
                  <FileImage className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400">No {assetType}s uploaded yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload your first {assetType} above
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setShowAssetModal(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#0D1117] border border-gray-800 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full bg-[#0D1117]/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <img
          onClick={() => navigate('/')}
                        src={logoImg}
                        alt="Visura Logo"
                        className="h-5 sm:h-6 md:h-7 cursor-pointer"
                      />

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <a href="#" className="text-white font-semibold">
              Generate
            </a>
            <div
            onClick={() => {
              navigate("/history" , {state: {initial: initial}})
            }}
             className="text-gray-400 cursor-pointer hover:text-white transition">
              History
            </div>

            {/* Pricing will be seen only if user is not premium */}
            {userData?.plan !== "premium" && (
            <div
            onClick={() => {
              navigate("/pricing" , {state: {initial: initial}})
            }}
            className="text-gray-400 cursor-pointer hover:text-white transition">
              Pricing
            </div>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-9 h-9 bg-[#161B22] rounded-lg flex items-center justify-center border border-gray-800 hover:bg-gray-800 transition"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-[#161B22] flex items-center justify-center rounded-full text-xs sm:text-sm border border-gray-800">
              {userData?.plan === "free" ? (
                <>
                  <span className="text-gray-400 hidden xs:inline">Credits:</span>
                  <span className="ml-1 sm:ml-2 font-semibold text-purple-400">
                    {credits || 0}
                  </span>
                </>
              ) : (
                <>
                  <span className="ml-1 sm:ml-2 font-semibold text-purple-400">
                    Premium
                  </span>
                </>
              )}
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed top-[60px] sm:top-[68px] left-0 right-0 bg-[#161B22] border-b border-gray-800 z-40 lg:hidden">
          <div className="px-4 sm:px-6 py-4 space-y-3">
            <a
              href="#"
              onClick={() => setShowMobileMenu(false)}
              className="block text-white font-semibold py-2 px-4 rounded-lg bg-[#0D1117] hover:bg-gray-800 transition"
            >
              Generate
            </a>
            <div
              onClick={() => {
                navigate("/history", { state: { initial: initial } });
                setShowMobileMenu(false);
              }}
              className="block text-gray-400 font-medium py-2 px-4 rounded-lg hover:bg-[#0D1117] hover:text-white transition cursor-pointer"
            >
              History
            </div>
            <div
              onClick={() => {
                navigate("/pricing", { state: { initial: initial } });
                setShowMobileMenu(false);
              }}
              className="block text-gray-400 font-medium py-2 px-4 rounded-lg hover:bg-[#0D1117] hover:text-white transition cursor-pointer"
            >
              Pricing
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Create Your Thumbnail
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400">
              Fill in the details below and let AI create the perfect thumbnail
              for you
            </p>
          </div>

          {/* Form Container */}
          <div className="space-y-4 sm:space-y-6">
            {/* Video Title */}
            <div className="bg-[#161B22] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800">
              <label className="block mb-3">
                <span className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
                  Video Title
                  <span className="text-red-400">*</span>
                </span>
                <span className="text-xs sm:text-sm text-gray-400 block mb-3 sm:mb-4">
                  Enter the title of your video or the main text you want on the
                  thumbnail
                </span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., INSANE Gaming Victory!, How to Build AI Apps, Best Coffee Recipe"
                className="w-full px-3 sm:px-4 md:px-5 py-3 sm:py-4 bg-[#0D1117] border border-gray-800 rounded-lg sm:rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm sm:text-base md:text-lg"
              />
            </div>

            {/* Orientation */}
            <div className="bg-[#161B22] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800">
              <label className="block mb-4">
                <span className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
                  Orientation
                  <span className="text-red-400">*</span>
                </span>
                <span className="text-xs sm:text-sm text-gray-400 block">
                  Choose the format based on your platform
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => setOrientation("landscape")}
                  className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${
                    orientation === "landscape"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-800 bg-[#0D1117] hover:border-gray-700"
                  }`}
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-2 sm:mb-3"></div>
                  <div className="text-sm sm:text-base font-semibold mb-1">Landscape (16:9)</div>
                  <div className="text-xs sm:text-sm text-gray-400">YouTube Videos</div>
                  <div className="text-xs text-gray-500 mt-1">1280 x 720</div>
                </button>

                <button
                  onClick={() => setOrientation("portrait")}
                  className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${
                    orientation === "portrait"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-800 bg-[#0D1117] hover:border-gray-700"
                  }`}
                >
                  <div className="aspect-[9/16] max-w-[80px] sm:max-w-[100px] md:max-w-[120px] mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-2 sm:mb-3"></div>
                  <div className="text-sm sm:text-base font-semibold mb-1">Portrait (9:16)</div>
                  <div className="text-xs sm:text-sm text-gray-400">Shorts & Reels</div>
                  <div className="text-xs text-gray-500 mt-1">1080 x 1920</div>
                </button>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="bg-[#161B22] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800">
              <label className="block mb-4">
                <span className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
                  Theme Style
                  <span className="text-red-400">*</span>
                </span>
                <span className="text-xs sm:text-sm text-gray-400 block">
                  Select the overall theme that matches your content
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme._id}
                    onClick={() => setSelectedTheme(theme._id)}
                    className={`relative p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all text-center ${
                      selectedTheme === theme._id
                        ? "border-purple-500 bg-purple-500/10 scale-105"
                        : "border-gray-800 bg-[#0D1117] hover:border-gray-700"
                    }`}
                  >
                    <div
                      className={`aspect-square bg-gradient-to-br ${theme.color} rounded-md sm:rounded-lg mb-1.5 sm:mb-2 md:mb-3 flex items-center justify-center text-xl sm:text-2xl md:text-3xl`}
                    >
                      {theme.icon}
                    </div>
                    <div className="font-semibold text-xs sm:text-sm leading-tight">{theme.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="bg-[#161B22] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800">
              <label className="block mb-4">
                <span className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
                  Thumbnail Description
                  <span className="text-red-400">*</span>
                </span>
                <span className="text-xs sm:text-sm text-gray-400 block">
                  Describe what you want to see in your thumbnail. Be specific
                  about colors, emotions, and elements.
                </span>
              </label>

              <textarea
                placeholder="Example: Explosion in the background, character celebrating with arms up, bold yellow text, dramatic lighting, high energy, motion blur effects..."
                rows="4"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-[#0D1117] border border-gray-800 rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-sm sm:text-base text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
              />

              <button
                onClick={() => { setPromptEnhanceBtnText("Enhancing"); enhancePrompt(prompt); }}
                className="mt-3 sm:mt-4 w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg sm:rounded-xl text-purple-400 text-sm sm:text-base font-semibold hover:bg-purple-500/20 transition flex items-center justify-center gap-2"
              >
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                {promptEnhanceBtnText}
                {/* When enhancing loader should appear */}
                {promptEnhanceBtnText === "Enhancing" && <BeatLoader
                size={10}
                color="#C084FC"
                />}
              </button>
            </div>

            {/* Assets Section */}
            <div className="bg-[#161B22] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800">
              <div className="mb-4 sm:mb-6">
                <span className="text-base sm:text-lg font-semibold mb-2 block">
                  Brand Assets (Optional) ⚡
                </span>
                <span className="text-xs sm:text-sm text-gray-400 block">
                  Upload your logo or main subject to be included in the
                  thumbnail
                </span>
              </div>

              {/* Logo Upload */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <label className="text-sm sm:text-base font-semibold text-gray-300">Logo</label>
                  <span className="text-xs text-gray-500">
                    PNG, JPG up to 5MB
                  </span>
                </div>

                {selectedLogo ? (
                  <div className="relative bg-[#0D1117] rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedLogo.url ? (
                          <img
                            src={selectedLogo.url}
                            alt={selectedLogo.filename || 'Logo'}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <FileImage className="w-6 h-6 text-purple-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                            {selectedLogo.filename || selectedLogo.name || 'Logo'}
                          </p>
                          <p className="text-xs text-gray-400">Selected</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedLogo(null)}
                        className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openAssetModal("logo")}
                    className="w-full border-2 border-dashed border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-purple-500/50 transition"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Click to upload logo
                    </p>
                  </button>
                )}

                {/* Logo Position */}
                <div className="mt-3 sm:mt-4">
                  <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-300">
                    Logo Position
                  </label>
                  <select
                    value={logoPosition}
                    onChange={(e) => setLogoPosition(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#0D1117] border border-gray-800 rounded-lg sm:rounded-xl focus:outline-none focus:border-purple-500 transition"
                  >
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="h-px bg-gray-800 my-4 sm:my-6"></div>

              {/* Subject Upload */}
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <label className="text-sm sm:text-base font-semibold text-gray-300">
                    Main Subject (Face/Product)
                  </label>
                  <span className="text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </span>
                </div>

                {selectedSubject ? (
                  <div className="relative bg-[#0D1117] rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedSubject.url ? (
                          <img
                            src={selectedSubject.url}
                            alt={selectedSubject.filename || 'Subject'}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <FileImage className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                            {selectedSubject.filename || selectedSubject.name || 'Subject'}
                          </p>
                          <p className="text-xs text-gray-400">Selected</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedSubject(null)}
                        className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openAssetModal("subject")}
                    className="w-full border-2 border-dashed border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-purple-500/50 transition"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Click to upload your face or product image
                    </p>
                  </button>
                )}

                {/* Subject Position */}
                <div className="mt-3 sm:mt-4">
                  <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-300">
                    Subject Position
                  </label>
                  <select
                    value={subjectPosition}
                    onChange={(e) => setSubjectPosition(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#0D1117] border border-gray-800 rounded-lg sm:rounded-xl focus:outline-none focus:border-purple-500 transition"
                  >
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Reference Thumbnails */}
            <div className="bg-[#161B22] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800">
              <div className="mb-4">
                <span className="text-base sm:text-lg font-semibold mb-2 block">
                  Reference Thumbnails (Optional) ⚡
                </span>
                <span className="text-xs sm:text-sm text-gray-400 block">
                  Upload thumbnails you like for style inspiration.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {selectedReference ? (
                  <div className="relative aspect-video bg-[#0D1117] rounded-lg sm:rounded-xl border-2 border-purple-500 overflow-hidden group">
                    {selectedReference.url ? (
                      <img
                        src={selectedReference.url}
                        alt={selectedReference.filename || 'Reference'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedReference(null)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openAssetModal("reference")}
                    className="aspect-video border-2 border-dashed border-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition"
                  >
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-3 sm:pt-4">
              <button
              onClick={(e) => {setSubmitBtnText("Generating"); handleSubmit(e)}}
              className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center justify-center gap-2 sm:gap-3">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                {submitBtnText}
                {/* Show loader when generating */}
                {submitBtnText === "Generating" && <BeatLoader
                size={10}
                color="#fff"
                />}
              </button>
              <div className="mt-3 sm:mt-4 text-center">
                <p className="text-xs sm:text-sm text-gray-400">
                  This will use{" "}
                  <span className="text-white font-semibold">1 credit</span>
                  {" • "}
                  <span className="text-gray-500 hidden xs:inline">
                    Estimated time: 30-40 seconds
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
