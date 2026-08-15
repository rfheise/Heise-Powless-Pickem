import "server-only";
import { API_ROUTE, REVALIDATE, Request } from "./config";

//Server side read of a public (unauthenticated) endpoint.
//
//These are the same GET routes the browser used to call on mount. Fetching
//them here means the html the visitor receives already has the data in it,
//and the result is cached for REVALIDATE seconds so the backend is not hit
//once per visitor.
export async function serverGet(
  route: string,
  data: Record<string, string> = {},
): Promise<Request> {
  let query = "";
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    query += (i === 0 ? "?" : "&") + `${keys[i]}=${data[keys[i]]}`;
  }
  try {
    const req = await fetch(`${API_ROUTE}${route}${query}`, {
      method: "get",
      next: { revalidate: REVALIDATE },
    });
    if (!req.ok) {
      return { success: false, payload: "An Error Occured" };
    }
    return (await req.json()) as Request;
  } catch {
    //a backend hiccup must not take the page down - the client component
    //falls back to its own fetch exactly like it does today
    return { success: false, payload: "An Error Occured" };
  }
}
