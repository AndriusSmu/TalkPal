TalkPal is an accessible, touch-first communication tool designed for large-scale interactive whiteboards in day care environments. It simplifies voice messaging for users with cognitive or motor challenges, focusing on concrete visual feedback and a low-stress interface.

🌟 Key Features
Neumorphic "Soft UI": High-contrast, tactile buttons designed to be unmissable on large touchscreens.

Daily Starters: Caregiver-curated prompts to help users overcome "blank screen" anxiety and start conversations easily.

The Digital Fridge: A simple way for users to "star" and save comforting messages from loved ones for emotional regulation.

Concrete Visual Feedback: A glowing microphone indicator that provides immediate proof that the device is listening.

Safety First: A dedicated "Safety Shield" for users to hide or report content that makes them feel uncomfortable.

🛠️ Technical Stack
Vanilla JavaScript (ES6+): Core logic, audio recording API, and state management.

HTML5 & CSS3: Semantic structure and advanced CSS Grid/Flexbox for a responsive "No-Scroll" layout.

Local Storage: Persistent saving of "Favorite" and "Hidden" messages without a backend requirement.

Canvas Confetti: Lightweight library for positive reinforcement upon successful message delivery.

♿ Accessibility Considerations
TalkPal was built with specific personas in mind (e.g., users with Dyspraxia or intellectual disabilities):

Action-Reaction Loop: Visual feedback (Confetti/Glows) occurs within 100ms of user input.

Zero-Scroll Interface: The layout uses viewport units (vh) to ensure all interactive elements fit on a single "pane of glass."

Simplified Navigation: Large circular avatars and color-coded paths reduce cognitive load.

🚀 Installation & Deployment
Clone the repository:

Bash
git clone https://github.com/YOUR_USERNAME/TalkPal.git
Open index.html in any modern web browser.

For the best experience, host via GitHub Pages to use it as a Progressive Web App (PWA) on a tablet or whiteboard.
