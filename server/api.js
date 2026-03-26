require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const {importJWK,jwtVerify}=require('jose');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const User=require('./User');
const app=express();
app.use(cors());
mongoose.connect(process.env.MONGO_URI);
app.get('/api/data', async (req, res) => {
    const authHeader=req.headers['authorization'];
    const dpopProof=req.headers['dpop']; // The Signed Proof
    try 
    {
        const token=authHeader.split(' ')[1];
        const decodedToken=jwt.verify(token,process.env.SERVER_SECRET);
        const user=await User.findOne({username: decodedToken.sub});
        const publicKey=await importJWK(user.publicKey,'RS256');
        // To verify the DPoP signature against the user's public key
        await jwtVerify(dpopProof,publicKey);
        res.json({secret:"Access Granted: Token belongs to this hardware." });
    } 
    catch (err) 
    {
        res.status(401).json({ error:"Invalid Proof or Hijacked Token" });
    }
});
app.listen(4000,() => console.log("Vault on:4000"));
