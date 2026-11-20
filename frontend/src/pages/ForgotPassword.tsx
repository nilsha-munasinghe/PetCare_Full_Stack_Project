import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PawPrint } from "lucide-react";
import api from "../api";

export default function ForgotPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);

  async function submit(e:FormEvent) {
    e.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      if (token) {
        if (password !== confirm) { setError("Passwords do not match."); return; }
        const response = await api.post("/auth/reset-password",{token,password});
        setMessage(response.data.message || "Password reset successful.");
      } else {
        const response = await api.post("/auth/forgot-password",{email});
        setMessage(response.data.message || "If an account exists, a reset link has been sent.");
      }
    } catch (err:unknown) {
      const text = (err as {response?:{data?:{message?:string}}}).response?.data?.message;
      setError(text || "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }

  return <section className="auth-section"><div className="auth-card"><div className="auth-logo"><PawPrint/></div><span className="eyebrow">PETCARE ACCOUNT</span><h1>{token ? "Choose a new password" : "Forgot your password?"}</h1><p className="muted">{token ? "Create a new password for your account." : "Enter the email address linked to your PetCare account. We'll email you a secure reset link."}</p>
    <form onSubmit={submit} className="form-stack">
      {!token ? <label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label> : <><label>New password<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/></label><label>Confirm new password<input required minLength={8} type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Enter password again"/></label></>}
      {error&&<p className="error-text">{error}</p>}{message&&<p className="success-text">{message}</p>}
      <button className="btn-primary full" disabled={busy}>{busy?"Please wait...":token?"Reset password":"Send reset link"}</button>
    </form>
    <p className="auth-switch"><Link to="/login">Back to sign in</Link></p></div></section>;
}
