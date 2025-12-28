"use client";

// DOCS: docs/connectome/log_panel/IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md

import { serialize_ledger_to_jsonl, serialize_ledger_to_text } from "../lib/connectome_export_jsonl_and_text_log_serializer";
import { useConnectomeStore } from "../lib/zustand_connectome_state_store_with_atomic_commit_actions";

const copy_to_clipboard = async (text: string) => {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }
};

export default function ExportButtons() {
  const ledger = useConnectomeStore((state) => state.ledger);
  const sessionId = useConnectomeStore((state) => state.session_id);

  const handleCopyJsonl = async () => {
    const jsonl = serialize_ledger_to_jsonl(ledger, sessionId);
    await copy_to_clipboard(jsonl);
  };

  const handleCopyText = async () => {
    const text = serialize_ledger_to_text(ledger, sessionId);
    await copy_to_clipboard(text);
  };

  return (
    <div className="log-export">
      <button className="btn btn-ghost" onClick={handleCopyJsonl}>
        Copy JSONL
      </button>
      <button className="btn btn-ghost" onClick={handleCopyText}>
        Copy Text
      </button>
    </div>
  );
}
