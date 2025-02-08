import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from "./useAuthStore.js"

export const useChatStore = create( (set,get) => ({
    messages:[],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    translation: false,
    
    getUsers: async() => {
        set({isUsersLoading:true})
        try{
            const res  = await axiosInstance.get("/message/users")
            set({users:res.data})
        } catch(error){
            toast.error(error.res.data.message);
        } finally {
            set({isUsersLoading:false});
        }
    },

    getMessages: async(userId) => {
        set({isMessagesLoading: true})
        try{
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages:res.data});
        } catch(error){
            toast.error(error.res.data.message);
        } finally {
            set({isMessagesLoading:false});
            const {messages} = get()
            console.log(messages)
        }
    },

    sendMessage: async(msgData) => {
        const {selectedUser, messages} = get()
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, msgData);
            set({messages:[...messages, res.data]});
        } catch(error){
            if (error.response) { // Check if the server responded with an error
                const errorMessage = error.response.data?.message || error.response.statusText || "An error occurred."; // Use optional chaining
    
                if (error.response.status === 413) {
                    console.error("Payload Too Large:", errorMessage);
                    toast.error("Message too large. Please shorten it."); // Specific message for 413
                } else {
                    console.error("HTTP Error:", error.response.status, errorMessage);
                    toast.error(errorMessage); // Generic message for other errors
                }
            } else if (error.request) { // The request was made but no response was received
                console.error("No response received:", error.message);
                toast.error("No response from the server.");
            } else { // Something happened in setting up the request that triggered an Error
                console.error("Request setup error:", error.message);
                toast.error("An error occurred while setting up the request.");
            }
        } 
    },

    
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;
        
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return; // my socket receives messages so code displays it for all users because no filter
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    translate: async(data) => {
        try{
            set({translation:true});
        } catch(error){
            set({translation:false});
            toast.error("Error translating text");
            console.log("Error in translation",error);
        }
    },

    backToOriginal: async() => {
        set({translation:false});
    },
}));