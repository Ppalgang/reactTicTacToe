import React, { useState } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import "./Chat.css";

function Game({ channel, setChannel }) {
  // Oyuncuların oyun kanalına katılıp katılmadığını izlemek için state kullanılır.
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  // Oyunun sonucunu saklamak için state kullanılır.
  const [result, setResult] = useState({ winner: "none", state: "none" });

  // Oyuncu katılma olayını dinle ve oyuncuların katılıp katılmadığını güncelle
  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  if (!playersJoined) {
    return <div> Diğer oyuncunun katılması bekleniyor...</div>;
  }

  return (
    <div className="gameContainer">

      {result.state === "won" && <div className="final-text"> {result.winner} Oyunu Kazandı</div>}
      {result.state === "tie" && <div className="final-text"> Oyun Berabere</div>}

      {/* Oyun tahtası bileşeni */}
      <Board result={result} setResult={setResult} />

      {/* Stream Chat mesajlarını gösteren pencere */}
      <Window>
        <MessageList
          disableDateSeparator
          closeReactionSelectorOnClick
          hideDeletedMessages
          messageActions={["react"]}
        />
        <MessageInput noFiles />
      </Window>

      <button className="glow-on-hover"
        onClick={async () => {
          // Oyuncuyu oyun kanalından izlemeyi durdur
          await channel.stopWatching();
          setChannel(null);
        }}
      >
        {" "}
        Oyundan Çık
      </button>
    </div>
  );
}

export default Game;
