const admin = require('../firebaseAdmin.js');
const { user } = require('../models'); // Import the Sequelize user model

const signup = async (req, res) => {
    const { token, publicKey } = req.body;
    if (!publicKey) {
        return res.status(400).json({ success: false, message: 'Public key is required for signup.' });
    }
    const encodedKey = Buffer.from(publicKey).toString('base64');

    try {
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // Get additional user details from Firebase
        const userRecord = await admin.auth().getUser(uid);
        const displayName = userRecord.displayName;
        const creationTime = userRecord.metadata.creationTime;



        const newUser = await user.create({
            uid,
            email,
            displayName,
            createdAt: new Date(creationTime),
            updatedAt: new Date(),

        }, { publicKey: encodedKey });

        res.status(200).json({ success: true, message: 'User verified and created/exists.', user: newUser });
    } catch (error) {
        console.error('Error during signup process', error);
        res.status(500).json({ success: false, message: 'Internal server error during signup.' });
    }
};
const login = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Find user in the database using Sequelize
        const existingUser = await user.findOne({ where: { uid } });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User does not exist. Please sign up first.' });
        }

        res.status(200).json({ success: true, message: 'User login verified.', user: existingUser });
    } catch (error) {
        console.error('Error during login process', error);
        res.status(500).json({ success: false, message: 'Internal server error during login.' });
    }
};

module.exports = { login, signup }