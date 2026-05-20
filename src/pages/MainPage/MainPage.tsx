import { PitchInteractiveLogo, RorrLogo } from '../../components/Logos'

interface MainPageProps {
  onLogin: () => void
  onLeague: () => void
}

export function MainPage({ onLogin, onLeague }: MainPageProps) {
  return (
    <div className="flex min-h-full flex-col bg-brand-bg">
      <header className="flex items-center justify-between px-6 py-5 opacity-[0.66] sm:px-10">
        <RorrLogo className="text-xl" />
      </header>

      <main className="flex flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
        <section className="flex w-full flex-col rounded-2xl bg-brand-card px-6 py-10 sm:px-10">
          <h1 className="text-center text-[24px] font-semibold leading-tight text-brand-ink">
            Welcome to RORR
          </h1>
          <p className="mt-3 text-center text-[14px] font-light text-brand-ink/70">
            Back your favorite leagues and play along
          </p>

          <div className="mt-12 flex flex-1 flex-col items-center justify-center gap-4">
            <button
              type="button"
              onClick={onLogin}
              className="h-[48px] w-full max-w-[280px] rounded-[30px] bg-[#969cda] text-[16px] font-semibold text-white shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#afb5ea] active:bg-[#7e85c9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda] focus-visible:ring-offset-2"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onLeague}
              className="h-[48px] w-full max-w-[280px] rounded-[30px] border border-[#969cda] bg-white text-[16px] font-semibold text-[#46383a] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#f5f6ff] active:bg-[#eceeff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda] focus-visible:ring-offset-2"
            >
              League
            </button>
          </div>

          <footer className="mt-8 flex flex-col items-center gap-3">
            <PitchInteractiveLogo />
            <p className="text-[12px] font-normal text-brand-ink/60">
              ⓒPitch Interactive Co.,LTD. All rights reserved
            </p>
          </footer>
        </section>
      </main>
    </div>
  )
}
