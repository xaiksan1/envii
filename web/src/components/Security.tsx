import { Check, X } from "lucide-react";

export function Security() {
  return (
    <section className="relative py-24 border-t border-zinc-800 bg-zinc-900/30">
      <div className="absolute left-0 right-0 top-24 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      <div className="absolute left-0 right-0 bottom-24 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Security by design
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Your environment variables contain sensitive data. Envii is built
            with that in mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-zinc-700">
          <div className="relative bg-zinc-950 p-6 border-l-2 border-l-emerald-500">
            <div className="absolute -top-px -right-px w-4 h-4 border-r border-t border-emerald-500/50" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border border-emerald-500/50 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-400">
                What's Protected
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                "Recovery phrase never leaves your device",
                "Encryption keys derived locally",
                "Server never sees plaintext content",
                "All backups encrypted with AES-256-GCM",
                "Each backup has a unique random IV",
                "Authentication tags prevent tampering",
                "Salt embedded in backup for portability",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative bg-zinc-950 p-6 border-l-2 border-l-zinc-600">
            <div className="absolute -top-px -right-px w-4 h-4 border-r border-t border-zinc-600/50" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border border-zinc-600 flex items-center justify-center">
                <X className="w-4 h-4 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-300">
                What's NOT Protected
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                "Client-side malware on your device",
                "Recovery phrase if you share or lose it",
                "Physical access to an unlocked device",
                "Screenshots or copy-paste of phrase",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-zinc-400">
                  <X className="w-4 h-4 text-zinc-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mt-12 border border-zinc-800 bg-zinc-950">
          <div className="absolute -top-px -left-px w-4 h-4 border-l border-t border-emerald-500/50" />
          <div className="absolute -top-px -right-px w-4 h-4 border-r border-t border-emerald-500/50" />
          <div className="absolute -bottom-px -left-px w-4 h-4 border-l border-b border-emerald-500/50" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-r border-b border-emerald-500/50" />

          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900">
            <h3 className="text-lg font-semibold text-white font-mono">
              Technical Details
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-950 p-4">
              <div className="text-xs text-zinc-600 mb-1 font-mono uppercase tracking-wider">
                Encryption
              </div>
              <div className="text-zinc-200 font-mono">AES-256-GCM</div>
            </div>
            <div className="bg-zinc-950 p-4">
              <div className="text-xs text-zinc-600 mb-1 font-mono uppercase tracking-wider">
                Key Derivation
              </div>
              <div className="text-zinc-200 font-mono">PBKDF2-SHA256</div>
            </div>
            <div className="bg-zinc-950 p-4">
              <div className="text-xs text-zinc-600 mb-1 font-mono uppercase tracking-wider">
                KDF Iterations
              </div>
              <div className="text-zinc-200 font-mono">600,000</div>
            </div>
            <div className="bg-zinc-950 p-4">
              <div className="text-xs text-zinc-600 mb-1 font-mono uppercase tracking-wider">
                Recovery Phrase
              </div>
              <div className="text-zinc-200 font-mono">BIP-39 (12 words)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
