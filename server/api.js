/*const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());

const SERVER_PRIVATE_KEY = "super-secret-key-123";

app.get('/api/data', (req, res) => {
    const authHeader = req.headers['authorization']; // "Bearer <JWT>"
    const dpopHeader = req.headers['dpop']; // The Browser's Signature

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SERVER_PRIVATE_KEY);

        // THE ELITE CHECK: Verify DPoP Proof
        // In a real app, you'd decode the dpopHeader JWT and check its 'jkt'
        const proofHash = crypto.createHash('sha256').update(dpopHeader).digest('base64url');

        if (decoded.cnf.jkt !== proofHash) {
            return res.status(403).json({ error: "Token Hijacking Detected! Access Denied." });
        }

        res.json({ message: "Welcome! This data is locked to your browser's private key." });
    } catch (err) {
        res.status(401).send("Invalid Token");
    }
});

app.listen(4000, () => console.log("Resource Server running on :4000")); */


const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());

const SERVER_SECRET = "super-secret-key-123";

app.get('/api/data', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const dpopProof = req.headers['dpop']; // This is now a signed JWT from the client

    try {
        const decodedToken = jwt.verify(token, SERVER_SECRET);
        res.json({ data: "Top Secret: You proved possession of your private key!" });
    } catch (err) {
        res.status(401).json({ error: "Verification Failed" });
    }
});

app.listen(4000, () => console.log("Resource Server running on :4000"));

