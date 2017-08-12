//Import like statements
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ejs = require('ejs');
var expressValidator = require('express-validator');

var app = express();

/*
//A custom middleware. Note: The placement matters
var logger = function(req, res, next){
  console.log("Logging...");
  next();
};

//The above wont work if we dont do the following.
app.use(logger);
*/

//Adding body-parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {Extended: false}));

//Adding middleware for static path files like html css
app.use(express.static(path.join(__dirname, 'public')));

/*Setting Views */
//Adding/Setting view engine as ejs
app.set('view engine', 'ejs');
//Specifying the path where the view files are
app.set('views', path.join(__dirname, './views'));

//One out of the many Middleware of express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Creating a Global Variable for errors
app.use(function(req,res,next){
  res.locals.errors = null;
  next();
});


//Trying to parse json
var person = {
  name: "Avikaran",
  age: 27
};
var name = 'avikaran';

//Creating an array
var users = [
  {
      id: 1,
      name: 'avikaran'
  },
  {
      id: 2,
      name: 'yoyo'

  }

]

//Handling a GET request. This is called a route handler
app.get('/', function(req,res){
  //res.json(person); //To parse json
  /*res.render('index' , {
    title: 'Customers'
  });*/
  console.log('hi')
 res.render('index', {
   users,
   errors: [],
 }); //, { title: 'The index page!' })

  //res.render('try',{user: "Great User",title:"homepage"});
});

//Handling a POST request at /users/add. This is the route handler
app.post('/users/add', function(req,res){

  //First Lets do validation.
  //Setting rules to validate using req.checkbody
  req.checkBody('first_name', 'First Name can not be empty', 'a').notEmpty();
  req.checkBody('last_name', 'Last Name can not be empty').notEmpty();
  req.checkBody('email', 'Email-id can not be empty').notEmpty();

  //Once rules are set, lets check for errors
  var errors = req.validationErrors() || [];
  console.log("errors", errors);
  //var errors = req.getValidationResult();


  if(errors && errors.length){
    //console.log(errors);
    res.render('index', {
      errors,
    });
  }else{
    var newUser = {
      firstName : req.body.first_name,
      lastName : req.body.last_name,
      email : req.body.email,
    };
    console.log(newUser);
  }



});


//This is what starts the app.
app.listen(3000, function(){
  console.log('Server Started on Port 3000');
})
