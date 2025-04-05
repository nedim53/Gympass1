var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const { autentifikujKorisnika } = require('../kontroler/autentifikacija');
const db = require('../db');

// Ovdje bi trebalo da se koristi neki middleware za autentifikaciju i izdavanje tokena
router.post('/', autentifikujKorisnika);

/* GET home page. */
router.get('/', async function(req, res, next) {

  // Provera da li postoji token u kolačićima
  const token = req.cookies.accessToken; 
  if (!token) {
      return res.status(401).send('Pristup odbijen. Token nije pronađen.');
  }
    // Pretpostavljamo da su podaci admina spremljeni u tokenu
    const decoded = jwt.verify(token, 'secret_key'); // Koristite istu tajnu kao prilikom generisanja tokena
    const adminId = decoded.id; // ID administratora izvučen iz tokena

    const results = await db.query('SELECT * FROM admini WHERE id = ?', [adminId]);
    const admin = results[0];
    console.log(admin);

    res.render('profilAdmin', {
        title: 'Moj profil',
        admin: admin[0] // Prosleđivanje podataka na klijent (templat)
    });
});

router.post('/updateAdmin', async function(req, res) {

  const token = req.cookies.accessToken; 
  if (!token) {
      return res.status(401).send('Pristup odbijen. Token nije pronađen.');
  }

  // Dekodirajte token i izvadite admin ID
  const decoded = jwt.verify(token, 'secret_key'); // Koristite istu tajnu kao pri generisanju tokena
  const admin = decoded; // ID administratora izvučen iz tokena

  // Preuzimanje novih podataka sa forme
  const { ime, prezime, email,  mjesto_rodjenja, drzava, grad } = req.body;
  const adminId = admin.id; 

  // SQL upit za ažuriranje podataka
  const query = `
      UPDATE admini 
      SET ime = ?, prezime = ?, email = ?, mjesto_rodjenja = ?, drzava = ?, grad = ? 
      WHERE id = ?;
  `;

  // Izvršavanje upita sa parametrima
  await db.query(query, [ime, prezime, email, mjesto_rodjenja, drzava, grad, adminId]);
  res.redirect('/profilAdmin');
});

module.exports = router;
