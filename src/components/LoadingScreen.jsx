/**
 * LoadingScreen — Full-page loading state shown while
 * Firebase resolves the auth state on initial load.
 */
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0b0f1a]">
      {/* Gradient mesh background */}
      <div className="gradient-mesh" />

      {/* Logo mark */}
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 4L6 9V17C6 22.55 10.16 27.74 16 29C21.84 27.74 26 22.55 26 17V9L16 4Z"
              fill="white"
              fillOpacity="0.15"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M12 16L14.5 18.5L20 13"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-xl opacity-40 -z-10" />
      </div>

      {/* Spinner */}
      <div className="flex items-center gap-3">
        <div className="spinner" />
        <span className="text-slate-400 text-sm font-medium tracking-wide">
          Verifying session…
        </span>
      </div>
    </div>
  )
}
