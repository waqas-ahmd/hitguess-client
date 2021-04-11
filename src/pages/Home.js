import React, { useState } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { ERRORS, generateCode } from "../utils";

import { socket } from "../socket";

const Home = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    socket.emit("join", { room: code }, (error) => {
      if (!error) {
        navigate(`/room?id=${code}&player=2`);
      } else {
        alert(ERRORS[error]);
      }
    });
  };
  const handleCreate = () => {
    const newCode = generateCode(8);
    socket.emit("create", { room: newCode });
    navigate(`/room?id=${newCode}&player=1`);
    console.log(socket);
  };

  return (
    <div className={styles.main}>
      <h3>HIT OR GUESS</h3>

      <button onClick={() => navigate("/how-to-play")}>How To Play</button>
      <button onClick={handleCreate}>Create New Room</button>
      <div className={styles.orText}>OR</div>
      <input
        onChange={(e) => {
          setCode(e.target.value);
        }}
        type="text"
        placeholder="Enter Join Code"
      />
      <button disabled={code === ""} onClick={handleJoin}>
        Join Room
      </button>
    </div>
  );
};

export default Home;
