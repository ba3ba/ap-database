var express = require("express");
    app = express();
    mongoose = require("mongoose");
    request = require("request");
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';
var uri = "mongodb://localhost/AP_test";
  mongoose
.connect(uri, {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(Error, err.message);
});



fs.readFile('credentials-2.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), listMajors);
});
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1wd0-k5c2Uv2KqVh-nsQAWT_DhXWvfvzjJCkntCv1ueU',
    range: 'Class Data!A2:E',
  }, (err, res) => {
     var value = res.data.values;
    var studentSchema = new mongoose.Schema({
        name: String,
        Gender: String,
        year: Number,
        HomeState: String
      });
      var Student = mongoose.model('Student', studentSchema);
    //Addind students to AP_test
     /*for(var i = 0; i < value.length; i++){
        var row = value[i];
        var name = row[0];
            gender = row[1];
            year = Math.floor(Math.random() * 5);
            state = row[3];
        var student = new Student({
            name: name,
            Gender: gender,
            year: year,
            state: state
        });
        student.save(function(err){
            if(err){
                console.log(err);
            }
        });
    }*/
    
 app.all("/:all1/:all2/:all3",function(req,res){
    // console.log(req);

Student.find(function(err,students){
    var names = [];
    var genders = [];
    var years = [];
        students.forEach(function(student){
            names.push(student.name);
            //console.log(names);
            genders.push(student.Gender);
            years.push(student.year);            
        });
    //console.log(names);
    res.render('home.ejs', {names: names, genders: genders, years: years});
    });
      
        

    
});
    app.listen(8080);
  });
}

