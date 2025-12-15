"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";


enum ModeEnum {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET = "RESET",
}

// Loading fallback component
function LoginPageSkeleton() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-700 rounded-lg w-3/4 mx-auto" />
          <div className="h-10 bg-gray-700 rounded-lg" />
          <div className="h-10 bg-gray-700 rounded-lg" />
          <div className="h-10 bg-gray-700 rounded-lg w-1/2" />
        </div>
      </div>
    </div>
  );
}

function LoginPageContent() {
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.LOGIN);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Memoizar handlers - AuthProvider ahora maneja la redirección
  const handleSuccess = useCallback(() => {
    // La redirección ahora se maneja en AuthProvider después del login exitoso
    console.log('[LoginPage] Login successful, AuthProvider will handle redirect');
  }, []);

  const handleRegisterSuccess = useCallback(() => {
    setMode(ModeEnum.LOGIN);
  }, []);

  const switchMode = useCallback((newMode: ModeEnum) => {
    setMode(newMode);
  }, []);

  const handleForgotPassword = useCallback(() => {
    setMode(ModeEnum.RESET);
  }, []);

  const handleResetSuccess = useCallback(() => {
    setMode(ModeEnum.LOGIN);
  }, []);

  const handleBackToLogin = useCallback(() => {
    setMode(ModeEnum.LOGIN);
  }, []);
  return (
    <div className={`relative flex justify-center items-center min-h-screen overflow-hidden `}>
      {/* Grid pattern overlay */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 opacity-[0.06] `}
      />

      {/* Gradient orbs */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-24 -left-24 h-[42rem] w-[42rem] rounded-full blur-3xl opacity-0 animate-fade-in `}
      />
      
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-32 -right-24 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-0 animate-fade-in `}
      />
      
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-0 animate-fade-in `}
      />
      

      {/* Form container with fade transition */}
      <div className="relative z-10 w-full max-w-md px-4">
        {mode === ModeEnum.LOGIN && (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => switchMode(ModeEnum.REGISTER)}
            onForgotPassword={handleForgotPassword}
          />
        )}
        
        {mode === ModeEnum.REGISTER && (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => switchMode(ModeEnum.LOGIN)}
          />
        )}
        
        {mode === ModeEnum.RESET && (
          <ResetPasswordForm
            onBack={handleBackToLogin}
            onSuccess={handleResetSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginPageContent />
    </Suspense>
  );
}


