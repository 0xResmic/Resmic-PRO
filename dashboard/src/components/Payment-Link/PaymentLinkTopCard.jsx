function PaymentLinkTopCard({data}) {
    return (
        <>
            <div className="flex justify-between items-center my-1 lg:my-3 flex-wrap">
                {/* card1 */}
                <div className="w-[45%] md:w-[32%] shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-500 tracking-wide text-xs">All Payment Link</div>
                    <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                        <div className="text-2xl font-bold">{data?.tier || 0}</div>
                    </div>
                </div>
                {/* Card2 */}
                <div className="w-[45%] md:w-[32%] shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-500 tracking-wide text-xs">Active</div>
                    <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                        <div className="text-2xl font-bold">{data?.end_date || 0}</div>
                    </div>
                </div>
                {/* Card3 */}
                <div className="w-[45%] md:w-[32%] shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-500 tracking-wide text-xs">De-Active</div>
                    <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                        <div className="text-2xl font-bold">{data?.unique_users || 0}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentLinkTopCard;