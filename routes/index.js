const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var users =[
    {
        "id": 1,
        "name": "Srujana", 
        "email": "srujana.chamrolia4@gmail.com",
        "password": "12345", 
        "heightfeet": "5",
        "heightinches": "6",
        "weight": "82",
        "age":"22",
        "gender":"female",
        "reminders": {
            "sleep": true,
            "water":false,
            "exercise":false,
            "handwash":true,
            "walk":false
        }
    }
]

// ENDPOINTS

/* GET all details of all users */
router.get('/users', function(req, res) { 
    users.length==0 ? res.status(404): res.status(200);
    res.send(users);
})
  
/* GET user by email */
router.get('/users/:email', function(req, res) { 
    var selectedusers = users.filter(function(user) {
      return user.email == req.params["email"];
    });
    res.status(200);
    res.send(selectedusers);
})

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/* POST new user registration */
router.post('/register', function(req, res) { 
     var id = users.length + 1;
     var newuser = req.body;
     newuser.id = id;
     users.push(newuser);     
     res.status(202);
     res.send("registered");
})

router.get('/login/:email/:password', function(req, res) { 
    var selectedusers = users.filter(function(user) {
      return user.email == req.params.email && user.password == req.params.password;
    });
   
    if(selectedusers.length > 0){
        res.status(200);
        res.send(selectedusers);
    }else{
        res.status(200);
        res.send("mismatch");
    }
})

/* POST reminders */
router.post('/save-reminders', function(req, res) { 
    var remindersJson = req.body;
    var useremail = remindersJson.email;
    users.filter(function(user) {
        if(user.email == useremail){
            user.reminders = remindersJson.reminders; 
        }
    });
    res.status(202);
    res.send("saved");
})

/* POST updates to height & weight */
router.post('/update-height-weight', function(req, res) { 
    var receivedJson = req.body;
    console.log(receivedJson);

    var heightfeet = receivedJson.heightfeet;
    var heightinch = receivedJson.heightinch;
    var weight = receivedJson.weight;
    var useremail = receivedJson.useremail;

    users.filter(function(user) {
        if(user.email == useremail){
            user.heightfeet = heightfeet; 
            user.heightinches = heightinch; 
            user.weight = weight; 
        }
    });
    res.status(202);
    res.send("saved");
})

module.exports = router;