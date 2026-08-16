import Logout from "@/components/Account/Logout";

//No metadata on purpose. The old logout route renders a bare <div> with no
//Background, so it never touches document.title and the tab keeps saying
//"Heise Powless Pickem" - which is what the root layout title gives us here.

export default function Page() {
  return <Logout />;
}
