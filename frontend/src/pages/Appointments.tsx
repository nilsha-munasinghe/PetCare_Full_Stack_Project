import { Fragment, useEffect, useState, type FormEvent } from "react";
import api from "../api";
import type { Appointment } from "../types";
import { CalendarDays, XCircle, Pencil, Check, X } from "lucide-react";

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

function localDateInput(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

function todayLocal(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export default function Appointments() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const response = await api.get("/appointments");
      setItems(response.data);
      setError("");
    } catch {
      setError("Please log in to view appointments.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function beginReschedule(appointment: Appointment) {
    setEditingId(appointment._id);
    setNewDate(localDateInput(appointment.date));
    setNewTime(appointment.time);
    setError("");
    setNotice("");
  }

  async function saveReschedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await api.patch(`/appointments/${editingId}/reschedule`, {
        date: newDate,
        time: newTime
      });
      setEditingId(null);
      setNotice("Appointment rescheduled successfully.");
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(message || "Could not reschedule this appointment.");
    } finally {
      setSaving(false);
    }
  }

  async function cancel(id: string) {
    setError("");
    setNotice("");
    try {
      await api.patch(`/appointments/${id}`, { status: "Cancelled" });
      setNotice("Appointment cancelled successfully.");
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(message || "Could not cancel this appointment.");
    }
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-title">
          <span className="eyebrow">YOUR VISITS</span>
          <h1>My Appointments</h1>
          <p>All your pet's care visits in one place.</p>
        </div>

        {error && <p className="error-text">{error}</p>}
        {notice && <p className="success-text">{notice}</p>}

        <div className="panel">
          {items.length === 0 ? (
            <p className="empty">No appointments found yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Service</th>
                    <th>Date &amp; time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((appointment) => (
                    <Fragment key={appointment._id}>
                      <tr>
                        <td><b>{appointment.pet?.name || "Pet"}</b></td>
                        <td>{appointment.service?.name || "Service"}</td>
                        <td>
                          {new Date(appointment.date).toLocaleDateString()} · {appointment.time}
                        </td>
                        <td>
                          <span className={`status ${appointment.status.toLowerCase()}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          {appointment.status === "Pending" && (
                            <button
                              type="button"
                              className="text-button"
                              onClick={() => beginReschedule(appointment)}
                            >
                              <Pencil size={15} /> Reschedule
                            </button>
                          )}
                          {["Pending", "Confirmed"].includes(appointment.status) && (
                            <button
                              type="button"
                              className="text-button"
                              onClick={() => void cancel(appointment._id)}
                            >
                              <XCircle size={15} /> Cancel
                            </button>
                          )}
                          { !["Pending", "Confirmed"].includes(appointment.status) && "—" }
                        </td>
                      </tr>

                      {editingId === appointment._id && (
                        <tr>
                          <td colSpan={5}>
                            <form className="form-stack" onSubmit={saveReschedule}>
                              <strong>Reschedule {appointment.pet?.name || "pet"}'s appointment</strong>
                              <div className="two-fields">
                                <label>
                                  New date
                                  <input
                                    type="date"
                                    required
                                    min={todayLocal()}
                                    value={newDate}
                                    onChange={(event) => setNewDate(event.target.value)}
                                  />
                                </label>
                                <label>
                                  New time
                                  <select
                                    required
                                    value={newTime}
                                    onChange={(event) => setNewTime(event.target.value)}
                                  >
                                    {timeSlots.map((slot) => (
                                      <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                              <div className="button-row">
                                <button className="btn-primary" type="submit" disabled={saving}>
                                  <Check size={16} /> {saving ? "Saving..." : "Save changes"}
                                </button>
                                <button
                                  className="text-button"
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  disabled={saving}
                                >
                                  <X size={16} /> Keep current booking
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
