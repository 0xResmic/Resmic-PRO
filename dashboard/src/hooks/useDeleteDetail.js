import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export async function useDeleteDetail(endpoint, body) {
    try {
        const response = await axios.delete(`${BACKEND_URL}${endpoint}`, { data: body }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw (error?.message || 'Something went wrong');
    } 
}