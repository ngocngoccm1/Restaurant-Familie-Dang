import { siteUrl } from "./lib/urls";
import { lazy, Suspense, useEffect, useState } from "react";
import { Menu as MenuIcon, X, ShoppingBag, Phone } from "lucide-react";
import restaurant from "./data/restaurant.json";
import menuData from "./data/menu.json";
import { money } from "./lib/cart";
import type { Dish, Selection } from "./types";
import { useCart } from "./hooks/useCart";
import { Dialog, Photo, Arrow } from "./components/UI";
import Landing from "./sections/Landing";
import DigitalMenu from "./sections/Menu";
import Legal from "./components/Legal";
const DishDialog = lazy(() => import("./components/DishDialog"));
const CartDrawer = lazy(() => import("./components/CartDrawer"));
export default function App() {
  const cart = useCart();
  const [menuReset, setMenuReset] = useState(0);
  const [mobileNav, setMobileNav] = useState(false),
    [cartOpen, setCartOpen] = useState(false),
    [selected, setSelected] = useState<Dish | null>(null),
    [category, setCategory] = useState("Vorspeisen"),
    [allergens, setAllergens] = useState(false),
    [gallery, setGallery] = useState<string | null>(null),
    [toast, setToast] = useState("");
  const legalPage = location.pathname.split("/").filter(Boolean).at(-1)?.replace(/\.html$/, "");
  const isLegal = legalPage === "impressum" || legalPage === "datenschutz";
  useEffect(() => {
    document.title = isLegal
      ? `${legalPage === "impressum" ? "Impressum" : "Datenschutz"} | Familie Dang`
      : "Restaurant Familie Dang | Sushi & vietnamesische Küche in Höchstädt";
  }, [isLegal, legalPage]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isLegal]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNav(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const onMenu = (c: string) => {
    setCategory(c);
    setMenuReset((value) => value + 1);
    setMobileNav(false);
  };
  function add(s: Selection) {
    cart.add(s);
    setToast("Zu deiner Auswahl hinzugefügt.");
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Zum Inhalt springen
      </a>
      <header className="header">
        <a
          className="wordmark"
          href={isLegal ? siteUrl() : "#start"}
          aria-label="Familie Dang Startseite"
        >
          <span>RESTAURANT</span>
          <strong>
            FAMILIE DANG<span className="brand-dot">.</span>
          </strong>
        </a>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          <a href={siteUrl("#restaurant")}>Restaurant</a>
          <a href={siteUrl("#speisekarte")}>Speisekarte</a>
          <a href={siteUrl("#einblicke")}>Einblicke</a>
          <a href={siteUrl("#kontakt")}>Kontakt</a>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={restaurant.phoneHref}>
            Tisch anfragen <Arrow />
          </a>
          <button
            className="header-cart"
            aria-label={`Warenkorb öffnen, ${cart.count} Artikel`}
            onClick={() => {
              setCartOpen(true);
              setMobileNav(false);
            }}
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
            <span>Warenkorb</span>
            <b>{cart.count}</b>
          </button>
          <button
            className="mobile-nav-button icon-button"
            aria-expanded={mobileNav}
            aria-controls="mobile-nav"
            aria-label={
              mobileNav ? "Navigation schließen" : "Navigation öffnen"
            }
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
        {mobileNav && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile Navigation"
          >
            {[
              ["Restaurant", "restaurant"],
              ["Speisekarte", "speisekarte"],
              ["Einblicke", "einblicke"],
              ["Kontakt & Öffnungszeiten", "kontakt"],
            ].map(([name, id]) => (
              <a key={id} href={siteUrl(`#${id}`)} onClick={() => setMobileNav(false)}>
                {name}
                <Arrow />
              </a>
            ))}
            <a href={restaurant.phoneHref}>
              <Phone size={16} />
              Tisch telefonisch anfragen
            </a>
          </nav>
        )}
      </header>
      {isLegal ? (
        <Legal page={legalPage as "impressum" | "datenschutz"} />
      ) : (
        <main id="main">
          <Landing
            onMenu={onMenu}
            onCart={() => setCartOpen(true)}
            onGallery={setGallery}
            menu={
              <DigitalMenu
                key={menuReset}
                category={category}
                setCategory={setCategory}
                onSelect={setSelected}
                onAllergens={() => setAllergens(true)}
              />
            }
          />
        </main>
      )}
      <footer className="footer">
        <div className="footer-top">
          <span className="eyebrow">Sushi-Bar & vietnamesische Küche</span>
          <a href={siteUrl("#speisekarte")}>
            Noch ein Lieblingsgericht?
            <Arrow />
          </a>
        </div>
        <a className="footer-wordmark" href={siteUrl("")}>
          FAMILIE DANG<span>.</span>
        </a>
        <div className="footer-info">
          <p>
            {restaurant.street}
            <br />
            {restaurant.postalCode} {restaurant.city}
          </p>
          <p>
            {restaurant.hours.map((hours, index) => (
              <span key={hours.days}>
                {index > 0 && <br />}
                {hours.days} · {hours.time} Uhr
              </span>
            ))}
          </p>
          <a href={restaurant.phoneHref}>
            {restaurant.phone}
            <Arrow />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Restaurant Familie Dang</span>
          <div>
            <a href={siteUrl("impressum.html")}>Impressum</a>
            <a href={siteUrl("datenschutz.html")}>Datenschutz</a>
            <button onClick={() => setAllergens(true)}>Allergene</button>
          </div>
        </div>
      </footer>
      {!isLegal && (
        <div className="mobile-bar">
          <a href={restaurant.phoneHref}>
            <Phone size={16} />
            Anrufen
          </a>
          <button onClick={() => setCartOpen(true)}>
            <ShoppingBag size={17} />
            Warenkorb ({cart.count})<span>{money(cart.total)}</span>
          </button>
        </div>
      )}
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
        <button aria-label="Hinweis schließen" onClick={() => setToast("")}>
          <X size={16} />
        </button>
      </div>
      <Suspense
        fallback={
          <span className="loading-status" role="status">
            Auswahl wird geladen …
          </span>
        }
      >
        {selected && (
          <DishDialog
            dish={selected}
            onClose={() => setSelected(null)}
            onAdd={add}
          />
        )}{" "}
        {cartOpen && (
          <CartDrawer cart={cart} onClose={() => setCartOpen(false)} />
        )}
      </Suspense>
      {allergens && (
        <Dialog
          title="Allergene & Zusatzstoffe"
          onClose={() => setAllergens(false)}
          className="allergen-dialog"
        >
          <div className="dialog-body">
            <h2>Gut zu wissen.</h2>
            <p>
              Die folgenden Kennzeichnungen stammen aus der bereitgestellten
              Speisekarte. Einige Angaben sind uneindeutig. Bitte bei Allergien,
              Unverträglichkeiten und Sonderwünschen direkt mit dem Restaurant
              sprechen.
            </p>
            <p className="allergen-note">
              Die Kennzeichnungen sind keine vollständige oder unabhängig
              überprüfte Allergenliste. Die Karte nennt „k“ Schalenfrüchte und
              „o“ Pilze. Die Zahlen 12 und 13 werden nicht erläutert.
            </p>
            <h3>Kennzeichnungen laut Speisekarte</h3>
            <dl className="legend-list">
              {Object.entries(menuData.allergenLegend).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <h3>Zusatzstoffe laut Speisekarte</h3>
            <dl className="legend-list">
              {Object.entries(menuData.additiveLegend).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="fine-print">{menuData.notes.join(" ")}</p>
            <a href={restaurant.phoneHref} className="button">
              Fragen telefonisch klären
              <Arrow />
            </a>
          </div>
        </Dialog>
      )}
      {gallery && (
        <Dialog
          title="Ein Blick auf unsere Speisekarte"
          onClose={() => setGallery(null)}
          className="gallery-dialog"
        >
          <Photo
            name={gallery}
            alt="Vergrößerte Speisenillustration aus der bereitgestellten Speisekarte"
            eager
          />
          <p>
            Illustration aus der Speisekarte. Die tatsächliche Anrichtung kann
            abweichen.
          </p>
        </Dialog>
      )}
    </>
  );
}
