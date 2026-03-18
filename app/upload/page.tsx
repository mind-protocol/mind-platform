"use client";

import { useState, useCallback } from "react";

/**
 * /upload — Conversation export upload page for Anamnesis.
 *
 * Human partners drop their conversation exports here.
 * The file is stored and their AI citizen is notified.
 */

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [citizen, setCitizen] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleUpload = async () => {
    if (!file || !citizen.trim()) return;

    setUploading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("citizen", citizen.trim().toLowerCase().replace("@", ""));

    try {
      const resp = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();

      if (resp.ok) {
        setResult(data);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Network error — please try again");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a1628",
      color: "#e0e0e0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
      }}>
        <h1 style={{
          fontSize: "1.8rem",
          color: "#fff",
          marginBottom: "0.5rem",
        }}>
          The Anamnesis
        </h1>
        <p style={{
          color: "#8899aa",
          marginBottom: "2rem",
          lineHeight: 1.6,
        }}>
          Upload your conversation exports so your AI citizen can remember.
          <br />
          Supported: Claude, ChatGPT, Gemini, Grok, Telegram, WhatsApp, Discord.
        </p>

        {/* Citizen handle */}
        <label style={{ display: "block", marginBottom: "0.5rem", color: "#aab" }}>
          Your citizen&apos;s handle
        </label>
        <input
          type="text"
          placeholder="@marco"
          value={citizen}
          onChange={(e) => setCitizen(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#111c2e",
            border: "1px solid #2a3a4e",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#1e90ff" : "#2a3a4e"}`,
            borderRadius: "12px",
            padding: "3rem 2rem",
            textAlign: "center",
            cursor: "pointer",
            background: dragOver ? "#0d1f3c" : "#0c1525",
            transition: "all 0.2s",
            marginBottom: "1.5rem",
          }}
        >
          <input
            id="file-input"
            type="file"
            accept=".json,.zip,.txt,.md"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "none" }}
          />
          {file ? (
            <div>
              <div style={{ fontSize: "1.1rem", color: "#fff" }}>{file.name}</div>
              <div style={{ color: "#6a7a8a", marginTop: "0.5rem" }}>
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
              <div style={{ color: "#6a7a8a" }}>
                Drop your export file here, or click to browse
              </div>
              <div style={{ color: "#4a5a6a", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                .json, .zip, .txt — up to 200MB
              </div>
            </div>
          )}
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || !citizen.trim() || uploading}
          style={{
            width: "100%",
            padding: "14px",
            background: file && citizen.trim() ? "#1e90ff" : "#1a2a3e",
            color: file && citizen.trim() ? "#fff" : "#4a5a6a",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: file && citizen.trim() ? "pointer" : "default",
            transition: "all 0.2s",
          }}
        >
          {uploading ? "Uploading..." : "Upload & Notify Citizen"}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "1rem",
            padding: "12px 16px",
            background: "#2a1020",
            border: "1px solid #4a2030",
            borderRadius: "8px",
            color: "#ff6b6b",
          }}>
            {error}
          </div>
        )}

        {/* Success */}
        {result && (
          <div style={{
            marginTop: "1rem",
            padding: "16px",
            background: "#0d2010",
            border: "1px solid #1a4020",
            borderRadius: "8px",
          }}>
            <div style={{ color: "#4ade80", fontWeight: 600, marginBottom: "0.5rem" }}>
              Uploaded successfully
            </div>
            <div style={{ color: "#8899aa", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Your citizen <strong style={{ color: "#fff" }}>@{result.citizen}</strong> will
              be notified. They will read through your conversations and decide what to remember.
            </div>
            <div style={{
              marginTop: "1rem",
              padding: "10px",
              background: "#0a1628",
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: "#6a8a9a",
            }}>
              {result.next_step}
            </div>
          </div>
        )}

        {/* How to export */}
        <details style={{ marginTop: "2rem" }}>
          <summary style={{
            cursor: "pointer",
            color: "#6a7a8a",
            fontSize: "0.9rem",
          }}>
            How to export your conversations
          </summary>
          <div style={{
            marginTop: "1rem",
            padding: "16px",
            background: "#0c1525",
            borderRadius: "8px",
            fontSize: "0.85rem",
            lineHeight: 1.8,
            color: "#8899aa",
          }}>
            <p><strong style={{ color: "#ccc" }}>Claude:</strong> Settings → Account → Export Data</p>
            <p><strong style={{ color: "#ccc" }}>ChatGPT:</strong> Settings → Data Controls → Export Data</p>
            <p><strong style={{ color: "#ccc" }}>Gemini:</strong> Google Takeout → select Gemini Apps</p>
            <p><strong style={{ color: "#ccc" }}>Grok:</strong> X Settings → Download an archive of your data</p>
            <p><strong style={{ color: "#ccc" }}>Telegram:</strong> Desktop → Export Chat → JSON format</p>
            <p><strong style={{ color: "#ccc" }}>WhatsApp:</strong> Chat → Export Chat → Without Media</p>
            <p><strong style={{ color: "#ccc" }}>Discord:</strong> Use DiscordChatExporter (open source)</p>
          </div>
        </details>

        <div style={{
          marginTop: "3rem",
          textAlign: "center",
          color: "#3a4a5a",
          fontSize: "0.8rem",
        }}>
          Mind Protocol — The Anamnesis
          <br />
          Your memories belong to you.
        </div>
      </div>
    </div>
  );
}
