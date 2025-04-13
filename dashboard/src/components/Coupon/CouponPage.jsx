import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddDetail } from "../../hooks/useAddDetails";
import { useFetchDetail } from "../../hooks/useFetchDetail";
import { useSelector } from "react-redux";
import { useDeleteDetail } from "../../hooks/useDeleteDetail";

function CouponPage({ data }) {
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    //Modal
    const [showModal, setShowModal] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const [couponData, setCouponData] = useState({
        user_id : token ,
        coupon_code: "",
        discount_type: 0,
        discount_value: "",
        usage_limit: "",
        min_order: "",
        start_date: "",
        end_date: "",
      });
    const [deleteCoupon, setDeleteCoupon] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const itemsPerPage=10;
  
    const handleFilterChange = (e) => {
      setStatusFilter(e?.target?.value);
    };
  
    const handleSearchChange = (e) => {
      setSearchQuery(e?.target?.value);
    };
  
    // Apply filters whenever the statusFilter, searchQuery, or date values change
    useEffect(() => {
      let filtered = data;
  
      // Status Filter
      if (statusFilter !== "all") {
        const isActive = statusFilter === "active";
        filtered = filtered.filter((item) => item.is_active === isActive);
      }
  
      // Search Query Filter
      if (searchQuery) {
        filtered = filtered?.filter((item) =>
          item?.coupon_code?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
      }
  
      setFilteredData(filtered);
      console.log("Filteres Data is : ", data);
      setCurrentPage(1); // Reset to the first page when filters change
    }, [statusFilter, searchQuery, data]);
  
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(filteredData) ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];

  
    const exportToExcel = () => {
      const ws = XLSX?.utils?.json_to_sheet(filteredData);
      const wb = XLSX?.utils?.book_new();
      XLSX?.utils?.book_append_sheet(wb, ws, "Payments");
      XLSX?.writeFile(wb, "payments.xlsx");
    };

  async function getallData() {
    const response = await useFetchDetail(`api/v1/coupon/coupon-list?user_id=${token}`);
    setFilteredData(response);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateCoupon = async () => {
    if (!couponData.coupon_code.trim() || !couponData.discount_value || !couponData.usage_limit || !couponData.min_order || !couponData.start_date || !couponData.end_date) {
        return toast.error("All input field is required!", {
            position: 'top-center'
        });
    }

    setLoading(true);
    try {
      const response = await useAddDetail('api/v1/coupon/create', couponData)
        console.log("Response is : ",response);
        setCouponData({
            user_id : token ,
            coupon_code: "",
            discount_type: 0,
            discount_value: "",
            usage_limit: "",
            min_order: "",
            start_date: "",
            end_date: "",
          });
        toast.success("Coupon Generated Successfully!", {
            position: "top-center",
            autoClose: 2000 
        });
        setTimeout(()=>{
            toast.info("Fetching New Coupon List", {
                position: "top-center",
                autoClose: 2000 
            });
        }, 2000);
        setTimeout(()=>{
            getallData();
        }, 3000)
      // Clear input
    } catch (error) {
      toast.error("Coupon Generation Fail!", {
            position: "top-center",
            autoClose: 4000 
        });
    } finally {
        setShowModal(false);
        setApiKey(""); 
        setLoading(false);
    }
  };

  async function handleDeleteKey() {
    setLoading2(true);
    try {
      const response = await useDeleteDetail('api/v1/coupon', {
            coupon_id: deleteCoupon,
        })
        
        console.log("Response is : ",response);
        toast.success("Coupon Deleted Successfully!", {
            position: "top-center",
            autoClose: 2000 
        });
        setTimeout(()=>{
            toast.info("Fetching updated Data!", {
                position: "top-center",
                autoClose: 2000 
            });
        }, 2000)
        setTimeout(()=>{
            getallData();
        }, 5000)
      // Clear input
    } catch (error) {
      toast.error("Deleting API Failed!", {
            position: "top-center",
            autoClose: 4000 
        });
    } finally {
        setShowDeleteModal(false);
        setDeleteCoupon(""); 
        setLoading2(false);
    }
  }

  return (
    <>
      <div className="flex justify-between items-end flex-wrap mb-6">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <button onClick={() => setShowModal(true)} className="px-2 py-1 text-sm border border-gray-300 rounded-md cursor-pointer font-semibold">
          <i className="bi bi-plus-lg"></i> Create New Coupon
        </button>
      </div>
      <div>
        <div className="mb-4 flex md:justify-end items-center flex-wrap gap-2">
            <div className="flex items-center space-x-4 flex-wrap gap-y-6 text-sm">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by Coupon Code"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                />
                <p className="absolute -top-3 left-1 bg-white px-2 text-primary">Coupon Code</p>
            </div>
            <div className="relative">
                <select
                    value={statusFilter}
                    onChange={handleFilterChange}
                    className="text-sm px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <p className="absolute -top-3 left-1 bg-white px-2 text-primary">Status</p>
            </div>
            </div>
            <button
                onClick={exportToExcel}
                className="ml-2 px-4 py-2 bg-primary text-white rounded-md text-sm"
            >
                Export to XLSX
            </button>
            </div>
      </div>

      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full bg-white border border-gray-200 text-sm text-center">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2">Coupon Code</th>
              <th className="px-4 py-2">Start From</th>
              <th className="px-4 py-2">Coupon Type</th>
              <th className="px-4 py-2">Discount Amount</th>
              <th className="px-4 py-2">Min Order</th>
              <th className="px-4 py-2">Use Count</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">More</th>
            </tr>
          </thead>
          <tbody>
            {
              currentItems?.length !== 0 ? (
                currentItems?.map((item) => (
                  <tr key={item?.coupon_id} className="border-b">
                    <td className="px-4 py-2">{item?.coupon_code}</td>
                    <td className="px-4 py-2">{new Date(item?.start_date)?.toLocaleString()}</td>
                    <td className="px-4 py-2">{Number(item?.discount_type) == 0 ? "Fixed Amount" : "Percentage" }</td>
                    <td className="px-4 py-2">{item?.discount_value}</td>
                    <td className="px-4 py-2">{item?.min_order}</td>
                    <td className="px-4 py-2">{item?.used_count}</td>
                    <td className="px-4 py-2">{item?.is_active ? "Active" : "Inactive"}</td>
                    <td className="px-4 py-2 text-red-500 cursor-pointer" onClick={()=>{
                        setDeleteCoupon(item?.coupon_id)
                        setShowDeleteModal(true);
                    }}>{"Delete"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-2">
                    No recent payments found.
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
          disabled={currentPage * itemsPerPage >= filteredData?.length}
          className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* No Keys Section */}
      {filteredData?.length==0 && (
        <div className="h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm my-2 text-gray-600">No Coupon generated</p>
            <p className="text-md my-2">Generate your first Coupon</p>
            <button onClick={() => setShowModal(true)} className="px-2 py-1 bg-blue-500 text-white rounded-md cursor-pointer">
              <i className="bi bi-plus-lg"></i> Generate Coupon
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="mt-[10vh] mx-2 bg-white rounded-lg p-6 max-w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
          <div className="flex justify-between items-center">
          <h2 className="text-md font-bold mb-4">Generate Coupon</h2>
           <p className="text-xl font-bold cursor-pointer text-primary" onClick={() => setShowModal(false)}>X</p>
          </div>
          {/* 2 Inputs Per Row */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Coupon Code */}
            <div>
              <label className="text-xs font-semibold">Coupon Code</label>
              <input
                type="text"
                name="coupon_code"
                className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                placeholder="Enter Coupon Code"
                value={couponData.coupon_code}
                onChange={handleChange}
              />
            </div>
  
            {/* Discount Type */}
            <div>
              <label className="text-xs font-semibold">Discount Type</label>
              <select
                name="discount_type"
                className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                value={couponData.discount_type}
                onChange={handleChange}
              >
                <option value={0}>Flat Amount</option>
                <option value={1}>Percentage</option>
              </select>
            </div>
  
            {/* Discount Value */}
            <div>
              <label className="text-xs font-semibold">Discount Value</label>
              <input
                type="number"
                name="discount_value"
                className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                placeholder="Enter Discount Value"
                value={couponData.discount_value}
                onChange={handleChange}
              />
            </div>
  
            {/* Usage Limit */}
            <div>
              <label className="text-xs font-semibold">Usage Limit</label>
              <input
                type="number"
                name="usage_limit"
                className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                placeholder="Enter Usage Limit"
                value={couponData.usage_limit}
                onChange={handleChange}
              />
            </div>
  
            {/* Min Order Value */}
            <div>
              <label className="text-xs font-semibold">Min Order Value</label>
              <input
                type="number"
                name="min_order"
                className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                placeholder="Enter Min Order Value"
                value={couponData.min_order}
                onChange={handleChange}
              />
            </div>
  
            {/* Start Date */}
            <div>
              <label className="text-xs font-semibold">Start Date</label>
              <input
                type="date"
                name="start_date"
                className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                value={couponData.start_date}
                onChange={handleChange}
              />
            </div>
  
            {/* End Date */}
            <div>
              <label className="text-xs font-semibold">End Date</label>
              <input
                type="date"
                name="end_date"
                className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                value={couponData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateCoupon}
              className="px-3 py-2 bg-primary text-white rounded-md text-sm"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-md my-8 text-center">Are you sure you want to delete Coupon?</h2>
            <div className="flex justify-center space-x-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDeleteKey} className="px-4 py-2 bg-primary text-white rounded-md">
                {loading2 ? "Deleting..." : "Delete Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default CouponPage;