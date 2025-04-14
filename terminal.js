let commands = {};
let ui = {};
let commandHistory = [];
let historyIndex = -1;

const terminal = document.getElementById("terminal");

fetch("commands.json")
  .then((res) => res.json())
  .then((data) => {
    commands = data;
    return fetch("ui.json");
  })
  .then((res) => res.json())
  .then((data) => {
    const savedUI = localStorage.getItem("terminal-ui");
    ui = savedUI ? JSON.parse(savedUI) : data;
    initializeTerminal();
  });

function applyStyles(el, styleConfig) {
  Object.entries(styleConfig).forEach(([key, value]) => {
    el.style[key] = value;
  });
}

function linkify(text) {
  const urlRegex =
    /(https?:\/\/[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+)/gi;
  return text.replace(urlRegex, (url) => {
    const fullUrl = url.startsWith("http") ? url : "https://" + url;
    return `<a href="${fullUrl}" target="_blank" style="color:${
      ui.link?.color || "#00f"
    }">${url}</a>`;
  });
}

function createInputLine() {
  const line = document.createElement("div");
  line.className = "line";
  line.style.display = "flex";
  line.style.gap = "10px";
  line.style.alignItems = "center";

  const prompt = document.createElement("span");
  prompt.textContent = "$";
  applyStyles(prompt, ui.prompt || {});

  const input = document.createElement("input");
  input.type = "text";
  input.className = "input-field";
  input.autofocus = true;
  applyStyles(input, ui.input || {});

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const command = input.value.trim();
      if (!command) return;

      commandHistory.push(command);
      historyIndex = commandHistory.length;

      input.disabled = true;
      input.style.display = "none";

      const typed = document.createElement("span");
      typed.textContent = command;
      applyStyles(typed, ui.input || {});
      line.appendChild(typed);

      executeCommand(command);
    } else if (event.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = "";
      }
      event.preventDefault();
    }
  });

  line.appendChild(prompt);
  line.appendChild(input);
  terminal.appendChild(line);
  input.focus();
  terminal.scrollTop = terminal.scrollHeight;
}

function executeCommand(command) {
  if (command === "settings") {
    openSettings();
    return;
  }

  if (commands[command]) {
    if (command === "clear") {
      terminal.innerHTML = "";
      const clearedMessage = document.createElement("div");
      clearedMessage.textContent = "UI Settings have been updated";
      applyStyles(clearedMessage, ui.output || {});
      terminal.appendChild(clearedMessage);
      createInputLine();
      return;
    }

    commands[command].forEach((line) => {
      const output = document.createElement("div");
      output.className = "output";
      output.innerHTML = linkify(line);
      applyStyles(output, ui.output || {});
      terminal.appendChild(output);
    });
  } else {
    const error = document.createElement("div");
    error.className = "output";
    error.textContent =
      "Command not found. Type 'help' for available commands.";
    applyStyles(error, ui.output || {});
    terminal.appendChild(error);
  }

  terminal.scrollTop = terminal.scrollHeight;
  createInputLine();
}

function addTitle() {
  const title = document.createElement("div");
  title.textContent = "Welcome to My Portfolio!";
  applyStyles(title, ui.title || {});
  terminal.appendChild(title);
}

function initializeTerminal() {
  addTitle();
  createInputLine();
}

function openSettings() {
  const overlay = document.getElementById("settings-overlay");
  const form = document.getElementById("settings-form");

  form.querySelectorAll(".setting-group").forEach((group) => {
    const key = group.dataset.key;
    const style = ui[key] || {};
    group.querySelector("input[name='color']").value = style.color || "#ffffff";
    group.querySelector("input[name='fontSize']").value = parseInt(
      style.fontSize || 16
    );
  });

  overlay.classList.remove("hidden");
}

function closeSettings() {
  document.getElementById("settings-overlay").classList.add("hidden");
}

function textForOptions(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  applyStyles(msg, ui.output || {});
  terminal.appendChild(msg);
  terminal.scrollTop = terminal.scrollHeight;
  createInputLine();
}

function cancelSettings() {
  closeSettings();
  textForOptions("Settings exited.");
}

document.getElementById("settings-form").addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelectorAll(".setting-group").forEach((group) => {
    const key = group.dataset.key;
    const color = group.querySelector("input[name='color']").value;
    const fontSize = group.querySelector("input[name='fontSize']").value + "px";

    ui[key] = { color, fontSize };
  });

  localStorage.setItem("terminal-ui", JSON.stringify(ui));
  closeSettings();
  const message = document.createElement("div");
  message.textContent = "UI settings updated successfully.";
  applyStyles(message, ui.output || {});
  terminal.appendChild(message);
  terminal.scrollTop = terminal.scrollHeight;
  createInputLine();
});

document.getElementById("reset-ui").addEventListener("click", () => {
  fetch("ui.json")
    .then((res) => res.json())
    .then((defaultUI) => {
      ui = defaultUI;
      localStorage.removeItem("terminal-ui");

      // Reload form inputs
      document.querySelectorAll(".setting-group").forEach((group) => {
        const key = group.dataset.key;
        const style = ui[key] || {};
        group.querySelector("input[name='color']").value =
          style.color || "#ffffff";
        group.querySelector("input[name='fontSize']").value = parseInt(
          style.fontSize || 16
        );
      });

      closeSettings();

      textForOptions("UI settings have been reset to default.")
    });
});

document.addEventListener("click", () => {
  const input = terminal.querySelector("input.input-field:not([disabled])");
  if (input) input.focus();
});
