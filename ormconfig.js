module.exports = {
    "logging": JSON.parse(process.env.DB_LOGGING),
    "type": 'mysql',
    "host": process.env.DB_HOST,
    "port": parseInt(process.env.DB_PORT),
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "synchronize": JSON.parse(process.env.DB_SYNCHRONIZE),
}