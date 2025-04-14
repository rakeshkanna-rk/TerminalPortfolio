# 🧑‍💻 Terminal Portfolio

A web-based, interactive **terminal-style portfolio** that mimics a command-line interface. Users can explore your profile using simple commands like `help`, `about`, `projects`, and more.

## 🚀 Features

- Terminal-style input/output UI
- Fully customizable UI (colors, font sizes, etc.)
- Command definitions in `commands.json`
- Live link detection (Ctrl + Click to open in new tab)
- `settings` overlay to update UI styles
- Settings are stored in `localStorage`
- Reset option to restore default styles
- Command history navigation with ↑ and ↓
- Focus input from anywhere on the page

## 📁 File Structure

```
.
├── index.html
├── style.css
├── script.js
├── commands.json
└── ui.json
```

## 📦 Customization

### 🔧 Define Your Commands

Edit `commands.json` to add or customize terminal commands.

```json
{
  "help": [
    "Available commands: about, projects, contact, clear, settings"
  ],
  "about": [
    "I'm a frontend developer passionate about clean UI and web magic!"
  ]
}
```

### 🎨 Configure the UI

Customize `ui.json` to define UI styles (font size, colors):

```json
{
  "title": { "color": "#00FF00", "font-size": "20px" },
  "prompt": { "color": "#FFFFFF", "font-size": "16px" },
  "input": { "color": "#FF3333", "font-size": "16px" },
  "output": { "color": "#FFFF00", "font-size": "16px" },
  "link": { "color": "#33BBFF", "font-size": "16px" }
}

```

### ⚙️ Settings Overlay

Type `settings` in the terminal to bring up the UI editor. Modify:

- Title font and color
- Input field appearance
- Output styling
- Link colors
- Prompt color

Changes are stored in the browser using `localStorage`.

Use the **Reset** button to restore default settings from `ui.json`.

## 🧪 Usage

Open `index.html` in your browser or host it on a static site like GitHub Pages, Vercel, or Netlify.

## 📸 Demo

> Coming soon – add a GIF or screenshot of your terminal portfolio here.

## 💡 Tip

Click anywhere on the screen to automatically focus the terminal input.

## 📃 License

MIT — feel free to modify and use it for your own portfolio!

---

### 👋 Built with love & JavaScript
