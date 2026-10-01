import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import "./GameCount.css";

interface PusherAuthResponse {
  auth: string;
  channel_data?: string;
  shared_secret?: string;
}

export default function GameCount() {
  const [gameCount, setGameCount] = useState(0);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!appKey || !cluster) return;

    const pusher = new Pusher(appKey, {
      cluster,
      forceTLS: true,
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
        customHandler: async ({ socketId, channelName }, callback) => {
          try {
            const response = await axios.post<PusherAuthResponse>(
              "/api/pusher/auth",
              { socketId, channelName },
            );
            callback(null, response.data);
          } catch (error) {
            callback(error as Error, null);
          }
        },
      },
    });

    const channel = pusher.subscribe("private-games");

    channel.bind(
      "pusher:subscription_count",
      (data: { subscription_count: number }) => {
        setGameCount(data.subscription_count);
      },
    );

    return () => {
      pusher.unsubscribe("private-games");
    };
  }, []);

  return (
    gameCount > 1 && (
      <span className="game-count">{gameCount} games playing right now</span>
    )
  );
}
