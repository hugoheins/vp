const express = require('express');
const dateET = require('./src/dateTimeET');
const fs = require('fs').promises;
const bodyparser = require('body-parser');

const regTextRef = 'public/txt/visits.txt';
//käivtan express.js funktsiooni ja annan nimeks "app"
const app = express();
//määrame veebilehtedele mallide renderdamise mootori
app.set('view engine', 'ejs');
//määran ühe päris kataloogi virtuaalses serveris kättesaadavaks
app.use(express.static('public'));
//marsruudid
app.get('/', (req, res)=>{
    //res.send('Express.js läks käima ja serveerib meile veebi.');
    const dayNow = dateET.fullDay();
    const dateNow = dateET.fullDate(0);
    const timeNow = dateET.fullTime();
    res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});
app.get('/vanasona', async (req, res)=>{
    try{
        const data = await fs.readFile('/home/hugohein/public_html/vp/public/txt/vanasonad.txt', 'utf8');
	    const read = data.split(';');
        res.render('vanasona', {vanasona: read[Math.round(Math.random() * read.length - 1)]});
    } catch(err){
        res.send('Vanasõnu ei loetud ära');
    }
});
app.get('/regvisit', (req, res)=>{
    res.render('regvisit')
});
app.post('/regvisit', async (req, res)=>{
    try {
        await fs.open(regTextRef, 'a');
        await fs.appendFile(regTextRef, req.body.nameInput + ';');
        res.render('regvisit');
    } catch (err){
        console.log(err);
        res.render('regvisit');
    }
    
});

app.listen(5113);