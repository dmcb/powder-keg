/**
 * Lobby field for the game seed. Controlled: the lobby keeps the draft value
 * and commits it to the game store when the game starts.
 */
export default function SeedInput(props: {
  value: string;
  onChange: (seed: string) => void;
}) {
  return (
    <fieldset>
      <label htmlFor="seed">Seed</label>
      <input
        value={props.value}
        type="text"
        id="seed"
        autoComplete="off"
        autoCorrect="off"
        onFocus={(e) => e.target.select()}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </fieldset>
  );
}
