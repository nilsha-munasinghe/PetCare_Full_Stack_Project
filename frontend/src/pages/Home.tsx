import { PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShieldCheck, CalendarDays, Stethoscope, Scissors, Syringe } from "lucide-react";

const services = [
  { icon: Stethoscope, title: "Health Checkups", text: "Gentle wellness visits to keep your pet happy and healthy." },
  { icon: Syringe, title: "Vaccinations", text: "Essential vaccinations and preventive care for every life stage." },
  { icon: Scissors, title: "Grooming", text: "A fresh, clean and comfortable experience for your furry friend." }
];

const petFriends = [
  { name: "Dogs", detail: "Big love, happy paws", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=85", tone: "dog" },
  { name: "Cats", detail: "Little purr machines", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=85", tone: "cat" },
  { name: "Rabbits", detail: "Soft noses & floppy ears", image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=700&q=85", tone: "rabbit" },
  { name: "Guinea pigs", detail: "Tiny friends, huge hearts", image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=85", tone: "guinea" }
];

export default function Home() {
  return <>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy">
      <span className="eyebrow"><PawPrint size={16}/> YOUR PET'S HAPPY PLACE</span>
      <h1>Little paws,<br/><em>lots of love.</em></h1>
      <p>From playful puppies to tiny bunnies, give every furry family member the gentle care they deserve.</p>
      <div className="hero-actions"><Link to="/book" className="btn-primary">Book an Appointment <ArrowRight size={18}/></Link><Link to="/services" className="btn-outline">Explore Services</Link></div>
      <div className="hero-trust"><span><ShieldCheck/> Caring professionals</span><span><Heart/> Made with love</span></div>
    </div><div className="hero-visual"><div className="hero-image"><img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=85" alt="Happy golden dog"/></div><div className="floating-note"><span className="note-icon"><CalendarDays/></span><span><b>Easy booking</b><small>Care in a few clicks</small></span></div><div className="hero-sticker">♥</div><span className="hero-paw paw-one">🐾</span><span className="hero-paw paw-two">♡</span></div></div></section>
    <section className="pet-family-section"><div className="container"><div className="section-heading"><span className="eyebrow">OUR LITTLE FAMILY</span><h2>Every kind of paw is welcome</h2><p>Big, tiny, fluffy or curious — we have a special place for every little friend.</p></div><div className="pet-family-grid">{petFriends.map((pet)=><article className={`pet-family-card ${pet.tone}`} key={pet.name}><div className="pet-family-photo"><img src={pet.image} alt={pet.name}/><span className="pet-heart">♡</span></div><div className="pet-family-copy"><h3>{pet.name}</h3><p>{pet.detail}</p></div></article>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">WHAT WE DO</span><h2>All the care, all the cuddles</h2><p>Simple, reliable care for the companions who make life better.</p></div><div className="service-grid">{services.map(({icon: Icon,title,text})=><article className="service-card" key={title}><div className="service-icon"><Icon/></div><h3>{title}</h3><p>{text}</p><Link to="/services">Learn more <ArrowRight size={15}/></Link></article>)}</div></div></section>
    <section className="care-banner"><div className="container care-inner"><div><span className="eyebrow light">A LITTLE CARE GOES A LONG WAY</span><h2>Because they're family.</h2><p>Create your account, add your pet and book their next visit with ease.</p></div><Link to="/register" className="btn-white">Join PetCare <ArrowRight size={17}/></Link></div></section>
  </>;
}
