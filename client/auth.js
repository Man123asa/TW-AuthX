async function signup(username) 
{
    const keyPair=await window.crypto.subtle.generateKey(
        {name:"RSASSA-PKCS1-v1_5",modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},
        // non extractable nature of the tokens
        false,["sign","verify"] 
    );
    // saving to IndexedDB
    const db=await idb.openDB('SentinelDB',1,{upgrade(db){db.createObjectStore('keys');}});
    await db.put('keys',keyPair,username);
    const pub=await window.crypto.subtle.exportKey("jwk",keyPair.publicKey);
    await fetch('http://localhost:3000/register',
    {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username,publicKeyJWK:pub})
    });
    alert("Key created & registered");
}
async function accessData(username) 
{
    const authRes = await fetch('http://localhost:3000/login', 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    const {accessToken}=await authRes.json();
    const db=await idb.openDB('SentinelDB',1);
    const keyPair=await db.get('keys',username);
    
    // create DPoP JWT token (signed by private key)
    const header={alg:"RS256",typ:"dpop+jwt",jwk:await window.crypto.subtle.exportKey("jwk",keyPair.publicKey)};
    const payload={iat:Math.floor(Date.now()/1000),jti:crypto.randomUUID()};
    
    // result of signing payload
    const dpopProof="eyJhbGciOiJSUzI1NiIs...";
    const res=await fetch('http://localhost:4000/api/data', 
    {
        headers:{'Authorization':`Bearer ${accessToken}`,'DPoP':dpopProof}
    });
    console.log(await res.json());
}

