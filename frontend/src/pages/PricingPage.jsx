import React from 'react'
import logoImg from "../assets/visura-logo.png";
import { useEffect, useState } from 'react';
import { ArrowLeft, FileImage } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import {
  Check,
} from "lucide-react";

import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

const PricingPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {initial} = location.state || {};
    const [userData, setUserData] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Fetch user data on component mount
    useEffect(() => {
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
          } else {
            toast.error("Please login to continue");
            navigate('/login');
          }
        } catch (error) {
          toast.error("Please login to continue");
          navigate('/login');
        }
      };

      fetchUserData();
    }, [navigate]);

    const onPlanSelect = async () => {
      // Handle plan selection logic here
      if (!userData) {
        toast.error("User data not loaded. Please try again.");
        return;
      }

      try {
        // Make API call to update user plan
        const response = await axios.post(
          API_ENDPOINTS.UPDATE_PLAN,
          {
            userId: userData._id
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (response.status === 200) {
          toast.success("Plan updated successfully");
          // Optionally navigate to thumbnail generator
          navigate('/thumbnail-generation', { state: { userData: response.data.user, initial: initial } });
        }

      }
      catch (error) {
        toast.error(error.response?.data?.message || "Failed to update plan");
      }
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
        <div
        className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img
          onClick={() => navigate('/')}
          src={logoImg} alt="Visura Logo" className="h-7 cursor-pointer" />

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
        
          <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#161B22] rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-gray-400 text-sm">Perfect for trying out</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-1">$0</div>
                <div className="text-gray-400 text-sm">Forever free</div>
              </div>
              <button className="w-full px-6 py-3 bg-[#0D1117] border border-gray-800 rounded-xl font-semibold hover:bg-[#1c2128] transition">
                Get Started
              </button>
              <ul className="mt-8 space-y-4">
                {[
                  "1 thumbnail per month",
                  "Basic style presets",
                  "Standard quality export"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border-2 border-purple-500 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-400 text-sm">For serious creators</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-1">$19</div>
                <div className="text-gray-400 text-sm">per month</div>
              </div>
              <button
              onClick={onPlanSelect}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/50 transition">
                Get Pro
              </button>
              <ul className="mt-8 space-y-4">
                {[
                  "100 thumbnails per month",
                  "All style presets",
                  "High quality export",
                  "Face/logo upload",
                  "Prompt enhancement",
                  "Priority support",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Plan */}
            <div className="bg-[#161B22] rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Business</h3>
                <p className="text-gray-400 text-sm">For teams & agencies</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-1">$49</div>
                <div className="text-gray-400 text-sm">per month</div>
              </div>
              <button className="w-full px-6 py-3 bg-[#0D1117] border border-gray-800 rounded-xl font-semibold hover:bg-[#1c2128] transition">
                Contact Sales
              </button>
              <ul className="mt-8 space-y-4">
                {[
                  "Unlimited thumbnails",
                  "Custom brand kit",
                  "Team collaboration",
                  "API access",
                  "Dedicated support",
                  "Custom integrations",
                  "SLA guarantee",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Note */}
          <div className="text-center mt-12">
            <p className="text-gray-400">
              Need a custom plan?{" "}
              <a
                href="#"
                className="text-purple-400 hover:text-purple-300 transition font-semibold"
              >
                Contact us
              </a>{" "}
              for enterprise solutions
            </p>
          </div>
        </div>
      </section>

        </div>

      </div>
  );
}

export default PricingPage