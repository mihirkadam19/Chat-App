import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";


const BASE_URL = "http://localhost:5001"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUP: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    isCheckingAuth: true,

    checkAuth: async () => {
        try{
            const response = await axiosInstance.get("/auth/check");
            set({authUser: response.data});
            //console.log(response.data)
            
            get().connectSocket(); 
            //console.log(get().socket)
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

            get().connectSocket();
        } catch(error) {
            toast.error(error.response.data.message);
            console.log("Error is siging up", error)
        } finally {
            set({isSigningUP:false});
        }
    },

    logout: async () => {
        try{
            const response = await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("User Logged out");
            get().disconnectSocket();
        } catch(error){
            toast.error(error.response.data.message);
        }
    },

    login: async (data) => {
        set({isLoggingIn:true});
        try{
            const response = await axiosInstance.post("/auth/login", data);
            set({authUser:response.data});
            toast.success("Login Success");

            get().connectSocket();
        } catch(error){
            toast.error(error.response.data.message);
            console.log("Error is Login",error);
        } finally{
            set({isLoggingIn:false});
        }
    },

    updateProfile: async(data) => {
        set({isUpdatingProfile:true});
        try {
            const response = await axiosInstance.put("/auth/update-pfp", data)
            //set({authUser})
            toast.success("Profile Picture Updated")
        } catch(error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            set({isUpdatingProfile:false});
        }
    },

    connectSocket: () => {
        const {authUser, socket, onlineUsers} = get();
        //console.log(socket)
        if (!authUser || socket?.connected) return;
        
        const newSocket = io(BASE_URL, {
            query:{
                userId: authUser._id,
            },
        });
        newSocket.connect();
        set({socket: newSocket});

        //listen for online users
        newSocket.on("getOnlineUsers", (userIds) => {
            //console.log(userIds);
            set({onlineUsers: userIds});
            //console.log("onlineUsers",get().onlineUsers);
        })
    },

    disconnectSocket: () => {
        //console.log("Disconnecting socket ...")
        if(get().socket?.connected) get().socket.disconnect();
    }
    
}));