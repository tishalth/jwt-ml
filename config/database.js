require('dotenv').config();
const { PORT, USERNAME, PASSWORD, SERVER, DATABASE } = process.env;

const config = {
    user: USERNAME,
    password: PASSWORD,
    server: SERVER,
    database: DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true 
    }
}

module.exports = config;