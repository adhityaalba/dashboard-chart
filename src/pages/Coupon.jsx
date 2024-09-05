import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { getToken } from '../utils/token'; 

const ITEMS_PER_PAGE = 10; 

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editCoupon, setEditCoupon] = useState(null); 
  const [newCoupon, setNewCoupon] = useState({ code: '', name: '', start_date: '', end_date: '' });
  const [isAdding, setIsAdding] = useState(false); 
  const token = getToken();

  // Fetch Coupons Data
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`https://sandbox.dibuiltadi.com/api/dashboard/common/v1/lists/coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.items;
      setCoupons(data);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
    } catch (error) {
      setError('Failed to fetch coupons data');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Calculate Paginated Data
  const paginatedCoupons = coupons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Pagination 
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle Create Coupon
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://sandbox.dibuiltadi.com/api/dashboard/customer-service/v1/coupons`, newCoupon, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewCoupon({ code: '', name: '', start_date: '', end_date: '' });
      setIsAdding(false);
      fetchCoupons();
    } catch (error) {
      setError('Failed to create coupon');
    }
  };

  // Handle Update Coupon
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://sandbox.dibuiltadi.com/api/dashboard/customer-service/v1/coupons/${editCoupon.code}`,
        {
          start_date: editCoupon.start_date,
          end_date: editCoupon.end_date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditCoupon(null);
      fetchCoupons();
    } catch (error) {
      setError('Failed to update coupon');
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editCoupon) {
      setEditCoupon({ ...editCoupon, [name]: value });
    } else {
      setNewCoupon({ ...newCoupon, [name]: value });
    }
  };

  // Handle Show Coupon Details
  const showCouponDetails = async (couponCode) => {
    try {
      const response = await axios.get(`https://sandbox.dibuiltadi.com/api/dashboard/customer-service/v1/coupons/${couponCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { code, name, start_date, end_date } = response.data;
      alert(`Coupon Code: ${code}\nName: ${name}\nStart Date: ${start_date}\nEnd Date: ${end_date}`);
    } catch (error) {
      setError('Failed to fetch coupon details');
    }
  };

  // Handle Export Data
  const handleExport = async () => {
    try {
      const response = await axios.get(`https://sandbox.dibuiltadi.com/api/dashboard/customer-service/v1/coupons/export?sort_by=name&sort_direction=asc&search_by=name&search_query=`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'coupons_export.txt');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setError('Failed to export coupons data');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-4">Coupon</h1>
        <p className="mb-4">Welcome to the Coupon!</p>
        {error && <p className="text-red-500">{error}</p>}

        {/* Create New Coupon Form */}
        <div className="flex items-center mb-4">
          {!isAdding && !editCoupon && (
            <>
              <button onClick={() => setIsAdding(true)} className="mr-4 px-4 py-2 bg-green-500 text-white rounded">
                Add New Coupon
              </button>
              <button onClick={handleExport} className="px-4 py-2 bg-blue-500 text-white rounded">
                Export
              </button>
            </>
          )}
        </div>
        {isAdding && (
          <form onSubmit={handleCreate} className="mb-4">
            <h2 className="text-xl font-bold mb-2">Add New Coupon</h2>
            <input type="text" name="code" placeholder="Coupon Code" value={newCoupon.code} onChange={handleChange} className="border p-2 mb-2 w-full" required />
            <input type="text" name="name" placeholder="Coupon Name" value={newCoupon.name} onChange={handleChange} className="border p-2 mb-2 w-full" required />
            <input type="date" name="start_date" placeholder="Start Date" value={newCoupon.start_date || ''} onChange={handleChange} className="border p-2 mb-2 w-full" required />
            <input type="date" name="end_date" placeholder="End Date" value={newCoupon.end_date || ''} onChange={handleChange} className="border p-2 mb-2 w-full" required />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Create Coupon
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="ml-2 px-4 py-2 bg-red-500 text-white rounded">
              Cancel
            </button>
          </form>
        )}

        {/* Edit Coupon Form */}
        {editCoupon && (
          <form onSubmit={handleUpdate} className="mb-4">
            <h2 className="text-xl font-bold mb-2">Edit Coupon</h2>
            <input type="text" name="code" placeholder="Coupon Code" value={editCoupon.code} onChange={handleChange} className="border p-2 mb-2 w-full" disabled />
            <input type="date" name="start_date" placeholder="Start Date" value={editCoupon.start_date || ''} onChange={handleChange} className="border p-2 mb-2 w-full" required />
            <input type="date" name="end_date" placeholder="End Date" value={editCoupon.end_date || ''} onChange={handleChange} className="border p-2 mb-2 w-full" required />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Update Coupon
            </button>
            <button type="button" onClick={() => setEditCoupon(null)} className="ml-2 px-4 py-2 bg-red-500 text-white rounded">
              Cancel
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="py-2 px-4 text-left">Code</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoupons.map((coupon) => (
                <tr key={coupon.code} className="border-b">
                  <td className="py-2 px-4">{coupon.code}</td>
                  <td className="py-2 px-4">{coupon.name}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => showCouponDetails(coupon.code)} className="px-4 py-2 bg-teal-500 text-white rounded">
                      Details
                    </button>
                    <button onClick={() => setEditCoupon(coupon)} className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
            Previous
          </button>
          <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
