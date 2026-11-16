const express = require('express');
const router = express.Router();

//kontrollerid
const{
    regvisit,
    regvisitPost
                } = require('../controllers/visitControllers');

router.route('/').get(regvisit);

router.route('/').post(regvisitPost);


module.exports = router;