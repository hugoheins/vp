const dateET = require('../src/dateTimeET');
const fs = require('fs').promises;
const regTextRef = 'public/txt/regText.txt'
//app.get('/regvisit', (req, res)=> {
const regvisit = async (req, res) => {
    try {
        const data = await fs.readFile(regTextRef, 'utf8');
        const visits = data.split(';').filter(visit => visit.trim() !== '');
        const lastVisit = visits[visits.length - 1];

        if (!lastVisit) {
            return res.render('regvisit', {
                info: 'ühtegi külastust pole veel registreeritud!'
            });
        }

        const visitParts = lastVisit.split(',');
        const info = 'Viimati registreeris külastuse ' +
            visitParts[0] + ', ' + visitParts[1] +
            ', kell ' + visitParts[2];

        res.render('regvisit', { info });
    } catch (err) {
        res.render('regvisit', {
            info: 'ühtegi külastust pole veel registreeritud!'
        });
    }
};

const regvisitPost = async (req, res) => {
    try {
        const name = (req.body.nameInput || '').trim();

        if (!name) {
            return res.render('regvisit', {
                info: 'Palun sisesta oma nimi!'
            });
        }

        const visitDate = dateET.fullDate();
        const visitTime = dateET.fullTime();

        await fs.appendFile(
            regTextRef,
            name + ',' + visitDate + ',' + visitTime + ';'
        );

        const info = 'Viimati registreeris külastuse ' +
            name + ', ' + visitDate + ', kell ' + visitTime;

        res.render('regvisit', { info });
    } catch (err) {
        console.log(err);
        res.render('regvisit', {
            info: 'Külastuse registreerimine ebaõnnestus!'
        });
    }
};


module.exports = {
    regvisit,
    regvisitPost
}