import type { Metadata } from "next";
import RecapView from "@/components/Recap/RecapView";
import { serverGet } from "@/lib/server";
import { current_year } from "@/lib/config";

//"/" and "/recap" were the same route in the old app and still are. The
//segment config has to be declared literally per file, so this is a copy of
//app/page.tsx rather than a re-export of it.
//prerendered html is served to every visitor and regenerated in the
//background at most once every 5 minutes. must be a literal - next parses
//this statically, it cannot follow an imported constant.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Weekly Recap | Heise Powless",
};

export default async function Page() {
  const req = await serverGet("/api/recap/latest");
  const recap = req.success ? req.payload : null;
  return (
    <RecapView
      initialRecap={recap}
      initialWeek={recap ? "" + recap.week.week : "1"}
      initialYear={recap ? "" + recap.week.year : current_year.toString()}
    />
  );
}
