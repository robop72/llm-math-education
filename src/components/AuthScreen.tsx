import { useState } from "react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";

type Stage = "enter-email" | "check-email";
type Mode = "signin" | "signup";

interface Props {
  initialError?: string;
}

export default function AuthScreen({ initialError = "" }: Props) {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("enter-email");
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!supabase) return;
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setStage("check-email");
    }
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center px-4 py-12",
      "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
      "dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950"
    )}>
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo + wordmark */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/voxii-logo.png"
            alt="Voxii AI"
            className="h-14 object-contain drop-shadow-sm"
          />
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
              AI-powered tutoring for your child
            </p>
          </div>
        </div>

        {/* Card */}
        <div className={cn(
          "w-full rounded-2xl p-8",
          "bg-white dark:bg-gray-900",
          "border border-gray-200 dark:border-gray-800",
          "shadow-xl shadow-indigo-100/40 dark:shadow-none"
        )}>
          {stage === "enter-email" ? (
            <div className="flex flex-col gap-5">
              {/* Sign in / Sign up toggle */}
              <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
                {(["signin", "signup"] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(""); }}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                      mode === m
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {mode === "signin" ? "Welcome back" : "Get started"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {mode === "signin"
                    ? "Sign in with your email — no password needed."
                    : "Create your parent account — we'll email you a secure link."}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="you@example.com"
                  autoFocus
                  className={cn(
                    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all",
                    "bg-gray-50 dark:bg-gray-800",
                    "border border-gray-200 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40",
                    error && "border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/40"
                  )}
                />
                {error && (
                  <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
                )}
              </div>

              <button
                onClick={handleSend}
                disabled={loading || !email.trim()}
                className={cn(
                  "w-full py-3 rounded-xl text-sm font-semibold text-white transition-all",
                  "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]",
                  "shadow-md shadow-indigo-200 dark:shadow-indigo-900/30",
                  "flex items-center justify-center gap-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                )}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending…
                  </>
                ) : mode === "signin" ? (
                  "Send sign-in link"
                ) : (
                  "Create account →"
                )}
              </button>

              {mode === "signup" && (
                <p className="text-xs text-center text-gray-400 dark:text-gray-600 leading-relaxed">
                  After clicking the link in your email you'll set up your first student profile.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center py-2">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                "bg-indigo-50 dark:bg-indigo-900/30"
              )}>
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Check your email
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We sent a sign-in link to
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {email}
                </p>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs">
                Click the link in your email to sign in. The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
              </p>

              <button
                onClick={() => { setStage("enter-email"); setEmail(""); }}
                className="text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        {/* Trust strip */}
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure sign-in
          </span>
          <span className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Parent account
          </span>
          <span className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
          <span>© Voxii AI</span>
        </div>

      </div>
    </div>
  );
}
