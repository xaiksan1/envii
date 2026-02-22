import {
  Shield,
  Key,
  Cloud,
  Fingerprint,
  FolderSync,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Your secrets are encrypted locally with AES-256-GCM before leaving your machine. The server never sees your plaintext data.",
  },
  {
    icon: Key,
    title: "Recovery Phrase Only",
    description:
      "No accounts, emails, or passwords. Just a 12-word BIP-39 phrase that you control. Lose the phrase? We can't help — by design.",
  },
  {
    icon: Cloud,
    title: "Cloud-First",
    description:
      "Access your environment files from anywhere. Perfect for setting up new machines or switching between devices.",
  },
  {
    icon: Fingerprint,
    title: "Smart Matching",
    description:
      "Projects are matched across machines using git remote URLs, package names, or folder names. Restore finds the right files automatically.",
  },
  {
    icon: FolderSync,
    title: "Full Project Restore",
    description:
      "Restore complete project environments including nested .env files in monorepos. One command brings back everything.",
  },
  {
    icon: Shield,
    title: "Zero Knowledge",
    description:
      "The server stores only encrypted blobs. No metadata about your projects, no file names, no directory structure visible to anyone but you.",
  },
];

export function Features() {
  return (
    <section className="relative py-24 border-t border-zinc-800">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Built for developers who care about security
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Envii is designed with privacy and simplicity at its core. No
            compromises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative p-6 bg-zinc-950 hover:bg-zinc-900/80 transition-colors group"
            >
              <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-transparent group-hover:border-emerald-500/50 transition-colors" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-transparent group-hover:border-emerald-500/50 transition-colors" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 border border-zinc-700 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs text-zinc-600 font-mono">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
