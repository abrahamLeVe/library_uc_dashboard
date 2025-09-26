
import { Suspense } from "react";
import AcmeLogo from "./ui/acme-logo";
import LoginForm from "./ui/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-md p-6 space-y-6">
        <div className="flex h-40 w-full items-end rounded-lg bg-blue-500 p-3">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
