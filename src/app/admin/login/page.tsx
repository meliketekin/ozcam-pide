import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { Photo } from "@/components/photo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Yönetim Girişi",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-1 items-center justify-center bg-ink-deep px-6 py-16">
      <Photo src="/images/hero-firin.jpg" alt="" sizes="100vw" className="opacity-30" />
      <div className="relative w-full max-w-sm bg-white p-10 shadow-2xl">
        <Logo className="justify-center text-ink" />
        <h1 className="mt-6 mb-8 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
          Yönetim Paneli
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
