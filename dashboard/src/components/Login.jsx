import ResmicLogo from '../assets/images/resmic-logo.png'
import { useEffect, useState } from 'react'
import VerifyOtp from "../components/VerifyOtp"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAddDetail } from '../hooks/useAddDetails';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [nextPage, setNextPage] = useState(false)
    const [showOtpPage, setShowOtpPage] = useState(false);
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
   
    function handlePage (){
        setNextPage(!nextPage);
    }

    useEffect(()=>{
        if(token){
            navigate("/")
        }
    },[])

    async function submitEmail(){
        try {
            setIsValid(false);
            const response = await useAddDetail('api/v1/auth/login',{
                email : email
            })
            
            toast.success("Otp Sent Successfully!", {
                position: "top-center",
                autoClose : 4000
            });
            setShowOtpPage(!showOtpPage)
        }
        catch (error) {
            toast.error(error || "Something went wrong!", {
                position: "top-center",
                autoClose : 4000,
            });       
        }
        finally{
            setIsValid(true);
        }
    }

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setIsValid(validateEmail(value));
    };

    function makeOtpPageFalse(){
        setShowOtpPage(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitEmail();
        }
      };

    return (
        <>
          {
            showOtpPage == false ? (
                <div className="w-100 min-h-screen bg-secondary flex justify-center items-center">
            <div className=" lg:w-[40%] md:w-[70%] w-[90%] border-red-800 flex flex-col items-center justify-center text-center">
                <div className='flex justify-center items-center gap-4 my-4'>
                    <img src={ResmicLogo} alt="resmiclogo" width="60px" className="filter grayscale"/>
                    <h1 className='text-4xl font-bold text-black'>Resmic Pro</h1>
                </div>

                {
                    nextPage == false ?
                    <div className="w-[90%] bg-white my-3 p-5 rounded-xl flex flex-col justify-center items-center">
                    <h3 className='text-2xl font-bold my-3'>Sign in to your account</h3>
                    <p className='text-gray-500 text-md my-3 tracking-wide'>Resmic is available on Base, Polygon <br /> and Sepolia</p>
                    <button onClick={handlePage} className='w-[90%] bg-primary py-2 rounded-md text-center cursor-pointer text-white flex items-center justify-center gap-3 my-3 text-md border-primary'>
                    <i className="bi bi-envelope"></i>
                    Sign in with your Email
                    </button>
                    </div> :
                    <div className="w-[90%] bg-white my-3 p-5 rounded-xl flex flex-col justify-center items-center">
                    <div className='min-w-[100%] text-start'>
                        <i className="bi bi-arrow-left text-2xl cursor-pointer" onClick={handlePage}></i>
                    </div>
                    <h3 className='px-5 py-4 rounded-full bg-secondary text-gray-500 my-3'>
                        <i className="bi bi-envelope text-3xl"></i>
                        </h3>
                    <h3 className='text-2xl font-bold my-3'>Sign in with your Email</h3>
                    <div className='relative w-[100%]'>
                    <input type="email"
                    className={`w-[90%] lg:px-10 md:px-16 px-10 py-2 my-3 outline-none border rounded-md focus:border-primary`}
                        placeholder="Enter your email"
                        value={email}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}  />
                         
                        <div className='absolute top-5 left-8 md:left-14 lg:left-[8%]'>
                            <i className="bi bi-envelope"></i>
                        </div>
                    </div>
                    <button className={`w-[90%] py-2 rounded-md text-white text-center flex items-center justify-center gap-3 my-3 text-md border-primary 
                     ${isValid ? "bg-primary cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
                     onClick={submitEmail}
                     disabled={!isValid}
                 >
                     Continue <i className="bi bi-arrow-right"></i>
                 </button>                                  
                    </div>

                }

                <p className='text-sm flex flex-wrap justify-center gap-1 items-center text-gray-500 my-3'> <i className="bi bi-c-circle"></i> Resmic 2025 <i className="bi bi-dot"></i> <a href="mailto:support@resmic.com">Contact</a> <i className="bi bi-dot"></i> <a href="https://www.resmic.com/privacy/" target='_blank'>Privacy Policy</a> <i className="bi bi-dot"></i> <a href="https://www.resmic.com/terms/" target='_blank'>Terms of Conditions</a></p>
            </div>
          </div>
            ) : <VerifyOtp userEmail={email} makeOtpPageFalse ={makeOtpPageFalse}/>
          }
          <ToastContainer />
        </>
    )
}
  
export default Login
  