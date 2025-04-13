import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function useFetchDetail(endpoint) {
    try {
        const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        // return [];
        throw (error?.response?.data?.message || error?.message || 'Something went wrong');

    } 
}