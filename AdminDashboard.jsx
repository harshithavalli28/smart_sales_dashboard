import { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#FF6B6B", "#4ECDC4", "#556270", "#FFD93D", "#6A0572"];

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [salesGrowth, setSalesGrowth] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [salesByRegion, setSalesByRegion] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [customerAcquisition, setCustomerAcquisition] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [
          rev, prod, cust, growth,
          cat, region, daily, customers
        ] = await Promise.all([
          API.get("/stats/monthly-revenue", { headers }),
          API.get("/stats/top-products", { headers }),
          API.get("/stats/top-customers", { headers }),
          API.get("/stats/sales-growth", { headers }),
          API.get("/stats/sales-by-category", { headers }),
          API.get("/stats/sales-by-region", { headers }),
          API.get("/stats/daily-sales", { headers }),
          API.get("/stats/customer-acquisition", { headers }),
        ]);

        setRevenue(rev.data);
        setTopProducts(prod.data);
        setTopCustomers(cust.data);
        setSalesGrowth(growth.data);
        setSalesByCategory(cat.data);
        setSalesByRegion(region.data);
        setDailySales(daily.data);
        setCustomerAcquisition(customers.data);
        setTopCustomers(cust.data.map(c => ({
        name: c.name,
        total_spent: Number(c.total_spent) // convert string to number
      })));

      setSalesByCategory(cat.data.map(c => ({
        category: c.category,
        revenue: Number(c.revenue) // convert string to number
      })));
      setSalesByRegion(region.data.map(r => ({
  region: r.address,
  revenue: Number(r.revenue)
})));

      } catch (err) {
        console.error("❌ Dashboard fetch error:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-lg text-black">
          <h2 className="text-lg font-semibold mb-2">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#FF6B6B" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Bar Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-lg text-black">
          <h2 className="text-lg font-semibold mb-2">Top Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4ECDC4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Customers Pie Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-lg text-black">
          <h2 className="text-lg font-semibold mb-2">Top Customers</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topCustomers}
                dataKey="total_spent"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {topCustomers.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Growth Line Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-lg text-black">
          <h2 className="text-lg font-semibold mb-2">Sales Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales_count" stroke="#6A0572" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category Pie Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-lg text-black">
          <h2 className="text-lg font-semibold mb-2">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByCategory}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {salesByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Region Bar Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-lg text-black">
          <h2 className="text-lg font-semibold mb-2">Sales by Region</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByRegion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#FFD93D" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Sales Line Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-lg text-black">
          <h2 className="text-lg font-semibold mb-2">Daily Sales (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4ECDC4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
{/* Customer Acquisition Line Chart */} 
<div className="bg-white rounded-2xl p-4 shadow-lg text-black"> 
  <h2 className="text-lg font-semibold mb-2">Customer Acquisition</h2> 
  <ResponsiveContainer width="100%" height={300}> 
    <LineChart data={customerAcquisition}> 
      <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="month" />
        <YAxis />
         <Tooltip /> 
         <Legend />
          <Line type="monotone" dataKey="new_customers" stroke="#6A0572" /> 
          </LineChart> 
          </ResponsiveContainer> 
          </div> 
          </div> 
          </div> 
          ); 
        }