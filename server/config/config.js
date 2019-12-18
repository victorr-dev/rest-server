require('dotenv').config()

const config = {
    PORT: process.env.PORT,
    URL: process.env.URL_DB,
    CADUCIDAD_TOKEN: process.env.CADUCIDAD_TOKEN,
    SEED: process.env.SEED,
    CLIENT_ID: process.env.CLIENT_ID
}

module.exports = config