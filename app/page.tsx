import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();

  // Already logged in? Go straight to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            PitchPerfect
          </h1>
          <span className="text-xs text-gray-400">AI Sales Roleplay</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-lg text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Practice Sales.
            <br />
            <span className="text-blue-600">Get Scored. Close More.</span>
          </h2>
          <p className="text-gray-500 mt-4 text-base sm:text-lg leading-relaxed">
            AI prospects that respond in-character based on real buyer personas.
            Instant feedback on opener quality, qualification, objection
            handling, and closing technique.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              3 difficulty levels
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI-generated prospects
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Instant scorecard
            </span>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <button className="w-full sm:w-auto bg-white border border-gray-300 text-gray-900 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </form>
            <form
              action={async () => {
                "use server";
                await signIn("guest", { redirectTo: "/dashboard" });
              }}
            >
              <button className="w-full sm:w-auto bg-gray-100 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Continue as Guest
              </button>
            </form>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            No account needed to view shared sessions. Sign in to practice.
          </p>
        </div>

        <div className="mt-16 w-full max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-700 font-bold text-sm">1</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Create Scenario</h3>
              <p className="text-xs text-gray-500 mt-1">Describe your target prospect and set the difficulty</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-700 font-bold text-sm">2</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Practice Conversation</h3>
              <p className="text-xs text-gray-500 mt-1">Roleplay as the SDR against an AI prospect</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-700 font-bold text-sm">3</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Get Scored</h3>
              <p className="text-xs text-gray-500 mt-1">Receive detailed feedback and track your progress</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-4">
        <p className="text-xs text-gray-400 text-center">
          PitchPerfect — AI Sales Roleplay Training
        </p>
      </footer>
    </div>
  );
}
