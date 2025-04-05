const db = require('../db');
const jwt = require('jsonwebtoken');


async function autentifikujKorisnika(req, res) {
    const { email, pswd } = req.body;

    try {
        // Provjera u tabeli korisnici
        const [korisniciResult] = await db.query('SELECT * FROM korisnici WHERE email = ?', [email]);

        if (!korisniciResult || korisniciResult.length === 0) {
            // Ako nije pronađen u tabeli korisnici, provjerava u tabeli radnici
            const [adminRez] = await db.query('SELECT * FROM admini WHERE email = ?', [email]);

            if (!adminRez || adminRez.length === 0) {
                return res.status(404).send('Korisnik ili admin ne postoji');
            } else {
                const admin = adminRez[0];

                // Provjera lozinke za admina
                if (admin.lozinka !== pswd) {
                    console.log(`Pogrešna lozinka za admina. Unesena: ${pswd}, Očekivana: ${admin.lozinka}`);
                    return res.status(401).send('Pogrešna lozinka');
                }
                const accessToken = jwt.sign(
                    {
                        id: admin.id,
                        ime: admin.ime,           // Novo: ime
                        prezime: admin.prezime,   // Novo: prezime
                        email: admin.email,       // Email korisnika
                        status: admin.status,     // Status korisnika (korisnik/admin)
                        datum_rodjenja: admin.datum_rodjenja, // Datum rođenja
                        mjesto_rodjenja: admin.mjesto_rodjenja, // Mesto rođenja
                        drzava: admin.drzava,     // Država
                        grad: admin.grad          // Grad
                    },
                    'secret_key', // Tvoj tajni ključ
                    {
                        expiresIn: '1h', // Token ističe za 1 sat
                    }

                    
                );

                    // Postavljanje tokena u kolačić
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,  // Kolačić je samo za server (ne može da se pristupi iz JavaScript-a)
                    secure: true,    // Kolačić se šalje samo preko HTTPS-a
                });
                console.log('Uspješna prijava kao admin.');
                return res.redirect('/homeAdmin');
            }
        } else {
            const korisnik = korisniciResult[0];

            // Provjera lozinke za korisnika
            if (korisnik.lozinka !== pswd) {
                console.log(`Pogrešna lozinka za korisnika. Unesena: ${pswd}, Očekivana: ${korisnik.lozinka}`);
                return res.status(401).send('Pogrešna lozinka');
            }

            console.log('Uspješna prijava kao korisnik.');
            const accessToken = jwt.sign(
                {
                    id: korisnik.id,
                    ime: korisnik.ime,           // Novo: ime
                    prezime: korisnik.prezime,   // Novo: prezime
                    email: korisnik.email,       // Email korisnika
                    status: korisnik.status,     // Status korisnika (korisnik/admin)
                    datum_rodjenja: korisnik.datum_rodjenja, // Datum rođenja
                    mjesto_rodjenja: korisnik.mjesto_rodjenja, // Mesto rođenja
                    drzava: korisnik.drzava,     // Država
                    grad: korisnik.grad          // Grad
                },
                'secret_key', // Tvoj tajni ključ
                {
                    expiresIn: '1h', // Token ističe za 1 sat
                }
            );
            
            // Postavljanje tokena u kolačić
            res.cookie('accessToken', accessToken, {
                httpOnly: true,  // Kolačić je samo za server (ne može da se pristupi iz JavaScript-a)
                secure: true,    // Kolačić se šalje samo preko HTTPS-a
            });
    
            // Postavljanje tokena u kolačić
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
            return res.redirect('/home');
        }
    } catch (err) {
        console.error('Greška pri provjeri korisnika:', err.stack);
        res.status(500).send('Greška na serveru');
    }
}

async function registrujKorisnika(req, res) {
    const { first_name, last_name, email, password, birth_date, birth_place, country, city } = req.body;
    
    try {
        // SQL upit za unos podataka u tabelu korisnici
        const query = `
            INSERT INTO korisnici (ime, prezime, email, lozinka, datum_rodjenja, mjesto_rodjenja, drzava, grad)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Izvršenje upita za unos korisnika
        await db.query(query, [first_name, last_name, email, password, birth_date, birth_place, country, city]);

        // Nakon uspješne registracije, možete preusmjeriti na login stranicu
        res.redirect('/');  // Ovo će korisnika preusmjeriti na /login

        // Ili, možete renderovati neku stranicu sa porukom o uspehu
        // res.render('success', { message: 'Registracija je uspješna!' });
    } catch (err) {
        console.error('Greška pri unosu podataka: ' + err.message);
        res.status(500).send('Greška pri unosu podataka');
    }
}



module.exports = { autentifikujKorisnika, registrujKorisnika };
