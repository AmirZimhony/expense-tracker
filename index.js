const express = require('express');
const { google } = require('googleapis');

//authentication and specification of spreadsheet-BEGIN************
const auth = new google.auth.GoogleAuth({
    keyFile: "expenses-credentials.json",

    scopes: "https://www.googleapis.com/auth/spreadsheets",
});


 // Create client instance for auth
var client = null;
const clientStart = async () =>{
     client = await auth.getClient();
}

clientStart();

// Instance of Google Sheets API
const googleSheets = google.sheets({ version: "v4", auth: client });

const spreadsheetId = '1Mv6rkHzpzYsvJxoVFO9rh7xNvlXYGBlkR5g1sB3P9QY';
//authentication and specification of spreadsheet- END************

const app = express();

app.set('view engine', 'ejs');//determining engine for injecting variables into pages

app.use(express.urlencoded({ extended: true }));//allows us to parse  html data from requests


app.get("/expense", (req,res) => {
    res.render('index');
})

app.get("/success", (req,res) => {
    res.render('success');
})

app.post("/", async (req, res) => {

    const { name, amount, category, date , planned, payed } = req.body;

    console.log(req.body);

   


    // Get metadata about spreadsheet
    // const metaData = await googleSheets.spreadsheets.get({
    //     auth,
    //     spreadsheetId,
    // });

    // Read rows from spreadsheet
    // const getRows = await googleSheets.spreadsheets.values.get({
    //     auth,
    //     spreadsheetId,
    //     range: "Sheet1!A:F",
    // });

    // Write rows to spreadsheet
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:F",
        valueInputOption: "USER_ENTERED",
        resource: {
            values:[[name, amount, category, date , planned, payed]],
        }
    });

    res.redirect('/success')
})

// app.all('*', (req, res, next) => {
//     next(new ExpressError('404 here loser', 404))
// })





app.get('*',(req,res)=>{
    res.render('404');
})

//defining port to listen on - 3000 for Andre 3000
app.listen(3000, () => {
    console.log('listening...')
}
)