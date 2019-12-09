const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');


//passport config
require('./config/passport')(passport)

//PORT Configuration
const PORT = process.env.PORT || 5000;

//DB Connection
const db = 'mongodb+srv://Alvin:Binbai13@testcluster1-74rc4.mongodb.net/test?retryWrites=true&w=majority';
// const db = 'mongodb://localhost:27017/blogit';

mongoose.connect(db, {useNewUrlParser: true})
.then(()=> console.log('Connection to DB is OK'))
.catch((err) => console.log(err));

//Use EJS LAYOUTS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Disable URLENCODED
app.use(express.urlencoded({extended:false}));

// Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next) =>{
    res.locals.success_msg =req.flash('succes_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.error =req.flash('error');
    next();
})

app.use(express.static('public'));
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/dashboardoptions', require('./routes/dashboardoptions'));
app.use('/feed', require('./routes/feed'));


app.listen(PORT,console.log(`Server started on Port ${PORT}`))


