var express = require('express');
var router = express.Router();
const { autentifikujKorisnika} = require('../kontroler/autentifikacija');

router.post('/',autentifikujKorisnika);

/* GET home page. */
router.get('/', function(req, res, next) {
  

  res.render('index', { title: 'Express' });
});

module.exports = router;
