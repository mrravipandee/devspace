import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ msg: "Logged out successfully" });

  // Clear the token cookie
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), 
  });

  return res;
}
