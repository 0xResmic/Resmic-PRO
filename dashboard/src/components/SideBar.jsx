import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
function SideBar() {
    const location = useLocation();
    const dispatch = useDispatch();
    return(
        <>
            <div className="w-[15%] min-h-screen lg:flex flex-col hidden border-r-2 bg-[#F9F9F9]">
                <ul className="flex flex-col justify-center items-start mt-4 text-md">
                    <Link to="/" className="text-gray-800 cursor-pointer p-2 rounded w-full">
                        <div
                            className={`px-2 py-2 rounded-md mr-2 ${
                                location.pathname === "/" ? "bg-primary text-white" : "text-black"
                            }`}
                        >
                            <i className="bi bi-grid mr-2"></i> Home
                        </div>
                    </Link>
                    <Link to="/payment" className="text-gray-800 cursor-pointer p-2 rounded w-full">
                        <div
                            className={`px-2 py-2 rounded-md mr-2 ${
                                location.pathname === "/payment" ? "bg-primary text-white" : "text-black"
                            }`}
                        >
                            <i className="bi bi-wallet2 mr-2"></i> Payment
                        </div>
                    </Link>
                    <Link to="/customer" className="text-gray-800 cursor-pointer p-2 rounded w-full">
                        <div
                            className={`px-2 py-2 rounded-md mr-2 ${
                                location.pathname === "/customer" ? "bg-primary text-white" : "text-black"
                            }`}
                        >
                            <i className="bi bi-people mr-2"></i> Customer
                        </div>
                    </Link>
                    <Link to="/payment-link" className="text-gray-800 cursor-pointer p-2 rounded w-full">
                        <div
                            className={`px-2 py-2 rounded-md mr-2 ${
                                location.pathname === "/payment-link" ? "bg-primary text-white" : "text-black"
                            }`}
                        >
                            <i className="bi bi-link-45deg mr-2"></i> Payment Links
                        </div>
                    </Link>

                    <Link to="/invoice" className="text-gray-800 cursor-pointer p-2 rounded w-full">
                        <div
                            className={`px-2 py-2 rounded-md mr-2 ${
                                location.pathname === "/invoice" ? "bg-primary text-white" : "text-black"
                            }`}
                        >
                            <i className="bi bi-list-columns mr-2"></i> Invoice
                        </div>
                    </Link>

                    {/* <Link to="/coupon" className="text-gray-800 cursor-pointer p-2 rounded w-full">
                        <div
                            className={`px-2 py-2 rounded-md mr-2 ${
                                location.pathname === "/coupon" ? "bg-primary text-white" : "text-black"
                            }`}
                        >
                            <i className="bi bi-bookmark-heart mr-2"></i> Coupons
                        </div>
                    </Link> */}

                    <Link to="/developer" className="text-gray-800 cursor-pointer p-2 rounded w-full">
                        <div
                            className={`px-2 py-2 rounded-md mr-2 ${
                                location.pathname === "/developer" ? "bg-primary text-white" : "text-black"
                            }`}
                        >
                            <i className="bi bi-code-slash mr-2"></i> Developer
                        </div>
                    </Link>

                    <Link to="/subscription" className="text-gray-800 cursor-pointer p-2 rounded w-full">
                        <div
                            className={`px-2 py-2 rounded-md mr-2 ${
                                location.pathname === "/subscription" ? "bg-primary text-white" : "text-black"
                            }`}
                        >
                            {/* <i className="bi bi-bag-plus-fill mr-2"></i> Subscription */}
                            <i className="bi bi-bag-plus mr-2"></i> Your Plans
                        </div>
                    </Link>


                    <a href= "mailto:support@resmic.com" className="text-gray-800 cursor-pointer p-2 rounded w-full">
                        <div
                            className={`px-2 py-2 rounded-md mr-2 text-black`}
                        >
                            <i className="bi bi-headset mr-2"></i> Support
                        </div>
                    </a>

                    <Link className="text-gray-800 cursor-pointer p-2 rounded w-full" onClick={() => dispatch(logout())} >
                        <div
                            className={`px-2 py-2 rounded-md mr-2 text-black`}>
                            <i className="bi bi-box-arrow-right mr-2"></i> Logout
                        </div>
                    </Link>
                </ul>
            </div>
        </>
    )
}

export default SideBar;