import InvoicePage from "./Invoice/InvoicePage";
import InvoiceTopCard from "./Invoice/InvoiceTopCard";

function Invoice() {
    return(
        <>
            <div className="w-[100%] lg:w-[85%] min-h-screen p-4">
                <div className="flex justify-between items-end flex-wrap mb-2">
                    <h1 className="text-3xl font-bold">Invoices</h1>
                    <a href="https://pay.resmic.com/" target="_blank"><button className="px-2 py-1 text-sm bg-primary text-white rounded-md cursor-pointer font-semibold">
                    <i className="bi bi-plus-lg"></i> Create Invoice
                    </button></a>
                </div>
                <InvoiceTopCard/>
                <InvoicePage/>
            </div>
        </>
    )
}

export default Invoice;