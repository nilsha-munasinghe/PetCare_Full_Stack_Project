import { PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShieldCheck, CalendarDays, Stethoscope, Scissors, Syringe } from "lucide-react";

const services = [
  { icon: Stethoscope, title: "Health Checkups", text: "Gentle wellness visits to keep your pet happy and healthy." },
  { icon: Syringe, title: "Vaccinations", text: "Essential vaccinations and preventive care for every life stage." },
  { icon: Scissors, title: "Grooming", text: "A fresh, clean and comfortable experience for your furry friend." }
];
export default function Home() {
  return <>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy">
      <span className="eyebrow"><PawPrint size={16}/> YOUR PET'S HAPPY PLACE</span>
      <h1>Care that makes<br/><em>tails wag.</em></h1>
      <p>Thoughtful pet care, trusted professionals and easy online appointments — all in one friendly place.</p>
      <div className="hero-actions"><Link to="/book" className="btn-primary">Book an Appointment <ArrowRight size={18}/></Link><Link to="/services" className="btn-outline">Explore Services</Link></div>
      <div className="hero-trust"><span><ShieldCheck/> Caring professionals</span><span><Heart/> Made with love</span></div>
    </div><div className="hero-visual"><div className="hero-image"><img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=85" alt="Happy golden dog"/></div><div className="floating-note"><span className="note-icon"><CalendarDays/></span><span><b>Easy booking</b><small>Care in a few clicks</small></span></div><div className="hero-sticker">♥</div></div></div></section>
    <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">WHAT WE DO</span><h2>Everything your pet needs</h2><p>Simple, reliable care for the companions who make life better.</p></div><div className="service-grid">{services.map(({icon: Icon,title,text})=><article className="service-card" key={title}><div className="service-icon"><Icon/></div><h3>{title}</h3><p>{text}</p><Link to="/services">Learn more <ArrowRight size={15}/></Link></article>)}</div></div></section>
    <section className="care-banner"><div className="container care-inner"><div><span className="eyebrow light">A LITTLE CARE GOES A LONG WAY</span><h2>Because they're family.</h2><p>Create your account, add your pet and book their next visit with ease.</p></div><Link to="/register" className="btn-white">Join PetCare <ArrowRight size={17}/></Link></div></section>
  </>;
}
