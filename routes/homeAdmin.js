var express = require('express');
var router = express.Router();
const db = require('../db'); // Import povezivanja na bazu
const jwt = require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next) {
  

  res.render('homeAdmin', { title: 'home' });
});

module.exports = router;
