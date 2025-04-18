# Connections: AI Edition

A sleek, mobile-friendly web game inspired by NYT Connections, where players group words into categories—each representing an AI concept. Built with Three.js for neon visuals and particle effects.

## Features
- **AI-Themed Categories:** Types of algorithms, famous AI tools, ethical issues, neural network layers, and more.
- **Drag-and-Drop Gameplay:** Select and group tiles by dragging or tapping.
- **Sleek Neon UI:** Futuristic, glowing tiles and subtle particle effects using Three.js.
- **Responsive Design:** Fully mobile-friendly and text wraps inside tiles.
- **Instant Feedback:** Correct groups lock in with visual effects; solve all to win!

## Play the Game
Once deployed, play here: [https://connections-ai-edition.windsurf.build](https://connections-ai-edition.windsurf.build)

## Local Development
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/connections-ai-edition.git
   cd connections-ai-edition
   ```
2. Start a local server (Python 3):
   ```bash
   python3 -m http.server 8000
   ```
3. Open [http://localhost:8000](http://localhost:8000) in your browser.

## Tech Stack
- HTML/CSS/JS
- [Three.js](https://threejs.org/) for particle effects and visuals

## Customization
- To add or change AI categories/words, edit the `GROUPS` array in `main.js`.

---
Inspired by NYT Connections. Built for learning and fun!
