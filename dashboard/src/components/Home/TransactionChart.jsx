import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const filterData = (data, filter) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const now = new Date();
  
  if (filter === "12 Months" || filter === "6 Months") {
    const filteredData = sortedData.filter(({ date }) => {
      const itemDate = new Date(date);
      return now - itemDate <= (filter === "12 Months" ? 12 : 6) * 30 * 24 * 60 * 60 * 1000;
    });
    const monthlyData = {};
    filteredData.forEach(({ date, total_volume }) => {
      const month = new Date(date).toLocaleString("en-GB", { month: "short", year: "numeric" });
      monthlyData[month] = (monthlyData[month] || 0) + parseFloat(total_volume);
    });
    return Object.entries(monthlyData).map(([date, total_volume]) => ({ date, total_volume }));
  }
  
  const filteredData = sortedData.filter(({ date }) => {
    const itemDate = new Date(date);
    if (filter === "7 Days") return now - itemDate <= 7 * 24 * 60 * 60 * 1000;
    if (filter === "30 Days") return now - itemDate <= 30 * 24 * 60 * 60 * 1000;
    return true;
  });
  
  return filteredData.map(({ date, total_volume }) => ({
    date: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    total_volume: parseFloat(total_volume)
  }));
};

const exportToExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const fileData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
  saveAs(fileData, "transactions.xlsx");
  toast.success("File successfully downloaded!", { position: "top-right" });
};

export default function TransactionsChart({apiData}) {
  const [filter, setFilter] = useState("30 Days");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData(filterData(apiData, filter));
  }, [filter, apiData]);

  return (
    <div className="w-full md:w-[68%] my-3">
        <div className="py-3 pl-3 border shadow-md rounded-md pr-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-black mr-2">Payment Report</h2>
                <div className="flex space-x-2 flex-wrap gap-y-2">
                {["12 Months", "6 Months", "30 Days", "7 Days"].map((option) => (
                    <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={`text-xs cursor-pointer px-2 py-1 rounded-lg border transition-all ${filter === option ? "bg-black text-white" : "border-black text-black"}`}
                    >
                    {option.toUpperCase()}
                    </button>
                ))}
                <button onClick={() => exportToExcel(chartData)} className="text-xs px-2 py-1 rounded-lg border border-black text-black cursor-pointer">
                    Export Excel &nbsp; <i className="bi bi-arrow-down-circle text-md"></i>
                </button>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300} className="text-xs">
                {chartData.length > 0 ? (
                    <LineChart data={chartData}>
                    <XAxis dataKey="date" stroke="#4f2c71" />
                    <YAxis stroke="#4f2c71" tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Line type="monotone" dataKey="total_volume" stroke="#4f2c71" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                      No Payment Report Found for Last {filter}
                    </div>
                )}
            </ResponsiveContainer>

            <ToastContainer/>
            </div>
    </div>
  );
}