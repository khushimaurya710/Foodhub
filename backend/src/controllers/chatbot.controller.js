const jwt = require('jsonwebtoken');

async function getChatbotToken(req, res) {
    const secret = process.env.CHATBOT_IDENTITY_SECRET;
    if (!secret) {
        return res.status(500).json({ message: 'CHATBOT_IDENTITY_SECRET not configured' });
    }

    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const payload = {
        user_id: user._id.toString(),
        email: user.email,
        role: 'user',
    };

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return res.status(200).json({ token });
}

module.exports = {
    getChatbotToken,
};

