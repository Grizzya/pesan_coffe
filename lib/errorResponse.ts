import { NextResponse } from "next/server";

export function errorResponse(
  error: unknown,
  message = "Terjadi kesalahan pada server"
) {
  // Log detail error ke server
  console.error(error);

  // Production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }

  // Development: boleh tampilkan detail
  return NextResponse.json(
    {
      error: message,
      detail:
        error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}
