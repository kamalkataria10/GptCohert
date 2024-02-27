import "./App.css";
import "./styles/reset.css";
import { useState } from "react";

import { makeRequest } from "./api/api";
import SideMenu from "./components/SideMenu/Sidemenu";
import ChatMessage from "./components/ChatMessage/ChatMessage";

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you?",
    },
  ]);

  async function handleSubmit(e) {
    e.preventDefault();

    let response = await makeRequest({ prompt: input });
    console.log(response);
    // Ensure response and generations array exist
    setChatLog([
      ...chatLog,
      {
        user: "me",
        message: input,
      },
      {
        user: "gpt",
        message: response.data,
      },
    ]);
    setInput("");
  }

  return (
    <div className="App">
      <SideMenu></SideMenu>

      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows="1"
              className="chat-input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
