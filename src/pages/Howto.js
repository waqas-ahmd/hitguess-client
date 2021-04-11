import React from "react";
import { useNavigate } from "react-router";
import styles from "./Howto.module.css";

const Howto = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.main}>
      <h3>Game Rules</h3>
      <div className={styles.list}>
        <ul>
          <li>This is a multiplayer numbers guessing game</li>
          <li>There are players in each game</li>
          <li>
            Create the room and send the room code to someone you want to play
            with
          </li>
          <li>Once the second player joins the game, the game will start</li>
          <li>
            One player will click any of the six numbers and the other will try
            to guess it
          </li>
          <li>
            The incorrect guess will add the score of the player who is hitting
            the number
          </li>
          <li>If the guess is correct, the player roles will be swapped</li>
        </ul>
      </div>
      <button
        onClick={() => {
          navigate("/");
        }}
        className={styles.home}
      >
        Home
      </button>
    </div>
  );
};

export default Howto;
