export default function GamepadButtonHelper(props: {
  buttonToPress: number;
  light?: boolean;
  pressed?: boolean;
}) {
  return (
    <div className={`gamepad-buttons ${props.light ? "light" : ""}`}>
      <div
        className={`gamepad-button up ${
          props.buttonToPress == 3 ? "press-me" : ""
        } ${props.buttonToPress == 3 && props.pressed ? "pressed" : ""}`}
      />
      <div
        className={`gamepad-button left ${
          props.buttonToPress == 2 ? "press-me" : ""
        } ${props.buttonToPress == 2 && props.pressed ? "pressed" : ""}`}
      />
      <div
        className={`gamepad-button right ${
          props.buttonToPress == 1 ? "press-me" : ""
        } ${props.buttonToPress == 1 && props.pressed ? "pressed" : ""}`}
      />
      <div
        className={`gamepad-button down ${
          props.buttonToPress == 0 ? "press-me" : ""
        } ${props.buttonToPress == 0 && props.pressed ? "pressed" : ""}`}
      />
    </div>
  );
}
