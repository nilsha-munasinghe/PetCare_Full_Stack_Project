import { Navigate,Route,Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Pets from "./pages/Pets";
import Booking from "./pages/Booking";
import Appointments from "./pages/Appointments";
import Admin from "./pages/Admin";
import AdminPets from "./pages/AdminPets";
import Shop from "./pages/Shop";
function Guard({children,admin=false}:{children:JSX.Element;admin?:boolean}){
 const user=useSelector((s:RootState)=>s.auth.user);
 if(!user)return <Navigate to="/login" replace/>;
 if(admin&&user.role!=="admin")return <Navigate to="/dashboard" replace/>;
 return children;
}
export default function App(){
 const user=useSelector((s:RootState)=>s.auth.user);
 return <Routes><Route element={<Layout/>}><Route path="/" element={<Home/>}/><Route path="/services" element={<Services/>}/><Route path="/shop" element={<Shop/>}/>
 <Route path="/login" element={user?<Navigate to="/dashboard"/>:<Auth mode="login"/>}/><Route path="/register" element={user?<Navigate to="/dashboard"/>:<Auth mode="register"/>}/>
 <Route path="/dashboard" element={<Guard><Dashboard/></Guard>}/><Route path="/pets" element={<Guard><Pets/></Guard>}/><Route path="/book" element={<Guard><Booking/></Guard>}/><Route path="/appointments" element={<Guard><Appointments/></Guard>}/><Route path="/admin" element={<Guard admin><Admin/></Guard>}/><Route path="/admin/pets" element={<Guard admin><AdminPets/></Guard>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes>;
}
