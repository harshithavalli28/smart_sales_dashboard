import { useEffect, useState } from "react";
import API from "../api";

export default function ManageSales() {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    items: [{ product_id: "", quantity: "", price: "" }],
  });

  const fetchSales = async () => {
    const res = await API.get("/sales");
    setSales(res.data);
  };

  const handleItemChange = (i, field, value) => {
    const updated = [...form.items];
    updated[i][field] = value;
    setForm({ ...form, items: updated });
  };

  const addSaleItem = () => {
    setForm({ ...form, items: [...form.items, { product_id: "", quantity: "", price: "" }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/sales", form);
    setForm({ customer_id: "", items: [{ product_id: "", quantity: "", price: "" }] });
    fetchSales();
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Manage Sales</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Customer ID"
          value={form.customer_id}
          onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
        />

        {form.items.map((item, i) => (
          <div key={i} className="flex gap-2 my-2">
            <input className="border p-2" placeholder="Product ID"
              value={item.product_id} onChange={(e) => handleItemChange(i, "product_id", e.target.value)} />
            <input className="border p-2" placeholder="Quantity"
              value={item.quantity} onChange={(e) => handleItemChange(i, "quantity", e.target.value)} />
            <input className="border p-2" placeholder="Price"
              value={item.price} onChange={(e) => handleItemChange(i, "price", e.target.value)} />
          </div>
        ))}

        <button type="button" onClick={addSaleItem} className="bg-gray-400 text-white p-2 mr-2">+ Item</button>
        <button type="submit" className="bg-green-500 text-white p-2">Save Sale</button>
      </form>

      <table className="border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.id}</td>
              <td className="border p-2">{s.customer}</td>
              <td className="border p-2">{s.employee}</td>
              <td className="border p-2">${s.total_amount}</td>
              <td className="border p-2">{new Date(s.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
