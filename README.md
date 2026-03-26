Project : AuthX

A security-focused middleware Identity Provider (IdP) that provides secure authentication and authorization to applications. It replaces traditional password-based logins with a hardware-bound system, ensuring user identities are tied to a physical device rather than a shared secret.

Core Features:

.  Passwordless Authentication: Implements an asymmetric challenge-response handshake to eliminate credential-based vulnerabilities.

.  Cryptographic Authorization: Utilizes DPoP-constrained JWTs to ensure access tokens are locked to the originating hardware.

.  Identity Middleware: Functions as a centralized gatekeeper for identity verification and secure API access.


Key Mechanisms: 

. Registration: Generates local RSA/ECDSA key pairs on the client device; only the Public Key is stored server-side.

. Verification: Uses the Web Crypto API to sign server-issued nonces locally, proving possession of the device.

. Binding: Issues tokens that are cryptographically bound to the user's hardware, rendering intercepted tokens useless on other devices.
