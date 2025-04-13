function SubscriptionTopCard({data}){
    return(
        <>
        <div className="flex justify-between my-1 md:my-2 items-center flex-wrap">

            {/* Card 1 */}
            <div className="w-[45%] md:w-[24%] border shadow-md rounded-md p-3 bg-white">
                <p className="text-gray-500 tracking-wide text-xs">CURRENT PLAN</p>
                <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                <div className="text-2xl font-bold"> {data?.tier == "99" ? "Free Trial" : data?.tier == "1" ? "Starter" : data?.tier == "2" ? "Growth" : data?.tier == "3" ? "Enterprise" : "-"  || '-'}</div>
                </div>

            </div>

            {/* Card 2 */}
            <div className="w-[45%] md:w-[24%] border  shadow-md rounded-md p-3 bg-white my-3">
                <p className="text-gray-500 tracking-wide text-xs">VALID TILL</p>
                <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                    <div className="text-2xl font-bold">
                    {data?.end_date || '-'}</div>
                </div>

            </div>

            {/* Card 3 */}
            <div className="w-[45%] md:w-[24%] border  shadow-md rounded-md p-3 bg-white my-3">
                <p className="text-gray-500 tracking-wide text-xs">LAST PAYMENT AMOUNT</p>
                <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                    <div className="text-2xl font-bold">
                    {data?.created_at || '-'}</div>
                </div>

            </div>

            {/* Card 4 */}
            <div className="w-[45%] md:w-[24%] border  shadow-md rounded-md p-3 bg-white my-3">
                <p className="text-gray-500 tracking-wide text-xs">PAYMENT DUE</p>
                <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                    <div className="text-2xl font-bold">
                    {data?.unique_users ||'-'}</div>
                </div>

            </div>

        </div>
        </>
    )
}

export default SubscriptionTopCard;