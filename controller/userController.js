const admin = require('../firebaseAdmin.js')
const pool = require('../db.js')
const verifyUser = async (req, res) => {
    const { token, publicKey } = req.body
    try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        const uid = decodedToken.uid
        const email = decodedToken.email

        //get user record
        const userRecord = await admin.auth().getUser(uid);
        const displayName = userRecord.displayName
        const creationTime = userRecord.metadata.creationTime
        console.log(userRecord)
        const { rows } = await pool.query('SELECT * FROM users WHERE uid = $1', [uid]);

        if (rows.length === 0) {
            await pool.query(
                'INSERT INTO users (uid, email, "displayName", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
                [uid, email, displayName, creationTime, new Date()]
            )
            console.log('New user created')
        }
        else {
            console.log(rows)
            console.log('user already exists')
        }
        res.status(200).json({ success: true, message: 'User verified and user created' })
    } catch (error) {
        console.error('Error verifying Firebase ID token', error)
    }
}

module.exports = { verifyUser } 