import { signIn, auth, POST_LOGIN_REDIRECT } from "@/auth";
import { redirect } from "next/navigation";

type SearchParams = { callbackUrl?: string; error?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const redirectTo = callbackUrl || POST_LOGIN_REDIRECT;

  if (session?.user) {
    redirect(redirectTo);
  }

  return (
    <main className="page">
      <div className="card">
        <h1>로그인</h1>
        <p>GitHub 계정으로 계속하려면 아래 버튼을 클릭하세요.</p>

        {error && (
          <p style={{ color: "#ff7a7a" }}>
            로그인 중 문제가 발생했습니다. 다시 시도해주세요.
          </p>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo });
          }}
        >
          <div className="actions">
            <button type="submit" className="btn">
              <svg
                aria-hidden="true"
                height="20"
                viewBox="0 0 16 16"
                width="20"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub으로 로그인
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
