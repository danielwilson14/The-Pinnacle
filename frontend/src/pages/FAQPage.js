import React, { useState } from "react";
import "../styles/FAQ.css";

const FAQPage = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the chatbot work?",
      answer:
        "The chatbot uses AI to generate responses based on your input. It provides real-time interaction, and while messages are stored, they are used for functionality rather than training AI models.",
    },
    {
      question: "Is my data stored?",
      answer:
        "Yes, your chats are stored in our database. However, they are kept private and are not used to train AI. This allows you to view past conversations when returning.",
    },
    {
      question: "Can the chatbot remember past conversations?",
      answer:
        "Yes, the chatbot remembers previous messages within a session. Additionally, chat history is stored in our database, allowing you to access past conversations.",
    },
    {
      question: "Why isn’t my message sending?",
      answer:
        "Check your internet connection and ensure the server is running. If the issue persists, try refreshing the page or logging out and back in.",
    },
    {
      question: "Can I customize the chatbot's responses?",
      answer:
        "Currently, customization is not available. However, future updates may include settings that allow you to personalize responses.",
    },
    {
      question: "Can I delete my chat history?",
      answer:
        "At the moment, chat history is stored, and erasable at anytime, when you delete it it is erased from all of our databases.",
    },
  
  ];

  return (
    <div className="faq-page">
      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about the chatbot.</p>

        {faqs.map((faq, index) => (
          <div key={index} className="faq-section">
            <button className="faq-question" onClick={() => toggleQuestion(index)}>
              {faq.question}
              <span className={`arrow ${openQuestion === index ? "open" : ""}`}>&#9662;</span>
            </button>
            {openQuestion === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
