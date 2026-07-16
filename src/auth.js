// JWKS-verified Keycloak JWT middleware — the fundamentals done right:
// keys fetched from the realm's JWKS endpoint (survives key rotation),
// RS256 enforced, issuer validated. Audience validation activates when
// KC_RESOURCE is set — it requires an audience mapper on your realm's
// client (Keycloak does not put your API in `aud` by default).
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const authServerUrl = (process.env.KC_AUTH_SERVER_URL || 'http://localhost:8080').replace(/\/$/, '');
const realm = process.env.KC_REALM || 'your-realm';
// The issuer as minted in tokens — override when clients reach Keycloak on
// a different URL than this server does (Docker/internal networks).
const issuer = process.env.KC_ISSUER || `${authServerUrl}/realms/${realm}`;
const audience = process.env.KC_RESOURCE || undefined;

const client = jwksClient({
    jwksUri: `${authServerUrl}/realms/${realm}/protocol/openid-connect/certs`,
    cache: true,
    rateLimit: true
});

const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        callback(null, key.getPublicKey());
    });
};

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(401).json({error: 'No token provided'});
    }

    const token = bearerHeader.split(' ')[1];

    jwt.verify(token, getKey, {
        algorithms: ['RS256'],
        issuer,
        ...(audience ? {audience} : {})
    }, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                error: 'Invalid token',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        req.user = {
            id: decoded.sub,
            username: decoded.preferred_username,
            email: decoded.email,
            roles: decoded.realm_access?.roles || []
        };

        next();
    });
};

module.exports = {verifyToken};
