import { Color } from "three";

export default function kelvinToRGB(kelvin: number) {
  kelvin = kelvin / 100;
  let r, g, b;

  // Red
  if (kelvin <= 66) {
    r = 255;
  } else {
    r = kelvin - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    if (r < 0) r = 0;
    if (r > 255) r = 255;
  }
  // Green
  if (kelvin <= 66) {
    g = kelvin;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
  } else {
    g = kelvin - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
  }
  if (g < 0) g = 0;
  if (g > 255) g = 255;
  // Blue
  if (kelvin > 66) {
    b = 255;
  } else {
    if (kelvin <= 19) {
      b = 0;
    } else {
      b = kelvin - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
      if (b < 0) b = 0;
      if (b > 255) b = 255;
    }
  }

  return new Color(r / 255, g / 255, b / 255);
}
