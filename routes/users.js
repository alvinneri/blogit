const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const moment = require('moment');
const multer = require('multer');
const path = require("path");




//Database models
const User = require('../models/User');
const Blog = require('../models/Blog');
const Profile = require('../models/Profile');
const retrievePath = '/uploads/';


//Multer storage code
const storage =  multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage : storage,
    limits :{fileSize : 1000000},
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).single('profilephotoName');


//Login get route
router.get('/login',(req, res, err)=>{
    res.render('login')
});

// Login post route
router.post('/login',(req,res, next)=>{
    passport.authenticate('local',{
        successRedirect: 'dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//Register get route
router.get('/register',(req, res, err)=>{   
    res.render('register')
   
});


//Register post route
router.post('/register',(req,res)=>{
    
    const {firstname, lastname, email, password, password2} = req.body;
    let errors = [];

    if(!firstname || !lastname ||!email || !password || !password2  ){
        errors.push({msg:'Please fill in all fields'})
    }
    if(password != password2){
        errors.push({msg:'Password do not match'});
    }
    if(password.length < 6){
        errors.push({msg:'Password should be atleast 6 characters'})
    }
    if(errors.length > 0){
        res.render('register',{
            errors,
            firstname,
            lastname,
            email,
            password,
            password2
        })
    }else{
      
        User.findOne({email:email})
        .then(user=>{
            if(user){
                errors.push('Email exist');
                res.render('register',{
                errors,
                firstname,
                lastname,
                email,
                password,
                password2
            })
            }else{
                const newUser = new User({
                    firstname,
                    lastname,
                    email,
                    password
                });

                //Create a default first blog
                const newBlog = new Blog({
                    email,
                    firstname,
                    lastname,
                    title : 'My First Blog',
                    content : 'None',
                    date: moment().format('MMMM Do YYYY, h:mm:ss a')   
                });

                newBlog.save();

                //Create a default profile photo
                const newProfile = new Profile({
                    email,
                    firstname,
                    lastname,
                    date: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    bio: 'Edit your Bio',
                    gender: 'Male',
                    profile_photo: 'defaultpic.jpg',
                    destination: retrievePath
                })

                newProfile.save();

                // Encrypt password
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password, salt, (err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user=>{
                            res.redirect('./login')
                        })
                    })
                })
            }          
        })
    }
})

//Dashboard route
router.get('/dashboard', (req,res)=>{
    Blog.find({email:req.user.email}, (err,docs)=>{
        if(err) throw err;
        Profile.find({email: req.user.email},(err,docs2)=>{
            res.render('dashboard',{
                firstname: req.user.firstname,
                lastname:  req.user.lastname,
                email: req.user.email,
                Blog: docs,  
                Profile : docs2
        })   
    })
    })
})


//Profile route
router.get('/profile',(req,res)=>{
    Profile.find({email: req.user.email},(err,docs)=>{
        res.render('profile',{
            Profile : docs
    })   
})
})

//Upload a profile photo route
router.post('/uploadprofile', (req, res, err)=>{
    
    const email =  req.user.email;
    let errors = [];
    

    //Function upload defined above
    upload(req,res, (err)=>{
        if(err) {
            errors.push({msg:err})  ;
            Profile.find({email: req.user.email},(err,docs)=>{
                res.render('profile',{
                    Profile : docs,
                    errors,
            })
        })      
            
        }else{
            Profile.updateOne({email:email},{profile_photo: req.file.filename, destination:'/uploads/'},(err)=>{
                if(err) throw err;
                res.redirect('/users/dashboard');    
            })          
        }
    });  
})


//Edit bio router
router.post('/editbio', (req,res,err)=>{

    const email = req.user.email;
    const {bio, gender} = req.body; 
    
        Profile.updateOne({email:email},{bio:req.body.bio, gender:req.body.gender},(err)=>{
            if(err) throw err;
            res.redirect('/users/dashboard');    
        });
    

});


//Logout get route
router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg', 'Logged out');
    res.redirect('/users/login');

});

module.exports = router;

