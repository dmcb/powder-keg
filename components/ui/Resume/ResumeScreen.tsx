import PlayerConnectMenu from "components/ui/Menu/PlayerConnectMenu";
import { useGameStore } from "stores/gameStore";
import Modal from "components/ui/Modal/Modal";

/**
 * Shown while the game is paused. Resumes once the joined, connected players
 * have held their ready buttons long enough, or when the button is clicked.
 */
export default function ResumeScreen(props: { open: boolean }) {
  const setPaused = useGameStore((state) => state.setPaused);

  return (
    <Modal id="resume" open={props.open}>
      <h1>Paused</h1>
      <PlayerConnectMenu
        speed={2}
        action="resume"
        onComplete={() => setPaused(false)}
      />
    </Modal>
  );
}
