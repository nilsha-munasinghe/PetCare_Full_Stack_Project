import { useEffect, useState } from "react";
import api from "../api";
import type { Service } from "../types";
import { Link } from "react-router-dom";
import { Stethoscope, Scissors, Syringe, HeartPulse } from "lucide-react";

const icons=[Stethoscope,Scissors,Syringe,HeartPulse];
export default function Services() {
  const [services,setServices]=useState<Service[]>([]); const [error,setError]=useState("");
  useEffect(()=>{api.get("/services").then(r=>setServices(r.data)).catch(()=>setError("Could not load services. Please check that the backend is running."));},[]);
  return <section className="page-section"><div className="container"><div className="section-heading"><span className="eyebrow">OUR SERVICES</span><h1>Care for every stage of life</h1><p>Choose the right care for your beloved companion.</p></div>{error&&<p className="error-text">{error}</p>}<div className="service-grid">{services.map((s,i)=>{const Icon=icons[i%icons.length];return <article className="service-card" key={s._id}><div className="service-icon"><Icon/></div><h3>{s.name}</h3><p>{s.description}</p><div className="service-meta"><b>LKR {s.price.toLocaleString()}</b><span>{s.duration} min</span></div><Link to="/book" className="btn-primary full">Book this service</Link></article>;})}</div>{services.length===0&&!error&&<p className="empty">No services added yet. Ask the administrator to add services.</p>}</div></section>;
}
