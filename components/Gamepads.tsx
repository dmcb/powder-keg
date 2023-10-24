import { useFrame } from "@react-three/fiber";

export default function Gamepads() {
  useFrame((_, delta) => {
    const controllers = navigator.getGamepads();
  });

  return <></>;
}
