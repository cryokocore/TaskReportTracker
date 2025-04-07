// import React, { useState, useEffect } from "react";
// import "antd/dist/reset.css";
// import AuthForm from "./Login";
// import MithranTracker from "./Mithran"; // Change this dynamically based on username
// import OtherUser from "./OtherUser";


// function App() {
//   const [user, setUser] = useState(null);


//   return (

//     <div>
//     {user?.employeeId === "ST006" ? (
//       <MithranTracker username={user.username} setUser={setUser} user={user}/>
//     ) : user ? (
//       <OtherUser username={user.username} setUser={setUser}  user={user} />
//     ) : (
//       <AuthForm setUser={setUser} />
//     )}
//   </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import "antd/dist/reset.css";
import AuthForm from "./Login";
import MithranTracker from "./Mithran"; // For user ST006
import OtherUser from "./OtherUser"; // For other users
import Admin from "./Admin"; // Import Admin component

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {/* Show Admin panel only for ST001 or ST002 */}
      {user?.employeeId === "ST001" || user?.employeeId === "ST002" ? (
        <Admin username={user.username} setUser={setUser} user={user} />
      ) : user?.employeeId === "ST006" ? (
        <MithranTracker username={user.username} setUser={setUser} user={user} />
      ) : user ? (
        <OtherUser username={user.username} setUser={setUser} user={user} />
      ) : (
        <AuthForm setUser={setUser} />
      )}
    </div>
  );
}

export default App;
