var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');
var fs = require('fs');

/*
user_data=require('./user_data.json');
console.log(user_data['dport']['password']);
*/

/* Ex2a
user_data_file = './user_data.json'; 

if(fs.existsSync(user_data_file)){
var user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf-8' ));
console.log(user_data);
} else{
    console.log(`${user_data_file} does not exist`);
}
*/

//Ex2b
user_data_file = './user_data.json';

if (fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    //console.log(`${user_data_file} has ${file_stats["size"]} characters`);
    var user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf-8'));
} else {
    console.log(`${user_data_file} does not exist`);
}

//console.log(user_data);

app.all('*', function (request, response, next) {
    console.log(request.method + request.path);
    next();
});

//this processes the login form
app.post('/process_login', function (request, response, next) {
    //console.log(request.body);
    let username_entered = request.body["uname"];
    let password_entered = request.body["psw"];

    //validates login info, 
    if (typeof user_data[username_entered] != 'undefined') {
        if (user_data[username_entered]['password'] == password_entered) {
            response.send(`${username_entered} is logged in`);
        } else {
            response.send(`incorrect password`)
        }
    } else {
        response.send('user not found');
    }
});

//this processes the registration form
app.post('/process_register', function (request, response, next) {
    let username_entered = request.body["uname"];
    let password_entered = request.body["psw"];
    let password_repeat = request.body["psw-repeat"];

    //validates the registration info
    if (typeof user_data[username_entered] == 'undefined' && password_entered == password_repeat) {
        username = request.body["uname"];
        user_data[username] = {};
        user_data[username]["name"] = request.body["name"];
        user_data[username]["password"] = request.body["psw"];
        user_data[username]["email"] = request.body["email"];

       response.send(fs.writeFileSync(user_data_file, JSON.stringify(user_data)));
       console.log('it works');
        } else {
            console.log(typeof user_data[username_entered]);
            response.redirect('./register.html');
        }
});

//gets a response from the browser, 
app.get('', function (request, response, next) {
    response.send('I got a request for /test');
});

//posts the data to the server
app.post('/display_purchase', function (request, response, next) {
    post_data = request.body;

    /* 
    Assigns post data to the_qty and checks that it is a non  negative intger. Also redirects the user
    back to the order page if they submit an invalid value. 
    */

    if (post_data['quantity_textbox']) {
        the_qty = post_data['quantity_textbox'];
        if (isNonNegInt(the_qty)) {
            response.send(`Thank you for purchasing ${the_qty} things!`);
            return;
        } else {
            response.redirect(`./order_page.html?quantity_textbox=` + the_qty);
            return;
        }
    }
});


//creates a static file from the directory called public.
app.use(express.static('./public'));


// the server listens for 8080
app.listen(8080, function () {
    console.log(`listening on port 8080`)
}
); // note the use of an anonymous function here 

function isNonNegInt(q, returnErrors = false) {
    if (q == '') q = 0;
    var errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer 

    return returnErrors ? errors : (errors.length == 0);
}