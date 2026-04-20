import { useState, useEffect } from "react";
import { fetchAutomations, type AutomationAction } from "@/api/workflowApi";

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAutomations()
      .then((data) => {
        if (!cancelled) {
          setAutomations(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to fetch automations:", err);
          setError("Could not connect to backend");
          // Fallback mock data
          setAutomations([
            { id: "send_email", label: "Send Email", params: ["to", "subject", "body"] },
            { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
            { id: "notify_slack", label: "Notify Slack Channel", params: ["channel", "message"] },
          ]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { automations, loading, error };
}
