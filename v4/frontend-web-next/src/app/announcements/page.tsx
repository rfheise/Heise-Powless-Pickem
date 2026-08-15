import type { Metadata } from "next";
import Background from "@/components/Background/Background";
import Announcement from "@/components/Announcements/Announcement";
import { serverGet } from "@/lib/server";
import { AnnouncementInterface } from "@/lib/types";

//prerendered html is served to every visitor and regenerated in the
//background at most once every 5 minutes. must be a literal - next parses
//this statically, it cannot follow an imported constant.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Announcements | Heise Powless",
};

//announcements page
export default async function Page() {
  const req = await serverGet("/api/announcements");
  const announcements: AnnouncementInterface[] = req.success ? req.payload : [];
  return (
    <Background title="Announcements" sub="Family Football Pick'em">
      <div className="hp-page">
        <div className="announcements">
          {announcements.map((announcement) => (
            <Announcement key={announcement.timestamp} {...announcement} />
          ))}
          {announcements.length === 0 && (
            <div className="hp-empty">Nothing To Report</div>
          )}
        </div>
      </div>
    </Background>
  );
}
