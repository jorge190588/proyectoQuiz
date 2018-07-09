'use strict';

const conn = require('./conexion');

class Prueba{
    getAll(Callback){
        conn.query('SELECT * FROM online', Callback);
    }
}

module.exports = Prueba;