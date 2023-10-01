import { NextRequest } from "next/server";
import { jsonResponse } from "lib/jsonResponse";
import { pusher } from "lib/pusher";

export async function POST(request: NextRequest) {
  try {
    // pusher.trigger("network", "player-joined", {
    //   message: "hello world",
    // });
    const res = await pusher.get({ path: "/channels/users" });
    if (res.status === 200) {
      const body = await res.json();
      const users = body.users;
      return jsonResponse(200, { pass: true, data: users });
    } else {
      return jsonResponse(200, { pass: false, error: res });
    }
  } catch (e) {
    console.error(e);
    return jsonResponse(200, { pass: false, error: e });
  }
}
