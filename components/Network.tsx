import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";

export interface AxiosResponse {
  pass: boolean;
  data: any;
}

export default function Network() {
  const [players, setPlayers] = useState([]);

  const connect = async () => {
    const response = await axios.post<never, AxiosResponse>(
      "/api/players/connect"
    );
    console.log(response);
  };

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: process.env.NEXT_PUBLIC_CLUSTER,
    });

    const channel = pusher.subscribe("network");

    channel.bind("player-joined", (data) => {
      setPlayers(data.players);
      console.log(data.players);
    });

    connect();

    return () => {
      pusher.unsubscribe("network");
    };
  }, []);

  return <></>;
}
