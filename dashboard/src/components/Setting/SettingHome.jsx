import { useNavigate } from "react-router-dom";

function SettingHome() {
    const navigate = useNavigate();
    function navigateMe(pageName) {
        if(pageName == 'personal') {
            navigate('/setting/account-detail');
        } else {
            navigate('/setting/business-detail');
        }
    }
    return(
        <>
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <div className="flex items-center gap-4 flex-wrap my-3">
                    <div className="flex items-center p-2 rounded-xl border border-gray-300 gap-x-3 cursor-pointer w-[350px]" onClick={()=>navigateMe('personal')}>
                        <span className="px-3 py-2 bg-primary rounded-md text-2xl"><i className="bi bi-person text-white"></i></span>
                        <div>
                            <p className="text-ms">Account</p>
                            <p className="text-gray-800 text-sm">Update Personal and Login Details</p>
                        </div>
                    </div>

                    <div className="flex items-center p-2 rounded-xl border border-gray-300 gap-x-3 cursor-pointer w-[350px]"  onClick={()=>navigateMe('business')}>
                        <span className="px-3 py-2 bg-pink-500 rounded-md text-2xl"><i className="bi bi-bookmarks text-white"></i></span>
                        <div>
                            <p className="text-ms">Business</p>
                            <p className="text-gray-800 text-sm">Update Business Details</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingHome;