import type { ReactNode } from "react";
import { Phone, MapPin, Clock, ArrowDown } from "lucide-react";
import restaurant from "../data/restaurant.json";
import { Arrow, Frame, Photo, SectionRule } from "../components/UI";
export default function Landing({
  onMenu,
  onCart,
  onGallery,
  menu,
}: {
  onMenu: (category: string) => void;
  onCart: () => void;
  onGallery: (name: string) => void;
  menu: ReactNode;
}) {
  return (
    <>
      <section className="hero" id="start">
        <Photo
          name="dang-sushi-platter"
          alt="Sushi-Platte bei Familie Dang mit Nigiri, Sashimi und Sushi-Rollen auf Bambusbrücken"
          eager
        />
        <div className="hero-caption">
          <span className="eyebrow">Höchstädt an der Donau</span>
          <h1>Familie<br />Dang<span className="hero-brand-dot">.</span></h1>
          <p className="hero-cuisine">Sushi-Bar & vietnamesische Küche</p>
          <a
            className="hero-link"
            href="#speisekarte"
            onClick={() => onMenu("Vorspeisen")}
          >
            Speisekarte entdecken <Arrow />
          </a>
        </div>
        <a
          className="hero-scroll"
          href="#restaurant"
          aria-label="Restaurant entdecken"
        >
          <ArrowDown size={20} strokeWidth={1.5} />
        </a>
        <span className="hero-image-note">Sushi bei Familie Dang</span>
      </section>
      <div className="brand-ribbon" aria-hidden="true">
        <span>Sushi · Phở · Familie Dang</span>
        <span>Zusammen schmeckt’s am besten</span>
        <span>Sushi · Phở · Familie Dang</span>
      </div>
      <section id="restaurant" className="welcome section-gap">
        <div className="container">
          <div className="story-pair">
            <Frame
              label="Willkommen bei Familie Dang"
              className="story-frame reveal"
            >
              <span className="small-ornament" aria-hidden="true">
                ✳
              </span>
              <h2>
                Ein Tisch.
                <br />
                Zwei Küchen.
                <br />
                Viele Lieblingsgerichte.
              </h2>
              <p>
                Vietnamesische Küche und Sushi – bei Familie Dang in Höchstädt
                an der Donau kommen beide auf den Tisch. Von Phở mit Koriander
                über Sommerrollen bis zu Nigiri und unseren Family-Dang-Rollen.
              </p>
              <a className="button" href="#speisekarte">
                Finde dein Lieblingsgericht <Arrow />
              </a>
            </Frame>
            <div className="story-photo">
              <Photo
                name="dang-sushi-rolls"
                alt="Sushi-Rollen, Nigiri und Sashimi bei Familie Dang"
              />
              <span className="photo-caption">
                Unsere Sushi-Bar. Zum Entdecken und Teilen.
              </span>
            </div>
          </div>
          <div className="menu-discovery">
            <SectionRule>Von Phở bis Sushi</SectionRule>
            <p className="discovery-copy">
              Eine warme Suppe. Eine frische Rolle. Eine Platte zum Teilen.{" "}
              <br />
              Entdecke, worauf du heute Lust hast.
            </p>
            <div className="menu-tiles">
              {[
                {
                  title: "Vietnamesische Küche",
                  img: "pho",
                  alt: "Phở mit Reisbandnudeln und Kräutern aus der Speisekarte",
                  category: "Große Suppen",
                  label: "Phở & mehr entdecken",
                  number: "01",
                },
                {
                  title: "Sushi-Bar",
                  img: "dang-sushi-detail",
                  alt: "Sushi-Auswahl bei Familie Dang mit Lachs, Thunfisch und Inside-out-Rollen",
                  category: "Family Dang",
                  label: "Sushi entdecken",
                  number: "02",
                },
                {
                  title: "Getränke",
                  img: "ginger-tea",
                  alt: "Ingwertee mit Minze und Limette aus der Speisekarte",
                  category: "Hausgemachte Getränke",
                  label: "Getränke entdecken",
                  number: "03",
                },
              ].map((t) => (
                <div className="menu-tile" key={t.category}>
                  <a
                    href="#speisekarte"
                    className="tile-photo"
                    onClick={() => onMenu(t.category)}
                  >
                    <Photo name={t.img} alt={t.alt} />
                    <span className="tile-number">
                      {t.number} / Speisekarte
                    </span>
                    <h3>{t.title}</h3>
                    <span className="tile-arrow">
                      <Arrow />
                    </span>
                  </a>
                  <a
                    className="button"
                    href="#speisekarte"
                    onClick={() => onMenu(t.category)}
                  >
                    {t.label}
                    <Arrow />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {menu}
      <section className="drink-section section-gap">
        <div className="container drink-pair">
          <div className="drink-photo">
            <Photo
              name="house-drinks"
              alt="Fruchtige Getränke aus der Speisekarte"
            />
            <span className="photo-caption">
              Hausgemachte Getränke · je 5,90 € laut Karte
            </span>
          </div>
          <Frame label="Darf’s noch etwas sein?" className="reveal">
            <h2>
              Kleine Pause.
              <br />
              Große Erfrischung.
            </h2>
            <p>
              Minze, Ananas, Passionsfrucht oder Ingwer. Unsere Karte bietet
              hausgemachte Getränke, Lassi und Tee – dazu vietnamesischen Kaffee
              mit Kondensmilch.
            </p>
            <a
              className="button"
              href="#speisekarte"
              onClick={() => onMenu("Hausgemachte Getränke")}
            >
              Getränk aussuchen
              <Arrow />
            </a>
          </Frame>
        </div>
      </section>
      <section className="photo-break" aria-label="Sushi zum Teilen">
        <Photo
          name="dang-sushi-detail"
          alt="Sushi-Auswahl mit Sashimi, Nigiri und Rollen bei Familie Dang"
        />
        <div>
          <span className="eyebrow">Nigiri · Maki · Family Dang</span>
          <p>
            Für die Mitte.
            <br />
            Für alle.
          </p>
          <a
            className="button"
            href="#speisekarte"
            onClick={() => onMenu("Menü Family Dang")}
          >
            Sushi-Menüs entdecken
            <Arrow />
          </a>
        </div>
      </section>
      <section id="bestellung" className="order-section section-gap">
        <div className="container story-pair">
          <div className="order-photo">
            <Photo
              name="summer-rolls"
              alt="Sommerrollen mit Salat und Reisnudeln aus der Speisekarte"
            />
          </div>
          <Frame label="Deine Auswahl" className="reveal">
            <h2>
              Erst aussuchen.
              <br />
              Dann gemeinsam
              <br />
              genießen.
            </h2>
            <p>
              Stelle deine Gerichte im Warenkorb zusammen und sende deine
              Bestellung per WhatsApp an uns. Verfügbarkeit und die Möglichkeiten
              zur Abholung oder Lieferung klären wir gemeinsam im Chat.
            </p>
            <button className="button" onClick={onCart}>
              Bestellung zusammenstellen
              <Arrow />
            </button>
            <a className="text-link" href={restaurant.phoneHref}>
              {restaurant.phone} <Arrow />
            </a>
            <p className="fine-print">
              In WhatsApp auf „Senden“ tippen und unsere Bestätigung abwarten.
            </p>
          </Frame>
        </div>
      </section>
      <section id="einblicke" className="gallery-section section-gap">
        <div className="gallery-inner">
          <Frame label="Ein Blick auf die Karte" className="gallery-frame">
            <h2>
              Appetit auf
              <br />
              mehr?
            </h2>
          </Frame>
          <button
            className="gallery-image gallery-one"
            onClick={() => onGallery("dang-sushi-rolls")}
            aria-label="Sushi-Auswahl vergrößern"
          >
            <Photo
              name="dang-sushi-rolls"
              alt="Frisch angerichtete Sushi-Rollen bei Familie Dang"
            />
            <span>
              Die Sushi-Bar <Arrow />
            </span>
          </button>
          <button
            className="gallery-image gallery-two"
            onClick={() => onGallery("pho")}
            aria-label="Phở-Bild vergrößern"
          >
            <Photo name="pho" alt="Eine Schale Phở aus dem Menü" />
            <span>
              Vietnamesische Küche <Arrow />
            </span>
          </button>
          <button
            className="gallery-image gallery-three"
            onClick={() => onGallery("vietnamese-coffee")}
            aria-label="Vietnamesischen Kaffee vergrößern"
          >
            <Photo
              name="vietnamese-coffee"
              alt="Vietnamesischer Kaffee mit Kondensmilch aus dem Menü"
            />
            <span>
              Kaffee & kleine Pausen <Arrow />
            </span>
          </button>
          <p className="gallery-note">
            Sushi-Fotos von Familie Dang. Weitere Speisenbilder stammen aus der
            bereitgestellten Speisekarte; die Anrichtung kann abweichen.
          </p>
        </div>
      </section>
      <section id="kontakt" className="contact-section section-gap">
        <div className="container">
          <SectionRule>Wir sehen uns in Höchstädt</SectionRule>
          <div className="contact-pair">
            <div className="contact-address">
              <MapPin size={26} strokeWidth={1} />
              <p className="eyebrow">Restaurant Familie Dang</p>
              <h2>
                Dillinger
                <br />
                Straße 17.
              </h2>
              <p>89420 Höchstädt an der Donau</p>
              <a
                className="button"
                href={restaurant.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Route in Google Maps öffnen
                <Arrow />
              </a>
              <span className="fine-print">
                Die Karte öffnet sich erst nach deinem Klick.
              </span>
            </div>
            <Frame label="Komm vorbei" className="contact-frame">
              <Clock size={23} strokeWidth={1} />
              <h3>Unsere Öffnungszeiten</h3>
              {restaurant.hours.map((h) => (
                <div className="hours-row" key={h.days}>
                  <span>{h.days}</span>
                  <strong>{h.time} Uhr</strong>
                </div>
              ))}
              <div id="tischanfrage" className="contact-phone">
                <h3>Ein Tisch für dich?</h3>
                <p>
                  Für Tischanfragen und Fragen zu deiner Auswahl erreichst du
                  uns telefonisch.
                </p>
                <a href={restaurant.phoneHref} className="phone-main">
                  <Phone size={20} strokeWidth={1.5} />
                  {restaurant.phone}
                </a>
                <a className="mobile-phone" href={restaurant.mobileHref}>
                  {restaurant.mobile}
                </a>
                <small>
                  Bitte Verfügbarkeit direkt mit dem Restaurant klären.
                </small>
              </div>
            </Frame>
          </div>
        </div>
      </section>
    </>
  );
}
