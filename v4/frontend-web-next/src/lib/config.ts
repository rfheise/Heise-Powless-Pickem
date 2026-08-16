//Shared between server and client code, so nothing in here may touch `window`.

//Defaults to production, so a build with no env set behaves exactly as it did
//when this was a hard-coded constant. Point it at a local django with
//NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 (see .env.local).
export const API_ROUTE =
  process.env.NEXT_PUBLIC_API_URL || "https://powless.heise.ai";

//the season the front end considers "now"
export const current_year = 2026;

//absolute url for a path on the pickem backend
export function generateLink(link: string) {
  return `${API_ROUTE}${link}`;
}

//how long a server rendered page is served from cache before next
//regenerates it in the background - every visitor gets prerendered html,
//and the backend sees at most one request per page per interval
export const REVALIDATE = 300;

export interface Request {
  success: boolean;
  payload: any;
}
