import { useEffect, useState } from "react";
import API from "../api";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  const fetchProducts = async () => {
    const res = await API.get("/products", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/products", form); // add product endpoint must exist
    setForm({ name: "", price: "", stock: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Manage Products</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input className="border p-2" placeholder="Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2" placeholder="Price"
          value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="border p-2" placeholder="Stock"
          value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <button className="bg-green-500 text-white p-2">Add</button>
      </form>

      <table className="border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">{p.stock}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
