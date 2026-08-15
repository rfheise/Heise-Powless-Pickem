"use server";

import { revalidatePath } from "next/cache";

//Drops the cached standings pages.
//
//"Update Standings" asks the backend to recompute, then used to reload the
//page to see the result. Now that the page is prerendered and held for
//REVALIDATE seconds, a plain reload would hand back the stale copy - so the
//cache entries have to be thrown away first.
export async function revalidateStandings() {
  revalidatePath("/standings");
  revalidatePath("/hall_of_shame");
}
