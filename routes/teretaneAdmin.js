var express = require('express');
var router = express.Router();
var db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

//ZA SLIKU
const storageS = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Generisanje jedinstvenog imena za sliku
  }
});

const uploadS = multer({ storage: storageS }); 

router.post('/dodajTeretanu', uploadS.single('slika'), async (req, res) => {
  try {
    // Provera da li postoji token u kolačićima
    const token = req.cookies.accessToken; 
    if (!token) {
        return res.status(401).send('Pristup odbijen. Token nije pronađen.');
    }

    // Dekodiranje tokena da izvučemo ID
    const decoded = jwt.verify(token, 'secret_key'); // Koristite istu tajnu kao prilikom generisanja tokena
    const adminId = decoded.id; // ID administratora izvučen iz tokena

    // Preuzimanje podataka iz forme
    const { naslov, podnaslov, adresa, radno_vrijeme, o_nama, broj_telefona, email, 
            radno_vrijeme_ponedjeljak, radno_vrijeme_utorak, radno_vrijeme_srijeda, 
            radno_vrijeme_cetvrtak, radno_vrijeme_petak, radno_vrijeme_subota, 
            radno_vrijeme_nedjelja } = req.body;

    // Učitaj sliku i sačuvaj njen putanju
    const slikaPath = req.file ? `images/${req.file.filename}` : '';

    // Unos u tabelu teretane
    const result = await db.query(
      'INSERT INTO teretane (admin_id, slika, naslov, podnaslov, adresa, radno_vrijeme) VALUES (?, ?, ?, ?, ?, ?)', 
      [adminId, slikaPath, naslov, podnaslov, adresa, radno_vrijeme]
    );

  
        // Proverite kako pristupate insertId
    const teretanaId = result[0].insertId;
    console.log('Teretana ID:', teretanaId);  // Ovaj log treba da prikaže 8, ne null

    // Unos u tabelu teretana_detalji
    await db.query(
      'INSERT INTO teretana_detalji (admin_id, teretana_id, radno_vrijeme_ponedjeljak, radno_vrijeme_utorak, radno_vrijeme_srijeda, ' +
      'radno_vrijeme_cetvrtak, radno_vrijeme_petak, radno_vrijeme_subota, radno_vrijeme_nedjelja, o_nama, recenzije, ' +
      'broj_telefona, email, adresa) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [adminId, teretanaId, radno_vrijeme_ponedjeljak, radno_vrijeme_utorak, radno_vrijeme_srijeda, 
      radno_vrijeme_cetvrtak, radno_vrijeme_petak, radno_vrijeme_subota, radno_vrijeme_nedjelja, 
      o_nama, '', broj_telefona, email, adresa]
    );

    // Dodajemo flash poruku
    //req.flash('success_msg', 'Oglas za teretanu je uspešno dodat!');

    // Redirektujemo na stranicu sa formom, gde će se prikazati poruka
    res.redirect('/teretaneAdmin');

  } catch (err) {
    console.error('Greška prilikom dodavanja teretane:', err);
    res.status(500).send('Greška prilikom dodavanja teretane.');
  }
});


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
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('teretaneAdmin');
});




module.exports = router;