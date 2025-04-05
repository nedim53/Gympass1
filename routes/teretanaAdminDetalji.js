var express = require('express');
var router = express.Router();
const { autentifikujKorisnika} = require('../kontroler/autentifikacija');
const db = require('../db');

router.post('/',autentifikujKorisnika);

router.get('/:id', async function(req, res, next) {
    const { id } = req.params;
  
    try {
      // Izvršavamo SQL upit koristeći ID
      const result = await db.query(
        'SELECT * FROM teretane t JOIN teretana_detalji td ON td.teretana_id = t.id WHERE t.id = ?',
        [id]
      );
      
      // Proverite da li je rezultat prazan
      if (result.length === 0) {
        return res.status(404).send('Teretana nije pronađena.');
      }
      console.log('-----------------------------------------')
      console.log(result[0]);
      // Prosleđivanje rezultata u view
      res.render('teretanaAdminDetalji', {
        title: 'Moj profil',
        teretana: result[0] // Prvo rezultat ako je niz (ako je samo jedan zapis)
      });
    } catch (err) {
      console.error('Greška prilikom dobijanja podataka:', err);
      res.status(500).send('Greška prilikom dobijanja podataka.');
    }
  });
router.get('/teretanaDetalji/:teretana_id', async (req,res) => {


});

module.exports = router;
