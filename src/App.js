// import logo from './logo.svg';
import "./App.css";
import ConclusionPopup from "./ConclusionPopup";
import React, { useState, useRef, useEffect } from "react";
import logo from "./logo.jpg";

const TypingSVG = () => {
  return (
    <svg height={40} width={40} style={{ marginLeft: 20 }} className="loader">
      <circle className="dot" cx={10} cy={20} r={3} style={{ fill: "grey" }} />
      <circle className="dot" cx={20} cy={20} r={3} style={{ fill: "grey" }} />
      <circle className="dot" cx={30} cy={20} r={3} style={{ fill: "grey" }} />
    </svg>
  );
};

function App() {
  const [showTyping, setShowTyping] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeSession, setActiveSession] = useState(0);
  const [sessions, setSessions] = useState([
    [
      {
        by: "bot",
        content:
          "Hi there. Let me help you to answer on 10K Forms. What information would you like to explore today?",
      },
      {
        by: "user",
        content:
          "testing",
      },
  
  ],
  ]);
  const bottomRef = useRef(null);
  let [length, setLength] = useState(0);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [styleOptions, setStyleOptions] = useState([
    "Style 1",
    "Style 2",
    "Style 3",
  ]);

  const [selectedStyle, setSelectedStyle] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [selectedStyleDoc, setSelectedStyleDoc] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  let text = "";

  const handleStyleChange = (event) => {
    setSelectedStyle(event.target.value);
  };

  const handleMaxLengthChange = (event) => {
    setMaxLength(event.target.value);
  };

  const handleStyleDocChange = (event) => {
    setSelectedStyleDoc(event.target.value);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = () => {
    // Send data to backend
    const data = {
      style: selectedStyle,
      maxLength: maxLength,
      styleDoc: selectedStyleDoc,
    };
    // Example fetch to send data to backend
    fetch("backendurl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from backend:", data);
        // Reset input fields after submission
        setSelectedStyle("");
        setMaxLength("");
        setSelectedStyleDoc("");
      })
      .catch((error) => {
        console.error("Error sending data to backend:", error);
      });
  };

  let botOutput = [{
    "response": "the revenue is 100.3 billion",
    "metadata": [{ 'abc': '1' }, { 'xyz': '2' }]
  }, {
    "response": "the revenue is 100.3 billion123, the revenue is 100.3 billion123, the revenue is 100.3 billion123, the revenue is 100.3 billion123",
    "metadata": [{ 'tetkjhfjhsjccjdhfjk shcchjhhdjhsdklfhjhsdfjdshjfhdsjjhfsjdhfsdkjfhsjkdfhskjhsfjdhsdjfkkdfsdkhsdfjhsdjfksdfkkfhsjfhskdf khsdjfhsdf kshdjfhdkjf': '1' }, { 'xyz': '2' }]
  }]
  function handleKeyPress(event) {
    if (event.target.value) {
      setValidationError(false);
      text = event.target.value;
      if (event.keyCode === 13) {
        displayText(event.target.value);
        event.target.value = "";
      }
    }
    else {
      if (event.keyCode === 13) {
        setValidationError(true);
      }
    }
  }
  const delay = (delay) => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  };
  const submit = async () => {
    text = document.getElementById("text").value;
    if (text) {
      displayText(text);
      text = "";
      document.getElementById("text").value = "";
    }
    else {
      setValidationError(true);
    }
  };
  async function displayText(text) {
    // var outputDiv = document.getElementById('output');
    // outputDiv.innerHTML += '<p class="user ff">' + text + '</p>';
    // outputDiv.innerHTML += '<p class="bot ff">' + botOutput[l] + '</p>';
    let source = [];
    setChats((chats) => [...chats, { by: "user", content: text }]);
    setShowTyping(true);
    let response = ""
    await fetch(`http://127.0.0.1:8000/ask?query=${text}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: ""
    }).then(resp => resp.json()).then(data => {
      console.log("data...", data);
      response = data;
    })
    setShowTyping(false);
    if (response.metadata.length) {
      source = response.metadata;
    }
    setChats((chats) => [...chats, { by: "bot", content: response.response, metadata: source }]);
    setLength(length + 1);
  };
  const [clickedChatIndex, setClickedChatIndex] = useState(null);

  const handleChatClick = (index) => {
    setClickedChatIndex(index === clickedChatIndex ? null : index);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  function addNewSession() {
    setSessions([...sessions, []]);
    setActiveSession(sessions.length);
  }

  function generateChatTranscript(messages) {
    let transcript = "";

    for (const message of messages) {
      transcript += `${message.by === "user" ? "You" : "Bot"}: ${message.content}\n`;

      if (message.metadata) {
        for (const metadataItem of message.metadata) {
          const key = Object.keys(metadataItem)[0];
          const value = metadataItem[key];
          transcript += `  Metadata - ${key}: ${value}\n`;
        }
      }
    }

    return transcript;
  }

  return (
    <div class="divBlock ff">
      <div class="session-column">
        {sessions.map((session, index) => (
          <div
            key={index}
            className={`session ${activeSession === index ? "active" : ""}`}
            onClick={() => setActiveSession(index)}
          >
            Session {index + 1}
          </div>
        ))}
        <div className="add-session" onClick={addNewSession}>
          <ion-icon name="add-circle"></ion-icon>
        </div>
      </div>
      <div class="header">
        <div
          style={{
            height: "100%",
            width: 160,
            paddingLeft: 5,
            background: "white",
          }}
        >
          {" "}
          <svg
            class="header__logo"
            fill="none"
            height="61"
            viewBox="0 0 154 61"
            width="154"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="#0000c9">
              <path d="m128.072 41.88c-2.848.0317-4.346-1.7021-4.346-4.7804 0-.203 0-.406.015-.609h11.168c.227-.812.374-1.7021.374-2.5159 0-3.7488-2.392-6.6241-7.309-6.6241-5.013 0-9.474 4.7488-9.474 9.7322 0 4.7804 3.239 7.6856 8.676 7.6856 2.393 0 4.754-.7803 6.413-1.9833l-1.024-2.4843c-1.32.9702-2.897 1.5494-4.493 1.5792zm-.033-11.8254c1.66 0 2.508 1.0317 2.508 3.2962 0 .2179-.018.4376-.033.6723h-6.365c.683-2.3893 2.165-3.9685 3.89-3.9685z"></path>
              <path d="m83.8752 26.3053c0-3.8902-3.1747-6.7321-7.9755-6.7321h-9.295l-7.0149 24.7905h5.8603l2.5867-9.1381h5.0958c5.8273 0 10.7426-3.6091 10.7426-8.9203zm-12.9897 6.0152h-2.0181l2.7846-9.8421h2.1151c2.6701 0 4.1663 1.7337 4.1663 4.0299 0 3.6873-3.0097 5.8122-7.0479 5.8122z"></path>
              <path d="m76.4609 60.7601h5.6275v.0354l8.6488-30.2414h5.9088l-3.8752 13.8087h5.6818l4.6554-16.5425h-11.5907l.652-2.2962c.326-1.203.879-3.2645 1.661-5.624.8131-2.4377 2.2937-3.9685 4.2808-3.9685.9605 0 1.5466.4209 1.5466 1.1397-.033.7803-.7006 1.2347-.7006 2.4843 0 1.4525 1.2869 2.5774 2.9459 2.5774 2.066 0 3.728-1.5941 3.728-3.5458 0-3.015-2.686-4.9983-6.7883-4.9983-6.0059 0-9.9626 3.6873-12.4367 12.2779"></path>
              <path d="m120.295 27.8193h-15.056l-.734 2.7338h7.277l-11.298 13.8088h15.936l.733-2.7338h-8.204z"></path>
              <path d="m150.094 27.542c-2.033 0-4.199 1.2663-5.909 3.8903l1.009-3.6091h-5.679l-4.656 16.5276h5.68l2.1-7.436c.846-3.0467 2.914-6.0151 4.281-6.0151 1.482 0 .929 2.6556 3.467 2.6556 1.84 0 2.946-1.6239 2.946-3.1082.017-1.7337-1.432-2.9051-3.239-2.9051z"></path>
            </g>
            <path
              d="m.410156 33.2891c.00197-.0056.00394-.0093.00591-.0149.007879-.0279.013788-.0558.021667-.0838z"
              fill="#fff"
            ></path>
            <path
              d="m4.62426 29.3849c4.75423-2.1527 13.01104-2.7803 23.53634-1.5605l2.9786-10.4976c-15.2038-1.8586-26.30536.2346-28.16048 6.8736l-.07568.2681c-.31436 1.5681.32212 3.2367 1.72122 4.9164z"
              fill="#3d96f7"
            ></path>
            <path
              d="m51.7063 26.2686c-4.7522 2.1509-13.013 2.7729-23.544 1.5512l-2.9787 10.4976c15.2038 1.8586 26.3054-.2346 28.1605-6.8736l.0718-.2533c.3221-1.5717-.3124-3.2422-1.7096-4.9219z"
              fill="#0000c9"
            ></path>
            <path
              d="m13.1193.795898-2.9787 10.497602c17.8041 1.2272 35.9129 8.1828 41.5636 14.9764 2.1831-.987 3.6248-2.2981 4.2089-3.8996l-2.4993 8.8234c-.0175.0838-.033.1695-.0563.2533l2.0181-7.1083c.652-2.2329.9606-3.4061.9606-4.3261-.0156-8.0952-22.1373-17.98202-43.2169-19.216702z"
              fill="#3d96f7"
            ></path>
            <path
              d="m51.7031 26.2677c1.3972 1.6816 2.0317 3.3521 1.7096 4.9219l2.4994-8.8234c-.5841 1.6034-2.0279 2.9126-4.209 3.9015z"
              fill="#3d96f7"
            ></path>
            <path
              d="m4.62421 29.3818c-2.17918.987-3.62291 2.2943-4.210883 3.8922-.273611 1.0373-.413327 1.7412-.413327 2.3427 0 8.1232 22.1217 17.9951 43.2169 19.2298l2.9631-10.4976c-17.7963-1.2273-35.8973-8.1772-41.55579-14.9671z"
              fill="#0000c9"
            ></path>
            <path
              d="m2.96206 24.1943-2.002591 7.1083c-.209574.7356-.384219 1.3539-.525875 1.8865l2.468316-8.7266c.01746-.0912.03493-.1806.06015-.2682z"
              fill="#fff"
            ></path>
            <path
              d="m4.62495 29.3821c-1.3991-1.6779-2.03559-3.3465-1.72123-4.9182l-2.468312 8.7266c-.007762.0279-.015524.0558-.021346.0838.587968-1.5979 2.031708-2.9052 4.210888-3.8922z"
              fill="#0000c9"
            ></path>
          </svg>
        </div>
        <p class="htext">PGS</p>
      </div>
      <div class="chatBlock">
        <div class="content">
          <div class="watermark">PGS</div>
          <div id="output" class="output">
            {sessions[activeSession].map((chat, index) => (
              <div key={index}>
                <p className={`${chat.by} ${isDropdownOpen ? 'hovered' : ''}`}
                  // className={`${chat.by} ff`}
                  onClick={() => handleChatClick(index)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {chat.content}
                  {chat.metadata && isDropdownOpen && clickedChatIndex != index && <span className="dropdown-icon">&#9660;</span>}
                  {chat.metadata && isDropdownOpen && clickedChatIndex === index && <span className="dropdown-icon">&#9650;</span>}
                </p>
                {chat.metadata && clickedChatIndex === index && (
                  <div className="sourceView">
                    {chat.metadata && chat.metadata.map((item, idx) => (
                      <p key={idx}><span className="sourceViewReference">Reference {Object.keys(item)[0]}:</span> {Object.values(item)[0]}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div ref={bottomRef} />
        </div>
        {showTyping && <TypingSVG />}

        <div class="text-field" onClick={handleKeyPress}>
          <input
            type="text"
            id="text"
            className={validationError ? 'errorText' : 'text'}
            placeholder="Enter your query"
            onKeyDown={handleKeyPress}
          />
          {/* {validationError && <span className="error-message">Please enter a value.</span>} */}
          <button onClick={submit} className="arrowButton">
            {/* <span class="arrow">&#10146;</span> */}
            <ion-icon class="arrow" name="send"></ion-icon>
          </button>
        </div>
      </div>

      <div className="input-column">
        <h3>Style Options</h3>
        <select value={selectedStyle} onChange={handleStyleChange}>
          <option value="">Select Style</option>
          {styleOptions.map((style, index) => (
            <option key={index} value={style}>
              {style}
            </option>
          ))}
        </select>
        <h3>Max Length</h3>
        <input
          type="number"
          value={maxLength}
          onChange={handleMaxLengthChange}
        />
        <h3>Style Doc</h3>
        <select value={selectedStyleDoc} onChange={handleStyleDocChange}>
          <option value="">Select Style Doc</option>
          {/* Add options for style docs here */}
        </select>
        <button onClick={handleSubmit}>Submit</button><br />
        <button
          className="header-button"
          onClick={() => {
            const transcript = generateChatTranscript(sessions[activeSession]);
            const blob = new Blob([transcript], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "chat_transcript.txt";
            link.click();
          }}>
          <i className="fas fa-download"></i> Download Chat </button>
        <br />
        <div className="divBlock ff">
          <button className="header-button" id="concludeButton" onClick={() => setIsPopupOpen(true)}>
            Conclude
          </button>
          <ConclusionPopup isOpen={isPopupOpen} onClose={handlePopupClose} />
        </div>
      </div>
    </div >
  );
}

export default App;
