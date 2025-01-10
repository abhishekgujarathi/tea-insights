import React, { useState } from "react";

const SERVER_HOSTED_API = "https://tea-insights-api.vercel.app";
// const SERVER_HOSTED_API = "http://192.168.1.12:3000";

// Utility function to parse formatted text
const parseText = (text) => {
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, (match, p1) => `<strong>${p1}</strong>`)
    .replace(/\*(.*?)\*/g, (match, p1) => `<em>${p1}</em>`)
    .replace(/_(.*?)_/g, (match, p1) => `<u>${p1}</u>`)
    .replace(/~~(.*?)~~/g, (match, p1) => `<s>${p1}</s>`)
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      (match, p1, p2) => `<a href="${p2}" target="_blank">${p1}</a>`
    )
    .replace(/`(.*?)`/g, (match, p1) => `<code>${p1}</code>`)
    .replace(/```(.*?)```/gs, (match, p1) => `<pre><code>${p1}</code></pre>`)
    .replace(/^> (.*?)$/gm, (match, p1) => `<blockquote>${p1}</blockquote>`)
    .replace(/^- (.*?)$/gm, (match, p1) => `<ul><li>${p1}</li></ul>`)
    .replace(/^\d+\. (.*?)$/gm, (match, p1) => `<ol><li>${p1}</li></ol>`)
    .replace(/\n/g, "<br/>");

  return formattedText;
};

const ChatApp = ({ sessionCollectionName }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Format the message using parseText
    const formattedMessage = parseText(message);

    // Add user's message to the UI
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: formattedMessage, sender: "user" },
    ]);
    setMessage("");
    setIsLoading(true);

    try {
      console.log("Hello", sessionCollectionName);

      const response = await fetch(`${SERVER_HOSTED_API}/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          collectionName: sessionCollectionName,
          input: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the backend.");
      }

      const data = await response.json();
      const botMessage = data.result || "Sorry, no response available.";

      // Format bot's message and add it to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: parseText(botMessage), sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Handle error in case something goes wrong
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error: Unable to fetch a response.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#212121] h-[95%]">
      {/* Chat Messages */}
      <div className="flex-1 p-4 bg-[#2a2a2a] overflow-y-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } items-center my-2`}
          >
            <div
              className={`p-3 rounded-lg max-w-[70%] ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center my-2">
            <div className="bg-gray-600 text-white p-3 rounded-lg max-w-[70%]">
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-[#333333] w-full">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow p-2 border rounded-lg text-white bg-[#555555] border-gray-500 placeholder-gray-400"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
