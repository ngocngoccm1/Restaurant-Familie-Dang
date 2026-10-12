import menu from "../data/menu.json";
export function CodeInfo({ codes }: { codes: string[] }) {
  const legend: Record<string, string> = {
    ...menu.allergenLegend,
    ...menu.additiveLegend,
  };
  return codes.length ? (
    <span className="codes">
      Kennzeichnung:{" "}
      {codes.map((code) => (
        <span key={code} title={legend[code] ?? "Im Original nicht erläutert"}>
          {code}
        </span>
      ))}
    </span>
  ) : (
    <span className="codes">
      Keine Kennzeichnung im Original. Bitte bei Allergien nachfragen.
    </span>
  );
}
