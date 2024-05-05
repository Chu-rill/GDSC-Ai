let userInput = document.getElementById("text");
const messagesContainer = document.getElementById("messages-container");
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_GEMINI_API_KEY } from "./secrets.js";
const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
const storedMessages =
  JSON.parse(sessionStorage.getItem("storedMessages")) || [];
let stamp = new Date();
const send = document.querySelector(".send");

messagesContainer.innerHTML = "";
// Populate messages container with stored messages
storedMessages.forEach((message) => {
  displayMessage(message.sender, message.text, new Date(message.timestamp));
  displayMessage("Conversa", message.text, new Date(message.timestamp));
  // if (message.sender === "You") {
  //   displayMessage("You", message.text, new Date(message.timestamp));
  // } else {
  //   displayMessage("Conversa", message.text, new Date(message.timestamp));
  // }
});
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "hello i would like to know what you can do" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    // generationConfig: { maxOutputTokens: 200 },
  });

  const msg = userInput.value;
  userInput.value = "";
  console.log(userInput);
  console.log(msg);

  displayMessage("You", msg, stamp);

  if (
    msg.toLowerCase() === "who is your creator" ||
    msg.toLowerCase() === "who created you"
  ) {
    // Respond with the custom name of the creator
    setTimeout(() => {
      displayMessage("Conversa", "I was created by Churchill Daniel.", stamp);
    }, 2000);
  } else if (
    msg.toLowerCase() === "what is your name" ||
    msg.toLowerCase() === "who are you" ||
    msg.toLowerCase() === "what are you"
  ) {
    setTimeout(() => {
      displayMessage(
        "Conversa",
        "My name is Conversa a genral purpose large language model",
        stamp
      );
    }, 2000);
  } else {
    const result = await chat.sendMessageStream(msg);
    const response = await result.response;
    const text = response.text();

    const history = await chat.getHistory();
    const msgContent = { role: "user", parts: [{ text: msg }] };
    const contents = [...history, msgContent];
    const { totalTokens } = await model.countTokens({ contents });

    displayMessage("Conversa", text, stamp);
    console.log(text);

    // // Store the message in sessionStorage
    // const newMessage = { sender: "You", text: msg, timestamp: stamp.getTime() };
    // storedMessages.push(newMessage);
    // sessionStorage.setItem("storedMessages", JSON.stringify(storedMessages));

    // Store the user message in sessionStorage
    const userMessage = {
      sender: "You",
      text: msg,
      timestamp: stamp.getTime(),
    };
    storedMessages.push(userMessage);

    // Store the bot message in sessionStorage
    const botMessage = {
      sender: "Conversa",
      text: text,
      timestamp: stamp.getTime(),
    };
    storedMessages.push(botMessage);

    // Update sessionStorage with the combined messages array
    sessionStorage.setItem("storedMessages", JSON.stringify(storedMessages));
  }
}

function displayMessage(sender, message, timestamp) {
  const newMessage = document.createElement("div");
  newMessage.classList.add(
    "message",
    sender === "You" ? "user-message" : "bot-message",
    "flex",
    "mb-4",
    "text-white"
  );

  const senderImage = document.createElement("img");
  senderImage.src =
    sender === "You" ? "debian_grey_swirl.png" : "gruvbox_minimal_space.png";
  senderImage.alt =
    sender === "You" ? "User Profile Picture" : "Bot Profile Picture";
  senderImage.style.width = "40px";
  senderImage.style.height = "40px";

  senderImage.classList.add("rounded-3xl");

  const messageContent = document.createElement("div");
  messageContent.style.marginLeft = "8px";
  messageContent.classList.add("message-content");

  const messageText = document.createElement("div");
  messageText.classList.add("message-text", "text-white");

  // Check if the message is a list
  if (Array.isArray(message)) {
    const orderedList = document.createElement("ol");

    // Loop through each item in the list and create list items
    message.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      orderedList.appendChild(listItem);
    });

    // Append the ordered list to the message content
    messageText.appendChild(orderedList);
  } else {
    // If not a list, display as plain text
    messageText.textContent = message;
  }

  const messageInfo = document.createElement("div");
  messageInfo.classList.add("message-info");

  const senderName = document.createElement("span");
  senderName.classList.add("sender-name");
  senderName.textContent = sender;

  const currentHour = timestamp.getHours();

  // Get the current minutes
  const currentMinutes = timestamp.getMinutes();

  // Format the current time (optional)
  const formattedTime = `${currentHour}:${
    currentMinutes < 10 ? "0" : ""
  }${currentMinutes}`;

  const timestampSpan = document.createElement("span");
  timestampSpan.style.marginLeft = "8px";
  timestampSpan.classList.add("timestamp");
  timestampSpan.textContent = formattedTime;

  messageInfo.appendChild(senderName);
  messageInfo.appendChild(timestampSpan);

  messageContent.appendChild(messageInfo);
  messageContent.appendChild(messageText);

  newMessage.appendChild(senderImage);
  newMessage.appendChild(messageContent);

  messagesContainer.appendChild(newMessage);
}

// Call run() when you want to start the conversation
send.addEventListener("click", () => {
  run();
});
userInput.addEventListener("keypress", (event) => {
  // Check if the key pressed is Enter (key code 13)
  if (event.key === "Enter") {
    // Call the run function
    run();
  }
});
