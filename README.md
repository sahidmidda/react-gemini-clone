# Phoenix AI ✨

Phoenix AI is a simple, responsive AI chatbot built with React (Vite) and Tailwind CSS, powered by the Google Gemini API. It features a clean and minimal design, enabling users to chat seamlessly without the need for any sign-in.

---

## Features 🚀

- **Responsive Design**: Optimized for all screen sizes with a clean, minimal interface.
- **AI Context Memory**: The AI remembers user-provided context and uses it in future responses during the session.
- **Chat Functionality**: 
  - User inputs a message, clicks the send button, and receives an AI-generated response.
  - Responses with code are beautifully highlighted using markdown and syntax highlighting for a Code-Editor like experience.
- **Message History Persistence**: Chat history and context are saved in the browser's `localStorage`, persisting even after a refresh.
- **Delete Chat**: Users can clear the entire chat history and start fresh with a single click.
- **No Sign-In Required**: Direct access to chat - no account or login needed!

---

## Tech Stack 🛠️

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **AI API**: Google Gemini API
- **UI Components**: 
  - `@headlessui/react`
  - `@heroicons/react`
  - `lucide-react`
- **Markdown Rendering**: `react-markdown`
- **Syntax Highlighting**: `react-syntax-highlighter`

---

## Installation & Setup ⚙️

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/sahidmidda/react-gemini-clone.git
   cd react-gemini-clone
   
2. **Install Dependencies**:

   ```bash
   npm install
   
3. **Add Environment Variables**:

   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_RESPONSE_DELAY_IN_MS=delay_you_want_in_ms
   
4. **Run the Application**:

   ```bash
   npm run dev
   
5. **Access the App**:

    Open your browser and navigate to
  
   ```bash
   http://localhost:5173
   
---
   
## Usage 📖

1. Type a message in the input field and click the send button to chat with the AI.
2. Provide information about yourself for better context in responses.
3. If the AI response contains code, it will be displayed with syntax highlighting.
4. To clear the chat history, click the **Trash Icon** button.
5. All chat history is saved locally and persists across page refreshes.


---

## Future Improvements 🔮
- Add user management (login, sessions).
- Support for multiple chat threads.
- Enhance UI/UX for a more interactive experience.

---

## Screenshots

![Startup Page](https://github.com/sahidmidda/react-gemini-clone/blob/main/phoenix-app-startup.png)
![In Between Conversation](https://github.com/sahidmidda/react-gemini-clone/blob/main/phoenix-app-in-between-convo.png)
![Delete Context Modal](https://github.com/sahidmidda/react-gemini-clone/blob/main/phoenix-app-delete-context-modal.png)

Enjoy chatting with your own **Gemini Clone**! 💬✨
