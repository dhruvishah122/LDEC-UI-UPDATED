const { query } = require('express');

const dotenv= require('dotenv');
dotenv.config();
const nodemailer = require("nodemailer");
const notifier = require('node-notifier');
const bodyParser=require('body-parser');
const mysql = require("mysql2");

const express=require('express');
const app= express();
const alert =require('alert');
const swal=require('sweetalert');
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/'));
const methodOverride=require("method-override");
app.set("view-engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/"));

const http = require('http');
const port=8080;

const Nexmo = require('nexmo');

//Nexmo Config
const nexmo = new Nexmo({
    apiKey:'',
    apiSecret: ''
},{debug:true});
app.set('port',port);
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'ldce',
    password:'Dbms#amazon122',
});
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
  });
  app.use(express.static(path.join(__dirname, '../Frontend')));

  app.post("/authenticate", (req, res) => {
    let enroll = req.body.Enrollment_no;
    let password = req.body.password;

    // Query to check if the credentials match
    let q = `SELECT * FROM student_details WHERE Enrollment_no = ? AND pass = ?`;
    
    connection.query(q, [enroll, password], (error, results) => {
        if (error) {
            throw error;
        }

        if (results.length === 0) {
            // Either Enrollment_no does not exist or password is incorrect
            res.redirect('/user');
        } else {
            // Successful authentication
            res.render('Student_option.ejs');
            // Alternatively, if you prefer sending a message:
            // res.send("Successfully logged in!!");
        }
    });
});


app.get("/user",(req,res)=>{
    res.render("Student_register.ejs");
});
app.get("/prof_user",(req,res)=>{
    res.render("professor_register.ejs"); 
});
app.get("/login",(req,res)=>{
    res.render('Student_login.ejs');
});
app.get("/professor_login",(req,res)=>{
    res.render('professor_login.ejs');
});
app.post("/register", (req, res) => {
    let { Full_Name, Enrollment_no, Email, Phone_Number, pass, Semester, Division } = req.body;

    // Query to check if Enrollment_no already exists
    let checkQuery = `SELECT * FROM student_details WHERE Enrollment_no = ?`;

    connection.query(checkQuery, [Enrollment_no], (error, results) => {
        if (error) {
            throw error;
        }

        if (results.length > 0) {
            // Enrollment_no exists, redirect to /login
            res.redirect("/login");
        } else {
            // Enrollment_no does not exist, proceed with registration
            let insertQuery = `INSERT INTO student_details(Full_Name, Enrollment_no, Email, Phone_Number, pass, Semester, Division) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            let student_details = [Full_Name, Enrollment_no, Email, Phone_Number, pass, Semester, Division];

            connection.query(insertQuery, student_details, (err, result) => {
                if (err) {
                    throw err;
                }
       console.log(result);
                if (Semester === '4') {
                    let sem4Query = `INSERT INTO sem_4 (Enrollment_no, COA, DM, OOP, OS, PEM) VALUES (?, ?, ?, ?, ?, ?)`;
                    let sem_4 = [Enrollment_no, '0', '0', '0', '0', '0'];

                    connection.query(sem4Query, sem_4, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Successfully entered data in subject table for semester 4");
                    });
                } else if (Semester === '6') {
                    let sem6Query = `INSERT INTO sem_6 (Enrollment_no,TOC, AJP,DAV, SE, CNS, BDA,AI, WP, MAD) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    let sem_6 = [Enrollment_no, '0', '0', '0', '0', '0', '0', '0', '0', '0'];

                    connection.query(sem6Query, sem_6, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Successfully entered data in subject table for semester 6");
                    });
                } else if (Semester === '1') {
                    let year1Query = `INSERT INTO year_1 (Enrollment_no, BEE , BE ,ENGLISH , MATHS1, PHYSICS,PPS , EGD ,ES, BME, MATHS2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    let year_1 = [Enrollment_no, '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

                    connection.query(year1Query, year_1, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Successfully entered data in subject table for year 1");
                    });
                }
                else if (Semester === '3') {
                    let sem3Query = `INSERT INTO sem_3 (Enrollment_no, ETC , P&S ,DS , DBMS, IC , DF) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    let sem_3 = [Enrollment_no, '0', '0', '0', '0', '0', '0'];

                    connection.query(sem3Query, sem_3, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Successfully entered data in subject table for semester 3");
                    });
                }
                else if (Semester === '5') {
                    let sem5Query = `INSERT INTO sem_5 (Enrollment_no, PE , CN ,ADA , IPDC, WD , DSCI,CS ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    let sem_5 = [Enrollment_no, '0', '0', '0', '0', '0', '0'];

                    connection.query(sem5Query, sem_5, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Successfully entered data in subject table for semester 5");
                    });
                }

                console.log("Successfully registered student!");
                res.redirect("/login");
            });
        }
    });
});

// Endpoint to send OTP
app.post("/prof_register",(req,res)=>{
   
    
    let q= `insert into faculty(Full_name ,phone ,email,pass) values (?, ?, ?, ?)`;
    let{Full_name ,phone ,email,pass}=req.body;
    
    let faculty = [Full_name ,phone ,email,pass];
    
    connection.query(q,faculty,(error,result)=>{
        if (error) {
            throw (error);
         
          } 
         
       console.log("Successfully registered student!", result);

           // res.send("Sucessfully registered!!", res.redirect("/professor_login"));
            res.status("successfully registered!!").send(res.redirect("/professor_login"));
          
        //  }
    });
});
app.post("/prof_authenticate", (req, res) => {
    let phone = req.body.phone;
    let pass = req.body.pass;

    let q = `SELECT * FROM faculty WHERE phone = ? AND pass = ?`; // Changes made here
    connection.query(q, [phone, pass], (error, result) => { // Changes made here
        if (error) {
            throw (error);
        }
        console.log(result);
        if (result.length == 0)
            res.redirect('/prof_user');
        else {
            //res.render('Student_option.ejs');
            res.redirect('/opt');
        }
    });
});
app.get("/opt",(req,res)=>{
res.render("professor_option.ejs");
});
app.get("/mark_attendance",(req,res)=>{
    res.render("attendance_form.ejs");
});

app.post("/mark",(req,res)=>{
    let emai=req.body.email;
    let ot=req.body.otp;
    let sem=req.body.sem;
let q=`select * from otp_table where  otp=? and email=? `;
connection.query(q,[ot,emai],(err,result)=>{
if(err) throw err;
if(result.length==0)
res.send("Authentication failed or timeout");
else
{   console.log(result);
    let id=req.body.id;
    let enroll = req.body.enroll;
    if(sem=='4'){
    let q1=`update sem_4 set \`${id}\` = \`${id}\` + 1 where Enrollment_no=${req.body.enroll}`;
    connection.query(q1,(error,results)=>{
    if(error) throw error;//res.send("WRONG DETAILS");
    console.log(results);
    res.render("Student_option.ejs");
    });
}
else if(sem=='1'){
    let q1=`update year_1 set \`${id}\` = \`${id}\` + 1 where Enrollment_no=${req.body.enroll}`;
    connection.query(q1,(error,results)=>{
    if(error) throw error;//res.send("WRONG DETAILS");
    console.log(results);
    res.send("Attendance marked successfully");
    });
}
else if(sem=='6'){
    let q1=`update sem_6 set \`${id}\` = \`${id}\` + 1 where Enrollment_no=${req.body.enroll}`;
    connection.query(q1,(error,results)=>{
    if(error) throw error;//res.send("WRONG DETAILS");
    console.log(results);
    res.send("Attendance marked successfully");
    });
}
}
});
//connection.end();
});
//alerts when email sent
app.post("/take_attendance",(req,res)=>{
  //console.log(req.body.email);
  let email=req.body.email;
  let pass=req.body.pass;
  let q=`select email,pass from faculty where pass=? and email=?`;
  connection.query(q,[pass,email],(error,result)=>{
  if(error) throw error;
  if(result.length==0)
  res.send("You aren't registered");
else
 {
  const otp=Math.floor(1000 + Math.random() * 9000);
async function main() {

const transporter = nodemailer.createTransport({
   service:'gmail',
    auth: {
        user: 'dhruvishah116122@gmail.com',
        pass: 'uxihxgezpzalaexn'
    },
    tls: {
        rejectUnauthorized: false // Ignore self-signed certificates (if necessary)
    }
});
  
  // Define and send message inside transporter.sendEmail() and await info about send from promise:

  let info = await transporter.sendMail({
    from: '"LDCE Attendance team 😊" <dhruvishah116122@gmail.com>',
    to: req.body.email,
    subject: '🔔 LDCE Class Attendance System - OTP Notification 🔔',
    html: `
    <h1>Hello Respected Faculty, 👋</h1>
    <p>We hope you are doing well! 🌟</p>
    <p>Your class attendance OTP is: <strong>${otp}</strong> 🔑</p>
    <p>Please share this OTP with students to take class attendance 📝</p>
    <p>Thank you for your attention! 😊</p>
    <p>Best regards,</p>
    <p>The LDCE Attendance Team 📚</p>
   
`
    

  });
}
res.render("professor_option.ejs");
 
// res.redirect('/alert');// Random ID generated after successful send (optional)
 
const q1 = 'INSERT INTO otp_table (email, otp, time_stamp) VALUES (?, ?, NOW())';
    connection.query(q1, [req.body.email, otp], (err, results) => {
        if (err) {
            console.error('Error inserting OTP into MySQL:', err);
           // return res.status(500).json({ error: 'Failed to generate OTP' });
        }
        console.log('OTP generated and stored:', otp);
       // return res.json({ otp: otp });
    });
    function cleanupExpiredOTP() {
      const oneMinuteAgo = new Date(Date.now() - 300000); // 1 minute ago
      const q = 'DELETE FROM otp_table WHERE time_stamp < ?';
      connection.query(q, [oneMinuteAgo], (err, results) => {
          if (err) {
              console.error('Error cleaning up expired OTPs:', err);
          ///    return;
          }
          console.log('Expired OTPs cleaned up');
      });
  }
  
  // Schedule cleanup of expired OTPs every minute
  setInterval(cleanupExpiredOTP, 60000);
main()
.catch(err => console.log(err));
 
 }
});

});

//alerts
app.get("/alert",(req,res)=>{
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Alert</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        </head>
       
            <script>
              swal("Good job!", "You clicked the button!", "success");
            
            </script>
        </body>
        </html>
    `);
});

app.get("/take",(req,res)=>{
    res.render("generate_otp.ejs");
    });
app.get("/show_attendance",(req,res)=>{
   res.render("show.ejs");
});
    app.post("/show",(req,res)=>{
    let sem=req.body.sem;
    let enroll=req.body.enroll;
    if(sem==4){
        let q=`select * from sem_4 natural join student_details where  Enrollment_no=? and sem_4.Enrollment_no=student_details.Enrollment_no`;
        connection.query(q,[enroll],(err,result)=>{
        if(err) throw err;
        const columnNames = Object.keys(result[0]);
        res.render("Student_view.ejs",{data:result,columns:columnNames});
        });
    }
    });

app.get("/faculty_access",(req,res)=>{
res.render("faculty_access.ejs");
});
app.post("/edit_attendance_access",(req,res)=>{
    let sem=req.body.sem;
  if(sem==4){
    // let q=`select * from sem_4 inner join student_details on sem_4.Enrollment_no=student_details.Enrollment_no`;
    let q=`select sem_4.* from student_details inner join sem_4 where sem_4.Enrollment_no=student_details.Enrollment_no `;
    connection.query(q,(error,result)=>{
        if(error) throw error;
        const columnNames = Object.keys(result[0]);
        res.render("view.ejs",{data:result,columns:columnNames,tableName:'sem_4'});
    });
  }
  if(sem==1){
    let q=`select year_1.* from year_1 inner join student_details on year_1.Enrollment_no=student_details.Enrollment_no`;
    connection.query(q,(error,result)=>{
        if(error) throw error;
        const columnNames = Object.keys(result[0]);
        res.render("view.ejs",{data:result,columns:columnNames,tableName:'year_1'});
    });
  }
  if(sem==6){
    let q=`select sem_6.* from sem_6 inner join student_details on sem_6.Enrollment_no=student_details.Enrollment_no`;
    connection.query(q,(error,result)=>{
        if(error) throw error;
        const columnNames = Object.keys(result[0]);
        res.render("view.ejs",{data:result,columns:columnNames,tableName:'sem_6'});
    });
  }
  if(sem==3){
    let q=`select sem_3.* from sem_3 inner join student_details on sem_3.Enrollment_no=student_details.Enrollment_no`;
    connection.query(q,(error,result)=>{
        if(error) throw error;
        const columnNames = Object.keys(result[0]);
        res.render("view.ejs",{data:result,columns:columnNames,tableName:'sem_3'});
    });
  }
  if(sem==5){
    let q=`select sem_5.* from sem_5 inner join student_details on sem_5.Enrollment_no=student_details.Enrollment_no`;
    connection.query(q,(error,result)=>{
        if(error) throw error;
        const columnNames = Object.keys(result[0]);
        res.render("view.ejs",{data:result,columns:columnNames,tableName:'sem_5'});
    });
  }
});
app.post('/update', (req, res) => {
    const { Enrollment_no, table, data } = req.body;

    // Validate table name to prevent SQL injection
    const validTables = ['sem_3', 'sem_4', 'sem_5', 'sem_6', 'year_1'];
    if (!validTables.includes(table)) {
        return res.status(400).json({ success: false, message: 'Invalid table name' });
    }

    let query = `UPDATE ${table} SET `;
    let updates = [];
    let values = [];

    for (let column in data) {
        if (column !== 'Enrollment_no') {
            updates.push(`\`${column}\` = ?`);
            values.push(data[column]);
        }
    }

    query += updates.join(', ') + ' WHERE Enrollment_no = ?';
    values.push(Enrollment_no);

    console.log('Executing query:', query, values); // Log the query and values

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating data:', err); // Log the error
            return res.json({ success: false, message: 'Error updating data', error: err });
        }

        console.log('Update result:', result); // Log the result
        res.json({ success: true, message: 'Data updated successfully' });
    });
});

    // Assume you have your database query and result here
 
module.exports={
    devServer:{
        port:process.env.PORT
    }
};
app.listen(port,()=>{
    console.log(`app is listening on ${port}`);
    
});