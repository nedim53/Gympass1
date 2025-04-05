var express = require('express');
var router = express.Router();
const db = require('../db'); // Import povezivanja na bazu
const { registrujKorisnika} = require('../kontroler/autentifikacija');


router.post('/registruj_se', registrujKorisnika);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('registracija');
});

module.exports = router;
