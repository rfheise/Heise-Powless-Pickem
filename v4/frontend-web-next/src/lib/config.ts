//Shared between server and client code, so nothing in here may touch `window`.

export const API_ROUTE = "https://powless.heise.ai";
// export const API_ROUTE = "http://127.0.0.1:8000";

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
