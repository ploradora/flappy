import { redirect } from "next/navigation";

export default function CatchAllRoute() {
  redirect("/overview");
}
