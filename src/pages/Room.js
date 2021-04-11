import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styles from "./Room.module.css";
import queryString from "query-string";
import { socket } from "../socket";

const Room = () => {
  const [waiting, setWaiting] = useState(false);
  const [isMyTurn, setMyTurn] = useState();
  const [isMyRound, setMyRound] = useState(null);
  const [round, setRound] = useState(1);
  const [hittedNumber, setHittedNumber] = useState("?");
  const [guessedNumber, setGuessedNumber] = useState("?");
  const [showHit, setShowHit] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [interval, setInterval] = useState(false);
  const [oppoScore, setOppoScore] = useState(0);

  const navigate = useNavigate();

  const room = queryString.parse(useLocation().search).id;
  const player = queryString.parse(useLocation().search).player;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (player === "1") {
      setWaiting(true);
    } else {
      socket.emit("joined", { room });
    }

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (round === 2 && isMyRound && userScore > oppoScore) {
    setRound(3);
  } else if (round === 2 && !isMyRound && userScore < oppoScore) {
    setRound(3);
  }

  useEffect(() => {
    socket.on("start", ({ round }) => {
      setInterval(true);
      setWaiting(false);
      if (round === socket.id) {
        setMyRound(true);
        setMyTurn(true);
      } else {
        setMyRound(false);
        setMyTurn(false);
      }
    });

    socket.on("hitted", ({ player, num }) => {
      setHittedNumber(num);
      if (player !== socket.id) {
        setMyTurn(true);
        setShowHit(false);
        setGuessedNumber("?");
      } else {
        setShowHit(true);
      }
      console.log("hitted");
    });

    socket.on("guessed", ({ guessed, player, score, num }) => {
      setShowHit(true);
      setGuessedNumber(num);
      console.log("guessed");
      if (guessed) {
        setInterval(true);
        setMyRound((prev) => !prev);
        setRound((prev) => prev + 1);
        if (player !== socket.id) {
          setMyTurn(false);
        } else {
          setMyTurn(true);
        }
      } else {
        if (player === socket.id) {
          setOppoScore((prevScore) => prevScore + score);
        } else {
          setUserScore((prevScore) => prevScore + score);
        }
        if (player !== socket.id) {
          setMyTurn(true);
        }
      }
    });
  }, []);

  const handleGuess = (num) => {
    socket.emit("guess", { num, player: socket.id, room });
  };

  const handleHit = (num) => {
    if (isMyRound) {
      setGuessedNumber("?");
    }
    socket.emit("hit", { num, player: socket.id, room });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setInterval(false);
    let num = Number(e.target.textContent);
    setMyTurn(false);
    if (isMyRound) {
      handleHit(num);
    } else {
      handleGuess(num);
    }
  };

  return (
    <div className={styles.main}>
      {round < 3 ? (
        <>
          {waiting ? (
            <>
              <div>
                Invite using this code{" "}
                <span className={styles.roomCode}>{room}</span>
              </div>
              <div>Waiting for the other player to join</div>
            </>
          ) : (
            isMyRound !== null &&
            (isMyRound ? (
              <div>
                {isMyTurn
                  ? "Hit the Number"
                  : "Opponent is Guessing, Please Wait!"}{" "}
              </div>
            ) : (
              <div>
                {isMyTurn
                  ? "Guess the Number"
                  : "Opponent is Hitting, Hang On!"}
              </div>
            ))
          )}
        </>
      ) : (
        <div>Game Over !</div>
      )}
      <div className={styles.gameplay}>
        <div className={styles.cards}>
          <div className={styles.scoreCard}>
            <span>My Score</span>
            <span>{userScore}</span>
          </div>
          <div className={styles.card}>
            <span>Hit</span>
            <span className={styles.number}>
              {showHit ? hittedNumber : "?"}
            </span>
          </div>

          <div className={styles.card}>
            <span>Guess</span>
            <span className={styles.number}>{guessedNumber}</span>
          </div>
          <div className={styles.scoreCard}>
            <span>Not My Score</span>
            <span>{oppoScore}</span>
          </div>
        </div>
        <div className={styles.buttons}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              disabled={!isMyTurn || round === 3}
              onClick={handleClick}
              className={styles.numberBtns}
              key={num}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      {round > 2 ? (
        <>
          {oppoScore === userScore ? (
            <div className={styles.tieText}>Game Tied!</div>
          ) : oppoScore > userScore ? (
            <div className={styles.loseText}>You Lose!</div>
          ) : (
            <div className={styles.winText}>You Win!</div>
          )}
          <button
            className={styles.home}
            onClick={() => {
              navigate("/");
            }}
          >
            HOME
          </button>
        </>
      ) : null}
      {interval && round < 3 ? (
        <div className={styles.interval}>
          {round === 1
            ? isMyRound
              ? "You'll Go First. Start Hitting!"
              : "Opponent will be hitting first. Try to Guess their Hits"
            : round === 2
            ? isMyRound
              ? "You Guessed it Right! Now Start Hitting!"
              : "Opponent Guessed It! Now they'll be Hitting."
            : null}
        </div>
      ) : null}
    </div>
  );
};

export default Room;
