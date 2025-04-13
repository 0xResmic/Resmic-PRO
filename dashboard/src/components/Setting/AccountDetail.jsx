import { useEffect, useState } from "react";
import { useFetchDetail } from "../../hooks/useFetchDetail";
import { useUpdateDetail } from "../../hooks/useUpdateDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AccountDetail() {
    const navigate = useNavigate();
    // State for form fields
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "heydivyapawar@gmail.com", // Pre-filled and disabled
    });

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const token = useSelector((state) => state.auth.token);

    // Handle form submission
    async function handleSaveChanges() {
        try {
                const response = await useUpdateDetail('api/v1/user', {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                })
                console.log("Response is : ", response);
                toast.success("Personal Detail Saved Successfully!", {
                    position: "top-center",
                    autoClose: 3000 
                    });

                    setFormData({
                        ...formData,
                        firstName: "",
                        lastName: "",
                    });

                    setTimeout(()=>{
                        toast.info("Fetching Updated Detail!", {
                            position: "top-center",
                            autoClose: 2000 
                            });
                    }, 2000)
                    setTimeout(()=>{
                        getUserDetail();
                    }, 5000)
            } catch (error) {
                toast.error(error || "Something went wrong!", {
                    position: "top-center",
                    autoClose: 4000
                });
            }
    };

    useEffect(()=>{
        getUserDetail();
    },[]);

    async function getUserDetail() {
        const response = await useFetchDetail(`api/v1/user?user_id=${token}`)
        console.log("User Detail: ", response);
        const nameParts = response.name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts[1] || "";

        // Set the state with API data
        setFormData({
            firstName: firstName,
            lastName: lastName,
            email: response.email
        });
    }

    function navigateBack() {
        navigate("/setting");
    }

    return (
        <div className="w-[100%] lg:w-[85%] min-h-screen p-4">
            <p className="text-blue-500 cursor-pointer mb-3 font-medium" onClick={navigateBack}><i className="bi bi-arrow-left"></i> Go Back</p>
            <div className="flex justify-between items-end flex-wrap mb-6 gap-y-3">
                <h1 className="text-3xl font-bold">Account Detail</h1>
                <button 
                    onClick={handleSaveChanges} 
                    className="px-2 py-1 text-sm bg-primary text-white rounded-md cursor-pointer font-semibold"
                >
                    <i className="bi bi-plus-lg"></i> Save Changes
                </button>
            </div>

            <div className="flex items-center">
                <div className="sm:w-[20%]">
                    <label className="text-lg font-medium" htmlFor="firstName">First Name</label>
                </div>
                <div className="sm:w-[50%] mx-2 w-full">
                    <input 
                        type="text" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-primary" 
                        placeholder="Enter First Name" 
                        id="firstName"
                    />
                </div>
            </div>

            <div className="flex items-center my-5">
                <div className="sm:w-[20%]">
                    <label className="text-lg font-medium" htmlFor="lastName">Last Name</label>
                </div>
                <div className="sm:w-[50%] mx-2 w-full">
                    <input 
                        type="text" 
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-primary" 
                        placeholder="Enter Last Name" 
                        id="lastName"
                    />
                </div>
            </div>

            <div className="flex items-center my-5">
                <div className="sm:w-[20%]">
                    <label className="text-lg font-medium" htmlFor="email">Email</label>
                </div>
                <div className="sm:w-[50%] mx-2 w-full">
                    <input 
                        type="text" 
                        name="email" 
                        value={formData.email}
                        className="w-full border border-gray-300 px-4 py-3 text-gray-400 rounded-md outline-none focus:border-primary cursor-not-allowed" 
                        placeholder="heydivyapawar@gmail.com" 
                        id="email" 
                        disabled
                    />
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default AccountDetail;