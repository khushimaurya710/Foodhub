import React, { useEffect, useState } from "react";
import axios from "axios";

const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [loadingIdentity, setLoadingIdentity] = useState(false);

  // Load Chatbase script once
  useEffect(() => {
    if (!CHATBASE_ID) return;
    if (window.chatbase) return;

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.async = true;
    script.defer = true;
    script.id = "chatbase-script";
    script.setAttribute("chatbotId", CHATBASE_ID);
    document.body.appendChild(script);

    // keep script for whole app lifetime
  }, []);

  // When panel opens, identify current signed‑in user so Chatbase can personalize
  useEffect(() => {
    if (!open) return;
    if (!CHATBASE_ID) return;

    const identifyUser = async () => {
      try {
        setLoadingIdentity(true);
        const res = await axios.get("https://foodhub-backend-yvpj.onrender.com/api/chatbot/token", {
          withCredentials: true,
        });
        const token = res.data.token;
        if (window.chatbase && token) {
          window.chatbase("identify", { token });
        }
      } catch {
        // fall back to anonymous
      } finally {
        setLoadingIdentity(false);
      }
    };

    identifyUser();
  }, [open]);

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-window">
          <header className="chatbot-header">
            <div>
              <div className="chatbot-title">FoodHub Assistant</div>
              <div className="chatbot-sub">
                {loadingIdentity
                  ? "Connecting securely…"
                  : "Online • powered by Chatbase"}
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </header>

          <div className="chatbot-body">
            <div className="chatbot-messages">
              <div className="chatbot-msg chatbot-msg-bot">
                Chatbase widget is loading. Use the chat bubble in the bottom
                right to talk with the assistant.
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "×" : "Chat"}
      </button>
    </div>
  );
}
