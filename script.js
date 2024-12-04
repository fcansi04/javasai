"use strict";

const chatList = document.querySelector(".chat_list");
const typingForm = document.querySelector(".typing_form");
const userInput = document.querySelector(".input");
const loadingIndicator = document.querySelector(".loading_indicator");
const header = document.querySelector(".header");

let userMessage = null;

const API_KEY = "AIzaSyCrRx8jl9t3QESpqbySGItXAX9kSEcl19I";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const createMessageElement = function (content, className) {
  const div = document.createElement("div");
  div.classList.add("message", className);
  div.innerHTML = content;
  return div;
};

const deleter = () => {
  if (confirm("are you sure to want to delete all messages")) {
    chatList.innerHTML = "";
    header.classList.remove("hidden");
  }
};

const suggestedEls = document.querySelectorAll(".suggested_el");

suggestedEls.forEach((el) => {
  const suggestedTextEl = el.querySelector("h4");
  el.addEventListener("click", () => {
    const suggestedText = suggestedTextEl.innerText;
    userInput.value = suggestedText;
    header.classList.add("hidden");

    handleOutgoingChat();
  });
});

const generateAPIResponse = async (animationDiv) => {
  const textElement = animationDiv.querySelector(".text");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });
    const data = await response.json();

    const apiResponse = data?.candidates[0].content.parts[0].text;
    textElement.innerText = apiResponse;
  } catch (error) {
    console.log(error);
  } finally {
    animationDiv.classList.remove("loading");
  }
};

const showLoadingAnimation = () => {
  const animationDiv = document.createElement("div");
  animationDiv.classList.add("message", "incoming", "loading");
  const animationHtml = `
        <div class="message_content">
          <img src="gemini.svg" alt="gemini image" class="avatar" />
          <p class="text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo,
            quisquam neque ullam iure.
          </p>
          <div class="loading_indicator">
            <div class="loading_bar"></div>
            <div class="loading_bar"></div>
            <div class="loading_bar"></div>
          </div>
        </div>
        <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

  animationDiv.innerHTML = animationHtml;
  chatList.appendChild(animationDiv);

  generateAPIResponse(animationDiv);
};
const copyMessage = (copyIcon) => {
  const messageText = copyIcon.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(messageText);
  copyIcon.innerText = "done";
  setTimeout(() => (copyIcon.innerText = "content_copy"), 1000);
};

const handleOutgoingChat = function () {
  userMessage = userInput.value.trim();
  if (!userMessage) return;
  const html = `<div class="message_content">
          <img src="user-2935527_1280.png" alt="user image" class="avatar" />
          <p class="text">
            ${userMessage}
          </p>
        </div>`;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  chatList.appendChild(outgoingMessageDiv);
  typingForm.reset();

  showLoadingAnimation();

  chatList.scrollTo(0, chatList.scrollHeight);
};

typingForm.addEventListener("submit", (e) => {
  header.classList.add("hidden");
  e.preventDefault();
  handleOutgoingChat();
});
