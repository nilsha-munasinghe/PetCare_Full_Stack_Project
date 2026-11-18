import { Link } from "react-router-dom";
import { CalendarDays, PawPrint, PlusCircle, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function Dashboard() {
  const user=useSelector((s:RootState)=>s.auth.user);
  return <section className="page-section"><div className="container"><div className="page-title"><span className="eyebrow">YOUR PETCARE SPACE</span><h1>Hello, {user?.name || "there"}! 👋</h1><p>Let's make sure your best friend gets the care they deserve.</p></div>
    <div className="dashboard-grid"><Link to="/pets" className="dashboard-card"><span className="dash-icon"><PawPrint/></span><h3>My Pets</h3><p>Add and manage your pet profiles.</p><span className="card-link">Manage pets <ArrowRight size={16}/></span></Link><Link to="/book" className="dashboard-card"><span className="dash-icon"><PlusCircle/></span><h3>Book a Visit</h3><p>Schedule a service with our team.</p><span className="card-link">Book now <ArrowRight size={16}/></span></Link><Link to="/appointments" className="dashboard-card"><span className="dash-icon"><CalendarDays/></span><h3>Appointments</h3><p>View your upcoming and past visits.</p><span className="card-link">View bookings <ArrowRight size={16}/></span></Link></div>
  </div></section>;
}
