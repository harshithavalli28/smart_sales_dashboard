import { useState, useEffect, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

const EmployeeDashboard = () => {
  const { logout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("customers");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    price: "",
    stock: "",
    product_id: "",
    customer_id: "",
    quantity: "",
    sale_date: "",
  });

  // Load data
  useEffect(() => {
    if (activeTab === "customers") fetchCustomers();
    if (activeTab === "products") fetchProducts();
    if (activeTab === "sales") fetchSales();
  }, [activeTab]);

  // API calls
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error("Fetch customers error:", err.response?.data || err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
    }
  };

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res.data);
    } catch (err) {
      console.error("Error fetching sales:", err.response?.data || err.message);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Add or Update item
  const handleSave = async () => {
    try {
      if (activeTab === "customers") {
        if (editingId) {
          await API.put(`/customers/${editingId}`, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          });
        } else {
          await API.post("/customers", {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          });
        }
        fetchCustomers();
      }

      if (activeTab === "products") {
        if (editingId) {
          await API.put(`/products/${editingId}`, {
            name: formData.name,
            category: formData.category,
            price: formData.price,
            stock: formData.stock,
          });
        } else {
          await API.post("/products", {
            name: formData.name,
            category: formData.category,
            price: formData.price,
            stock: formData.stock,
          });
        }
        fetchProducts();
      }

      if (activeTab === "sales") {
        await API.post("/sales", {
          customer_id: formData.customer_id,
          product_id: formData.product_id,
          quantity: formData.quantity,
          sale_date: formData.sale_date,
        });
        fetchSales();
      }

      // reset
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        category: "",
        price: "",
        stock: "",
        product_id: "",
        customer_id: "",
        quantity: "",
        sale_date: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // Load data into form for editing
  const handleEdit = (item) => {
    setEditingId(item.id);
    if (activeTab === "customers") {
      setFormData({
        name: item.name,
        email: item.email,
        phone: item.phone,
        address: item.address,
      });
    }
    if (activeTab === "products") {
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price,
        stock: item.stock,
      });
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      if (activeTab === "customers") await API.delete(`/customers/${id}`);
      if (activeTab === "products") await API.delete(`/products/${id}`);
      if (activeTab === "sales") await API.delete(`/sales/${id}`);

      if (activeTab === "customers") fetchCustomers();
      if (activeTab === "products") fetchProducts();
      if (activeTab === "sales") fetchSales();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["customers", "products", "sales"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-white text-purple-600 font-bold"
                : "bg-purple-500 text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Add/Update Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        {activeTab === "customers" && (
          <div className="flex gap-2 flex-wrap">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Customer Name"
              className="border p-2 rounded w-1/4"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded w-1/4"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded w-1/4"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded w-1/4"
            />
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 rounded"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        )}
        {activeTab === "products" && (
          <div className="flex gap-2 flex-wrap">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="border p-2 rounded w-1/5"
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="border p-2 rounded w-1/5"
            />
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded w-1/5"
            />
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border p-2 rounded w-1/5"
            />
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 rounded"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        )}
        {activeTab === "sales" && (
          <div className="flex gap-2 flex-wrap">
            <input
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              placeholder="Customer ID"
              className="border p-2 rounded w-1/5"
            />
            <input
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              placeholder="Product ID"
              className="border p-2 rounded w-1/5"
            />
            <input
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="border p-2 rounded w-1/5"
            />
            <input
              type="date"
              name="sale_date"
              value={formData.sale_date}
              onChange={handleChange}
              className="border p-2 rounded w-1/5"
            />
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Data Tables */}
      {activeTab === "customers" && (
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-2 border">{c.id}</td>
                  <td className="p-2 border">{c.name}</td>
                  <td className="p-2 border">{c.email}</td>
                  <td className="p-2 border">{c.phone}</td>
                  <td className="p-2 border">{c.address}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "products" && (
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2 border">{p.id}</td>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">₹{p.price}</td>
                  <td className="p-2 border">{p.stock}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "sales" && (
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Total Price</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="border p-2">{sale.id}</td>
                  <td className="border p-2">{sale.customer}</td>
                  <td className="border p-2">{sale.product}</td>
                  <td className="border p-2">{sale.quantity}</td>
                  <td className="border p-2 font-semibold text-green-600">
                    ₹{sale.total}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
