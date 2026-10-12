import { siteUrl } from "../lib/urls";
import restaurant from "../data/restaurant.json";
import { Arrow, SectionRule } from "./UI";
export default function Legal({ page }: { page: "impressum" | "datenschutz" }) {
  const title = page === "impressum" ? "Impressum" : "Datenschutz";
  return (
    <main id="main" className="legal-page container">
      <SectionRule>{title}</SectionRule>
      <h1>{title}</h1>
      <p className="legal-status">
        Entwurf · Angaben zur Veröffentlichung noch zu ergänzen
      </p>
      {page === "impressum" ? (
        <>
          <h2>Restaurant Familie Dang</h2>
          <p>
            {restaurant.street}
            <br />
            {restaurant.postalCode} {restaurant.city}
            <br />
            Deutschland
          </p>
          <p>
            Telefon: <a href={restaurant.phoneHref}>{restaurant.phone}</a>
            <br />
            Mobil: <a href={restaurant.mobileHref}>{restaurant.mobile}</a>
          </p>
          <h2>Noch nicht vollständig</h2>
          <p>
            Die bereitgestellten Unterlagen enthalten keinen vollständigen Namen
            des verantwortlichen Betreibers, keine Rechtsform und keine
            E-Mail-Adresse. Vertretungsberechtigte Personen, Registerangaben und
            Umsatzsteuer-Identifikationsnummer müssen, soweit zutreffend, vom
            Betreiber ergänzt werden.
          </p>
          <p>
            Diese Seite ist ein vorbereiteter Entwurf und noch kein
            vollständiges Impressum. Die Angaben müssen vor einer öffentlichen
            Veröffentlichung durch den Betreiber vervollständigt und geprüft
            werden.
          </p>
        </>
      ) : (
        <>
          <h2>Verantwortlicher</h2>
          <p>
            Die vollständigen Kontaktdaten des Verantwortlichen müssen vom
            Restaurantbetreiber ergänzt werden. Die unten beschriebenen
            technischen Funktionen beziehen sich auf diese Website.
          </p>
          <h2>Warenkorb auf deinem Gerät</h2>
          <p>
            Nach dem Hinzufügen eines Gerichts speichert die Website die Auswahl
            im lokalen Speicher deines Browsers unter „familie-dang-cart-v1“.
            Gespeichert werden ausschließlich Gerichtnummern, Varianten, Extras,
            Mengen und Auswahloptionen. Es werden keine Namen, Adressen oder
            Zahlungsdaten abgefragt. Du kannst den Warenkorb über die
            Mengensteuerung oder die Entfernen-Schaltflächen leeren. Die Auswahl
            wird nicht an einen Server gesendet.
          </p>
          <h2>Telefon und Kopieren</h2>
          <p>
            Telefonlinks öffnen die Telefonfunktion deines Geräts. Beim Klick
            auf „Auswahl kopieren“ wird der sichtbare Bestelltext in deine
            Zwischenablage geschrieben. Die Website verschickt keine
            Bestellungen automatisch.
          </p>
          <h2>Google Maps</h2>
          <p>
            Die Website bindet Google Maps nicht ein. Erst wenn du den
            ausdrücklich beschrifteten Kartenlink anklickst, öffnest du ein
            externes Angebot von Google. Dort gelten die
            Datenschutzinformationen des Anbieters.
          </p>
          <h2>Schriften, Bilder und Analyse</h2>
          <p>
            Schriften und Bilder werden vom selben Server wie die Website
            geladen. Die Anwendung verwendet keine Analyse- oder
            Marketing-Tracker, keine externen Schriftanbieter und keine
            eingebetteten sozialen Medien.
          </p>
          <h2>Vor Veröffentlichung ergänzen</h2>
          <p>
            Hosting-Anbieter, Serverprotokolle, Empfänger, Rechtsgrundlagen,
            Speicherfristen, Betroffenenrechte und zuständige Aufsichtsbehörde
            müssen mit dem tatsächlichen Betreiber und Hosting abgestimmt
            werden. Eine vollständige Datenschutzerklärung steht noch aus.
          </p>
        </>
      )}
      <a className="button" href={siteUrl("")}>
        Zurück zum Restaurant
        <Arrow />
      </a>
    </main>
  );
}
