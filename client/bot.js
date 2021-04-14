/**
 * Script for running a bot from the terminal.
 */

import http from 'http'
import connect from './client.js'
import createBot from './bot/bot.js'
import WebSocket from 'ws'

const name = process.env.USERNAME
const room = process.env.ROOM

const client = connect({}, http, WebSocket)

const bot = createBot(client, { name, room });

bot.start();

console.log("[bot] Bot is running")