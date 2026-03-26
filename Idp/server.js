const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const users = {}; // Simulated DB
const SERVER_SECRET = "super-secret-key-123";

app.post('/register', (req, res) => {
    const { username, publicKeyJWK } = req.body;
    // Calculate JWK Thumbprint (jkt) to bind to future tokens
    const jkt = crypto.createHash('sha256').update(JSON.stringify(publicKeyJWK)).digest('base64url');
    users[username] = { publicKey: publicKeyJWK, jkt };
    res.json({ message: "Registered successfully!" });
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (!users[username]) return res.status(401).send("User not found");

    // Bind token to the user's specific key thumbprint
    const accessToken = jwt.sign({
        sub: username,
        cnf: { jkt: users[username].jkt } 
    }, SERVER_SECRET, { expiresIn: '1h' });

    res.json({ accessToken, publicKeyJWK: users[username].publicKey });
});

app.listen(3000, () => console.log("IdP running on :3000"));

