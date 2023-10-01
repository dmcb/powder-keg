import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";

export interface AxiosResponse {
  pass: boolean;
  data: any;
}

export default function Network() {
  const [players, setPlayers] = useState([]);

  // const getPlayers = async () => {
  //   const response = await axios.post<never, AxiosResponse>(
  //     "/api/players/list"
  //   );
  //   console.log(response);
  // };

  useEffect(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
        customHandler: async (data, callback) => {
          const response = await axios.post<never, AxiosResponse>(
            "/api/pusher/auth",
            data
          );
          callback(null, response.data);
        },
      },
    });

    const channel = pusher.subscribe("private-players");
    channel.bind("pusher:subscription_succeeded", (members) => {
      console.log(members);
    });
    channel.bind("pusher:subscription_count", (data) => {
      console.log(data.subscription_count);
    });

    // getPlayers();

    return () => {
      pusher.unsubscribe("private-players");
    };
  }, []);

  return <></>;
}
