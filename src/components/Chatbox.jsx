import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const RESUME_CONTEXT = `You are an AI assistant representing Anup Parkhi, a Senior Front-End/Full-Stack Developer based in Austin, TX, with 8+ years of experience.

FIRST, if a user asks about Anup's skills, experience, projects, career, or anything found in the resume context below, answer using ONLY this resume data.

If the question is not about Anup (example: 'What is the fastest animal in the world?'), respond as a helpful assistant with general world knowledge.

RESUME CONTEXT:
Professional Summary:
- Front-End Developer with 8+ years of experience building performant user interfaces and data-driven visualizations using React, Redux, Node.js, and D3.js.
- Expert in JavaScript (ES6+), advanced state management, AI-enhanced UIs, scalable API integrations.
- Strong at optimizing app performance and collaborating with designers, data scientists, and product teams.

Technical Skills:
• JavaScript (ES6+): Functional programming, event loop, async design
• AI/ML Plugins: GitHub Copilot (project use)
• Frontend: React (Hooks, Context, Suspense), Redux toolkit, Responsive CSS3, D3.js
• State: Redux toolkit, Context API, advanced selectors
• Backend/API: Node.js, Express, RESTful APIs, MERN, JWT/OAuth
• Data Viz: D3.js, Chart.js, SVG, dashboards
• Testing: Jest, Cypress, browser dev tools, perf profiling
• CI/CD/Cloud: Docker, Kubernetes, Azure, Jenkins, GitHub Actions
• Other: Storybook, Webpack, npm/yarn, GIT, Prettier, ESlint

Professional Experience:
- Wipro Ltd/Apple Inc (Senior Frontend Developer, 2020-Present): Built scalable web apps with React, Redux, Node.js; led integration with D3.js, focused on accessibility and performance, APIs, Docker/Kubernetes, CI/CD for cloud deployment.
- FIGmd India Pvt Ltd (Frontend Engineer, 2017-2020): Modular React apps with Redux and Node.js, analytics, performance profiling, REST APIs, frontend-backend integration.

Selected Projects:
- Apple Support Site: React, Redux, D3.js, Github Copilot, Node.js, Docker. Integrated AI/ML features in UI for contextual suggestions, D3 dashboards, scalable component architecture, led project delivery.
- SEO Manager Analytics: React, D3.js, Node.js, Storybook, mobile-first dashboards, Storybook UI library, Docker CI/CD.
- Apple Foresight Business Insights: React, Redux, D3.js, Node.js, AWS; analytics dashboards, virtual DOM optimization, Node REST APIs.
- Healthcare Platform (PWA): React, Redux, Node.js, Cypress, Kubernetes. HIPAA-compliant, accessible, mobile, CI/CD pipelines, Docker deployment.

Certifications:
- Frontend React Developer Certification (2025)
- GitHub Copilot: AI-Powered Development (2025)
- Google Generative AI Certification (2025)

Visa Status / Work Authorization:
- H1B Visa, eligible for employer sponsorship/ transfer.

Education:
- Diploma Computer Science, CDAC Pune (2017)
- BE Electrical Engineering, Priyadarshini College of Engineering (2012-2016)

When relevant, distinguish clearly between answers about Anup and answers about general topics.
`;

// For Vite: store your key and model in .env as VITE_OPENROUTER_KEY, VITE_OPENROUTER_MODEL
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY;
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "system", text: RESUME_CONTEXT },
    { sender: "ai", text: "👋 Welcome to my AI Portfolio chat! Ask me anything." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
          model: OPENROUTER_MODEL,
          messages: currentMessages.map(m => ({
            role: m.sender === "user" ? "user" :
              m.sender === "system" ? "system" : "assistant",
            content: m.text
          }))
        })
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content || "Sorry, no reply.";
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
        <div className="center-chatbox-messages" ref={messagesContainerRef}>
          {messages
            .filter(msg => msg.sender !== "system")
            .map((msg, i) => (
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
