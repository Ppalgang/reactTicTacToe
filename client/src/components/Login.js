import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function Login({ setIsAuth }) {
  // Kullanıcı adı ve şifre durumlarını saklamak için state kullanılır.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Hata durumu için state kullanılır.
  const [error, setError] = useState("");

  // Tarayıcı çerezlerini kullanmak için bir nesne oluşturulur.
  const cookies = new Cookies();

  // Giriş fonksiyonu, sunucuya kullanıcı adı ve şifreyi gönderir.
  const login = () => {
    Axios.post("http://localhost:3001/login", {
      username,
      password,
    })
      .then((res) => {
        // Sunucudan gelen cevap üzerinden giriş bilgileri alınır.
        const { firstName, lastName, username, token, userId } = res.data;

        // Çerezlere giriş bilgileri eklenir.
        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("username", username);
        cookies.set("firstName", firstName);
        cookies.set("lastName", lastName);

        // Başarılı giriş durumu kontrol edilir ve ana bileşene bildirilir.
        if (userId && token) {
          setIsAuth(true);
        } else {
          setError("Yanlış kullanıcı adı veya şifre");
        }
      })
      .catch((error) => {
        setError("Yanlış kullanıcı adı veya şifre");
      });
  };

  return (
    <div className="login">
      <form>
        <span className="text-center">Gİrİş Yap</span>
        <div className="input-container">
          <input onChange={(event) => {
            setUsername(event.target.value);
          }}></input>
          <label>Kullanıcı Adı</label>
        </div>
        <div className="input-container">
          <input type="password" onChange={(event) => {
            setPassword(event.target.value);
          }}></input>
          <label>Şifre</label>
        </div>
      </form>
      <button onClick={login} className='glow-on-hover'> Giriş Yap</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;