Project : AuthX

A security-focused middleware Identity Provider (IdP) that provides secure authentication and authorization to applications. It replaces traditional password-based logins with a hardware-bound system, ensuring user identities are tied to a physical device rather than a shared secret.

Core Features
Passwordless: Users log in using asymmetric key pairs (RSA/ECDSA) instead of passwords.
Hardware Binding: Uses DPoP (Demonstrating Proof-of-Possession) to ensure JWTs cannot be used if stolen and moved to a different device.
Middleware Design: Acts as a centralized Identity Provider (IdP) for applications and users for api access.
