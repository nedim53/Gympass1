var express = require('express');
var router = express.Router();
const { autentifikujKorisnika} = require('../kontroler/autentifikacija');


/* GET home page. */
router.get('/', function(req, res, next) {
  

  res.render('kontaktAdmin', { title: 'Express' });
});

module.exports = router;
