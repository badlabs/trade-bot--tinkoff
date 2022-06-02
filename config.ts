try {
  require('dotenv').config()
}catch (e){}

export const config = {
  exchange: {
    exchangeToken: process.env.TINKOFF_SANDBOX_API_KEY || '',
  },
  auth: {
    token: process.env.BOT_TOKEN || '',
    required: false
  },
  api: {
    port: 4268,
    host: '10.8.0.22'
  },
  logs: {
    directory: './logs'
  }
}
