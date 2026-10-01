import React, { forwardRef, PropsWithChildren } from "react";
import "./ProgressButton.css";

type ProgressButtonProps = PropsWithChildren<{
  progress: number;
  enabled?: boolean;
  autoFocus?: boolean;
  onClick: () => void;
}>;

/**
 * Menu submit button whose background fills left-to-right with `progress`
 * (0 to 1).
 */
const ProgressButton = forwardRef<HTMLButtonElement, ProgressButtonProps>(
  function ProgressButton(props, ref) {
    const percent = Math.min(1, Math.max(0, props.progress)) * 100;

    const execute = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      props.onClick();
    };

    return (
      <button
        ref={ref}
        className="progress-button"
        type="submit"
        disabled={props.enabled === false}
        autoFocus={props.autoFocus}
        onClick={execute}
        style={{
          background: `linear-gradient(90deg, var(--color-dark-active) ${percent}%, var(--color-background-dark) ${percent}%)`,
        }}
      >
        {props.children}
      </button>
    );
  },
);

export default ProgressButton;
