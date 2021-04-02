import http from 'http'
import connect from './client.js'

const client = connect(http)

let userID

let res = await client.register('Mats', 'passord2')
    userID = res.body.userID
    res = await client.login('Mats', 'passord2')
    res = await client.getUser(userID)

console.log(res)