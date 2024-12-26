import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { updateProfile } from '../../../backend/controller/auth.controller';
export const useAuthStore = create((set) => ({
    authUser: null,
    isSignUp: false,
    isLogin: false,
    isUpdateProfile: false,
    isCheckAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/checkAuth");
            set({authUser: res.data});
        } catch (error) {
            set({authUser: null});
            console.log("Error in the checkAuth in useAuthStore", error.message);
        } finally {
            set({isCheckAuth: false});
        }
    },
    signup: async(data) => {
        try {
        set({isSignUp : true});
        const res = await axiosInstance.post("/auth/signup",data);
        set({authUser : res.data})
        toast.success("Account Create Successfully")
        } catch (error) {
            toast.error(error.response.data.error)
        } finally {
            set({isSignUp : false})
        }
    },
    login: async(data) => { 
        set({isLogin: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser : res.data})
            toast.success("Login Successfully")

        } catch (error) {
            toast.error(error.response.data.error)
        } finally {
            set({isLogin: false})
        }
    },
    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser : null})
            toast.success("Successfully logout")
        } catch (error) {
            toast.error(error.response.data.error)
        }
    },
    updateProfile: async(data) => {
        
    }
}))