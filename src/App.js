import React, { useState } from "react";
import "antd/dist/reset.css";
import AuthForm from "./Login";
import MithranTracker from "./Mithran"; 
import OtherUser from "./OtherUser"; 
import Admin from "./Admin"; 

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user?.employeeId === "ST001" || user?.employeeId === "ST002" ? (
        <Admin username={user.username} setUser={setUser} user={user} />
      ) : user?.employeeId === "ST006" ? (
        <MithranTracker username={user.username} designation={user.designation} mailid={user.mailid} setUser={setUser} user={user} />
      ) : user ? (
        <OtherUser username={user.username} designation={user.designation} mailid={user.mailid} setUser={setUser} user={user} />
      ) : (
        <AuthForm setUser={setUser} />
      )}
    </div>
  );
}

export default App;
