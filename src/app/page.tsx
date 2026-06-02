import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, POST_LOGIN_REDIRECT } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect(POST_LOGIN_REDIRECT);
  }

  return (
    <main className="page">
      <div className="card">
        <h1>환영합니다</h1>
        <p>GitHub 계정으로 로그인하면 프로필 페이지로 이동합니다.</p>
        <div className="actions">
          <Link href="/login" className="btn">
            로그인하기
          </Link>
        </div>
      </div>
    </main>
  );
}
