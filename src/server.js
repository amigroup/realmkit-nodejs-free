const express = require('express');
const cors = require('cors');
const {verifyToken} = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({origin: process.env.CORS_ORIGIN || 'http://localhost:4200'}));

// Public route — no token required.
app.get('/health', (req, res) => {
    res.json({status: 'ok'});
});

// Guarded route — requires a valid Keycloak-issued token.
app.get('/me', verifyToken, (req, res) => {
    res.json({user: req.user});
});

app.listen(port, () => {
    console.log(`listening on :${port} — GET /health (public), GET /me (guarded)`);
});
