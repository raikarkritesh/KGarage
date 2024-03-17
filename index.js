//Importing the dependencies required to run our application
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const session = require('express-session');


//connecting to mongodb database
mongoose.connect('mongodb://localhost:27017/mygarage');

//Defining our requests database model
const MyGarage = mongoose.model('MyGarage', {
    name : String,
    phoneEmail : String,
    carImageName : String,
    carDescription : String
})

//Defining our admin users database model
const AdminUser = mongoose.model('AdminUser',{
    username: String,
    password: String
}); 


//Setting up the global variables
var myWebApp = express();
myWebApp.use(express.urlencoded({extended:false}));

//Setting path to public folder and views folder
myWebApp.set('views', path.join(__dirname, 'views'));
myWebApp.use(express.static(__dirname + '/public'));

//Defining the view engine to be used
myWebApp.set('view engine', 'ejs');

//Setting up file upload middleware to be used by the app
myWebApp.use(fileupload()); 

//setting up the session middleware
myWebApp.use(session({
    secret: 'ajhgfkwqf',
    resave: false,
    saveUninitialized: true
}));


//setting up different routes or pages
//The home page of our website
myWebApp.get('/', function(req, res){
    //if the user is logged in display the admin nav page else display the guest nav page
    if(!req.session.loggedIn){
        var userData = {
            user : 'guest'
        };
        res.render('home', userData); //sending info about the user to home.ejs and rendering home.ejs
    }
    else{
        var userData = {
            user : 'admin'
        }
        res.render('home', userData); //sending info about the user to home.ejs and rendering home.ejs
    }
})

//The about page of website
myWebApp.get('/about', function(req, res){
    //if the user is logged in display the admin nav page else display the guest nav page
    if(!req.session.loggedIn){
        var userData = {
            user : 'guest'
        };
        res.render('about', userData); //sending info about the user to about.ejs and rendering about.ejs
    }
    else{
        var userData = {
            user : 'admin'
        }
        res.render('about', userData); //sending info about the user to about.ejs and rendering about.ejs
    }
})
//The make new request page
myWebApp.get('/newRequest', function(req, res){
    //if the user is logged in display the admin nav page else display the guest nav page
    if(!req.session.loggedIn){
        var userData = {
            user : 'guest'
        };
        res.render('newRequest', userData); //sending info about the user to newRequest.ejs and rendering newRequest.ejs
    }
    else{
        var userData = {
            user : 'admin'
        }
        res.render('newRequest', userData); //sending info about the user to newRequest.ejs and rendering newRequest.ejs
    }
})

//The login page
myWebApp.get('/login', function(req, res){
    //if the user is logged in display the admin nav page else display the guest nav page
    if(!req.session.loggedIn){
        var userData = {
            user : 'guest'
        };
        res.render('login', userData); //sending info about the user to login.ejs and rendering login.ejs
    }
    else{
        var userData = {
            user : 'admin'
        }
        res.render('login', userData); //sending info about the user to login.ejs and rendering login.ejs
    }
})

//The logout page
myWebApp.get("/logout", function(req, res){
    //reset the session variables to logged out state and redirect the user to home page
    req.session.username = '';
    req.session.loggedIn = false;
    res.redirect('/');
})

//The dashboard page
myWebApp.get('/dashboard', function(req, res){
    //Making sure admin is logged in to view the dashboard else send them to the login page
    if(!req.session.loggedIn){
        res.redirect('/login');
    }
    else{
        //collecting all info of the database and storing as key value pairs
        MyGarage.find({}).exec(function(err, carRequests){
            var allData = {
                carRequests : carRequests
            }
            res.render('dashboard', allData); //sending info from the database to dashboard.ejs and rendering dashboard.ejs
        });
    }
})

//The view page
myWebApp.get('/view/:id',function(req, res){
    //Making sure admin is logged in to view the request else send them to the login page
    if(!req.session.loggedIn){
        res.redirect('/login');
    }
    else{
        //Getting the id of the particular request
        var id = req.params.id;
 
        //finding the particular request in the database using the id obtained
        MyGarage.findOne({_id:id}).exec(function(err, carRequest){
            //If an invalid id is entered in the address bar then render the thank you page and display the id could not be found
            if (carRequest == 'undefined' || carRequest == null){
                //render thank you page with message as not found
                var messageAndUserData = {
                    message : 'to view could not be found',
                    user : 'admin'
                }
                res.render('thankyou', messageAndUserData);
            }
            //else get the data from the database and store as key value pairs
            else{
                var requestData = {
                    name : carRequest.name,
                    phoneEmail : carRequest.phoneEmail,
                    carImageName : carRequest.carImageName,
                    carDescription : carRequest.carDescription
                }
                //sending the requestData key value pair to viewRequest.ejs and rendering viewRequest.ejs
                res.render('viewRequest', requestData);
            }
        });
    }
    
});

//edit page
myWebApp.get('/edit/:id',function(req, res){
    //Making sure admin is logged in to edit the request else send them to the login page
    if(!req.session.loggedIn){
        res.redirect('/login');
    }
    else{
        //Getting the id of the particular request
        var id = req.params.id;

        //finding the particular request in the database using the id obtained
        MyGarage.findOne({_id:id}).exec(function(err, carRequest){
            //If an invalid id is entered in the address bar then render the thank you page and display the id could not be found
            if (carRequest == 'undefined' || carRequest == null){
                //render thank you page with message as not found
                var messageAndUserData = {
                    message : 'to edit could not be found',
                    user : 'admin'
                }
                res.render('thankyou', messageAndUserData);
            }
            //else get the data from the database and store as key value pairs
            else{
                var requestData = {
                    _id : id,
                    name : carRequest.name,
                    phoneEmail : carRequest.phoneEmail,
                    carImageName : carRequest.carImageName,
                    carDescription : carRequest.carDescription,
                }
                //sending the requestData key value pair to editRequest.ejs and rendering editRequest.ejs
                res.render('editRequest', requestData);
            }
        })
    }
})

//delete page
myWebApp.get('/delete/:id',function(req, res){
    //if the user is not logged in, send them to the login page
    if(!req.session.loggedIn){
        res.redirect('/login');
    }
    else{
        var id = req.params.id;
        MyGarage.findByIdAndDelete({_id:id}).exec(function(err, carRequest){
            var message = ' to delete could not be found';
            if(carRequest){
                message = 'has been deleted successfully';
            }
            var messageAndUserData = {
                message: message,
                user: 'admin'
            }
            res.render('thankyou', messageAndUserData);
        });
    }
});


//The thankyou page and info collection function
myWebApp.post('/thankyou', function(req, res){
    //fetch data 
    var name = req.body.name;
    var phoneEmail = req.body.phoneEmail;
    var carImage = req.files.carImage;
    var carDescription = req.body.carDescription;

   //fetch the name of the image that is collected
   var carImageName = req.files.carImage.name;
   //defining a path to store that image
   var carImagePath = './public/uploads/' + carImageName;
   //moving the image to that path
   carImage.mv(carImagePath);

    //store the fetched data as key value pairs
    var data = {
        name : name,
        phoneEmail : phoneEmail,
        carImageName : carImageName,
        carDescription : carDescription
    }

    //Create a new document into the connected database using the database model defined earlier
    var requestdata = new MyGarage(data);
    //save the document
    requestdata.save();

    //Verifying if admin is logged in or not to display the nav page accordingly
    if(!req.session.loggedIn){
        var messageAndUserData = {
            message : 'has been successfully submitted',
            user : 'guest'
        };
        res.render('thankyou', messageAndUserData); //sending info about the user and the message to thankyou.ejs and rendering thankyou.ejs
    }
    else{
        var messageAndUserData = {
            message : 'has been successfully submitted',
            user : 'admin'
        }
        res.render('thankyou', messageAndUserData); //sending info about the user and the message to thankyou.ejs and rendering thankyou.ejs
    }
})

//Process the edit page and update the particular request with given data
myWebApp.post('/edited', function(req, res){
    //Making sure admin is logged in to edit the request else send them to the login page
    if(!req.session.loggedIn){
        res.redirect('/login');
    }
    else{
        //fetch data 
        var _id = req.body._id;
        var name = req.body.name;
        var phoneEmail = req.body.phoneEmail;
        var carImage = req.files.carImage;
        var carDescription = req.body.carDescription;

        //fetch the name of the image that is collected
        var carImageName = req.files.carImage.name;
        //defining a path to store that image
        var carImagePath = './public/uploads/' + carImageName;
        //moving the image to that path
        carImage.mv(carImagePath);

        //finding the particular request that needs to be edited and replacing their respective values in the database with the values fetched
        MyGarage.findOne({_id:_id}).exec(function(err, carRequest){
            carRequest.name = name;
            carRequest.phoneEmail = phoneEmail;
            carRequest.carImageName = carImageName;
            carRequest.carDescription = carDescription;
            carRequest.save();
        })

        //render thank you page with message as editted
        var messageAndUserData = {
            message : 'has been sucessfully editted',
            user : 'admin'
        }
        res.render('thankyou', messageAndUserData);
        }
})

//processing the login page by verifying if the entered username and password is valid
myWebApp.post('/logingIn', function(req, res){
    //fetch data 
    var username = req.body.username;
    var password = req.body.password;

    //finding the adminuser from the database
    AdminUser.findOne({username: username, password: password}).exec(function(err, adminuser){
        //if username and password entered matches with that of admin user redirect to dashboard page else redirect to login page
        if(adminuser){ //when the user is found adminuser will not be empty
            req.session.username = username; //save current username in session
            req.session.loggedIn = true; //setting a flag in session that user is logged in
            res.redirect('/dashboard'); 
        }
        else{
            res.redirect('/login'); 
        }
    })
})

// --- project setup ---
// need to execute this step after running the application put http://localhost:8080/setup
// else admin user won't be created and the user wont be able to login
myWebApp.get('/setup',function(req, res){
    var adminData = {
        username : 'admin',
        password : 'admin'
    }

    var newAdmin = new AdminUser(adminData);
    newAdmin.save();

    res.send('Admin user created sucessfully');
});

//We are using port 8080 to listen
myWebApp.listen(8080);

//Confimation msg
console.log('Execution sucessfull!!!');