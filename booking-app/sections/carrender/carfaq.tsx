"use client"
import { useState } from "react"

const FAQS_LEFT = [
    { question: "How much does it cost to rent a car in Azerbaijan for a week?", answer: "Based on the average daily cost of US$61, it will cost you around US$430 for a week on our site." },
    { question: "How much does it cost to rent a car in Azerbaijan for a month?", answer: "Based on the average daily cost of US$61, it will cost you around US$1,841 for a month on our site." },
    { question: "Which car do people usually rent in Azerbaijan?", answer: null },
    { question: "How much does it cost to rent Small car in Azerbaijan?", answer: null },
    { question: "How much does it cost to rent Medium car in Azerbaijan?", answer: null },
    { question: "How much does it cost to rent Premium car in Azerbaijan?", answer: null },
    { question: "Which car rental companies are available in Azerbaijan?", answer: null },
    { question: "Which companies offer the cheapest car rates in Azerbaijan?", answer: null },
    { question: "Which pick-up locations in Azerbaijan are the most popular?", answer: null },
];

const FAQS_RIGHT = [
    { question: "Can I pick up the car in one location and return it to a different one in Azerbaijan?", answer: null },
    { question: "How far in advance should I book the car rental in Azerbaijan?", answer: null },
    { question: "Why should I book a car rental in Azerbaijan with Booking.com?", answer: null },
    { question: "What do I need to rent a car?", answer: null },
    { question: "Am I old enough to rent a car?", answer: null },
    { question: "Can I book a car for my partner, friend, colleague, etc?", answer: null },
    { question: "Any tips on choosing the right car?", answer: null },
    { question: "Is the rental price all inclusive?", answer: null },
];

function FaqItem({ question, answer }: { question: string; answer: string | null }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors"
            >
                <span className="text-sm font-semibold text-gray-900 pr-4">{question}</span>
                <svg
                    className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && answer && (
                <div className="px-4 pb-4 text-sm text-gray-600">{answer}</div>
            )}
        </div>
    );
}

export default function FaqSection() {
    return (
        <section className="max-w-6xl px-6 py-10 mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                    {FAQS_LEFT.map((faq) => (
                        <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    {FAQS_RIGHT.map((faq) => (
                        <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
}