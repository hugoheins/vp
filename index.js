const express = require('express');
const dateET = require('./src/dateTimeET');
const fs = require('fs').promises;
const bodyparser = require('body-parser');
//andmebaasi moodul, promises osaga async jaoks
const mysql = require('mysql2/promise');
//moodul .env file lugemiseks, parsimiseks
require('dotenv').config();
const regTextRef = 'public/txt/visits.txt';
//käivtan express.js funktsiooni ja annan nimeks "app"
const app = express();
//määrame veebilehtedele mallide renderdamise mootori
app.set('view engine', 'ejs');
//määran ühe päris kataloogi virtuaalses serveris kättesaadavaks
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));


//marsruudid
app.get('/', (req, res)=>{
    //res.send('Express.js läks käima ja serveerib meile veebi.');
    const dayNow = dateET.fullDay();
    const dateNow = dateET.fullDate(0);
    const timeNow = dateET.fullTime();
    res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});

app.get('/kool', (req, res)=>{
    res.render('tlu');
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

//visit marsruudid
const visitRouter = require('./routes/visitRoutes');
app.use('/regvisit', visitRouter);

//eesti filmi marsruudid
const eestifilmRouter = require('./routes/eestifilmRoutes');
app.use('/eestifilm', eestifilmRouter);

app.listen(5113);



/* app.get('/regvisit', (req, res)=>{
    res.render('regvisit')
});

app.post('/regvisit', async (req, res) => {
    try {
        const dateNow = dateET.fullDate(0);
        const timeNow = dateET.fullTime();
        await fs.appendFile(regTextRef, req.body.nameInput + ',' + dateNow + ',' + timeNow + ';');
        res.render('regvisit');
    } catch (err) {
        console.log(err);
        res.render('regvisit');
    }
});

app.get('/lastvisit', async (req, res)=>{
    try{
        const data = await fs.readFile(regTextRef, 'utf8');
	    const read = data.split(';').filter(item => item.trim() !== '');
        res.render('lastvisit', {lastvisit: read.at(-1)});
    } catch(err){
        res.send('Vanasõnu ei loetud ära');
    }
});
 */

/* app.get('/eestifilm', (req, res)=> {
    res.render('eestifilm');
}); */

/* app.get('/eestifilm/inimesed', async (req, res)=> {
    let conn;
    try{
        //loon andmebaasi ühenduse
        conn = await mysql.createConnection({
            host: process.env.DB_HOST, 
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        const sqlReq = 'SELECT * FROM person ORDER by last_name';
        const [sqlRes] = await conn.execute(sqlReq);
        //console.log(sqlRes);
        res.render('eestifilminimesed', {personList: sqlRes});
    }catch (err){
        console.log('Viga andmebaasist lugemisel: ' + err);
        res.render('eestifilminimesed', {personList: []});
    }finally{
        if(conn){
        await conn.end();
        }
    }
}); */

/* app.get('/eestifilm/inimesed_add', (req, res)=> {
    res.render('eestifilminimesed_add', {notice: 'Ootan sisestust!',
        notice: '',
        firstName: null,
        lastName: null,
        born: null,
        deceased: null
    });
}); */

/* app.post('/eestifilm/inimesed_add', async (req, res)=> {
    console.log(req.body);
    let conn;
    const now = new Date();
    const bornDate = new Date(req.body.bornInput);
    if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || isNaN(bornDate.getTime()) || bornDate > now){
        console.log("Andmed pole korrektsed")
        return res.render('eestifilminimesed_add', {
            notice: 'Andmed on puudulikud!',
            firstName: req.body.firstNameInput || null,
            lastName: req.body.lastNameInput || null,
            born: req.body.bornInput || null,
            deceased: req.body.deceasedInput || null
        });
    }
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST, 
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
        let deceasedDate = null;
        if(req.body.deceasedInput != ''){
            const deceasedDateObject = new Date(req.body.deceasedInput);

            if(isNaN(deceasedDateObject.getTime()) || deceasedDateObject > now || deceasedDateObject < bornDate){
                console.log("Surmakuupäev pole korrektne!");
                return res.render('eestifilminimesed_add', {
                    notice: 'Surmakuupäev pole korrektne!',
                    firstName: req.body.firstNameInput || null,
                    lastName: req.body.lastNameInput || null,
                    born: req.body.bornInput || null,
                    deceased: req.body.deceasedInput || null
                });
            }

            deceasedDate = req.body.deceasedInput;
        }
        await conn.execute(sqlReq, [
            req.body.firstNameInput,
            req.body.lastNameInput,
            req.body.bornInput,
            deceasedDate
        ]);
        res.render('eestifilminimesed_add', {
            notice: 'Nimi andmebaasi lisatud!',
            firstName: null,
            lastName: null,
            born: null,
            deceased: null
        });
    } catch (err) {
        console.log("Viga andmebaasiga suhtlemisel: " + err)
        res.render('eestifilminimesed_add', {
        notice: 'Tekkis viga, andmeid ei sisestatud!',
        firstName: req.body.firstNameInput || null,
        lastName: req.body.lastNameInput || null,
        born: req.body.bornInput || null,
        deceased: req.body.deceasedInput || null
    });
    }finally{
        if(conn){
        await conn.end();
        }
    }

    
}); */



/* app.get('/eestifilm/filmid_add', (req, res)=> {
    res.render('eestifilmid_add', {
        notice: '',
        title: null,
        year: null,
        duration: null,
        description: null
    });
}); */

/* app.post('/eestifilm/filmid_add', async (req, res)=> {
    console.log(req.body);
    let conn;

    if(!req.body.titleInput || !req.body.yearInput || !req.body.durationInput || Number(req.body.durationInput) <= 0 || Number(req.body.yearInput) <= 0 || !Number.isInteger(Number(req.body.yearInput)) || !Number.isInteger(Number(req.body.durationInput))){
        console.log("Andmed pole korrektsed");
        return res.render('eestifilmid_add', {
            notice: 'Andmed on puudulikud!',
            title: req.body.titleInput || null,
            year: req.body.yearInput || null,
            duration: req.body.durationInput || null,
            description: req.body.descriptionInput || null
        });
    }

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)';

        await conn.execute(sqlReq, [
            req.body.titleInput,
            req.body.yearInput,
            req.body.durationInput,
            req.body.descriptionInput || null
        ]);

        res.render('eestifilmid_add', {
            notice: 'Film andmebaasi lisatud!',
            title: null,
            year: null,
            duration: null,
            description: null
        });

    } catch (err) {
        console.log("Viga andmebaasiga suhtlemisel: " + err);
        res.render('eestifilmid_add', {
            notice: 'Tekkis viga, andmeid ei sisestatud!',
            title: req.body.titleInput || null,
            year: req.body.yearInput || null,
            duration: req.body.durationInput || null,
            description: req.body.descriptionInput || null
        });

    } finally {
        if(conn){
            await conn.end();
        }
    }
}); */



/* app.get('/eestifilm/ametid_add', (req, res)=> {
    res.render('eestifilmametid_add', {
        notice: '',
        title: null,
        description: null
    });
});

app.post('/eestifilm/ametid_add', async (req, res)=> {
    console.log(req.body);
    let conn;

    if(!req.body.titleInput){
        console.log("Andmed pole korrektsed");
        return res.render('eestifilmametid_add', {
            notice: 'Andmed on puudulikud!',
            title: req.body.titleInput || null,
            description: req.body.descriptionInput || null
        });
    }

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        let sqlReq = 'INSERT INTO profession (title, description) VALUES (?,?)';

        await conn.execute(sqlReq, [
            req.body.titleInput,
            req.body.descriptionInput || null
        ]);

        res.render('eestifilmametid_add', {
            notice: 'Amet andmebaasi lisatud!',
            title: null,
            description: null
        });

    } catch (err) {
        console.log("Viga andmebaasiga suhtlemisel: " + err);
        res.render('eestifilmametid_add', {
            notice: 'Tekkis viga, andmeid ei sisestatud!',
            title: req.body.titleInput || null,
            description: req.body.descriptionInput || null
        });

    } finally {
        if(conn){
            await conn.end();
        }
    }
}); */

