import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import api from "../api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { setCredentials } from "../store";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const dispatch=useDispatch<AppDispatch>(); const navigate=useNavigate();
  async function submit(e:FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const response=await api.post(`/auth/${mode}`, mode==="register"?{name,email,password}:{email,password});
      dispatch(setCredentials(response.data)); navigate("/dashboard");
    } catch (err: unknown) {
      const message = (err as {response?:{data?:{message?:string}}}).response?.data?.message;
      setError(message || "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }
  return <section className="auth-section"><div className="auth-card"><div className="auth-logo"><PawPrint/></div><span className="eyebrow">WELCOME TO PETCARE</span><h1>{mode==="login"?"Welcome back!":"Create your account"}</h1><p className="muted">{mode==="login"?"Sign in to manage your pet's care.":"Join our caring community today."}</p>
    <form onSubmit={submit} className="form-stack">{mode==="register"&&<label>Full name<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}<label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/></label>{error&&<p className="error-text">{error}</p>}<button className="btn-primary full" disabled={busy}>{busy?"Please wait...":mode==="login"?"Sign In":"Create Account"}</button></form>
    <p className="auth-switch">{mode==="login"?"New to PetCare?":"Already have an account?"} <Link to={mode==="login"?"/register":"/login"}>{mode==="login"?"Create account":"Sign in"}</Link></p></div></section>;
}
