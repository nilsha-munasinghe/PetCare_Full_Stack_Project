import { useEffect,useState } from "react";
import api from "../api";
import type { Pet } from "../types";
export default function AdminPets(){
 const [pets,setPets]=useState<Pet[]>([]),[error,setError]=useState("");
 async function load(){try{const r=await api.get("/pets");setPets(r.data);}catch{setError("Could not load pet records.");}}
 useEffect(()=>{void load();},[]);
 async function remove(id:string){if(!window.confirm("Delete this pet profile?"))return;try{await api.delete(`/pets/${id}`);await load();}catch(e:unknown){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Could not delete pet.");}}
 return <section className="page-section"><div className="container"><div className="page-title"><span className="eyebrow">ADMINISTRATION</span><h1>Pet Management</h1><p>Review registered pets and remove records when appropriate.</p></div>{error&&<p className="error-text">{error}</p>}<div className="panel table-wrap"><table><thead><tr><th>Pet</th><th>Type / Breed</th><th>Age</th><th>Owner</th><th>Action</th></tr></thead><tbody>{pets.map(p=><tr key={p._id}><td>{p.name}</td><td>{p.type} / {p.breed}</td><td>{p.age}</td><td>{p.owner?.name||"Owner"}</td><td><button className="text-button" onClick={()=>remove(p._id)}>Delete</button></td></tr>)}</tbody></table></div></div></section>;
}
