


            // to know which model works for me


            
// // async function listModels() {
// //   const response = await fetch(
// //     `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
// //   );
// //   const data = await response.json();
// //   console.log("Available models:", data);
// // }

// // listModels();


const GEMINI_API_KEY = "AIzaSyAS0uSxL6yeZO5_1oLH3Rzet7RZQIu5mgQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const chatWindow = document.getElementById("chatWindow");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const chatHistory = [];

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function generateResponse(userMessage) {
  chatHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory }),
    });
    const data = await response.json();
    const geminiReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\\*([^*]+)\\*/g, "$1") ||
      "لا يوجد رد.";
    chatHistory.push({
      role: "model",
      parts: [{ text: geminiReply }],
    });
    return geminiReply;
  } catch (error) {
    console.error(error);
    return "حدث خطأ في الاتصال.";
  }
}

async function handleSend() {
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;
  addMessage(userMsg, "user");
  chatInput.value = "";
  const botReply = await generateResponse(userMsg);
  addMessage(botReply, "bot");
}

sendBtn.addEventListener("click", handleSend);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});
