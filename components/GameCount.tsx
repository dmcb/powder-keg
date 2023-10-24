import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";

export interface AxiosResponse {
  pass: boolean;
  data: any;
}

export default function GameCount() {
  const [gameCount, setGameCount] = useState(0);

  // const setPlayers = async () => {
  //   const response = await axios.post<never, AxiosResponse>(
  //     "/api/players/state"
  //   );
  //   console.log(response);
  // };

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
        customHandler: async (data, callback) => {
          const response = await axios.post<never, AxiosResponse>(
            "/api/pusher/auth",
            {
              socketId: data.socketId,
              channelName: data.channelName,
            }
          );
          callback(null, response.data);
        },
      },
    });

    const channel = pusher.subscribe("private-games");

    channel.bind("pusher:subscription_count", (data) => {
      setGameCount(data.subscription_count);
    });

    return () => {
      pusher.unsubscribe("private-games");
    };
  }, []);

  return (
    gameCount > 1 && <span className="count">{gameCount} games running</span>
  );
}
