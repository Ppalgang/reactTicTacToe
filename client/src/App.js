import React from 'react';
import "./App.css";
import "./MyStyle.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { useState } from "react";
import JoinGame from "./components/JoinGame";

function App() {
  const api_key = "*";

  const cookies = new Cookies();

  // Tarayıcı çerezlerinden token'ı al
  const token = cookies.get("token");

  const client = StreamChat.getInstance(api_key);

  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    // Tarayıcı çerezlerini temizle
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");

    // Stream Chat kullanıcısını bağlantıdan çıkart
    client.disconnectUser();
    setIsAuth(false);
  };

  // Eğer token varsa, kullanıcıyı bağla ve oturumu açık yap
  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      });
  }

  return (
    <div className="App">
      <div className='wave'></div>
      <div className='wave'></div>
      <div className='wave'></div>
      {isAuth ? (
        // Oturum açıkken, sohbet arayüzünü ve oyun katılma bileşenini göster
        <Chat client={client}>
          <JoinGame />
          <button onClick={logOut} className='glow-on-hover'> Çıkış Yap</button>
        </Chat>
      ) : (
        // Oturum kapalıysa, kayıt ve giriş bileşenlerini göster
        <>
          <SignUp setIsAuth={setIsAuth} />
          <Login setIsAuth={setIsAuth} />
        </>
      )}
      
    </div>
  );
}

export default App;
