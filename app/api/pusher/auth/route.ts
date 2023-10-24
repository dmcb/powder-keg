import { NextRequest } from "next/server";
import { jsonResponse } from "lib/jsonResponse";
import { pusher } from "lib/pusher";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { socketId, channelName } = body;
    const authResponse = pusher.authorizeChannel(socketId, channelName);
    return jsonResponse(200, authResponse);
  } catch (e) {
    console.error(e);
    return jsonResponse(500, { error: e });
  }
}
