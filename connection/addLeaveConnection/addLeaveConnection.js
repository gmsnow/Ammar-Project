const { Pool } = require('pg'); 
const pool = new Pool({ 
user: 'ammar', 
host: 'dpg-d25eq83uibrs73ai34qg-a', 
database: 'ammar_kidy', 
password: '123', 
port: '5432', 
max: 10, // Maximum number of clients in the pool 
idleTimeoutMillis: 30000,})


module.exports = pool;