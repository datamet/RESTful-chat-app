const validator = require('../../routes/api/tokens/validator')
const db = require('../db.js')
const conns = require('./connections')

// Validating token from websocket connection
const handleMessage = async (conn, tokenID) => {
    const token = await db.getTokenById(tokenID)
    validator.valid(token)
    
    conns.add(token.userID, conn)
}

module.exports = {
    handleMessage
}