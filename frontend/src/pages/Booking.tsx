import { FormEvent, useEffect, useState } from "react";
import api from "../api";
import type { Pet, Service } from "../types";
import { useNavigate } from "react-router-dom";

const commonReasons = [
  "General health checkup",
  "Vaccination",
  "Not eating / loss of appetite",
  "Vomiting or diarrhoea",
  "Skin problem / itching",
  "Injury or pain",
  "Dental problem",
  "Grooming",
  "Other"
];

function getLocalDate(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export default function Booking() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pet, setPet] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [commonReason, setCommonReason] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get("/pets"), api.get("/services")])
      .then(([petsResponse, servicesResponse]) => {
        setPets(petsResponse.data);
        setServices(servicesResponse.data);
      })
      .catch(() => setError("Please log in first and make sure the backend is running."));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const reason = [commonReason, notes.trim()].filter(Boolean).join(" — ").slice(0, 500);

    try {
      await api.post("/appointments", { pet, service, date, time, reason });
      setMessage("Appointment request submitted successfully!");
      setTimeout(() => navigate("/appointments"), 900);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Booking failed."
      );
    }
  }

  return (
    <section className="page-section">
      <div className="container narrow">
        <div className="page-title">
          <span className="eyebrow">LET'S PLAN A VISIT</span>
          <h1>Book an appointment</h1>
          <p>A few details and your pet's next visit is on its way.</p>
        </div>

        <form className="panel form-stack" onSubmit={submit}>
          <label>
            Select your pet
            <select required value={pet} onChange={(e) => setPet(e.target.value)}>
              <option value="">Choose a pet</option>
              {pets.map((p) => (
                <option key={p._id} value={p._id}>{p.name} ({p.type})</option>
              ))}
            </select>
          </label>

          <label>
            Choose a service
            <select required value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">Choose a service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>{s.name} – LKR {s.price}</option>
              ))}
            </select>
          </label>

          <div className="two-fields">
            <label>
              Date
              <input
                required
                type="date"
                min={getLocalDate()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              Time
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Common reason
            <select value={commonReason} onChange={(e) => setCommonReason(e.target.value)}>
              <option value="">Choose a reason (optional)</option>
              {commonReasons.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Additional notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              placeholder="Add any other details about your pet's visit..."
            />
          </label>

          {pets.length === 0 && <p className="hint">Please add a pet profile before booking.</p>}
          {services.length === 0 && <p className="hint">No services are available yet. Please ask the administrator to add services.</p>}
          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button className="btn-primary full" disabled={!pets.length || !services.length}>
            Confirm Booking
          </button>
        </form>
      </div>
    </section>
  );
}
