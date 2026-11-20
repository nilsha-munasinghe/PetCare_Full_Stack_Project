import {
  ArrowRight, CalendarDays, Heart, PawPrint, ShieldCheck,
  Stethoscope, Syringe, Scissors, Clock3, Leaf, Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const pets = [
  { name: "Dogs", note: "Loyal friends, happy hearts", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=90", icon: "🐶" },
  { name: "Cats", note: "Curious whiskers welcome", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=90", icon: "🐱" },
  { name: "Rabbits", note: "Little hops, lots of love", image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=90", icon: "🐰" },
  { name: "Guinea Pigs", note: "Tiny friends, big personality", image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=90", icon: "🐹" },
];

const benefits = [
  { icon: Stethoscope, title: "Expert Care", text: "Professional veterinary care you can trust." },
  { icon: PawPrint, title: "Pet Wellness", text: "Regular checkups for a healthier life." },
  { icon: Heart, title: "Loving Environment", text: "A safe and friendly space for your pets." },
  { icon: Clock3, title: "Easy Booking", text: "Book a visit in just a few simple steps." },
];

const services = [
  { icon: Stethoscope, title: "Health Checkups", text: "Gentle nose-to-tail checkups to keep your best friend feeling their best.", tag: "WELLNESS" },
  { icon: Syringe, title: "Vaccinations", text: "Preventive care and essential vaccinations for every life stage.", tag: "PROTECTION" },
  { icon: Scissors, title: "Grooming", text: "A fresh, comfy grooming experience for your furry family.", tag: "PAMPERING" },
];

export default function Home() {
  return (
    <div className="home-redesign garden-home">
      <section className="garden-hero">
        <div className="garden-hero-inner container">
          <div className="garden-hero-copy">
            <span className="garden-welcome">Welcome to PetCare! <Heart size={25} /></span>
            <h1>Healthy Pets,<br /><em>Happy Lives.</em></h1>
            <p>We provide loving care for your beloved pets, with friendly support and simple appointment booking.</p>
            <div className="garden-hero-actions">
              <Link to="/book" className="garden-button"><CalendarDays size={18} /> Book Appointment <ArrowRight size={17} /></Link>
              <Link to="/services" className="garden-outline-button"><Leaf size={17} /> Learn More</Link>
            </div>
            <div className="garden-trust"><span><ShieldCheck size={16} /> Caring hands</span><span><Heart size={16} /> Happy hearts</span><span><Star size={16} /> Pet-first care</span></div>
          </div>
          <div className="garden-hero-visual">
            <div className="garden-photo-collage">
              <img className="garden-main-pet" src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1100&q=90" alt="Happy golden dog" />
              <img className="garden-small-cat" src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=85" alt="Cute cat" />
              <img className="garden-small-rabbit" src="https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=500&q=85" alt="White rabbit" />
              <span className="garden-love-bubble">We care<br />for them <Heart size={15} fill="currentColor" /></span>
              <span className="garden-photo-paw paw-a">🐾</span><span className="garden-photo-paw paw-b">🐾</span>
            </div>
          </div>
        </div>
        <div className="garden-leaf leaf-one">✿</div><div className="garden-leaf leaf-two">✿</div>
      </section>

      <section className="garden-benefits container" aria-label="Why choose PetCare">
        {benefits.map(({ icon: Icon, title, text }) => (
          <article className="garden-benefit" key={title}>
            <span className="garden-benefit-icon"><Icon size={27} /></span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </article>
        ))}
      </section>

      <section className="garden-pets-section">
        <div className="container">
          <div className="garden-section-title">
            <span className="garden-eyebrow"><PawPrint size={17} /> OUR LOVELY PETS <PawPrint size={17} /></span>
            <h2>Every little friend <em>belongs.</em></h2>
            <p>Find the right care for your furry family members.</p>
          </div>
          <div className="garden-pet-grid">
            {pets.map((pet) => (
              <article className="garden-pet-card" key={pet.name}>
                <div className="garden-pet-photo"><img src={pet.image} alt={pet.name} loading="lazy" /><span className="garden-pet-paw">🐾</span></div>
                <div className="garden-pet-caption"><div><h3>{pet.icon} {pet.name}</h3><p>{pet.note}</p></div><span className="garden-round-arrow"><ArrowRight size={18} /></span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="garden-services-section">
        <div className="container">
          <div className="garden-section-title">
            <span className="garden-eyebrow">GENTLE CARE, EVERY DAY</span>
            <h2>Little moments, <em>big care.</em></h2>
            <p>Everything they need to stay happy, healthy and loved.</p>
          </div>
          <div className="garden-service-grid">
            {services.map(({ icon: Icon, title, text, tag }) => (
              <article className="garden-service-card" key={title}>
                <div className="garden-service-top"><span><Icon size={25} /></span><small>{tag}</small></div>
                <h3>{title}</h3><p>{text}</p>
                <Link to="/services">Explore service <ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="garden-contact-section">
        <div className="container garden-contact-inner">
          <div className="garden-contact-copy">
            <span className="garden-eyebrow">A HAPPY PET STARTS HERE</span>
            <h2>Because they mean <em>the world.</em> ❤️</h2>
            <p>Let's give them the love and care they deserve. Create an account, add your pet and book their next visit.</p>
            <div className="garden-contact-actions"><Link to="/register" className="garden-button">Join our family <ArrowRight size={17} /></Link><Link to="/book" className="garden-contact-link">Book a visit</Link></div>
          </div>
          <div className="garden-contact-art"><img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=850&q=85" alt="A caring veterinarian with a dog" loading="lazy" /><span>Lots of love<br />for every paw 🐾</span></div>
        </div>
      </section>
    </div>
  );
}
