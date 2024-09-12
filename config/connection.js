// const { Sequelize } = require('sequelize');
// const config = require('./config/config.json')['development'];

// const sequelize = new Sequelize(config.database, config.username, config.password, {
//   host: config.host,
//   dialect: config.dialect,
// });

// module.exports = sequelize;

const { Sequelize } = require('sequelize');

// Konfigurasi Sequelize dengan environment variables
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  ssl: true, // Gunakan SSL karena Vercel PostgreSQL memerlukan SSL
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Tambahkan ini jika SSL tidak bisa di-verifikasi
    },
  },
});

module.exports = sequelize;
