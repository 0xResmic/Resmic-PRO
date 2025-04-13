function HomeFeatures({data}){
    return(
        <>
        <div className="w-[100%] md:w-[30%]">
            {/* cARD 1 */}
            <div className="w-[100%] border  shadow-md rounded-md p-3 bg-white my-3">
                <p className="text-gray-500 tracking-wide text-xs">TOTAL VOLUME</p>
                <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                    <div className="text-2xl font-bold">
                    <i className="bi bi-currency-dollar"></i>
                    {parseFloat(data.total_volume).toFixed(2) || 0}</div>
                    <p className="text-xs text-green-500 font-semibold">
                        {/* <i className="bi bi-plus-lg"></i> 36% <i className="bi bi-arrow-up"></i> */}
                        </p>
                </div>
            </div>

            {/* Card 2*/}

            <div className=" border  shadow-md rounded-md p-3 bg-white my-3">
                <p className="text-gray-700 font-bold tracking-wide text-sm">CREATE PAYMENT LINK</p>
                <p className="text-xs font-light text-gray-500 my-2">Receive Crypto Payments For Anything</p>
                <a href="https://pay.resmic.com/" target="_blank"><button className="bg-primary border-none px-2 py-1 rounded-md text-xs text-white my-3"> <i className="bi bi-plus-lg"></i> Create</button></a>
            </div>

            {/* Card 3 */}

            <div className=" border shadow-md rounded-md p-3 bg-white my-3">
                <p className="text-gray-700 font-bold tracking-wide text-sm">CREATE INVOICE LINK</p>
                <p className="text-xs font-light text-gray-500 my-2">Receive Crypto Create And Send Crypto Invoice To Your Customers</p>
                <a href="https://invoice.resmic.com/" target="_blank"><button className="bg-primary border-none px-2 py-1 rounded-md text-xs text-white my-3"> <i className="bi bi-plus-lg"></i> Create</button></a>
            </div>

        </div>
        </>
    )
}

export default HomeFeatures