import { redirect } from "next/navigation";

export default function ProposalRoot() {
  // Redirect /proposal to home or dashboard if needed
  redirect("/");
  return null;
}
