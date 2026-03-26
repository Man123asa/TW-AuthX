require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { calculateJwkThumbprint } = require('jose');
const cors = require('cors');
const User = require('./User');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

app.post('/register', async (req, res) => {
    const { username, publicKeyJWK } = req.body;
    const jkt = await calculateJwkThumbprint(publicKeyJWK); // Generate Fingerprint
    await User.findOneAndUpdate({ username }, { publicKey: publicKeyJWK, jkt }, { upsert: true });
    res.json({ message: "Identity Registered" });
});

app.post('/login', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("User not found");

    const accessToken = jwt.sign({
        sub: username,
        cnf: { jkt: user.jkt } // Hardware Binding
    }, process.env.SERVER_SECRET, { expiresIn: '1h' });

    res.json({ accessToken });
});

app.listen(3000, () => console.log("IdP on :3000"));


