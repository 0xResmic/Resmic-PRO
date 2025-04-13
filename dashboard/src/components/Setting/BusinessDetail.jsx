import { useEffect, useState } from "react";
import { useFetchDetail } from "../../hooks/useFetchDetail";
import { useUpdateDetail } from "../../hooks/useUpdateDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function BusinessDetail() {
    const navigate = useNavigate();
    // State for form fields
    const [formData, setFormData] = useState({
        businessName: "",
        businessAddress: "",
        businessEmail: "",
        supportEmail: "",
        supportMobile: "",
        businessWebsite: "",
        companyIdentificationNumber: ""
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
                const response = await useUpdateDetail('api/v1/user/company', {
                    user_id: token,
                    name: formData.businessName,
                    address: formData.businessAddress, 
                    email: formData.businessEmail,
                    support_email: formData.supportEmail, 
                    mobile: formData.supportMobile, 
                    support_mobile: formData.supportMobile,
                    company_identification_no: formData.companyIdentificationNumber,
                })
                console.log("Response is : ", response);
                toast.success("Business Detail Saved Successfully!", {
                    position: "top-center",
                    autoClose: 3000 
                    });

                    setFormData({
                        businessName: "",
                        businessAddress: "",
                        businessEmail: "",
                        supportEmail: "",
                        supportMobile: "",
                        businessWebsite: "",
                        companyIdentificationNumber: ""
                    });

                    setTimeout(()=>{
                        toast.info("Fetching Updated Detail!", {
                            position: "top-center",
                            autoClose: 2000 
                            });
                    }, 2000)
                    setTimeout(()=>{
                        getBusinessDetail();
                    }, 5000)
            } catch (error) {
                toast.error(error || "Something went wrong!", {
                    position: "top-center",
                    autoClose: 4000
                });
            }
    };

    useEffect(()=>{
        getBusinessDetail();
    },[]);

    async function getBusinessDetail() {
        const response = await useFetchDetail(`api/v1/user/company?user_id=${token}`)
        console.log("Business Detail: ", response);

        // Set the state with API data
        setFormData({
            businessName: response.name,
            businessAddress: response.address,
            businessEmail: response.email,
            supportEmail: response.support_email,
            supportMobile: response.support_mobile,
            businessWebsite: "",
            companyIdentificationNumber: response.company_identification_no
        });
    }

    function navigateBack() {
        navigate("/setting");
    }

    return (
        <div className="w-[100%] lg:w-[85%] min-h-screen p-4">
            <p className="text-blue-500 cursor-pointer mb-3 font-medium" onClick={navigateBack}><i className="bi bi-arrow-left"></i> Go Back</p>
            <div className="flex justify-between items-end flex-wrap mb-3 gap-y-3">
                <h1 className="text-3xl font-bold">Business Detail</h1>
                <button 
                    onClick={handleSaveChanges} 
                    className="px-2 py-1 text-sm bg-primary text-white rounded-md cursor-pointer font-semibold"
                >
                    <i className="bi bi-plus-lg"></i> Save Changes
                </button>
            </div>

            <p className="text-sm text-gray-800">This information helps customers recognize your business, understand your product and terms of service</p>

            <hr className="my-5"/>

            <div className="flex items-center flex-wrap gap-y-3">
                <div className="sm:w-[30%]">
                    <label className="text-lg font-medium" htmlFor="businessName">Business Name</label>
                    <p className="text-xs text-gray-500 my-2">Your public business information will be used on Checkout page, invoices and receipts. Please make sure it's correct.</p>
                </div>
                <div className="sm:w-[50%] md:mx-3 w-full">
                    <input 
                        type="text" 
                        name="businessName" 
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-primary" 
                        placeholder="Enter Business Name" 
                        id="businessName"
                    />
                </div>
            </div>

            <div className="flex items-center my-5 flex-wrap gap-y-3">
                <div className="sm:w-[30%]">
                    <label className="text-lg font-medium" htmlFor="businessAddress">Business Address</label>
                    <p className="text-xs text-gray-500 my-2">Your public business address will be used wherever required. Please make sure it's correct.</p>

                </div>
                <div className="sm:w-[50%] md:mx-3 w-full">
                    <input 
                        type="text" 
                        name="businessAddress" 
                        value={formData.businessAddress}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-primary" 
                        placeholder="Enter Business Address"  
                        id="businessAddress"
                    />
                </div>
            </div>

            <div className="flex items-center my-5 flex-wrap gap-y-3">
                <div className="sm:w-[30%]">
                    <label className="text-lg font-medium" htmlFor="businessEmail">Notification Email</label>
                    <p className="text-xs text-gray-500 my-2">Email that is used for payment notifications</p>

                </div>
                <div className="sm:w-[50%] md:mx-3 w-full">
                    <input 
                        type="email" 
                        name="businessEmail" 
                        value={formData.businessEmail}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-primary" 
                        placeholder="Enter Notification Email"  
                        id="businessEmail"
                    />
                </div>
            </div>

            <div className="flex items-center my-5 flex-wrap gap-y-3">
                <div className="sm:w-[30%]">
                    <label className="text-lg font-medium" htmlFor="supportEmail">Support Email</label>
                    <p className="text-xs text-gray-500 my-2">A support email is essentail for customers who encounter, any issues during the checkout pages</p>

                </div>
                <div className="sm:w-[50%] md:mx-3 w-full">
                    <input 
                        type="email" 
                        name="supportEmail" 
                        value={formData.supportEmail}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-primary" 
                        placeholder="Enter Support Email"  
                        id="supportEmail"
                    />
                </div>
            </div>

            <div className="flex items-center my-5 flex-wrap gap-y-3">
                <div className="sm:w-[30%]">
                    <label className="text-lg font-medium" htmlFor="supportMobile">Support Number</label>
                    <p className="text-xs text-gray-500 my-2">A support number for any emergency customer grievance</p>

                </div>
                <div className="sm:w-[50%] md:mx-3 w-full">
                    <input 
                        type="number" 
                        name="supportMobile" 
                        value={formData.supportMobile}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-primary" 
                        placeholder="Enter Support Mobile"  
                        id="supportMobile"
                    />
                </div>
            </div>

            <div className="flex items-center my-5 flex-wrap gap-y-3">
                <div className="sm:w-[30%]">
                    <label className="text-lg font-medium" htmlFor="businessWebsite">Business Website</label>
                    <p className="text-xs text-gray-500 my-2">If you don't have a website, you can enter a social media page</p>

                </div>
                <div className="sm:w-[50%] md:mx-3 w-full">
                    <input 
                        type="text" 
                        name="businessWebsite" 
                        value={formData.businessWebsite}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-primary" 
                        placeholder="Eg: https://resmic.com"  
                        id="businessWebsite"
                    />
                </div>
            </div>

            <div className="flex items-center my-5 flex-wrap gap-y-3">
                <div className="sm:w-[30%]">
                    <label className="text-lg font-medium" htmlFor="companyIdentificationNumber">Company Identification Number</label>
                    <p className="text-xs text-gray-500 my-2">If you don't have a identification number, you can enter a social media identification number</p>

                </div>
                <div className="sm:w-[50%] md:mx-3 w-full">
                    <input 
                        type="text" 
                        name="companyIdentificationNumber" 
                        value={formData.companyIdentificationNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-primary" 
                        placeholder="Eg: Resmic1290DK"  
                        id="companyIdentificationNumber"
                    />
                </div>
            </div>

            <ToastContainer/>
        </div>
    );
}

export default BusinessDetail;