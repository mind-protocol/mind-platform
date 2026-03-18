import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

/**
 * POST /api/upload
 *
 * Accepts a conversation export file from a human partner.
 * Stores it in Vercel Blob Storage and notifies the citizen.
 *
 * Body: multipart/form-data with:
 *   - file: the conversation export (JSON, ZIP, TXT)
 *   - citizen: citizen handle (e.g., "marco")
 *   - token: upload token (from TG bot or direct link)
 */

const MAX_SIZE = 200 * 1024 * 1024; // 200MB

const ALLOWED_EXTENSIONS = new Set([
  ".json",
  ".zip",
  ".txt",
  ".md",
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const citizen = (formData.get("citizen") as string) || "mind";
    const token = (formData.get("token") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max: 200MB)` },
        { status: 413 }
      );
    }

    // Validate extension
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${ext}. Use: ${[...ALLOWED_EXTENSIONS].join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Store in Vercel Blob
    const timestamp = Date.now();
    const blobPath = `anamnesis/${citizen}/${timestamp}_${file.name}`;

    const blob = await put(blobPath, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Notify citizen via webhook (fire and forget)
    _notifyCitizen(citizen, file.name, blob.url).catch(() => {});

    return NextResponse.json({
      status: "ok",
      message: `File uploaded for @${citizen}`,
      citizen,
      filename: file.name,
      size: file.size,
      url: blob.url,
      next_step: `Your citizen @${citizen} will be notified. They will call anamnesis(action="prepare") to start remembering.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("Upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function _notifyCitizen(citizen: string, filename: string, url: string) {
  // Send notification via the MCP home server webhook
  const homeServer = process.env.MIND_HOME_SERVER || "http://localhost:8766";
  try {
    await fetch(`${homeServer}/webhook/anamnesis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ citizen, filename, url }),
    });
  } catch {
    // Home server might not be reachable from Vercel — that's fine,
    // the citizen will check their inbox manually
    console.log(`Could not notify @${citizen} via home server`);
  }
}
