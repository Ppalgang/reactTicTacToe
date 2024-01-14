import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());

app.use(express.json());

// Stream Chat API anahtarları (Aktif çalışıyor.)
const api_key = "xycjnpn7kcht";
const api_secret =
  "e5845w8emd7858sthb65g3djtre6a4r2z32dsw9aa79xwamb8qtsu2avghjy3bbe";

// Stream Chat istemcisini oluştur
const serverClient = StreamChat.getInstance(api_key, api_secret);

// Kullanıcı kaydolma endpoint'i
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;

    // Kullanıcıya benzersiz bir kimlik ataması yap
    const userId = uuidv4();

    // Şifreyi bcrypt kullanarak hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = serverClient.createToken(userId);

    // Kullanıcı bilgilerini JSON formatında yanıtla
    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});

// Kullanıcı girişi endpoint'i
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Stream Chat üzerinde kullanıcıyı sorgula
    const { users } = await serverClient.queryUsers({ name: username });

    if (users.length === 0) return res.json({ message: "Kullanıcı Bulunamadı" });

    // Stream Chat için kullanıcı token'ını oluştur
    const token = serverClient.createToken(users[0].id);

    // Şifre eşleşiyorsa kullanıcı bilgilerini JSON formatında yanıtla
    const passwordMatch = await bcrypt.compare(
      password,
      users[0].hashedPassword
    );

    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        userId: users[0].id,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
