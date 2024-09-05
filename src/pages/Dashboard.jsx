import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { getToken } from '../utils/token';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [topStoresData, setTopStoresData] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState(null);
  const [selectedMonthRange, setSelectedMonthRange] = useState({ startMonth: '01', endMonth: '03' });
  const [selectedYear, setSelectedYear] = useState('2022');
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const token = getToken();
  // Fetch User Data
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`https://sandbox.dibuiltadi.com/api/dashboard/common/v1/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileData(response.data);
    } catch (error) {
      setError('Failed to fetch user profile data');
    }
  };

  // Fetch Monthly Orders Data
  const fetchMonthlyOrders = async (startMonth, endMonth, year) => {
    try {
      const response = await axios.get(`https://sandbox.dibuiltadi.com/api/dashboard/common/v1/summaries/orders/monthly`, {
        params: {
          start_month: `${year}-${startMonth}`,
          end_month: `${year}-${endMonth}`,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.items.map((item) => ({
        month: item.month,
        orders: parseFloat(item.orders.replace(/[^0-9.-]+/g, '')) || 0,
      }));

      setMonthlyData(data);
    } catch (error) {
      setError('Failed to fetch monthly orders data');
    }
  };

  // Fetch Top Stores
  const fetchTopStores = async () => {
    try {
      const response = await axios.get(`https://sandbox.dibuiltadi.com/api/dashboard/common/v1/summaries/top/stores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.items.map((item) => ({
        name: item.name,
        amount: parseFloat(item.amount.replace(/[^0-9.-]+/g, '')) || 0,
      }));

      setTopStoresData(data);
    } catch (error) {
      setError('Failed to fetch top stores data');
    }
  };

  // Fetch months and years for dropdowns
  useEffect(() => {
    const monthList = [
      { value: '01', label: 'Januari' },
      { value: '02', label: 'Februari' },
      { value: '03', label: 'Maret' },
      { value: '04', label: 'April' },
      { value: '05', label: 'Mei' },
      { value: '06', label: 'Juni' },
      { value: '07', label: 'Juli' },
      { value: '08', label: 'Agustus' },
      { value: '09', label: 'September' },
      { value: '10', label: 'Oktober' },
      { value: '11', label: 'November' },
      { value: '12', label: 'Desember' },
    ];
    setMonths(monthList);

    // Populate years dropdowns
    const yearList = ['2021', '2022', '2023', '2024'];
    setYears(yearList);
  }, []);

  // Update data
  useEffect(() => {
    fetchMonthlyOrders(selectedMonthRange.startMonth, selectedMonthRange.endMonth, selectedYear);
  }, [selectedMonthRange, selectedYear]);

  useEffect(() => {
    fetchTopStores();
    fetchUserProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome to the {profileData.name}!</p>

        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-8">
          {/* Filter for Monthly Orders */}
          <div className="mb-4">
            <h2 className="text-xl font-bold">Filter Monthly Orders</h2>
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <label htmlFor="month" className="mr-2">
                  Month:
                </label>
                <select id="month" value={selectedMonthRange.startMonth} onChange={(e) => setSelectedMonthRange({ ...selectedMonthRange, startMonth: e.target.value })} className="p-2 border">
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                <span className="ml-2 mr-2">to</span>
                <select id="endMonth" value={selectedMonthRange.endMonth} onChange={(e) => setSelectedMonthRange({ ...selectedMonthRange, endMonth: e.target.value })} className="p-2 border">
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="year" className="mr-2">
                  Year:
                </label>
                <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 border">
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-row-1 md:grid-cols-2 gap-8 mt-8 ml-8">
          {/* Monthly Orders Chart */}
          <div>
            <h2 className="text-xl font-bold text-center">Monthly Orders</h2>
            <LineChart width={500} height={300} data={monthlyData} className="ml-3">
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" />
            </LineChart>
          </div>

          {/* Top Stores Chart */}
          <div className="text-center ml-">
            <h2 className="text-xl font-bold text-center">Top Stores</h2>
            <BarChart width={500} height={300} data={topStoresData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
