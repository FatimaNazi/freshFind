(function () {
  var chatbotHost = document.createElement("div");
  chatbotHost.id = "freshfind-chatbot-root";
  document.body.appendChild(chatbotHost);

  chatbotHost.innerHTML = `
    <button class="chat-launcher" id="chatLauncher" aria-label="Open FreshFind Chat Assistant" title="Open FreshFind Assistant">
      <i class="bi bi-chat-dots-fill"></i>
      <span class="chat-launcher-badge"></span>
    </button>

    <div class="chat-panel shadow-lg" id="chatPanel" role="dialog" aria-labelledby="chatHeadTitle" aria-hidden="true">
      <div class="chat-head d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <div class="chat-avatar">
            <i class="bi bi-robot"></i>
            <span class="chat-status-dot" title="Online"></span>
          </div>
          <div>
            <h6 class="mb-0 fw-bold text-white" id="chatHeadTitle">FreshFind Assistant</h6>
            <span class="chat-head-sub">Active &bull; Instant Help</span>
          </div>
        </div>
        <div class="d-flex align-items-center gap-1">
          <button class="btn btn-sm chat-head-btn" id="chatMinimize" aria-label="Minimize chat" title="Minimize">
            <i class="bi bi-dash-lg"></i>
          </button>
          <button class="btn btn-sm chat-head-btn" id="chatClose" aria-label="Close chat" title="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <div class="chat-body" id="chatBody">
        <div class="chat-timestamp text-center text-muted small my-1">Today &bull; FreshFind Helper</div>
        
        <div class="chat-msg bot">
          <div class="chat-msg-icon"><i class="bi bi-robot"></i></div>
          <div class="chat-msg-content">
            Hello! I'm your FreshFind Assistant. Looking for markets, seasonal produce, hours, or bookmarks? Tap a quick question below or ask me anything!
          </div>
        </div>
      </div>

      <div class="chat-suggestions-wrapper">
        <div class="chat-suggestions-label small text-muted px-3 pt-2 pb-1 d-flex justify-content-between align-items-center">
          <span><i class="bi bi-stars text-warning me-1"></i>Suggested Questions</span>
          <span class="small text-muted fst-italic">Scroll &rarr;</span>
        </div>
        <div class="chat-suggestions-scroll" id="chatSuggestions">
          <!-- Populated by JS -->
        </div>
      </div>

      <form class="chat-footer-form p-2 border-top" id="chatForm">
        <div class="input-group input-group-sm">
          <input type="text" class="form-control" id="chatInput" placeholder="Ask about markets, produce, hours..." aria-label="Chat message input" autocomplete="off">
          <button class="btn btn-green px-3" type="submit" id="chatSendBtn" aria-label="Send message" title="Send message">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </form>
    </div>
  `;

  var chatLauncher = document.getElementById("chatLauncher");
  var chatPanel = document.getElementById("chatPanel");
  var chatClose = document.getElementById("chatClose");
  var chatMinimize = document.getElementById("chatMinimize");
  var chatForm = document.getElementById("chatForm");
  var chatInput = document.getElementById("chatInput");
  var chatBody = document.getElementById("chatBody");
  var chatSuggestions = document.getElementById("chatSuggestions");

  var chatQA = [];
  var FALLBACK_REPLY = "I'm still learning! You can browse the Market Directory, check the Produce Guide, or ask about specific days, locations, or produce.";

  var DEFAULT_SUGGESTIONS = [
    "Find markets near me",
    "What produce is in season?",
    "Show vegetable markets",
    "Which markets are open today?",
    "Find fruit markets",
    "Which markets sell organic produce?",
    "How do I bookmark a market?",
    "How do I leave feedback?",
    "What is FreshFind?"
  ];

  var STOPWORDS = ["a", "an", "the", "is", "are", "do", "does", "i", "to", "of", "for", "on", "in", "and", "can", "how", "what", "where", "my", "me", "show", "tell", "which"];

  function keywordsOf(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(function (w) {
      return w.length > 2 && STOPWORDS.indexOf(w) === -1;
    });
  }

  function renderSuggestions(questions) {
    if (!chatSuggestions) return;
    chatSuggestions.innerHTML = questions.map(function (q) {
      return '<button type="button" class="chat-suggestion-chip" title="' + q + '">' +
        '<i class="bi bi-arrow-return-right me-1"></i>' + q +
        '</button>';
    }).join("");
  }

  fetch("assets/chatbot-data.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
      chatQA = data;
      renderSuggestions(DEFAULT_SUGGESTIONS);
    })
    .catch(function (error) {
      console.error("Chatbot data failed to load:", error);
      chatQA = [];
      renderSuggestions(DEFAULT_SUGGESTIONS);
    });

  function openChat() {
    chatPanel.classList.add("open");
    chatPanel.setAttribute("aria-hidden", "false");
    chatLauncher.classList.add("active");
    setTimeout(function () {
      if (chatInput) chatInput.focus();
    }, 150);
  }

  function closeChat() {
    chatPanel.classList.remove("open");
    chatPanel.setAttribute("aria-hidden", "true");
    chatLauncher.classList.remove("active");
  }

  chatLauncher.addEventListener("click", function () {
    if (chatPanel.classList.contains("open")) {
      closeChat();
    } else {
      openChat();
    }
  });

  chatClose.addEventListener("click", closeChat);
  chatMinimize.addEventListener("click", closeChat);

  // Esc key closes chat
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && chatPanel.classList.contains("open")) {
      closeChat();
    }
  });

  chatSuggestions.addEventListener("click", function (e) {
    var chip = e.target.closest(".chat-suggestion-chip");
    if (!chip) return;
    var question = chip.textContent.replace(/^\s*\S+\s*/, "").trim() || chip.textContent.trim();
    handleMessage(question);
  });

  function getCurrentTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    var mStr = m < 10 ? "0" + m : m;
    return h + ":" + mStr + " " + ampm;
  }

  function addMessage(text, sender) {
    var msgWrapper = document.createElement("div");
    msgWrapper.className = "chat-msg " + sender;

    var timeStr = getCurrentTime();

    if (sender === "bot") {
      msgWrapper.innerHTML = `
        <div class="chat-msg-icon"><i class="bi bi-robot"></i></div>
        <div class="chat-msg-content">
          ${text}
          <div class="chat-msg-time">${timeStr}</div>
        </div>
      `;
    } else {
      msgWrapper.innerHTML = `
        <div class="chat-msg-content">
          ${text}
          <div class="chat-msg-time">${timeStr}</div>
        </div>
        <div class="chat-msg-icon"><i class="bi bi-person-fill"></i></div>
      `;
    }

    chatBody.appendChild(msgWrapper);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getReply(message) {
    if (!chatQA || !chatQA.length) return FALLBACK_REPLY;

    var normalized = message.trim().toLowerCase();

    // Direct match check first
    for (var i = 0; i < chatQA.length; i++) {
      if (chatQA[i].question.toLowerCase() === normalized) {
        return chatQA[i].answer;
      }
    }

    // Special quick intents
    if (normalized.indexOf("near") !== -1 || normalized.indexOf("location") !== -1 || normalized.indexOf("close") !== -1) {
      return "You can check the dynamic Nearby Market section on our home page by enabling geolocation, or search by neighborhood on the Market Directory!";
    }
    if (normalized.indexOf("vegetable") !== -1) {
      return "Clifton Weekend Market, DHA Farmers Market, Gulshan Fresh Street, and Malir Farmers Market have great selections of fresh vegetables!";
    }
    if (normalized.indexOf("fruit") !== -1) {
      return "Bahadurabad Green Market and Tariq Road Fresh Mart offer excellent fresh fruits like mangoes, bananas, and citrus.";
    }
    if (normalized.indexOf("season") !== -1 || normalized.indexOf("produce") !== -1) {
      return "Check our Produce Guide! In cool season look for spinach and mint; late spring-summer brings sweet mangoes; tomatoes and yogurt are available year-round.";
    }
    if (normalized.indexOf("open") !== -1 || normalized.indexOf("today") !== -1 || normalized.indexOf("day") !== -1) {
      return "Markets operate on specific schedules! For example, Clifton is open Saturday & Sunday (08:00 AM – 03:00 PM), Bahadurabad is open Wed & Sat, and Gulshan is open Tue, Thu & Sat.";
    }

    // Keyword scoring match
    var messageWords = keywordsOf(message);
    if (!messageWords.length) return FALLBACK_REPLY;

    var bestMatch = null;
    var bestScore = 0;

    chatQA.forEach(function (qa) {
      var questionWords = keywordsOf(qa.question);
      var score = 0;
      messageWords.forEach(function (word) {
        if (questionWords.indexOf(word) !== -1) score += 2;
        else if (qa.answer.toLowerCase().indexOf(word) !== -1) score += 1;
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = qa;
      }
    });

    return bestScore > 0 && bestMatch ? bestMatch.answer : FALLBACK_REPLY;
  }

  function handleMessage(message) {
    message = message.trim();
    if (!message) return;

    addMessage(message, "user");
    chatInput.value = "";

    // Show simulated typing state then reply
    var typingIndicator = document.createElement("div");
    typingIndicator.className = "chat-msg bot chat-typing";
    typingIndicator.innerHTML = `
      <div class="chat-msg-icon"><i class="bi bi-robot"></i></div>
      <div class="chat-msg-content typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(function () {
      if (typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
      }
      var reply = getReply(message);
      addMessage(reply, "bot");
    }, 450);
  }

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleMessage(chatInput.value);
  });
})();
