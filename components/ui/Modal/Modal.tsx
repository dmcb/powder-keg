import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import Borders from "components/ui/Decoration/Borders";
import "./Modal.css";

type ModalProps = Omit<
  ComponentPropsWithoutRef<"dialog">,
  "open" | "onCancel" | "onClose"
> & {
  open: boolean;
  /** Called on Escape. If omitted, the modal can't be dismissed that way. */
  onCancel?: () => void;
};

/**
 * Modal built on the native `<dialog>` element, opened with `showModal()` so
 * it sits in the top layer with a `::backdrop` and the rest of the page is
 * inert. Children are only mounted while open.
 */
export default function Modal({
  open,
  onCancel,
  className,
  children,
  ...rest
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={className ? `modal ${className}` : "modal"}
      onCancel={(e) => {
        e.preventDefault();
        onCancel?.();
      }}
      // Browsers may force-close on repeated Escape despite preventDefault;
      // reopen if we're still meant to be open.
      onClose={(e) => {
        if (open) e.currentTarget.showModal();
      }}
      {...rest}
    >
      <Borders />
      {open && children}
    </dialog>
  );
}
