import { siteUrl } from "../lib/urls";
import { useMemo, useState } from "react";
import { Search, Plus, X, ChevronDown, FileDown } from "lucide-react";
import menu from "../data/menu.json";
import { dishes, money } from "../lib/cart";
import type { Dish } from "../types";
import { CodeInfo } from "../components/CodeInfo";
import { SectionRule } from "../components/UI";
export const fold = (s: string) =>
  s
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss");
export default function Menu({
  category,
  setCategory,
  onSelect,
  onAllergens,
}: {
  category: string;
  setCategory: (s: string) => void;
  onSelect: (d: Dish) => void;
  onAllergens: () => void;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      dishes.filter((d) =>
        query.trim()
          ? fold(
              `${d.number} ${d.name} ${d.description} ${d.category}`,
            ).includes(fold(query.trim()))
          : category === "Alle Gerichte" || d.category === category,
      ),
    [category, query],
  );
  const currentNote = results.find(
    (d) => d.category === category,
  )?.categoryNote;
  function choose(value: string) {
    setCategory(value);
    setQuery("");
  }
  return (
    <section id="speisekarte" className="digital-menu section-gap">
      <div className="container">
        <SectionRule>Die Speisekarte</SectionRule>
        <div className="menu-intro">
          <div>
            <p className="eyebrow">Für jeden Appetit</p>
            <h2>Was darf es sein?</h2>
          </div>
          <div className="menu-tools">
            <a href={siteUrl("speisekarte.pdf")} target="_blank" rel="noreferrer">
              <FileDown size={16} /> PDF ansehen
            </a>
            <button onClick={onAllergens}>Allergene & Zusatzstoffe</button>
          </div>
        </div>
        <div className="menu-search">
          <Search size={20} aria-hidden="true" />
          <input
            aria-label="Gericht oder Nummer suchen"
            placeholder="Lieblingsgericht oder Nummer suchen …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              aria-label="Suche löschen"
              className="icon-button"
              onClick={() => setQuery("")}
            >
              <X size={19} />
            </button>
          )}
          <span>
            {results.length} {results.length === 1 ? "Gericht" : "Gerichte"}
          </span>
        </div>
        <div className="menu-layout">
          <nav className="category-nav" aria-label="Menükategorien">
            {["Alle Gerichte", ...menu.categories].map((c) => (
              <button
                key={c}
                className={category === c && !query ? "active" : ""}
                aria-pressed={category === c && !query}
                onClick={() => choose(c)}
              >
                {c}
                <span>
                  {
                    dishes.filter(
                      (d) => c === "Alle Gerichte" || d.category === c,
                    ).length
                  }
                </span>
              </button>
            ))}
          </nav>
          <div className="menu-results">
            <div className="mobile-category">
              <select
                aria-label="Kategorie wählen"
                value={category}
                onChange={(e) => choose(e.target.value)}
              >
                {["Alle Gerichte", ...menu.categories].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
            <div className="category-title">
              <h3>{query ? "Deine Suchergebnisse" : category}</h3>
              <span>Guten Appetit.</span>
            </div>
            {currentNote && !query && (
              <p className="category-note">{currentNote}</p>
            )}
            {results.length === 0 ? (
              <div className="no-results">
                <h3>Heute etwas anderes?</h3>
                <p>
                  Für „{query}“ haben wir kein Gericht gefunden. Suche nach Name
                  oder Nummer.
                </p>
                <button
                  className="button"
                  onClick={() => {
                    choose("Alle Gerichte");
                  }}
                >
                  Alle Gerichte anzeigen
                </button>
              </div>
            ) : (
              <div className="dish-list">
                {results.map((d) => (
                  <article className="dish-row" key={d.id} data-dish-id={d.id}>
                    <span className="dish-number">{d.number || "+"}</span>
                    <div className="dish-copy">
                      {(query || category === "Alle Gerichte") && (
                        <span className="eyebrow dish-category">
                          {d.category}
                        </span>
                      )}
                      <h4>{d.name}</h4>
                      {d.description && <p>{d.description}</p>}
                      {d.size && !d.name.includes("STK.") && (
                        <span className="dish-size">{d.size}</span>
                      )}
                      {d.spicy && <span className="dish-size">{d.spicy}</span>}
                      {d.dietary.includes("vegetarisch") && (
                        <span className="dish-size">Vegetarisch</span>
                      )}
                      <details className="dish-codes">
                        <summary>
                          Informationen
                          {d.codes.length ? " · " + d.codes.join(", ") : ""}
                        </summary>
                        <CodeInfo codes={d.codes} />
                        {d.variants.length > 0 && (
                          <p>
                            Die Kennzeichnung der Variante findest du bei der
                            Auswahl.
                          </p>
                        )}
                        <p>Bei Allergien bitte mit dem Restaurant sprechen.</p>
                      </details>
                    </div>
                    <div className="dish-action">
                      <span>
                        {d.variants.length > 0 && <small>ab </small>}
                        {money(d.priceCents)}
                      </span>
                      <button
                        aria-label={`Nr. ${d.number || "Extra"} ${d.name} auswählen`}
                        onClick={() => onSelect(d)}
                      >
                        <Plus size={19} strokeWidth={1.5} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <p className="menu-footnote">
              Preise und Angaben laut Speisekarte. Duftreis wird mit Sesam
              bestreut, auf Wunsch auch ohne. Bei Allergien und Sonderwünschen
              bitte unser Team ansprechen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
