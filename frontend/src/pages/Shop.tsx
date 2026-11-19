import { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import type { RootState } from "../store";
import type { Product,Order } from "../types";
export default function Shop(){
 const user=useSelector((s:RootState)=>s.auth.user);
 const [products,setProducts]=useState<Product[]>([]),[orders,setOrders]=useState<Order[]>([]);
 const [cart,setCart]=useState<Record<string,number>>({}),[address,setAddress]=useState(""),[phone,setPhone]=useState(""),[message,setMessage]=useState(""),[error,setError]=useState("");
 async function load(){try{const [p,o]=await Promise.all([api.get("/shop/products"),user?api.get("/shop/orders"):Promise.resolve({data:[]})]);setProducts(p.data);setOrders(o.data);}catch{setError("Could not load the shop.");}}
 useEffect(()=>{void load();},[user?.id]);
 const items=Object.entries(cart).filter(([,q])=>q>0);
 const total=items.reduce((sum,[id,q])=>sum+(products.find(p=>p._id===id)?.price||0)*q,0);
 async function checkout(){setError("");try{await api.post("/shop/orders",{items:items.map(([productId,quantity])=>({productId,quantity})),shippingAddress:address,phone});setCart({});setMessage("Order placed successfully!");await load();}catch(e:unknown){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Order failed.");}}
 async function cancel(id:string){try{await api.patch(`/shop/orders/${id}`,{status:"Cancelled"});await load();}catch{setError("Could not cancel order.");}}
 return <section className="page-section"><div className="container"><div className="page-title"><span className="eyebrow">PETCARE SHOP</span><h1>Food & essentials</h1><p>Everyday essentials for your furry family.</p></div>{error&&<p className="error-text">{error}</p>}{message&&<p className="success-text">{message}</p>}
 <div className="service-grid">{products.map(p=><article className="service-card" key={p._id}><div className="service-icon">🐾</div><h3>{p.name}</h3><p>{p.description}</p><div className="service-meta"><b>LKR {p.price.toLocaleString()}</b><span>{p.stock} in stock</span></div><label className="form-stack">Quantity<input type="number" min="0" max={p.stock} value={cart[p._id]||0} onChange={e=>setCart(old=>({...old,[p._id]:Math.min(p.stock,Math.max(0,Number(e.target.value)))}))}/></label></article>)}</div>
 {products.length===0&&<p className="empty">No products available yet.</p>}
 {user&&<div className="content-grid" style={{marginTop:28}}><div className="panel form-stack"><h2>Your cart</h2><p>{items.length} product type(s) · Total: <b>LKR {total.toLocaleString()}</b></p><label>Delivery address<input value={address} onChange={e=>setAddress(e.target.value)}/></label><label>Contact number<input value={phone} onChange={e=>setPhone(e.target.value)}/></label><button className="btn-primary" disabled={!items.length||!address.trim()||!phone.trim()} onClick={checkout}>Place order</button></div><div className="panel"><h2>My orders</h2>{orders.length===0?<p className="empty">No orders yet.</p>:orders.map(o=><div className="pet-row" key={o._id}><div className="pet-info"><b>LKR {o.total.toLocaleString()} · {o.status}</b><span>{o.items.map(i=>`${i.name} × ${i.quantity}`).join(", ")}</span></div>{o.status==="Pending"&&<button className="text-button" onClick={()=>cancel(o._id)}>Cancel</button>}</div>)}</div></div>}
 {!user&&<p className="hint">Sign in to place orders and view your order history.</p>}</div></section>;
}
