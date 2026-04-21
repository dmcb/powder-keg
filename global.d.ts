import type { ThreeElements } from "@react-three/fiber";

declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    interface IntrinsicElements extends ThreeElements {}
  }
}
