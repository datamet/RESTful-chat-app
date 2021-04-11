import http from 'http'
import connect from './client.js'

const client = connect({}, http)

const roomToJoin = options.room ? options.room : 'bot room'