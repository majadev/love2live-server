import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

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

app.get("/api/facebook", async (req, res) => {
    const pageId = "661527893700232";
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,created_time,permalink_url,attachments{media,subattachments{media}}&limit=10&access_token=${accessToken}`;

    try {
        const response = await axios.get(url);

        const posts = response.data.data.map(post => {
            const media = post.attachments ? post.attachments.data.map(att => att.media) : null;
            return { ...post, media };
        });

        res.status(200).json({
            posts,
            nextPage: response.data.paging?.next || null,
        });
    } catch (error) {
        console.error("Fel vid hämtning av Facebook-inlägg:", error);
        res.status(500).json({ error: "Något gick fel när vi hämtade inläggen" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});
