import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns"; // Kazanma desenlerini içeren modül

function Board({ result, setResult }) {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]); // Oyun tahtasını tutan state
  const [player, setPlayer] = useState("X"); // Oyuncu kimliğini tutan state
  const [turn, setTurn] = useState("X"); // Sırayla hangi oyuncunun oynayacağını belirten state

  const { channel } = useChannelStateContext(); // Stream Chat SDK'dan kanal durumu
  const { client } = useChatContext(); // Stream Chat SDK'dan genel istemci durumu

  useEffect(() => {
    checkIfTie(); // Oyun berabere mi bitmiş kontrolü
    checkWin(); // Kazanan bir desenin olup olmadığını kontrol et
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X"); // Sırayı diğer oyuncuya geçir

      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      }); // Stream Chat kanalına oyun hareketi olayını gönder

      setBoard(
        board.map((val, idx) => {
          if (idx === square && val === "") {
            return player;
          }
          return val;
        })
      ); // Tahtayı güncelle, seçilen kareye oyuncu kimliğini ekle
    }
  };

  const checkWin = () => {
    Patterns.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if (board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({ winner: board[currPattern[0]], state: "won" }); // Kazanan deseni bulunduğunda sonucu güncelle
      }
    });
  };

  const checkIfTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: "none", state: "tie" }); // Tahta doluysa ve kazanan yoksa oyun berabere
    }
  };

  channel.on((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(
        board.map((val, idx) => {
          if (idx === event.data.square && val === "") {
            return event.data.player;
          }
          return val;
        })
      );
    }
  });

  return (
    <div className="board">
      {/* Tahta satırları */}
      <div className="row">
        <Square
          val={board[0]}
          chooseSquare={() => {
            chooseSquare(0);
          }}
        />
        <Square
          val={board[1]}
          chooseSquare={() => {
            chooseSquare(1);
          }}
        />
        <Square
          val={board[2]}
          chooseSquare={() => {
            chooseSquare(2);
          }}
        />
      </div>
      <div className="row">
        <Square
          val={board[3]}
          chooseSquare={() => {
            chooseSquare(3);
          }}
        />
        <Square
          val={board[4]}
          chooseSquare={() => {
            chooseSquare(4);
          }}
        />
        <Square
          val={board[5]}
          chooseSquare={() => {
            chooseSquare(5);
          }}
        />
      </div>
      <div className="row">
        <Square
          val={board[6]}
          chooseSquare={() => {
            chooseSquare(6);
          }}
        />
        <Square
          val={board[7]}
          chooseSquare={() => {
            chooseSquare(7);
          }}
        />
        <Square
          val={board[8]}
          chooseSquare={() => {
            chooseSquare(8);
          }}
        />
      </div>
    </div>
  );
}

export default Board;
