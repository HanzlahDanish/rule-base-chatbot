
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const chatbotRules = rules as Rule[];

const quickQuestions = [
  {
    title: "Admissions",
    description: "Eligibility and applications",
    icon: "🎓",
    question: "What are the admission requirements?",
  },
  {
    title: "Semester Fees",
    description: "Fees and challans",
    icon: "💳",
    question: "Tell me about the semester fee",
  },
  {
    title: "Library",
    description: "Books and library cards",
    icon: "📚",
    question: "How can I get a library card?",
  },
  {
    title: "Hostel",
    description: "Accommodation and rooms",
    icon: "🏢",
    question: "Tell me about hostel accommodation",
  },
  {
    title: "Timings",
    description: "Classes and office hours",
    icon: "🕒",
    question: "What are the university timings?",
  },
];

function normalizeMessage(message: string): string {
  return message.toLowerCase().trim().replace(/\s+/g, " ");
}

function getBotReply(userMessage: string): string {
  const normalizedMessage = normalizeMessage(userMessage);

  for (const rule of chatbotRules) {
    const matched = rule.keywords.some((keyword) => {
      const normalizedKeyword = normalizeMessage(keyword);

      const escapedKeyword = normalizedKeyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const pattern = new RegExp(
        `(^|[^a-z0-9])${escapedKeyword}($|[^a-z0-9])`
      );

      return pattern.test(normalizedMessage);
    });

    if (matched) {
      return rule.reply;
    }
  }

  return "Sorry, I couldn't find an answer to your question. Please try asking about admissions, fees, university timings, library services, or hostels.";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Assalam-o-Alaikum! Welcome to the UOS Helpdesk Bot. 🎓\n\nI'm here to help you with university admissions, semester fees, library services, timings, and hostel information.\n\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  function sendMessage(question?: string) {
    const text = (question ?? input).trim();

    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
    };

    const botMessage: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: getBotReply(text),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      botMessage,
    ]);

    setInput("");
    setIsTyping(false);
    inputRef.current?.focus();
  }

  return (
    <main className="min-h-screen bg-[#F3F5FA] px-3 py-4 text-slate-800 sm:px-6 sm:py-7">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:min-h-[calc(100vh-3.5rem)]">

        {/* University header */}
        <header className="bg-[#08085A] px-4 py-4 text-white sm:px-7 sm:py-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 sm:h-[68px] sm:w-[68px]">
              <Image
                src="/images/uos-logo.jpg"
                alt="University of Sargodha logo"
                width={100}
                height={100}
                priority
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
                UOS Helpdesk Bot
              </h1>
              <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                University of Sargodha
              </p>
              <p className="mt-1 text-[11px] text-blue-200 sm:text-xs">
                Student Support Assistant
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs font-medium text-blue-50">
                Ready to help
              </span>
            </div>
          </div>
        </header>

        {/* Chat area */}
        <section className="flex flex-1 flex-col bg-[#F8F9FC]">
          <div
            className="flex-1 space-y-5 overflow-y-auto px-3 py-5 sm:px-7 sm:py-7"
            aria-label="Chat conversation"
            aria-live="polite"
          >
            {/* Welcome label */}
            <div className="flex justify-center">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm">
                STUDENT ASSISTANCE
              </span>
            </div>

            {/* Messages */}
            {messages.map((message) => {
              const isUser = message.sender === "user";

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-1">
                      <Image
                        src="/images/uos-logo.jpg"
                        alt="UOS Assistant"
                        width={48}
                        height={48}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
                      isUser
                        ? "rounded-br-md bg-[#08085A] text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {message.text}
                  </div>

                  {isUser && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-base">
                      👤
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick questions */}
            {messages.length === 1 && (
              <div className="ml-0 sm:ml-11">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Explore help topics
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {quickQuestions.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => sendMessage(item.question)}
                      disabled={isTyping}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-[#08085A]/40 hover:bg-blue-50/60 hover:shadow-sm disabled:opacity-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl transition group-hover:bg-white">
                        {item.icon}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#08085A]">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {item.description}
                        </span>
                      </span>

                      <span className="text-lg text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#08085A]">
                        ›
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#08085A]" />
                Preparing response...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message composer */}
          <div className="border-t border-slate-200 bg-white px-3 py-4 sm:px-7 sm:py-5">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about fees, admissions, library..."
                aria-label="Type your question"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#08085A] focus:bg-white focus:ring-2 focus:ring-[#08085A]/10"
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D62828] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#B91C1C] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
              >
                <span>Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] text-slate-400 sm:text-xs">
              <span>Rule-based chatbot</span>
              <span>•</span>
              <span>No AI API required</span>
              <span>•</span>
              <span>Independent prototype</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
