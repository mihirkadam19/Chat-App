import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUP: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    
    isCheckingAuth: true,
    checkAuth: async () => {
        try{
            const response = await axiosInstance.get("/auth/check");
            set({authUser: response.data});
        } catch(error){
            set({authUser: null})
            console.log("Error in check auth", error)
        } finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async(data) => {
        set({isSigningUP: true})
        try{
            const response = await axiosInstance.post("/auth/signup", data);
            set({authUser: response.data});
            toast.success("Account created succesfully");
        } catch(error) {
            toast.error(error.response.data.message);
            console.log("Error is siging up", error)
        } finally {
            set({isSigningUP:false});
        }
    }
}));