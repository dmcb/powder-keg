import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";

export default function Network() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: process.env.NEXT_PUBLIC_CLUSTER,
    });

    const channel = pusher.subscribe("network");

    channel.bind("player-joined", (data) => {
      setPlayers(data.players);
    });

    return () => {
      pusher.unsubscribe("network");
    };
  }, []);

  return (
    <div>
      <h1>Network</h1>
    </div>
  );
}
