const express = require('express');
const router = express.Router();

//kontrollerid
const{
    eestifilm,
    inimesed,
    inimesedAdd,
    inimesedAddPost,
    filmidAdd,
    filmidAddPost,
    ametidAdd,
    ametidAddPost,
    seosed,
    lisaSeos} = require('../controllers/eestifilmControllers');

router.route('/').get(eestifilm);
router.route('/inimesed').get(inimesed);
router.route('/inimesed_add').get(inimesedAdd);
router.route('/inimesed_add').post(inimesedAddPost);
router.route('/filmid_add').get(filmidAdd);
router.route('/filmid_add').post(filmidAddPost);
router.route('/ametid_add').get(ametidAdd);
router.route('/ametid_add').post(ametidAddPost);
router.route('/seosed').get(seosed);
router.route('/seosed').post(lisaSeos);

module.exports = router;