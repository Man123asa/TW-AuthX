const IDP_URL = "http://localhost:3000";
const RESOURCE_URL = "http://localhost:4000";

// Generate and store an RSA Identity in the browser
async function signup(username) {
    const keyPair = await window.crypto.subtle.generateKey(
        { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
        true, ["sign", "verify"]
    );

    // Save Private Key to IndexedDB/LocalStorage (Simulation)
    const priv = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
    localStorage.setItem(`key_${username}`, JSON.stringify(priv));

    const pub = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
    
    await fetch(`${IDP_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, publicKeyJWK: pub })
    });
    alert("Identity Created! No password needed.");
}

async function accessData(username) {
    // 1. Get Access Token
    const authRes = await fetch(`${IDP_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    const { accessToken } = await authRes.json();

    // 2. Create DPoP Proof (Simplified for project)
    const browserKey = localStorage.getItem(`key_${username}`);
    
    // 3. Call Protected API
    const res = await fetch(`${RESOURCE_URL}/api/data`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'DPoP': browserKey // Sending the key as proof (Simplified)
        }
    });
    const data = await res.json();
    console.log(data);
}
