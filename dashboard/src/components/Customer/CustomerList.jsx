import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useFetchDetail } from "../../hooks/useFetchDetail";
import { useSelector } from "react-redux";

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector((state) => state.auth.token);

  const fetchData = async (page = 1) => {
    const params = new URLSearchParams({
        user_id: token,
        limit: 10,
        page,
        ...(userAddress && { from_wallet_address: userAddress }),
        ...(fromDate && { from_date: fromDate }),
        ...(toDate && { to_date: toDate })
      }).toString();

    const result = await useFetchDetail(`api/v1/dashboard/unique-users?${params}`);
    setData(result);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (e) => setUserAddress(e.target.value);
  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);

  const applyFilters = () => fetchData(1);

  const resetFilters = async () => {
    setUserAddress("");
    setFromDate("");
    setToDate("");
    const result = await useFetchDetail(`api/v1/dashboard/unique-users?user_id=${token}&limit=10&page=1`);
    console.log("result", result)
    if(result){
      setData(result);
    }
    else {
      setData([]);
      
    }
    setCurrentPage(1);
  };

  const exportToExcel = async () => {
    const result = await useFetchDetail(`api/v1/dashboard/unique-users?user_id=${token}&limit=10&page=1`);
    const ws = XLSX.utils.json_to_sheet(result);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "customers.xlsx");
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      fetchData(newPage);
    }
  };

  return (
    <div className="w-full p-3">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <div className="mb-4 flex md:justify-end items-center flex-wrap gap-2">
        <div className="flex items-center space-x-4 flex-wrap gap-y-6 text-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by User Address"
              value={userAddress}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <p className="absolute -top-3 left-1 bg-white px-2 text-primary">User Address</p>
          </div>
          {/* <div className="relative">
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
          </div> */}
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
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Total Spent</th>
              <th className="px-4 py-2">Total Transactions</th>
              <th className="px-4 py-2">First Payment</th>
              <th className="px-4 py-2">Last Payment</th>
              <th className="px-4 py-2">Tag</th>
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data.map((item) => (
                <tr key={item.transaction_id} className="border-b">
                  <td className="px-4 py-2">{item?.from_wallet_address
                            ? `${item.from_wallet_address.slice(0, 6)}...${item.from_wallet_address.slice(-4)}`
                            : ""}
                  </td>
                  <td className="px-4 py-2">$ {item.total_amount}</td>
                  <td className="px-4 py-2">{item.total_transactions}</td>
                  <td className="px-4 py-2">{new Date(item.first_transaction_date).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(item.last_transaction_date).toLocaleString()}</td>
                  <td className="px-4 py-2">{item.tag || "N/A"}</td>
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

export default CustomerList;
