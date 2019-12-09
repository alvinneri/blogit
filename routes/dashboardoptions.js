const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/authentication');
const passport = require('passport')
const mongoose = require('mongoose')
const moment = require('moment');

const Blog = require('../models/Blog');


//Write a blog route
router.get('/write',(req,res,err)=>{
    res.render('writeblog')
});

// Edit a blog route
router.get('/edit/:id',(req,res,err)=>{
    Blog.find({  _id : req.params.id },(err,docs)=>{
        res.render('editblog', {
            Blog: docs,
        })
    })
});

// Delete a blog route
router.post('/delete/:id', (req,res,err)=>{ 
    Blog.deleteOne({_id: req.params.id }, (err,docs)=>{
        if(err) throw err;
        res.redirect('/users/dashboard');
    });
});


// Update a blog route
router.post('/update/:id',(req,res,err)=>{
    
    const date = moment().format('MMMM Do YYYY, h:mm:ss a');
    
   
    const {title, content} = req.body;
    let id = req.params.id;
    let errors = [];

    if(content.length < 0){
        errors.push({msg:'You did not write anything'})
    }
    if(content == '' || title == ''){
        errors.push({msg:'All fields are required'})
    }

    if(errors.length >0 ){
        res.render('editblog',{
            errors,
            content,
            title
        })
    }
    else{

        Blog.updateOne({_id: id}, {title: title, content:content, date:date }, (err)=>{
            if(err) throw err;
            res.redirect('/users/dashboard');   
        })
    }
});


//Post route save blog
router.post('/save',(req,res,err)=>{
    
    const {title, content} = req.body;
    
    let errors = [];

    if(content.length < 0){
        errors.push({msg:'You did not write anything'})
    }
    if(content == '' || title == ''){
        errors.push({msg:'All fields are required'})
    }

    if(errors.length >0 ){
        res.render('writeblog',{
            errors,
            content,
            title
        })
    }
    else{
        const newBlog = new Blog({
            email: req.user.email,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            title,
            content,
            date: moment().format('MMMM Do YYYY, h:mm:ss a')

        })

        newBlog.save();
        res.redirect('../users/dashboard')
    }
});

module.exports = router;
