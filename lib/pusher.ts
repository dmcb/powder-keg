import Pusher from "pusher";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const pusher = new Pusher({
  appId: requireEnv("PUSHER_APP_ID"),
  key: requireEnv("PUSHER_APP_KEY"),
  secret: requireEnv("PUSHER_APP_SECRET"),
  cluster: requireEnv("PUSHER_APP_CLUSTER"),
  useTLS: true,
});
