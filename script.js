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
        <span class="icon material-symbols-rounded">content_copy</span>`;

  animationDiv.innerHTML = animationHtml;
  chatList.appendChild(animationDiv);

  generateAPIResponse(animationDiv);
};

const handleOutgoingChat = function () {
  userMessage = userInput.value.trim();
  if (!userMessage) return;
  const html = `<div class="message_content">
          <img src="IMG-20241130-WA0021.jpg" alt="user image" class="avatar" />
          <p class="text">
            ${userMessage}
          </p>
        </div>`;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  chatList.appendChild(outgoingMessageDiv);
  typingForm.reset();

  showLoadingAnimation();
};

typingForm.addEventListener("submit", (e) => {
  header.classList.add("hidden");
  e.preventDefault();
  handleOutgoingChat();
});
