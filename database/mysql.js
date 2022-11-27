const mysql = require('mysql');
const path = require('path');

const envPathFileUrl = path.join(__dirname, '../.env');

require('dotenv')
    .config({ path: envPathFileUrl });
var pool = mysql.createPool({
    "user": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DATABASE_HOST,
    "port": process.env.DATABASE_PORT
});
exports.execute = (query, params=[]) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, conn) =>{
            if (error){
                reject(error);
            }else{
                conn.query(query, params, (error, result) =>{
                    conn.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result)
                    }
                });
            }
        })
    })
}

exports.pool = pool;