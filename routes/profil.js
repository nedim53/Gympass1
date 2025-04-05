var express = require('express');
var router = express.Router();
const { autentifikujKorisnika} = require('../kontroler/autentifikacija');
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/',autentifikujKorisnika);

/* GET home page. */
router.get('/', async function(req, res, next) {

  // Provera da li postoji token u kolačićima
  const token = req.cookies.accessToken; 
  if (!token) {
      return res.status(401).send('Pristup odbijen. Token nije pronađen.');
  }
    // Pretpostavljamo da su podaci admina spremljeni u tokenu
    const decoded = jwt.verify(token, 'secret_key'); // Koristite istu tajnu kao prilikom generisanja tokena
    const userId = decoded.id; // ID administratora izvučen iz tokena

    const results = await db.query('SELECT * FROM korisnici WHERE id = ?', [userId]);
    const user = results[0];
  

    res.render('profil', {
        title: 'Moj profil',
        admin: user[0] // Prosleđivanje podataka na klijent (templat)
    });
});

router.post('/update', async function(req, res) {

  const token = req.cookies.accessToken; 
  if (!token) {
      return res.status(401).send('Pristup odbijen. Token nije pronađen.');
  }

  // Dekodirajte token i izvadite admin ID
  const decoded = jwt.verify(token, 'secret_key'); // Koristite istu tajnu kao pri generisanju tokena
  const user = decoded; // ID administratora izvučen iz tokena

  // Preuzimanje novih podataka sa forme
  const { ime, prezime, email,  mjesto_rodjenja, drzava, grad } = req.body;
  const userId = user.id; 

  // SQL upit za ažuriranje podataka
  const query = `
      UPDATE korisnici 
      SET ime = ?, prezime = ?, email = ?, mjesto_rodjenja = ?, drzava = ?, grad = ? 
      WHERE id = ?;
  `;

  // Izvršavanje upita sa parametrima
  await db.query(query, [ime, prezime, email, mjesto_rodjenja, drzava, grad, userId]);
  res.redirect('/profil');
});

module.exports = router;
