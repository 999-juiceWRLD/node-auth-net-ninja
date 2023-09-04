const express = require('express')
const cors = require('cors')
const { localhost, connectDB, test_db, prod_db } = require('./src/serverr')
const authRouter = require('./src/routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');


// routes
app.get('*', checkUser); // checkUser middleware used in every GET request
app.get('/home', (req, res) => res.render('home'));
// app.get('/', (req, res) => res.send('experimental'));
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use('/', authRouter)

// database connection
const start = async () => {
  try {
    await connectDB(test_db);
    app.listen(localhost, console.log('running on ' + localhost));
  } catch (err) {
    console.log(err);
  }
}

start();

module.exports = app;
