import { useEffect, useState } from "react";
import api from "../api";
import type { Appointment } from "../types";
import { CalendarDays, XCircle, Pencil } from "lucide-react";

export default function Appointments() {
  const [items,setItems]=useState<Appointment[]>([]); const [error,setError]=useState("");
  async function load(){try{const r=await api.get("/appointments");setItems(r.data);}catch{setError("Please log in to view appointments.");}}
  useEffect(()=>{void load();},[]);
  async function reschedule(a:Appointment){const date=window.prompt("New date (YYYY-MM-DD)",new Date(a.date).toISOString().slice(0,10));if(!date)return;const time=window.prompt("New time (HH:MM)",a.time);if(!time)return;try{await api.patch(`/appointments/${a._id}/reschedule`,{date,time});await load();}catch{setError("Could not reschedule this appointment.");}}
  async function cancel(id:string){try{await api.patch(`/appointments/${id}`,{status:"Cancelled"});await load();}catch{setError("Could not cancel this appointment.");}}
  return <section className="page-section"><div className="container"><div className="page-title"><span className="eyebrow">YOUR VISITS</span><h1>My Appointments</h1><p>All your pet's care visits in one place.</p></div>{error&&<p className="error-text">{error}</p>}<div className="panel">{items.length===0?<p className="empty">No appointments found yet.</p>:<div className="table-wrap"><table><thead><tr><th>Pet</th><th>Service</th><th>Date & time</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map(a=><tr key={a._id}><td><b>{a.pet?.name||"Pet"}</b></td><td>{a.service?.name||"Service"}</td><td>{new Date(a.date).toLocaleDateString()} · {a.time}</td><td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td><td>{["Pending","Confirmed"].includes(a.status)&&<><button className="text-button" onClick={()=>reschedule(a)}><Pencil size={15}/> Reschedule</button><button className="text-button" onClick={()=>cancel(a._id)}><XCircle size={15}/> Cancel</button></>}</td></tr>)}</tbody></table></div>}</div></div></section>;
}
