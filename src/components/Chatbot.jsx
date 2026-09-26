import React, { useState, useEffect, useRef } from "react";
import chatbotData from "../data/chatbot-data.json";

const DEFAULT_SUGGESTIONS = [
  "Find markets near me",
  "What produce is in season?",
  "Show vegetable markets",
  "Which markets are open today?",
  "Find fruit markets",
  "Which markets sell organic produce?",
  "How do I bookmark a market?",
  "How do I leave feedback?",
  "What is FreshFind?"
];

const STOPWORDS = [
  "a", "an", "the", "is", "are", "do", "does", "i", "to", "of", "for",
  "on", "in", "and", "can", "how", "what", "where", "my", "me", "show", "tell", "which"
];

function keywordsOf(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.includes(w));
}

function getCurrentTime() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const mStr = m < 10 ? "0" + m : m;
  return `${h}:${mStr} ${ampm}`;
}

const FALLBACK_REPLY =
  "I'm still learning! You can browse the Market Directory, check the Produce Guide, or ask about specific days, locations, or produce.";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text:
        "Hello! I'm your FreshFind Assistant. Looking for markets, seasonal produce, hours, or bookmarks? Tap a quick question below or ask me anything!",
      time: getCurrentTime()
    }
  ]);

  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const getBotReply = (text) => {
    const chatQA = chatbotData || [];
    const normalized = text.trim().toLowerCase();

    // 1. Direct match check
    for (let i = 0; i < chatQA.length; i++) {
      if (chatQA[i].question.toLowerCase() === normalized) {
        return chatQA[i].answer;
      }
    }

    // 2. Special quick intents
    if (normalized.includes("near") || normalized.includes("location") || normalized.includes("close")) {
      return "You can check the dynamic Nearby Market section on our home page by enabling geolocation, or search by neighborhood on the Market Directory!";
    }
    if (normalized.includes("vegetable")) {
      return "Clifton Weekend Market, DHA Farmers Market, Gulshan Fresh Street, and Malir Farmers Market have great selections of fresh vegetables!";
    }
    if (normalized.includes("fruit")) {
      return "Bahadurabad Green Market and Tariq Road Fresh Mart offer excellent fresh fruits like mangoes, bananas, and citrus.";
    }
    if (normalized.includes("season") || normalized.includes("produce")) {
      return "Check our Produce Guide! In cool season look for spinach and mint; late spring-summer brings sweet mangoes; tomatoes and yogurt are available year-round.";
    }
    if (normalized.includes("open") || normalized.includes("today") || normalized.includes("day")) {
      return "Markets operate on specific schedules! For example, Clifton is open Saturday & Sunday (08:00 AM – 03:00 PM), Bahadurabad is open Wed & Sat, and Gulshan is open Tue, Thu & Sat.";
    }

    // 3. Keyword scoring match
    const messageWords = keywordsOf(text);
    if (!messageWords.length) return FALLBACK_REPLY;

    let bestMatch = null;
    let bestScore = 0;

    chatQA.forEach((qa) => {
      const questionWords = keywordsOf(qa.question);
      let score = 0;
      messageWords.forEach((word) => {
        if (questionWords.includes(word)) score += 2;
        else if (qa.answer.toLowerCase().includes(word)) score += 1;
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = qa;
      }
    });

    return bestScore > 0 && bestMatch ? bestMatch.answer : FALLBACK_REPLY;
  };

  const handleSendMessage = (messageText) => {
    const trimmed = (messageText || "").trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      time: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = getBotReply(trimmed);
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: reply,
        time: getCurrentTime()
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  return (
    <div id="freshfind-chatbot-root">
      {/* Chat Launcher Button */}
      <button
        className={`chat-launcher ${isOpen ? "active" : ""}`}
        aria-label="Open FreshFind Chat Assistant"
        title="Open FreshFind Assistant"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bi bi-chat-dots-fill"></i>
        <span className="chat-launcher-badge"></span>
      </button>

      {/* Chat Panel */}
      <div
        className={`chat-panel shadow-lg ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-labelledby="chatHeadTitle"
        aria-hidden={!isOpen}
      >
        <div className="chat-head d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="chat-avatar">
              <i className="bi bi-robot"></i>
              <span className="chat-status-dot" title="Online"></span>
            </div>
            <div>
              <h6 className="mb-0 fw-bold text-white" id="chatHeadTitle">
                FreshFind Assistant
              </h6>
              <span className="chat-head-sub">Active &bull; Instant Help</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-1">
            <button
              className="btn btn-sm chat-head-btn"
              aria-label="Minimize chat"
              title="Minimize"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-dash-lg"></i>
            </button>
            <button
              className="btn btn-sm chat-head-btn"
              aria-label="Close chat"
              title="Close"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="chat-body" ref={chatBodyRef}>
          <div className="chat-timestamp text-center text-muted small my-1">
            Today &bull; FreshFind Helper
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`chat-msg ${msg.sender}`}>
              {msg.sender === "bot" && (
                <div className="chat-msg-icon">
                  <i className="bi bi-robot"></i>
                </div>
              )}
              <div className="chat-msg-content">
                {msg.text}
                <div className="chat-msg-time">{msg.time}</div>
              </div>
              {msg.sender === "user" && (
                <div className="chat-msg-icon">
                  <i className="bi bi-person-fill"></i>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="chat-msg bot chat-typing">
              <div className="chat-msg-icon">
                <i className="bi bi-robot"></i>
              </div>
              <div className="chat-msg-content typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="chat-suggestions-wrapper">
          <div className="chat-suggestions-label small text-muted px-3 pt-2 pb-1 d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-stars text-warning me-1"></i>Suggested Questions
            </span>
            <span className="small text-muted fst-italic">Scroll &rarr;</span>
          </div>
          <div className="chat-suggestions-scroll">
            {DEFAULT_SUGGESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="chat-suggestion-chip"
                title={q}
                onClick={() => handleSendMessage(q)}
              >
                <i className="bi bi-arrow-return-right me-1"></i>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form className="chat-footer-form p-2 border-top" onSubmit={handleSubmit}>
          <div className="input-group input-group-sm">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder="Ask about markets, produce, hours..."
              aria-label="Chat message input"
              autoComplete="off"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button
              className="btn btn-green px-3"
              type="submit"
              aria-label="Send message"
              title="Send message"
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
