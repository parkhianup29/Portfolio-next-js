import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

// For Vite: store your key and model in .env as VITE_OPENROUTER_KEY, VITE_OPENROUTER_MODEL
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY;
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "👋 Welcome to my AI Portfolio chat! Ask me anything." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

//   useEffect(() => {
//     endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;
    setMessages(msgs => [...msgs, { sender: "user", text: input }]);
    setIsLoading(true);

    const currentMessages = [...messages, { sender: "user", text: input }];
    setInput("");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: `${OPENROUTER_MODEL}`,
          messages: currentMessages.map(m => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error("API error: " + (await response.text()));
      }
      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content || "Sorry, no reply from AI.";
      setMessages(msgs => [...msgs, { sender: "ai", text: aiReply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: "ai", text: "Error: " + err.message }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="center-chatbox-bg">
      <div className="center-chatbox">
        <div className="center-chatbox-header">
          <span>AI Assistant</span>
        </div>
        <div className="center-chatbox-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.sender === "user"
                  ? "center-chatbox-msg right"
                  : "center-chatbox-msg left"
              }
            >
              <span className={"center-chatbox-bubble " + msg.sender}>
                {msg.sender === "ai"
                  ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                  : msg.text}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="center-chatbox-msg left">
              <span className="center-chatbox-bubble ai">
                <span className="typing">
                  Thinking
                  <span className="typing-dot typing-dot1">.</span>
                  <span className="typing-dot typing-dot2">.</span>
                  <span className="typing-dot typing-dot3">.</span>
                </span>
              </span>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
        <form
          className="center-chatbox-input-row"
          onSubmit={handleSend}
        >
          <input
            className="center-chatbox-input"
            placeholder="Ask a question…"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            maxLength={180}
          />
          <button
            className="center-chatbox-send-btn"
            type="submit"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
