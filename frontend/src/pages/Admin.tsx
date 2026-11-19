import { useEffect, useState } from "react";
import api from "../api";
import type { User, Service, Product, Appointment, Order } from "../types";

interface Summary {
  users: number;
  pets: number;
  services: number;
  appointments: number;
  pending: number;
  products: number;
  orders: number;
}
type Tab = "overview" | "users" | "services" | "products" | "appointments" | "orders";

function apiMessage(error: unknown, fallback: string): string {
  return (
    error as { response?: { data?: { message?: string } } }
  ).response?.data?.message || fallback;
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<Summary | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30");
  const [stock, setStock] = useState("10");
  const [category, setCategory] = useState("Food");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const results = await Promise.allSettled([
      api.get("/admin/summary").then((r) => r.data as Summary),
      api.get("/admin/users").then((r) => r.data as User[]),
      api.get("/services").then((r) => r.data as Service[]),
      api.get("/appointments").then((r) => r.data as Appointment[]),
      api.get("/shop/orders").then((r) => r.data as Order[]),
      api.get("/shop/admin/products").then((r) => r.data as Product[])
    ]);

    const failures: string[] = [];
    const [summaryResult, usersResult, servicesResult, appointmentsResult, ordersResult, productsResult] = results;

    if (summaryResult.status === "fulfilled") setData(summaryResult.value);
    else failures.push("dashboard summary");

    if (usersResult.status === "fulfilled") setUsers(usersResult.value);
    else failures.push("users");

    if (servicesResult.status === "fulfilled") setServices(servicesResult.value);
    else failures.push("services");

    if (appointmentsResult.status === "fulfilled") setAppointments(appointmentsResult.value);
    else failures.push("appointments");

    if (ordersResult.status === "fulfilled") setOrders(ordersResult.value);
    else failures.push("orders");

    if (productsResult.status === "fulfilled") setProducts(productsResult.value);
    else failures.push("products");

    if (failures.length) {
      setError(`Could not load: ${failures.join(", ")}. Check your admin login and backend terminal.`);
    } else {
      setError("");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveService() {
    setError("");
    try {
      await api.post("/services", { name, description, price: Number(price), duration: Number(duration) });
      setName(""); setDescription(""); setPrice("");
      await load();
      setMessage("Service created.");
    } catch (e: unknown) {
      setError(apiMessage(e, "Could not create service."));
    }
  }

  async function saveProduct() {
    setError("");
    try {
      await api.post("/shop/products", { name, description, category, price: Number(price), stock: Number(stock) });
      setName(""); setDescription(""); setPrice("");
      await load();
      setMessage("Product created.");
    } catch (e: unknown) {
      setError(apiMessage(e, "Could not create product."));
    }
  }

  async function changeUser(user: User, patch: Partial<User>) {
    setError("");
    try {
      await api.patch(`/admin/users/${user._id || user.id}`, patch);
      await load();
      setMessage("User updated.");
    } catch (e: unknown) {
      setError(apiMessage(e, "Could not update user."));
    }
  }

  async function statusAppointment(appointment: Appointment, status: string) {
    setError("");
    try {
      await api.patch(`/appointments/${appointment._id}`, { status });
      await load();
      setMessage("Appointment status updated.");
    } catch (e: unknown) {
      setError(apiMessage(e, "Could not update appointment."));
    }
  }

  async function statusOrder(order: Order, status: string) {
    setError("");
    try {
      await api.patch(`/shop/orders/${order._id}`, { status });
      await load();
      setMessage("Order status updated.");
    } catch (e: unknown) {
      setError(apiMessage(e, "Could not update order."));
    }
  }

  async function deactivate(url: string) {
    setError("");
    try {
      await api.delete(url);
      await load();
      setMessage("Item deactivated.");
    } catch (e: unknown) {
      setError(apiMessage(e, "Could not deactivate item."));
    }
  }

  async function setProductActive(product: Product, active: boolean) {
    setError("");
    setMessage("");
    try {
      await api.put(`/shop/products/${product._id}`, { active });
      await load();
      setMessage(active ? "Product activated and visible in the shop." : "Product deactivated and hidden from the shop.");
    } catch (e: unknown) {
      setError(apiMessage(e, active ? "Could not activate product." : "Could not deactivate product."));
    }
  }

  async function report() {
    setError("");
    try {
      const response = await api.get("/reports/appointments.pdf", { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "petcare-appointments-report.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setError(apiMessage(e, "Could not generate PDF report."));
    }
  }

  const tabs: Tab[] = ["overview", "users", "services", "products", "appointments", "orders"];

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-title admin-title">
          <div>
            <span className="eyebrow">SYSTEM OVERVIEW</span>
            <h1>Admin Dashboard</h1>
            <p>Manage users, pets, services, bookings and shop orders.</p>
          </div>
          <button className="btn-primary" type="button" onClick={() => void report()}>
            Download PDF Report
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <div className="admin-tabs">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              className={tab === item ? "btn-primary small" : "btn-outline small"}
              onClick={() => { setTab(item); setError(""); setMessage(""); }}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className="stats-grid">
              {[
                ["Users", data?.users], ["Pets", data?.pets], ["Services", data?.services],
                ["Appointments", data?.appointments], ["Pending", data?.pending],
                ["Products", data?.products], ["Orders", data?.orders]
              ].map(([label, value]) => (
                <div className="stat-card" key={String(label)}>
                  <small>{label}</small><strong>{value ?? "—"}</strong>
                </div>
              ))}
            </div>
            <div className="panel admin-note">
              <h2>Booking overview</h2>
              <p><b>{data?.pending ?? "—"}</b> appointments are pending.</p>
            </div>
          </>
        )}

        {tab === "users" && (
          <div className="panel">
            <h2>User management</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Account</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id || user.id}>
                      <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
                      <td>{user.isActive === false ? "Disabled" : "Active"}</td>
                      <td>
                        <button type="button" className="text-button" onClick={() => void changeUser(user, { role: user.role === "admin" ? "customer" : "admin" })}>
                          {user.role === "admin" ? "Make customer" : "Make admin"}
                        </button>
                        {" "}
                        <button type="button" className="text-button" onClick={() => void changeUser(user, { isActive: user.isActive === false })}>
                          {user.isActive === false ? "Enable" : "Disable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="empty">No users found.</p>}
            </div>
          </div>
        )}

        {tab === "services" && (
          <div className="content-grid">
            <form className="panel form-stack" onSubmit={(e) => { e.preventDefault(); void saveService(); }}>
              <h2>Add service</h2>
              <label>Name<input required value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label>Description<textarea required value={description} onChange={(e) => setDescription(e.target.value)} /></label>
              <label>Price (LKR)<input required type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
              <label>Duration (minutes)<input required type="number" min="10" value={duration} onChange={(e) => setDuration(e.target.value)} /></label>
              <button className="btn-primary" type="submit">Add service</button>
            </form>
            <div className="panel">
              <h2>Services</h2>
              {services.map((service) => (
                <div className="pet-row" key={service._id}>
                  <div className="pet-info"><b>{service.name}</b><span>LKR {service.price} · {service.duration} minutes</span></div>
                  <button type="button" className="text-button" onClick={() => void deactivate(`/services/${service._id}`)}>Deactivate</button>
                </div>
              ))}
              {services.length === 0 && <p className="empty">No active services found.</p>}
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="content-grid">
            <form className="panel form-stack" onSubmit={(e) => { e.preventDefault(); void saveProduct(); }}>
              <h2>Add shop product</h2>
              <label>Name<input required value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label>Description<textarea required value={description} onChange={(e) => setDescription(e.target.value)} /></label>
              <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}><option>Food</option><option>Treats</option><option>Accessories</option><option>Other</option></select></label>
              <label>Price (LKR)<input type="number" min="0" required value={price} onChange={(e) => setPrice(e.target.value)} /></label>
              <label>Stock<input type="number" min="0" required value={stock} onChange={(e) => setStock(e.target.value)} /></label>
              <button className="btn-primary" type="submit">Add product</button>
            </form>
            <div className="panel">
              <h2>Products</h2>
              {products.map((product) => (
                <div className="pet-row" key={product._id}>
                  <div className="pet-info">
                    <b>{product.name}</b>
                    <span>LKR {product.price} · Stock {product.stock} · {product.active ? "Active in shop" : "Inactive (hidden from shop)"}</span>
                  </div>
                  {product.active ? (
                    <button type="button" className="text-button" onClick={() => void setProductActive(product, false)}>Deactivate</button>
                  ) : (
                    <button type="button" className="text-button" onClick={() => void setProductActive(product, true)}>Activate</button>
                  )}
                </div>
              ))}
              {products.length === 0 && <p className="empty">No products found.</p>}
            </div>
          </div>
        )}

        {tab === "appointments" && (
          <div className="panel table-wrap">
            <table>
              <thead><tr><th>Pet</th><th>Customer</th><th>Service</th><th>Date/time</th><th>Status</th><th>Change</th></tr></thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.pet?.name || "Pet"}</td>
                    <td>{appointment.customer?.name || "Customer"}</td>
                    <td>{appointment.service?.name || "Service"}</td>
                    <td>{new Date(appointment.date).toLocaleDateString()} {appointment.time}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <select aria-label={`Status for appointment ${appointment._id}`} value={appointment.status} onChange={(e) => void statusAppointment(appointment, e.target.value)}>
                        <option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && <p className="empty">No appointments found.</p>}
          </div>
        )}

        {tab === "orders" && (
          <div className="panel table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Total</th><th>Status</th><th>Change status</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-7)}</td><td>LKR {order.total.toLocaleString()}</td><td>{order.status}</td>
                    <td>
                      <select aria-label={`Status for order ${order._id}`} value={order.status} onChange={(e) => void statusOrder(order, e.target.value)}>
                        <option>Pending</option><option>Processing</option><option>Shipped</option><option>Completed</option><option>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p className="empty">No orders found.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
