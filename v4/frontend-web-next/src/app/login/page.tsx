import type { Metadata } from "next";
import Login from "@/components/Account/Login";

export const metadata: Metadata = {
  title: "Login | Heise Powless",
};

export default function Page() {
  return <Login />;
}
