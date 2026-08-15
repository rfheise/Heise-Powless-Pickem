import type { Metadata } from "next";
import Background from "@/components/Background/Background";
import HofBox from "@/components/HallOfFame/HofBox";
import { serverGet } from "@/lib/server";
import { Hof } from "@/lib/types";

//prerendered html is served to every visitor and regenerated in the
//background at most once every 5 minutes. must be a literal - next parses
//this statically, it cannot follow an imported constant.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Hall of Fame | Heise Powless",
};

export default async function Page() {
  const req = await serverGet("/api/hof");
  const hofs: Hof[] = req.success ? req.payload : [];
  let id = 0;
  return (
    <Background title="Hall of Fame" sub="Every champion, every season">
      <div className="hp-page">
        {hofs.length > 0 && (
          <div className="hp-list">
            <div className="hp-list-head">
              <span>Champions</span>
              <span>{`${hofs.length} ${hofs.length === 1 ? "banner" : "banners"}`}</span>
            </div>
            {hofs.map((hof) => (
              <HofBox key={id++} {...hof} />
            ))}
          </div>
        )}
        {hofs.length === 0 && <div className="hp-empty">No Champions Yet</div>}
      </div>
    </Background>
  );
}
