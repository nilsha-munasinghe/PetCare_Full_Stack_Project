import { useEffect, useState } from "react";
import api from "../api";
import { Users, PawPrint, CalendarDays, ClipboardList, Download } from "lucide-react";

interface Summary { users:number; pets:number; services:number; appointments:number; pending:number; }
export default function Admin() {
  const [data,setData]=useState<Summary|null>(null); const [error,setError]=useState("");
  useEffect(()=>{api.get("/admin/summary").then(r=>setData(r.data)).catch(()=>setError("Admin access is required. Please check your account role."));},[]);
  async function report(){try{const r=await api.get("/reports/appointments.pdf",{responseType:"blob"});const url=URL.createObjectURL(r.data);const a=document.createElement("a");a.href=url;a.download="petcare-appointments-report.pdf";a.click();URL.revokeObjectURL(url);}catch{setError("Could not generate report.");}}
  const cards=[["Users",data?.users,Users],["Pets",data?.pets,PawPrint],["Services",data?.services,ClipboardList],["Appointments",data?.appointments,CalendarDays]];
  return <section className="page-section"><div className="container"><div className="page-title admin-title"><div><span className="eyebrow">SYSTEM OVERVIEW</span><h1>Admin Dashboard</h1><p>Manage PetCare and keep everything running smoothly.</p></div><button className="btn-primary" onClick={report}><Download size={17}/> Download PDF Report</button></div>{error&&<p className="error-text">{error}</p>}<div className="stats-grid">{cards.map(([label,value,Icon])=>{const I=Icon as typeof Users;return <div className="stat-card" key={String(label)}><span className="dash-icon"><I/></span><small>{String(label)}</small><strong>{value??"—"}</strong></div>;})}</div><div className="panel admin-note"><h2>Booking overview</h2><p><b>{data?.pending??"—"}</b> appointments are currently pending.</p><p className="muted">Use the PDF report to review appointment details. Customer and pet information is protected by role-based access.</p></div></div></section>;
}
