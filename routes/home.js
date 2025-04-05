var express = require('express');
var router = express.Router();
const db = require('../db'); // Import povezivanja na bazu
const jwt = require('jsonwebtoken');


router.get('/uzmiTeretane', async (req, res) => {
  try {
      // Provera da li postoji token u kolačićima
      const token = req.cookies.accessToken; 
      if (!token) {
          return res.status(401).send('Pristup odbijen. Token nije pronađen.');
      }

      // Dekodiranje tokena da izvučemo ID
      const decoded = jwt.verify(token, 'secret_key'); // Koristite istu tajnu kao prilikom generisanja tokena
      const adminId = decoded.id; // ID administratora izvučen iz tokena
      const status = decoded.status;

      
      let query;
      if(status == 'korisnik'){
        query = 'SELECT * FROM teretane';
      }else{
        query = 'SELECT * FROM teretane WHERE admin_id = ?';
      }
      const result = await db.query(query, [adminId]);

      res.json(result[0]);
  } catch (err) {
      console.error('Greška prilikom uzimanja podataka o teretanama', err);
      res.status(500).send('Greška prilikom uzimanja podataka o teretanama');
  }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  

  res.render('home', { title: 'home' });
});

module.exports = router;
