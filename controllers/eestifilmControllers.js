const mysql = require('mysql2/promise');
//@desc home page for Estonian Film section
//@route GET /eestifilm
//@access public

//app.get('/eestifilm', (req, res)=> {
const eestifilm = (req, res) => {
    res.render('eestifilm');
};

//@desc page for list of people involved in Estonian Film industry
//@route GET /eestifilm/inimesed
//@access public

const inimesed = async (req, res) => {
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
};

//@desc page for adding people in Estonian Film industry
//@route GET /eestifilm/inimesed_add
//@access public

const inimesedAdd = (req, res) => {
    res.render('eestifilminimesed_add', {notice: 'Ootan sisestust!',
        notice: '',
        firstName: null,
        lastName: null,
        born: null,
        deceased: null
    });
};

//@desc page for adding people in Estonian Film industry
//@route POST /eestifilm/inimesed_add
//@access public

const inimesedAddPost = async (req,res) => {
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

    
};


//@desc page for films in Estonian Film industry
//@route GET /eestifilm/filmid
//@access public




//@desc page for adding films in Estonian Film industry
//@route GET /eestifilm/filmid_add
//@access public


const filmidAdd = (req, res) => {
    res.render('eestifilmid_add', {
        notice: '',
        title: null,
        year: null,
        duration: null,
        description: null
    });
};

//@desc page for adding films in Estonian Film industry
//@route POST /eestifilm/filmid_add
//@access public

const filmidAddPost = async (req, res) => {
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
};


//@desc page for adding professions in Estonian Film industry
//@route GET /eestifilm/ametid_add
//@access public

const ametidAdd = (req, res) => {
    res.render('eestifilmametid_add', {
        notice: '',
        title: null,
        description: null
    });
};

//@desc page for adding professions in Estonian Film industry
//@route POST /eestifilm/ametid_add
//@access public

const ametidAddPost = async (req, res) => {
    const positionName = (req.body.positionNameInput || '').trim();
    const positionDescription = (req.body.positionDescriptionInput || '').trim();

    let notice = null;
    if (!positionName) {
        notice = 'Ameti nimetus on sisestamata!';
    }

    const formValues = {
        notice: notice,
        positionNameValue: positionName,
        positionDescriptionValue: positionDescription
    };

    if (notice) {
        return res.render('eestiametid_add', formValues);
    }

    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });
        const sqlReq = 'INSERT INTO `position` (position_name, description) VALUES (?,?)';
        await conn.execute(sqlReq, [positionName, positionDescription || null]);
        res.render('eestiametid_add', emptyPositionForm('Amet "' + positionName + '" lisatud!'));
    }
    catch (err) {
        console.log('Viga andmebaasi kirjutamisel: ' + err);
        formValues.notice = 'Andmete salvestamine ebaõnnestus!';
        res.render('eestiametid_add', formValues);
    }
    finally {
        if (conn) {
            await conn.end();
        }
    }
};




const seosed = async (req, res) => {
    let conn;

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [inimesedSql] = await conn.execute('SELECT id, first_name, last_name FROM person ORDER BY last_name');
        const [movieSql] = await conn.execute('SELECT id, title FROM movie ORDER BY title');
        const [professionSql] = await conn.execute('SELECT id, title FROM profession ORDER BY title');
        res.render('seosed', {
            personList: inimesedSql,
            movieList: movieSql,
            professionList: professionSql,
            message: ''
        });

    } catch (err) {
        console.log('Viga andmebaasist lugemisel: ' + err);

        res.status(500).send('Viga andmebaasist andmete lugemisel.');

    } finally {
        if (conn) {
            await conn.end();
        }
    }
};


const lisaSeos = async (req, res) => {
    let conn;

    try {
        const { personId, movieId, professionId } = req.body;
        let { characterName } = req.body;

        if (!personId || !movieId || !professionId) {
            return res.status(400).send(
                'Palun vali inimene, film ja amet!'
            );
        }

        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [personRows] = await conn.execute(
            'SELECT id FROM person WHERE id = ?',
            [personId]
        );

        if (personRows.length === 0) {
            return res.status(400).send('Valitud inimest ei leitud!');
        }

        const [movieRows] = await conn.execute(
            'SELECT id FROM movie WHERE id = ?',
            [movieId]
        );

        if (movieRows.length === 0) {
            return res.status(400).send('Valitud filmi ei leitud!');
        }

        const [professionRows] = await conn.execute(
            'SELECT id, title FROM profession WHERE id = ?',
            [professionId]
        );

        if (professionRows.length === 0) {
            return res.status(400).send('Valitud ametit ei leitud!');
        }

        const isActor =
            professionRows[0].title.trim().toLowerCase() === 'näitleja';

        if (isActor && (!characterName || !characterName.trim())) {
            return res.status(400).send(
                'Näitleja puhul sisesta tegelaskuju nimi!'
            );
        }

        characterName = isActor ? characterName.trim() : null;

        const [existingRows] = await conn.execute(
            `SELECT id
             FROM person_in_movie
             WHERE person_id = ?
               AND movie_id = ?
               AND profession_id = ?
               AND character_name <=> ?`,
            [personId, movieId, professionId, characterName]
        );

        if (existingRows.length > 0) {
            return res.send(
                'Selline seos on juba olemas! Uut seost ei lisatud.'
            );
        }

        await conn.execute(
            `INSERT INTO person_in_movie
                (character_name, person_id, movie_id, profession_id)
             VALUES (?, ?, ?, ?)`,
            [characterName, personId, movieId, professionId]
        );

        res.send('Seos lisati edukalt!');

    } catch (err) {
        console.log('Viga seose lisamisel: ' + err);
        res.status(500).send('Seose lisamisel tekkis viga!');

    } finally {
        if (conn) {
            await conn.end();
        }
    }
};


module.exports = {
    eestifilm,
    inimesed,
    inimesedAdd,
    inimesedAddPost,
    filmidAdd,
    filmidAddPost,
    ametidAdd,
    ametidAddPost,
    seosed,
    lisaSeos
}