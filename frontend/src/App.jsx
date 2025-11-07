// import React, { useEffect, useState } from "react";
// import socket from "./socket";

// function App() {
//   const [userId, setUserId] = useState("");
//   const [receiverId, setReceiverId] = useState("");
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);

//   useEffect(() => {
//     // Join room when userId changes
//     if (userId) {
//       socket.emit("join", userId);
//     }
// git 
//     // Listen for messages
//     socket.on("message", (data) => {
//       setChat((prev) => [...prev, data]);
//     });

//     return () => socket.off("message");
//   }, [userId]);

//   const sendMessage = () => {
//     socket.emit("message", {
//       senderId: userId,
//       receiverId,
//       message,
//     });
//     setChat((prev) => [...prev, { senderId: userId, message }]);
//     setMessage("");
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>🔮 Astrology Chat</h2>
//       <input
//         placeholder="Your ID"
//         value={userId}
//         onChange={(e) => setUserId(e.target.value)}
//       />
//       <input
//         placeholder="Receiver ID"
//         value={receiverId}
//         onChange={(e) => setReceiverId(e.target.value)}
//       />
//       <div style={{ marginTop: 20, border: "1px solid #ccc", height: 200, overflowY: "auto", padding: 10 }}>
//         {chat.map((c, i) => (
//           <div key={i}>
//             <b>{c.senderId}:</b> {c.message}
//           </div>
//         ))}
//       </div>
//       <div style={{ marginTop: 10 }}>
//         <input
//           placeholder="Type message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }
// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

