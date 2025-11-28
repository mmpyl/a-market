"use client";

import { useEffect, useState, useCallback } from "react";

interface ErrorDetails {
  message: string;
  stack?: string;
  name: string;
  url: string;
  timestamp: string;
  digest?: string;
}

interface ErrorProps {
  error: Error & { digest?: string };
  reset?: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const details: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      digest: error.digest,
    };

    setErrorDetails(details);

    // Log error para debugging
    console.error("[Error Page]", details);
  }, [error]);

  const handleCopyError = useCallback(async () => {
    if (!errorDetails) return;

    const errorText = JSON.stringify(errorDetails, null, 2);
    
    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error:", err);
    }
  }, [errorDetails]);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleGoHome = useCallback(() => {
    window.location.href = "/";
  }, []);

  const handleFixError = useCallback(() => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "IFRAME_ERROR",
          payload: errorDetails,
        },
        "*"
      );
    }
  }, [errorDetails]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl w-full space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600 dark:text-red-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Algo salió mal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ha ocurrido un error inesperado. Intenta recargar la página o volver al inicio.
          </p>
        </div>

        {/* Error Message */}
        {errorDetails && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {errorDetails.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {errorDetails.message}
                </p>
              </div>
              <button
                onClick={handleCopyError}
                className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Copiar detalles del error"
              >
                {copied ? "✓ Copiado" : "Copiar"}
              </button>
            </div>

            {errorDetails.digest && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Error ID: {errorDetails.digest}
              </p>
            )}

            {process.env.NODE_ENV === "development" && errorDetails.stack && (
              <details className="mt-3">
                <summary className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white">
                  Ver stack trace
                </summary>
                <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  {errorDetails.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {reset && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Intentar de nuevo
            </button>
          )}
          
          <button
            onClick={handleReload}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Recargar página
          </button>

          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Ir al inicio
          </button>
        </div>

        {/* Dev Only - Fix Error Button */}
        {process.env.NODE_ENV === "development" && (
          <div className="flex justify-center">
            <button
              onClick={handleFixError}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              🔧 Fix Error (Dev Only)
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-500">
          <p>Si el problema persiste, contacta con soporte técnico</p>
          {errorDetails && (
            <p className="mt-1">
              Timestamp: {new Date(errorDetails.timestamp).toLocaleString("es-PE")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
