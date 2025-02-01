import axios from "axios";

export const axiosInstance = exios.create({
    baseURL: "http://locahost:5001/api",
    withCredentials: true,
})