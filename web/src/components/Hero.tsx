export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />

      <div className="absolute top-0 left-1/4 w-px h-48 bg-gradient-to-b from-emerald-500/50 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-32 bg-gradient-to-b from-emerald-500/30 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-zinc-700 bg-zinc-900/80 text-sm text-zinc-300">
            <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
            Open Source CLI Tool
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-center tracking-tight">
          <span className="text-white">Backup your </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            .env files
          </span>
          <br />
          <span className="text-white">across machines</span>
        </h1>

        <p className="mt-6 text-xl text-zinc-400 text-center max-w-2xl mx-auto leading-relaxed">
          End-to-end encrypted backup and restore for your environment
          variables. No accounts. No passwords. Just your 12-word recovery
          phrase.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#installation"
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold transition-colors"
          >
            Get Started
          </a>
          <a
            href="https://github.com/akinloluwami/envii"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-3 font-medium transition-all overflow-hidden border border-yellow-500/50 hover:border-yellow-400 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20"
          >
            <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,215,0,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
            <span className="relative flex items-center gap-2 text-yellow-400 group-hover:text-yellow-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
              </svg>
              Star on GitHub
            </span>
          </a>
        </div>

        <div className="mt-16 max-w-3xl mx-auto relative">
          <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-emerald-500/50" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-emerald-500/50" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-emerald-500/50" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-emerald-500/50" />

          <div className="border border-zinc-800 bg-zinc-900/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/50 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-zinc-600" />
                  <div className="w-3 h-3 bg-zinc-600" />
                  <div className="w-3 h-3 bg-zinc-600" />
                </div>
                <span className="text-sm text-zinc-500 font-mono">
                  terminal
                </span>
              </div>
              <div className="w-4 h-4 border border-zinc-600 flex items-center justify-center">
                <div className="w-2 h-2 border border-zinc-500" />
              </div>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div className="text-zinc-500"># Install envii globally</div>
              <div className="text-zinc-100">
                <span className="text-emerald-400">$</span> npm install -g
                envii-cli
              </div>
              <div className="mt-4 text-zinc-500">
                # Initialize with a recovery phrase
              </div>
              <div className="text-zinc-100">
                <span className="text-emerald-400">$</span> envii init
              </div>
              <div className="mt-4 text-zinc-500">
                # Backup all .env files in your projects
              </div>
              <div className="text-zinc-100">
                <span className="text-emerald-400">$</span> envii backup
              </div>
              <div className="text-emerald-400 mt-2">
                ✓ Found 12 projects with 28 env files
                <br />✓ Backup complete: bkp_8f07d168dd44
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
