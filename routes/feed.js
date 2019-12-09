const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/authentication');



const Blog = require('../models/Blog');
const Profile = require('../models/Profile');

//Newsfeed blog route 
router.get('/newsfeed',(req, res, err)=>{
    
    //Find all blogs in database
    Blog.find({},(err,docs)=>{
        res.render('newsfeed', {
            Blog: docs,
        })
    })
});

router.get('/profile/:email', (req,res,err)=>{

    Blog.find({email:req.params.email}, (err,docs)=>{
        if(err) throw err;
        Profile.find({email:req.params.email},(err,docs2)=>{
            res.render('viewprofile',{

                email: req.params.email,
                Blog: docs,  
                Profile : docs2
        })  
        
        
        
        
    })
    })
})


module.exports = router;