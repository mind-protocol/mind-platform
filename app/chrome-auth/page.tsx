"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type AuthStatus = "waiting" | "sending" | "success" | "error" | "no-extension" | "no-token";

function ChromeAuthInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<AuthStatus>(token ? "waiting" : "no-token");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    // Send the token to the MIND Chrome extension via postMessage.
    // The extension's content script listens for MIND_TELEGRAM_AUTH_COMPLETE.
    const sendToExtension = () => {
      setStatus("sending");
      window.postMessage(
        { type: "MIND_TELEGRAM_AUTH_COMPLETE", token },
        window.location.origin
      );
    };

    // Listen for the extension's acknowledgment
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.type !== "MIND_EXTENSION_AUTH_RECEIVED") return;

      if (event.data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(event.data.error || "Extension rejected the auth request");
      }
    };

    window.addEventListener("message", handleMessage);

    // Give the content script time to inject, then send
    const timer = setTimeout(sendToExtension, 500);

    // If no response after 5 seconds, the extension is probably not installed
    const timeout = setTimeout(() => {
      setStatus((prev) => (prev === "sending" ? "no-extension" : prev));
    }, 5000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timer);
      clearTimeout(timeout);
    };
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>MIND</h1>
        <p style={styles.subtitle}>Chrome Extension Auth</p>

        {status === "no-token" && (
          <div style={styles.message}>
            <p style={styles.errorText}>No token found.</p>
            <p style={styles.hint}>
              Use the <code>/chrome</code> command in the{" "}
              <a href="https://t.me/MIND_protocol_bot" style={styles.link}>
                Telegram bot
              </a>{" "}
              to get an auth link.
            </p>
          </div>
        )}

        {status === "waiting" && (
          <div style={styles.message}>
            <div style={styles.spinner} />
            <p style={styles.statusText}>Preparing...</p>
          </div>
        )}

        {status === "sending" && (
          <div style={styles.message}>
            <div style={styles.spinner} />
            <p style={styles.statusText}>Connecting to MIND extension...</p>
            <p style={styles.hint}>Make sure the MIND extension is installed in Chrome.</p>
          </div>
        )}

        {status === "success" && (
          <div style={styles.message}>
            <p style={styles.successText}>Connected!</p>
            <p style={styles.hint}>
              Your Chrome extension is now linked. You can close this tab.
            </p>
          </div>
        )}

        {status === "error" && (
          <div style={styles.message}>
            <p style={styles.errorText}>Connection failed</p>
            <p style={styles.hint}>{error}</p>
            <p style={styles.hint}>
              Try again with a new <code>/chrome</code> command.
            </p>
          </div>
        )}

        {status === "no-extension" && (
          <div style={styles.message}>
            <p style={styles.errorText}>Extension not detected</p>
            <p style={styles.hint}>
              The MIND Chrome extension doesn&apos;t seem to be installed.
              Install it first, then try again with <code>/chrome</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChromeAuthPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>MIND</h1>
            <div style={styles.spinner} />
          </div>
        </div>
      }
    >
      <ChromeAuthInner />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a1a",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#e0e0e0",
    padding: "20px",
  },
  card: {
    background: "#1a1a2e",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center" as const,
    maxWidth: "400px",
    width: "100%",
    border: "1px solid #2a2a4a",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "3px",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "32px",
  },
  message: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "12px",
  },
  statusText: {
    fontSize: "16px",
    color: "#ccc",
  },
  successText: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#4caf50",
  },
  errorText: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#ef5350",
  },
  hint: {
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.5",
  },
  link: {
    color: "#4a4aff",
    textDecoration: "none",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #2a2a4a",
    borderTopColor: "#4a4aff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
