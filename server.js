const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

const test_db = process.env.DB_URI_TEST;
const prod_db = process.env.DB_URI;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const localhost = process.env.LOCALHOST;

const configureDB = (db, pw=password, usn=username) => {
    // if db is test, just replace password. otherwise, apply
    // replace function on username.
    
    const modified = db.replace('<PASSWORD>', pw);
    if (db !== prod_db) {
        db = modified;
    } else {
        db = modified.replace('<USERNAME>', usn); // it's production db
    }
    return db;
};

const connectDB = (dbType) => {
    if (dbType === test_db || dbType === prod_db) {
        db = configureDB(dbType);
        dbName = dbType === test_db ? 'test' : 'production';

    }
    else { throw new Error('you can only use test (test_db) or production (prod_db) databases.'); }
    return mongoose
        .connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => {
            console.log(`connected to ${dbName}`);
        })
        .catch(err => {
            console.log('ERR CATCHED ' + err);
        })
}

module.exports = { localhost, connectDB, test_db, prod_db };
