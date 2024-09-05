import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { getToken } from '../utils/token'; // Assume token is stored here

const ITEMS_PER_PAGE = 10; // Number of items to display per page

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order
  const token = getToken();

  // Fetch Orders Data
  const fetchOrders = async (page = currentPage, query = '') => {
    try {
      const response = await axios.get(`https://sandbox.dibuiltadi.com/api/dashboard/customer-service/v1/orders`, {
        params: {
          page,
          per_page: ITEMS_PER_PAGE,
          sort_by: 'created_at',
          sort_direction: 'desc',
          start_date: '2022-01-01',
          end_date: '2024-12-31',
          buyer_phone: '',
          store_code: '',
          coupon_code: '',
          search_by: 'invoice_no',
          search_query: query,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.items;
      setOrders(data);
      setTotalPages(response.data.last_page); // Set total pages from API response
    } catch (error) {
      setError('Failed to fetch orders data');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery]);

  // Calculate Paginated Data
  const paginatedOrders = orders;

  // Pagination Controls
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(1, searchQuery); // Reset to first page with new search query
  };

  // Fetch Order Details
  const fetchOrderDetails = async (invoiceNo) => {
    try {
      const response = await axios.get(`https://sandbox.dibuiltadi.com/api/dashboard/customer-service/v1/orders/${invoiceNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedOrder(response.data);
    } catch (error) {
      alert('Failed to fetch order details');
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  //   rupiah
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
    return formatter.format(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-4">Order</h1>
        <p className="mb-4">Welcome to the Order page!</p>
        {error && <p className="text-red-500">{error}</p>}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by invoice number" className="border p-2 mb-2 w-full" />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="py-2 px-4 text-left">Invoice No</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Tanggal Transaksi</th>
                <th className="py-2 px-4 text-left">Buyer</th>
                <th className="py-2 px-4 text-left">Store</th>
                <th className="py-2 px-4 text-left">Coupon</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.invoice_no} className="border-b">
                  <td className="py-2 px-4">{order.invoice_no}</td>
                  <td className="py-2 px-4">{formatCurrency(order.grandtotal)}</td>
                  <td className="py-2 px-4">{order.created_at}</td>
                  <td className="py-2 px-4">
                    {order.buyer.name} ({order.buyer.phone})
                  </td>
                  <td className="py-2 px-4">{order.store.name}</td>
                  <td className="py-2 px-4">{order.coupon.name}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => fetchOrderDetails(order.invoice_no)} className="px-4 py-2 bg-blue-500 text-white rounded">
                      Details
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
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
            Next
          </button>
        </div>

        {/* Modal for Order Details */}
        <Modal isOpen={!!selectedOrder} onClose={closeModal} title="Order Details">
          {selectedOrder && (
            <div>
              <p>
                <strong>Invoice No:</strong> {selectedOrder.invoice_no}
              </p>
              <p>
                <strong>Grand Total:</strong> {formatCurrency(selectedOrder.grandtotal)}
              </p>
              <p>
                <strong>Created At:</strong> {selectedOrder.created_at}
              </p>
              <p>
                <strong>Buyer:</strong> {selectedOrder.buyer.name} ({selectedOrder.buyer.phone})
              </p>
              <p>
                <strong>Store:</strong> {selectedOrder.store.name}, {selectedOrder.store.city}, {selectedOrder.store.province}
              </p>
              <p>
                <strong>Coupon:</strong> {selectedOrder.coupon.name}
              </p>
              <h3 className="text-lg font-semibold mt-4">Items:</h3>
              <ul>
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>
                    {item.product.name} - {formatCurrency(item.total_price)} ({item.qty} pcs)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Order;
