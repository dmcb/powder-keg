import "./Borders.css";

const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];

// Points of an 8-point compass rose centred on the frame corner (4, 4)
const compassRose =
  "4,-7 5.15,1.23 8.95,-0.95 6.77,2.85 15,4 6.77,5.15 8.95,8.95 5.15,6.77 " +
  "4,15 2.85,6.77 -0.95,8.95 1.23,5.15 -7,4 1.23,2.85 -0.95,-0.95 2.85,1.23";

/**
 * Scrollwork running along one edge of the frame, away from the corner.
 * Mirrored across the diagonal for the other edge.
 */
function Scroll(props: { transform?: string }) {
  return (
    <g transform={props.transform}>
      <path
        className="corner-line"
        d="M22 12 C34 16 42 30 58 30 C72 30 78 20 72 14 C67 10 60 14 62 19 C63 22 67 22 68 19"
      />
      <path
        className="corner-line"
        d="M58 30 C80 34 96 22 118 20 C132 19 142 24 150 22"
      />
      <path
        className="corner-line thin"
        d="M112 21 C116 31 127 33 129 27 C130 23 125 22 124 25"
      />
      <path
        className="corner-fill"
        d="M92 26 C96 15 106 12 114 12 C110 19 103 25 92 26 Z"
      />
      <circle className="corner-fill" cx="150" cy="22" r="2.4" />
    </g>
  );
}

/**
 * Old-timey nautical ornaments (compass-rose medallion with scrollwork) that
 * sit over the corners of the page frame drawn by `body::before`.
 */
export default function Borders() {
  return (
    <div className="borders">
      {corners.map((corner) => (
        <svg
          key={corner}
          className={`corner ${corner}`}
          viewBox="-16 -16 176 176"
          aria-hidden="true"
        >
          <Scroll />
          <Scroll transform="matrix(0 1 1 0 0 0)" />
          <path className="corner-line thin" d="M15 15 L30 30" />
          <path className="corner-fill" d="M30 30 L41 35 L48 48 L35 41 Z" />
          <circle className="corner-medallion" cx="4" cy="4" r="16" />
          <circle className="corner-line thin" cx="4" cy="4" r="12.5" />
          <polygon className="corner-fill" points={compassRose} />
          <circle className="corner-pin" cx="4" cy="4" r="1.5" />
        </svg>
      ))}
    </div>
  );
}
