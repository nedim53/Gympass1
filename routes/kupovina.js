var express = require('express');
var router = express.Router();
const db = require('../db'); // Import povezivanja na bazu
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  res.render('kupovina');
});
router.get('/kupi', async function (req, res) {
  try {

    // Provera da li postoji token u kolačićima
          const token = req.cookies.accessToken; 
          if (!token) {
              return res.status(401).send('Pristup odbijen. Token nije pronađen.');
          }
    
          // Dekodiranje tokena da izvučemo ID
          const decoded = jwt.verify(token, 'secret_key'); // Koristite istu tajnu kao prilikom generisanja tokena
          const userId = decoded.id; // ID administratora izvučen iz tokena


    // Ekstrakcija query parametara
    const { cijena, tip } = req.query;

    // Provera da li su parametri prisutni
    if (!cijena || !tip) {
      return res.status(400).send('Nedostaju parametri cijena ili tip.');
    }

    await db.query('INSERT INTO kartice(korisnik_id, tip_kartice,cijena_kartice) VALUES (?,?,?)', [userId,tip,cijena]);
    
    // Ovde možete nastaviti sa logikom obrade kartice
    res.redirect('/kupovina');
  } catch (err) {
    console.error('Greška prilikom kupovine kartice', err);
    res.status(500).send('Došlo je do greške na serveru.');
  }
});
module.exports = router;
