
const GEMINI_API_KEY = "AIzaSyARYwT6vaJT9zd9CKuXaap1NzhNqPMDc_0";
const MODEL_NAME = "models/gemini-1.5-pro-001";  // Use the model from your available list

document.getElementById("sendBtn").addEventListener("click", sendToGemini);

async function sendToGemini() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  appendChat("You", message);
  input.value = "";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${MODEL_NAME}:generateText?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            text: message,
          },
          temperature: 0.7,
          maxOutputTokens: 512,
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.output || "❌ Gemini didn't return a response. Try again.";

    appendChat("Gemini", reply);
  } catch (error) {
    appendChat("Gemini", `❌ Error: ${error.message}`);
  }
}

function appendChat(sender, text) {
  const chatWindow = document.getElementById("chatWindow");
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}


            // to know which model works for me
// // async function listModels() {
// //   const response = await fetch(
// //     `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
// //   );
// //   const data = await response.json();
// //   console.log("Available models:", data);
// // }

// // listModels();
