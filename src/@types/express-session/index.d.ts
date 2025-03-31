import "express-session";

declare module "express-session" {
  interface SessionData {
    phoneNumber?: string; // ✅ Add visited property
    verified?: boolean; // ✅ Add verified property
  }
}