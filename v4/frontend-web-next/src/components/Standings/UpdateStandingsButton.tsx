"use client";

import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { revalidateStandings } from "@/app/actions";

export default function UpdateStandingsButton() {
  const router = useRouter();
  return (
    <div
      className="clicker"
      onClick={async () => {
        //updates standings by querying server
        let api = new API("/api/update_standings", "get");
        let req = await api.query({});
        if (req.success) {
          //bin the prerendered copy, then pull the fresh one
          await revalidateStandings();
          router.refresh();
        }
      }}
    >
      <div className="hp-btn standing-button">Update Standings</div>
    </div>
  );
}
