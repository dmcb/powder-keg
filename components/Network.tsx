import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";

export interface AxiosResponse {
  pass: boolean;
  data: any;
}

export default function Network() {
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
              userId: "1",
              userInfo: {
                name: "Blah",
                playerNumber: 1,
              },
            }
          );
          callback(null, response.data);
        },
      },
    });

    const channel = pusher.subscribe("presence-players");

    channel.bind("pusher:subscription_succeeded", (members) => {
      console.log(members);
    });

    return () => {
      pusher.unsubscribe("presence-players");
    };
  }, []);

  return <></>;
}
