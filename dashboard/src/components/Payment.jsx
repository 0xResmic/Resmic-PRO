import PaymentsList from "./Payments/PaymentsList.";

function Payment() {

    return(
        <>
            <div className="w-[100%] lg:w-[85%] min-h-screen p-4 ">
                <PaymentsList/>
            </div>
        </>
    )
}

export default Payment;