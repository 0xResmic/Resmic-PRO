import CouponPage from "./Coupon/CouponPage";
import { useState, useEffect } from "react";
import { useFetchDetail } from "../hooks/useFetchDetail";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Coupon() {
    const [apiData, setAPIData] = useState([]);
    const token = useSelector((state) => state.auth.token);
        useEffect(()=>{
            getAPIData();
        },[])
    
    
        async function getAPIData() {
            try {
                const response = await useFetchDetail(`api/v1/coupon/coupon-list?user_id=${token}`);
                setAPIData(response);
            } catch (error) {
                // toast.error(error || "Something went wrong!", {
                //             position: "top-center",
                //             autoClose: 4000
                // }); 
            }
        }
        
    return(
        <>
            <div className="w-[100%] lg:w-[85%] min-h-screen p-4">
                <CouponPage data={apiData}/>
            </div>
            <ToastContainer />
        </>
    )
}

export default Coupon;