const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = messageInput.value.trim();

  if (!text) return;

  addMessage(text, "user");
  messageInput.value = "";

  addMessage("ভাবছি... 🤔", "ai");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    const aiMessages = document.querySelectorAll(".message.ai");
    const lastMessage = aiMessages[aiMessages.length - 1];

    if (data.reply) {
      lastMessage.textContent = data.reply;
    } else {
      lastMessage.textContent = "দুঃখিত, উত্তর পাওয়া যায়নি। 😔";
    }

  } catch (error) {
    const aiMessages = document.querySelectorAll(".message.ai");
    const lastMessage = aiMessages[aiMessages.length - 1];

    lastMessage.textContent =
      "Server-এর সাথে যোগাযোগ করা যাচ্ছে না। 😔";
  }
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
