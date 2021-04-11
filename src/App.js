import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { useEffect } from "react";
import { connectSocket } from "./socket";
import Howto from "./pages/Howto";

function App() {
  useEffect(() => {
    connectSocket();
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/how-to-play" element={<Howto />} />
      </Routes>
    </div>
  );
}

export default App;
