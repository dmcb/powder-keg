import { NextRequest } from "next/server";
import { jsonResponse } from "lib/jsonResponse";
import { pusher } from "lib/pusher";

export async function POST(request: NextRequest) {
  try {
    pusher.trigger("network", "player-joined", {
      message: "hello world",
    });
  } catch (e) {
    console.error(e);
    return jsonResponse(200, { pass: false, error: e });
  }
  return jsonResponse(200, { pass: true, data: [] });
}
