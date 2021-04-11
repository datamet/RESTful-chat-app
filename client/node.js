import http from 'http'
import connect from './client.js'
import createBot from './bot/bot.js'

const client = connect(http)

const bot = createBot(client, {});

bot.start();