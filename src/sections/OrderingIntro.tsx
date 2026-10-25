import { Arrow, SectionRule } from "../components/UI";
import restaurant from "../data/restaurant.json";

export default function OrderingIntro({ onCart }: { onCart: () => void }) {
  return (
    <section id="bestellung" className="ordering-intro" aria-labelledby="ordering-title">
      <div className="container">
        <SectionRule>Restaurant Familie Dang · Deine Bestellung</SectionRule>
        <div className="ordering-intro-grid">
          <div className="ordering-intro-copy">
            <h1 id="ordering-title">Bestellen.<br /><span>Für zu Hause.</span></h1>
            <p>
              Wähle deine Gerichte und sende uns deine Bestellung per WhatsApp.
              Ob wir zu dir liefern können und welche Konditionen gelten,
              klären wir gerne direkt mit dir.
            </p>
            <a className="ordering-menu-link" href="#speisekarte">
              Speisekarte ansehen <Arrow />
            </a>
          </div>
          <div className="ordering-intro-details">
            <dl className="delivery-facts">
              <div><dt>Liefergebiet</dt><dd>Bitte anfragen</dd></div>
              <div><dt>Mindestbestellwert</dt><dd>Bitte anfragen</dd></div>
              <div><dt>Liefergebühr</dt><dd>Bitte anfragen</dd></div>
            </dl>
            <p className="eyebrow">Jetzt bestellen</p>
            <button className="button ordering-cart" onClick={onCart}>
              Bestellung per WhatsApp <Arrow />
            </button>
            <a className="ordering-phone" href={restaurant.phoneHref}>
              {restaurant.phone} <Arrow />
            </a>
            <p className="ordering-note">
              In WhatsApp auf „Senden“ tippen. Deine Bestellung gilt erst nach
              unserer Bestätigung. Wir freuen uns auf deine Nachricht!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
