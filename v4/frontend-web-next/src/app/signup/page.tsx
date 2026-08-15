import type { Metadata } from "next";
import SignUp from "@/components/Account/SignUp";

export const metadata: Metadata = {
  title: "Sign Up | Heise Powless",
};

export default function Page() {
  return <SignUp />;
}
