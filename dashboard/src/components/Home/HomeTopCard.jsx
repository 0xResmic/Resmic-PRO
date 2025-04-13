function HomeTopCard({data}){
    return(
        <>
        <div className="flex justify-between my-1 md:my-2 items-center flex-wrap">

            {/* Card 1 */}
            <div className="w-[45%] md:w-[24%] border shadow-md rounded-md p-3 bg-white">
                <p className="text-gray-500 tracking-wide text-xs">TODAY'S PAYMENT</p>
                <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                    <div className="text-2xl font-bold">
                    <i className="bi bi-currency-dollar"></i>
                       {data.volume_today || 0}</div>
                    <p className="text-xs text-green-500 font-semibold">
                        {/* <i className="bi bi-plus-lg"></i> 36% <i className="bi bi-arrow-up"></i> */}
                        </p>
                </div>

            </div>

            {/* Card 2 */}
            <div className="w-[45%] md:w-[24%] border  shadow-md rounded-md p-3 bg-white my-3">
                <p className="text-gray-500 tracking-wide text-xs">THIS WEEK</p>
                <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                    <div className="text-2xl font-bold">
                    <i className="bi bi-currency-dollar"></i>
                    {data.volume_1_week || 0}</div>
                    <p className="text-xs text-green-500 font-semibold">
                        {/* <i className="bi bi-plus-lg"></i> 36% <i className="bi bi-arrow-up"></i> */}
                        </p>
                </div>

            </div>

            {/* Card 3 */}
            <div className="w-[45%] md:w-[24%] border  shadow-md rounded-md p-3 bg-white my-3">
                <p className="text-gray-500 tracking-wide text-xs">TOTAL TRANSACTIONS</p>
                <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                    <div className="text-2xl font-bold">
                    {data.total_txs || 0}</div>
                    <p className="text-xs text-green-500 font-semibold">
                        {/* <i className="bi bi-plus-lg"></i> 36% <i className="bi bi-arrow-up"></i> */}
                        </p>
                </div>

            </div>

            {/* Card 4 */}
            <div className="w-[45%] md:w-[24%] border  shadow-md rounded-md p-3 bg-white my-3">
                <p className="text-gray-500 tracking-wide text-xs">UNIQUE USERS</p>
                <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                    <div className="text-2xl font-bold">
                    {data.unique_users || 0}</div>
                    <p className="text-xs text-green-500 font-semibold">
                        {/* <i className="bi bi-plus-lg"></i> 36% <i className="bi bi-arrow-up"></i> */}
                        </p>
                </div>

            </div>

        </div>
        </>
    )
}

export default HomeTopCard;