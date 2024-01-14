import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function SignUp({ setIsAuth }) {
  const cookies = new Cookies(); // Tarayıcı çerezlerini kullanabilmek için yeni bir Cookies nesnesi oluşturulur.
  const [user, setUser] = useState(null);

  // Kullanıcı kaydı fonksiyonu
  const signUp = () => {
    Axios.post("http://localhost:3001/signup", user).then((res) => {
      // Sunucuya kullanıcı bilgilerini içeren POST isteği yapılır.

      const { token, userId, firstName, lastName, username, hashedPassword } =
        res.data; // Sunucudan gelen yanıttan gerekli bilgiler çıkarılır.

      // Çerezlere kullanıcı bilgileri eklenir.
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("username", username);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      cookies.set("hashedPassword", hashedPassword);

      setIsAuth(true);
    });
  };

  return (
    <div className="signUp">
      <form>
        <span className="text-center">Hesap Oluştur</span>

        {/* İsim girişi */}
        <div className="input-container">
          <input
            onChange={(event) => {
              setUser({ ...user, firstName: event.target.value });
            }}
          ></input>
          <label>İsim</label>
        </div>

        {/* Soyisim girişi */}
        <div className="input-container">
          <input
            onChange={(event) => {
              setUser({ ...user, lastName: event.target.value });
            }}
          ></input>
          <label>Soy İsim</label>
        </div>

        {/* Kullanıcı adı girişi */}
        <div className="input-container">
          <input
            onChange={(event) => {
              setUser({ ...user, username: event.target.value });
            }}
          ></input>
          <label>Kullanıcı Adı</label>
        </div>

        {/* Şifre girişi */}
        <div className="input-container">
          <input
            type="password"
            onChange={(event) => {
              setUser({ ...user, password: event.target.value });
            }}
          ></input>
          <label>Şifre</label>
        </div>
      </form>

      <button onClick={signUp} className="glow-on-hover">
        {" "}
        Hesap Oluştur
      </button>
    </div>
  );
}

export default SignUp;
