import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useFetchDetail } from "../../hooks/useFetchDetail";
import { useSelector } from "react-redux";

const PaymentsList = () => {
  const [data, setData] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const token = useSelector((state) => state.auth.token);

  const handleFilterChange = (e) => {
    setStatusFilter(e?.target?.value);
  };

  const fetchData = async (page = 1) => {
    const params = new URLSearchParams({
        user_id: token,
        limit: 10,
        page,
        ...(transactionId && { transaction_hash : transactionId }),
        ...(fromDate && { from_date: fromDate }),
        ...(toDate && { to_date: toDate }),
        ...(statusFilter && { status : statusFilter })
      }).toString();

    const result = await useFetchDetail(`api/v1/dashboard/recent-txs?${params}`);
    setData(result);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (e) => setTransactionId(e.target.value);
  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);

  const applyFilters = () => fetchData(1);

  const resetFilters = async () => {
    setTransactionId("");
    setFromDate("");
    setToDate("");
    setStatusFilter("");
    const result = await useFetchDetail(`api/v1/dashboard/recent-txs?user_id=${token}&limit=10&page=1`);
    setData(result);
    setCurrentPage(1);
  };

  const exportToExcel = async () => {
    const result = await useFetchDetail(`api/v1/dashboard/recent-txs?user_id=${token}&limit=200&page=1`);
    console.log("result", result)
    const data_ = result?.map(tx => ({
      "Date": tx.created_at,
      "Payment Session": tx.session_id,
      "Transaction Hash": tx.transaction_id,
      "Payment Status": tx.status,
      "Amount (USD)": tx.amount,
      "Token": tx.token,
      "Blockchain": tx.blockchain,
      "Wallet Address": tx.from_wallet_address,
      "Coupon Code": tx.coupon_code || "N/A",
    })) || [];
    const ws = XLSX.utils.json_to_sheet(data_);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments.xlsx");
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      fetchData(newPage);
    }
  };

  return (
    <div className="w-full p-3">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <div className="mb-4 flex md:justify-end items-center flex-wrap gap-2">
        <div className="flex items-center space-x-4 flex-wrap gap-y-6 text-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Transaction ID"
              value={transactionId}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <p className="absolute -top-3 left-1 bg-white px-2 text-primary">Tnx ID</p>
          </div>
          <div className="relative">
            <select
                value={statusFilter}
                onChange={handleFilterChange}
                className="text-sm px-4 py-2 border border-gray-300 rounded-md"
            >
                <option value="" disabled>Select</option>
                <option value="completed">Paid</option>
                <option value="failed">Failed</option>
            </select>
            <p className="absolute -top-3 left-1 bg-white px-2 text-primary">Status</p>
          </div>
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <p className="absolute -top-3 left-1 bg-white px-2 text-primary">Start Date</p>
          </div>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <p className="absolute -top-3 left-1 bg-white px-2 text-primary">End Date</p>
          </div>
        </div>
        <button onClick={applyFilters} className="px-4 py-2 bg-primary text-white rounded-md text-sm">
          Apply Filters
        </button>
        <button onClick={resetFilters} className="px-4 py-2 border border-primary text-primary rounded-md text-sm">
          Reset Filters
        </button>
        <button onClick={exportToExcel} className="px-4 py-2 bg-primary text-white rounded-md text-sm">
          Export to XLSX
        </button>
      </div>

      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full bg-white border border-gray-200 text-sm text-center">
          <thead>
          <tr className="border-b bg-gray-100">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Token</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((item) => (
                <tr key={item?.transaction_id} className="border-b">
                          <td className="px-4 py-2">{new Date(item?.created_at)?.toLocaleString()}</td>
                          <td className="px-4 py-2">$ {item?.amount}</td>
                          <td className="px-4 py-2">{item?.status == 'completed' || item?.status == 'Completed'  ? <span className="bg-green-200 rounded-sm text-green-500 px-2">Paid</span> : <span className="bg-red-200 text-red-500 px-2 rounded-sm">Failed</span>}</td>
                          <td className="px-4 py-2">{item?.from_wallet_address
                            ? `${item.from_wallet_address.slice(0, 6)}...${item.from_wallet_address.slice(-4)}`
                            : ""}</td>
                          <td className="px-4 py-2">{item?.token}</td>
                          <td className="px-4 py-2">{item?.blockchain}</td>
                          <td className="px-4 py-2">{item?.action || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-2">
                  No recent payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          disabled={data?.length<10}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentsList;
