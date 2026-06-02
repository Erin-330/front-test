import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signOut, LOGIN_ROUTE } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect(LOGIN_ROUTE);
  }

  const { name, email, image } = session.user;
  const login = (session.user as { login?: string }).login;

  return (
    <main className="page">
      <div className="card">
        <div className="profile-header">
          {image && (
            <Image
              src={image}
              alt={name ? `${name} 아바타` : "사용자 아바타"}
              width={80}
              height={80}
              className="avatar"
            />
          )}
          <div>
            <h1 style={{ margin: 0 }}>{name || "이름 없음"}</h1>
            {login && (
              <p style={{ margin: "4px 0 0", color: "#8b93b0" }}>@{login}</p>
            )}
          </div>
        </div>

        <div>
          <div className="field">
            <span className="field-label">이름</span>
            <span>{name || "-"}</span>
          </div>
          <div className="field">
            <span className="field-label">이메일</span>
            <span>{email || "-"}</span>
          </div>
          {login && (
            <div className="field">
              <span className="field-label">GitHub 아이디</span>
              <span>@{login}</span>
            </div>
          )}
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <div className="actions">
            <button type="submit" className="btn btn-secondary">
              로그아웃
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
