import { Camera, Languages, Mail, User } from 'lucide-react';
import React, { useDebugValue, useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile, updateLanguage} = useAuthStore();

  const [selectedImage, setSelectedImage] = useState();

  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
      language:""
    });
  
  useEffect(()=>{
    console.log("State refresh")
  }, [authUser.language])
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const validateForm = () => {
    if(!formData.language.trim()) return toast.error("No language entered");
      return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOpen(false)
    setFormData({language:""})
    const success = validateForm();
    if(success==true) updateLanguage(formData); 
    
  };

  return (
    <div className="h-full pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={ selectedImage || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>

            <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>

          
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Preferred Language
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.language}</p>
              <div className="flex items-center justify-center">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2"
                  >
                    <p className="text-sm">Click here to Edit</p>
                  </button>

                  {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-slate-600 bg-opacity-50">
                      <div className="bg-base-100 p-8 rounded-lg shadow-xl w-96 max-w-full">
                        <h2 className="text-md font-semibold text-center mb-4">
                          Let's Select Your Preferred Language
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <input
                            type="text"
                            className="input input-bordered w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="e.g. English"
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            />
                          
                          <div className="flex flex-row gap-x-4 justify-end">
                            <button
                              onClick={() => setIsOpen(false)}
                              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                              Close
                            </button>
                            <button
                              type="submit"
                              className="mt-4 px-4 py-2 bg-base-300 text-white rounded-lg"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
            
                

            <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>


          </div>
          </div>
        </div>
      </div>
      </div>  
  );
}

export default ProfilePage
