import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { PawPrint, Menu, LogOut, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logout } from "../store";
import { useState } from "react";

export default function Layout() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const leave = () => { dispatch(logout()); navigate("/"); };
  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? "active" : ""}`;
  return <div className="min-h-screen">
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand"><span className="brand-icon"><PawPrint size={22}/></span><span>Pet<span className="brand-light">Care</span><small>LOVE • CARE • PROTECT</small></span></Link>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation"><Menu/></button>
        <nav className={open ? "nav-links show" : "nav-links"}>
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/services" className={linkClass}>Services</NavLink>
          <NavLink to="/shop" className={linkClass}>Pet Shop</NavLink>
          <NavLink to="/pets" className={linkClass}>My Pets</NavLink>
          {user?.role === "admin" && <><NavLink to="/admin" className={linkClass}>Admin</NavLink><NavLink to="/admin/pets" className={linkClass}>Manage Pets</NavLink></>}
          {user ? <><NavLink to="/appointments" className={linkClass}>Appointments</NavLink><span className="nav-user"><UserRound size={15}/> {user.name}</span><button className="btn-outline small" onClick={leave}><LogOut size={15}/> Logout</button></> :
            <><Link to="/login" className="nav-link">Login</Link><Link to="/register" className="btn-primary small">Get Started</Link></>}
        </nav>
      </div>
    </header>
    <main><Outlet/></main>
    <footer className="footer"><div className="container footer-inner"><div className="brand footer-brand"><PawPrint/> PetCare</div><p>Every paw deserves love, comfort and care.</p><span>© {new Date().getFullYear()} PetCare. Coursework project.</span></div></footer>
  </div>;
}
