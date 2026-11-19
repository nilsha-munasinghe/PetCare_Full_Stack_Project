import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Heart,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
} from "lucide-react";
import { Link } from "react-router-dom";

const pets = [
  {
    name: "Dogs",
    note: "For our loyal best friends",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=85",
    className: "dog",
    number: "01",
  },
  {
    name: "Cats",
    note: "For every curious whisker",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=85",
    className: "cat",
    number: "02",
  },
  {
    name: "Rabbits",
    note: "For the softest little hops",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=85",
    className: "rabbit",
    number: "03",
  },
  {
    name: "Guinea pigs",
    note: "For tiny friends with big hearts",
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=85",
    className: "guinea",
    number: "04",
  },
];

const services = [
  {
    icon: Stethoscope,
    title: "Health checkups",
    text: "Gentle nose-to-tail checkups to help your little friend feel their best.",
    tag: "WELLNESS",
  },
  {
    icon: Syringe,
    title: "Vaccinations",
    text: "Thoughtful preventive care and essential vaccinations for every life stage.",
    tag: "PROTECTION",
  },
  {
    icon: Scissors,
    title: "Grooming",
    text: "A fresh, comfy and feel-good grooming experience for your furry family.",
    tag: "PAMPERING",
  },
];

export default function Home() {
  return (
    <div className="home-redesign">
      <section className="new-hero">
        <div className="new-hero-orb orb-one" />
        <div className="new-hero-orb orb-two" />
        <div className="container new-hero-grid">
          <div className="new-hero-copy">
            <span className="new-kicker"><span className="kicker-paw"><PawPrint size={14} /></span> A LITTLE MORE LOVE FOR EVERY PAW</span>
            <h1>Care that feels like <em> a warm hug.</em></h1>
            <p className="new-hero-description">
              Happy pets start with gentle care. Find trusted services, book a visit
              and give your furry family the love they deserve.
            </p>
            <div className="new-hero-actions">
              <Link to="/book" className="new-button new-button-primary">Book a visit <ArrowRight size={17} /></Link>
              <Link to="/services" className="new-button new-button-quiet">Explore our care</Link>
            </div>
            <div className="new-hero-proof">
              <span><ShieldCheck size={17} /> Caring hands</span>
              <i />
              <span><Heart size={17} /> Happy hearts</span>
              <i />
              <span><BadgeCheck size={17} /> Easy booking</span>
            </div>
          </div>
          <div className="new-hero-art">
            <div className="hero-photo-backdrop" />
            <div className="hero-photo-frame">
              <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1100&q=90" alt="A happy golden dog enjoying a sunny day" />
            </div>
            <div className="hero-floating-card booking-float">
              <span className="float-icon"><CalendarDays size={19} /></span>
              <span><b>Time for a checkup?</b><small>Your next visit is a few clicks away</small></span>
            </div>
            <div className="hero-floating-card love-float">
              <span className="love-icon"><Heart size={18} fill="currentColor" /></span>
              <span><b>Lots of love</b><small>For every little friend</small></span>
            </div>
            <span className="hero-sparkle sparkle-a">✳</span>
            <span className="hero-sparkle sparkle-b">✦</span>
          </div>
        </div>
        <div className="container hero-bottom-note">
          <span className="scroll-line" />
          <span>GOOD CARE. SO MANY HAPPY TAILS.</span>
          <span className="hero-bottom-paw"><PawPrint size={17} /></span>
        </div>
      </section>

      <section className="new-pets-section">
        <div className="container">
          <div className="new-section-heading">
            <div>
              <span className="new-kicker">OUR LITTLE FAMILY</span>
              <h2>Every kind of <em>paw</em> belongs.</h2>
            </div>
            <p>Big, tiny, fluffy or curious — every companion has a special place here.</p>
          </div>
          <div className="new-pet-grid">
            {pets.map((pet) => (
              <article className={`new-pet-card ${pet.className}`} key={pet.name}>
                <div className="new-pet-image">
                  <img src={pet.image} alt={pet.name} loading="lazy" />
                  <span className="new-pet-number">{pet.number}</span>
                  <span className="new-pet-heart"><Heart size={17} /></span>
                </div>
                <div className="new-pet-info">
                  <div><h3>{pet.name}</h3><p>{pet.note}</p></div>
                  <span className="pet-arrow"><ArrowRight size={17} /></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="new-care-section">
        <div className="container">
          <div className="new-section-heading care-heading">
            <div>
              <span className="new-kicker">LITTLE MOMENTS, BIG CARE</span>
              <h2>Everything they need to <em>thrive.</em></h2>
            </div>
            <p>From routine checkups to a little pampering, we make pet care feel simple.</p>
          </div>
          <div className="new-service-grid">
            {services.map(({ icon: Icon, title, text, tag }, index) => (
              <article className="new-service-card" key={title}>
                <div className="service-card-top">
                  <span className={`new-service-icon service-icon-${index + 1}`}><Icon size={23} /></span>
                  <span className="service-tag">{tag}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to="/services" className="service-text-link">Discover more <ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="new-why-section">
        <div className="container new-why-grid">
          <div className="why-image-wrap">
            <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1000&q=85" alt="A veterinarian gently caring for a dog" loading="lazy" />
            <div className="why-sticker"><Sparkles size={17} /><span>Gentle care<br />with love</span></div>
          </div>
          <div className="why-copy">
            <span className="new-kicker">WHY PET PARENTS CHOOSE US</span>
            <h2>Because they're not just pets. <em>They're family.</em></h2>
            <p>We believe every pet deserves kindness, comfort and care that makes their humans feel good too.</p>
            <div className="why-points">
              <div><span><Heart size={17} /></span><p><b>A little extra love</b><small>Kindness in every step of their care.</small></p></div>
              <div><span><Clock3 size={17} /></span><p><b>Simple appointments</b><small>Book their next visit without the fuss.</small></p></div>
              <div><span><ShieldCheck size={17} /></span><p><b>Care you can feel good about</b><small>Support for every stage of their life.</small></p></div>
            </div>
            <Link to="/services" className="new-button new-button-primary">See how we care <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="new-cta-section">
        <div className="container new-cta-inner">
          <div className="cta-paw cta-paw-one"><PawPrint size={44} /></div>
          <div className="cta-copy">
            <span className="new-kicker">A HAPPY PET STARTS HERE</span>
            <h2>Ready for more tail wags?</h2>
            <p>Create your account, add your pet and book their next little care moment.</p>
          </div>
          <Link to="/register" className="new-button new-button-light">Join the family <ArrowRight size={17} /></Link>
          <div className="cta-paw cta-paw-two"><Heart size={36} /></div>
        </div>
      </section>
    </div>
  );
}
