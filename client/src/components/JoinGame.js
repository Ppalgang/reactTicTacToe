import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

function JoinGame() {
  // Rakip kullanıcı adını saklamak için state kullanılır.
  const [rivalUsername, setRivalUsername] = useState("");

  // Stream Chat bağlamasını kullanmak için gerekli bilgiler alınır.
  const { client } = useChatContext();

  // Oluşturulan oyun kanalını saklamak için state kullanılır.
  const [channel, setChannel] = useState(null);

  // Oyun kanalı oluşturma veya katılma fonksiyonu
  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: rivalUsername } });

    if (response.users.length === 0) {
      alert("Kullanıcı bulunamadı");
      return;
    }

    // Yeni bir oyun kanalı oluştur ve kullanıcıları ekleyerek ayarla
    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();

    setChannel(newChannel);
  };

  return (
    <>
      {/* Eğer bir oyun kanalı varsa, oyun bileşeni ve özel giriş bileşeni ile göster */}
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel} />
        </Channel>
      ) : (
        <div className="joinGame">
          <form>
            <span className="text-center">Oyun Kur</span>
            <div className="input-container">
              <input onChange={(event) => {
                setRivalUsername(event.target.value);
              }}></input>
              <label>Rakibin Kullanıcı Adı...</label>
            </div>
          </form>
          <button onClick={createChannel} className='glow-on-hover'> Oyun Kur/Katıl</button>
        </div>
      )}
    </>
  );
}

export default JoinGame;
