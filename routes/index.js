const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/authentication');
const nodemailer = require('nodemailer');

//Homepage route
router.get('/',(req, res, err)=>{  
    res.render('homepage') 
});


//About page route
router.get('/about',(req, res, err)=>{
    
    res.render('about')
   
});

//Setting up transport service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'alvin.neri.ece2@gmail.com',
        pass: 'Binbai13'
    },
    tls:{
        rejectUnauthorized:false
      }
});





router.post('/mail', (req,res,err)=>{
    const {name, email, message} = req.body;
    let errors =[];
    if(name == '' |email == '' | message == ''){
        errors.push({msg:'Please fill in all fields'})
    }
    
    if(errors.length>0){
        res.render('about',{
            errors,
            name,
            email,
            message
        })
    }
    else{
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    const mailOption = {
        from: 'alvin.neri.ece2@gmail.com',
        to: 'alvin.neri.ece@gmail.com',
        subject: 'From blogit',
        text: 'none',
        html: output
    }
    
    transporter.sendMail(mailOption, (err, info)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Email: ' + info.response);
        }
        res.render('emailsuccess')
    })
}
});


module.exports = router;

