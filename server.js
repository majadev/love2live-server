import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servern fungerar!");
});

app.get("/api/secret", (req, res) => {
    res.json({ mail: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});
