// module import
const fs = require('fs');
var express = require('express');
var url = require('url');
var mysql = require('mysql');
const path = require('path');
const bodyparser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');



// database information
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'contactapp',
  port	   : '3306'
});


// database connection
connection.connect();

var app = express();
// parse application/jsons

//view engine 
app.set('view engine','pug')

app.use(bodyparser.json())
app.use(cookieParser())
app.use(session({secret: "session information"}));

// parse application/x-www-form-urlencoded
var urlencodedParser = bodyparser.urlencoded({ extended: false })

// home page request
app.get('/',function(req,res){
  res.status(200);
  // if(req.session.name != null){
  //     res.send("your name is " + req.session.name);
  //  } else {
  //     req.session.name = "sandeep";
  //     res.send("");
  //  }
	res.render('index');
});

// loginpage request
app.get('/loginpage',function(req,res){
	res.status(200);
  res.render('login')
});

// login with us request
app.post('/login',urlencodedParser,function(req,res){
	var email = req.body.email;
	var pass = req.body.pass;
  var data;
  res.status(200);
	connection.query("select password,uid from registration where email = '" + email + "'",
		function (err, result, fields) {
		  if (err)
		  	throw err
       
        req.session.uid=result[0].uid
        console.log(req.session.uid)
        if(result[0].password.localeCompare(pass) == 0){
  		 	console.log('user authetication complete');
        res.render('table')
		 }
		 else {
       res.write("User email or password incorrect")
       res.render('login')
		 }
	});
});

// registration page request
app.get('/registration',function(req,res){
  res.status(200);
  res.render('register')
});

// get registration with us request
app.post('/reg',urlencodedParser,function(req,res){
	let uname = req.body.fname;
	let lname = req.body.lname;
	let email = req.body.email;
	let pass = req.body.pass;
	let cpass = req.body.cpass;
  let mobile = req.body.mobile;

 

  // data save into database
	connection.query('insert into registration (firstname,lastname,mobile,email,password) values (?,?,?,?,?)',[uname,lname,mobile,email,pass] ,function (err, rows) {
		  if (err)
		  	throw err
		 console.log('Data added successfully with affected rows:' + rows.affectedRows);
	});

  console.log('"'+uname+' '+lname+'" register successfully ..... !!!!');
  //res.cookie('c', req.body);
  res.status(200);
  res.render('login')
});

// contact request
app.get('/contact',function(req,res){
	res.status(200);
  res.render('contact')
});

// get registration with us request
app.post('/add',urlencodedParser,function(req,res){
	let uname = req.body.fname;
	let lname = req.body.lname;
	let email = req.body.email;
	let address = req.body.address;
	let mobile = req.body.mobile;

  // data save into database
	connection.query('insert into contact (firstname,lastname,mobile,email,address,uid) values (?,?,?,?,?,?)',[uname,lname,mobile,email,address,req.session.uid] ,function (err, rows) {
		  if (err)
		  	throw err
		 console.log('Data added successfully with affected rows:' + rows.affectedRows);
	});

  //console.log('"'+uname+' '+lname+'" register successfully ..... !!!!');
  //res.cookie('c', req.body);
  res.status(200);
  res.render('table')
});

// table routing
app.get('/table',function(req,res){
	res.status(200);
  res.render('table')
});

// data request
app.get('/datat',function(req,res){
  connection.query("select * from contact where uid='"+req.session.uid+"'" ,
    function (err, result, fields) {
      if (err)
        throw err;
      var data = result;
      //console.log(data);
      res.send(JSON.stringify(data));
  });
});



// app.get('/cookie', function(req, res) {
//   console.log('Cookies: ', req.cookies.c)
//   res.status(200)
//   res.send("check console")
// })



app.get('/contact/delete/:id',function(req,res){
  connection.query("delete from contact where cid = " + req.param('id'),
    function (err, result, fields) {
      if (err)
        throw err;
      res.redirect('/table');
  });
});


app.get('/contact/edit/:id',function(req,res){
  req.session.cid = req.params['id']
   console.log(req.params['id'])
  connection.query("select * from contact where cid = " + req.param('id'),
    function (err, result, fields) {
      let firstname = result[0].firstname;
      let lastname =  result[0].lastname;
      let email = result[0].email;
      let mobile = result[0].mobile;
      let add = result[0].address;
 console.log(add)
    
      res.render('edit',{
        first:firstname,
        last:lastname,
        email:email,
        mobile:mobile,
        addr:add
      })
  });
});

// edit form data
// app.get('/userinfo',function(req,res){
//   console.log(req.session.cid);
//   connection.query("select * from contact where cid = " + req.session.cid,
//     function (err, result, fields) {
//       if (err)
//         throw err;
//       var data = result;
//       console.log(data);
//       res.send(JSON.stringify(data));
//   });
// });


app.post('/contact/edit/editme',urlencodedParser,function(req,res){
  let uname = req.body.fname;
	let lname = req.body.lname;
	let email = req.body.email;
	let address = req.body.address;
	let mobile = req.body.mobile;

  var query = "UPDATE contact SET firstname='${uname}', lastname='${lname}', email='${email}', mobile='${mobile}', address='${address}' WHERE cid = " + req.session.cid;

    connection.query('update contact set firstname ="'+uname+'", lastname="'+lname+'",email="'+email+'",address="'+address+'" where cid="'+req.session.cid+'"')

  // connection.query(query,
  //   function (err, result, fields) {
  //     if (err)
  //       throw err;
  //     let data = result;
  //     res.send(JSON.stringify(data));
  // });
  // res.JSON
  // res.sendFile(path.join(__dirname+'/edit.html'));
  res.redirect('/table')
});


app.listen(3001,() => console.log('server started at port no 3001'));
