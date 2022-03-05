require('dotenv').config()
const express = require('express');
const fs = require('fs');
// const password = fs.readFileSync('password.txt', 'utf8');  //relevant when ran on local machine
const password = process.env.PASSWORD;
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1Mv6rkHzpzYsvJxoVFO9rh7xNvlXYGBlkR5g1sB3P9QY');
let sheet = null;

//Authentication and specification of spreadsheet-BEGINNING************
const authGoogle = async function start() {
    await doc.useServiceAccountAuth({
        // env var values are copied from service account credentials generated by google
        // see "Authentication" section in docs for more info
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
    }
authGoogle();

const loadGoogleInfo = async function() {
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);
    sheet = doc.sheetsByIndex[0];
    }
    
loadGoogleInfo();

//authentication and specification of spreadsheet- END************

const app = express();

app.set('view engine', 'ejs');//determining engine for injecting variables into pages

app.use(express.urlencoded({ extended: true }));//allows us to parse  html data from requests

app.use(express.static(path.join(__dirname, 'public')));//makes it possible to open this file from different folders

app.get('/', (req, res) => {
    res.render('index', { password });
});

app.get("/expense", (req,res) => {
    res.render('index', { password });
})

app.get("/success", (req,res) => {
    res.render('success');
})

app.post("/", async (req, res) => {

    const { name, amount, category, date , planned, payed } = req.body;
    console.log(req.body);
    
    await sheet.addRow([name, amount, category, date , planned, payed]);

    res.redirect('/success')
})


app.get('*',(req,res)=>{
    res.render('404');
})



const port = process.env.PORT || 3000;
//defining port to listen on - 3000 for Andre 3000
app.listen(port, () => {
    console.log(`listening... on port ${port} `)
}
)