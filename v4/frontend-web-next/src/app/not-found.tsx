import type { Metadata } from "next";
import Background from "@/components/Background/Background";

export const metadata: Metadata = {
  title: "Not Found | Heise Powless",
};

//create-react-app rendered the nav and an empty page for an unknown url;
//this keeps the same shell and says so out loud.
export default function NotFound() {
  return (
    <Background title="Not Found" noHeading={true}>
      <div className="hp-page">
        <div className="hp-empty">Nothing Here</div>
      </div>
    </Background>
  );
}
