const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var users =[
    {
        "id": 1,
        "name": "Srujana", 
        "email": "srujana.chamrolia4@gmail.com",
        "password": "12345", 
        "height-feet": "5",
        "height-inches": "6",
        "weight": "82"
    },
    {
        "id": 2,
        "name": "Srujana", 
        "email": "srujana.chamrolia2@gmail.com",
        "password": "12345", 
        "height-feet": "5",
        "height-inches": "4",
        "weight": "89"
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
        res.send(selectedusers[0].name);
    }else{
        res.status(200);
        res.send("mismatch");
    }
})

module.exports = router;