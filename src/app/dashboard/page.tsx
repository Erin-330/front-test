import { redirect } from "next/navigation";
import { POST_LOGIN_REDIRECT } from "@/auth";

export default function DashboardPage() {
  redirect(POST_LOGIN_REDIRECT);
}
