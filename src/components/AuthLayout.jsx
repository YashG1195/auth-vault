export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="gradient-mesh" />

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo + Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 blur-xl opacity-40 -z-10" />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            Auth<span className="gradient-text">Vault</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-medium tracking-wide uppercase">
            Secure · Private · Fast
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-7 flex flex-col gap-5">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>

          {children}
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          Protected by Firebase Authentication &mdash; AuthVault &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
