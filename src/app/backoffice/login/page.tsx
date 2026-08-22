import Image from "next/image";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function BackofficeLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 px-4">
      <Image
        src="/logo.png"
        alt="Pasame un Mate"
        width={485}
        height={717}
        priority
        className="h-auto w-40"
      />
      <LoginForm />
    </div>
  );
}
