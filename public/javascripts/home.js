document.addEventListener('DOMContentLoaded', () => {
    // Pokretanje funkcije za učitavanje teretana
    loadTeretane();
});

// Učitavanje teretana sa servera
async function loadTeretane() {
    try {
        // Dohvati teretane sa servera
        const response = await fetch('/home/uzmiTeretane');
        if (!response.ok) {
            throw new Error('Greška pri učitavanju teretana');
        }

        const teretane = await response.json();

        // Proveri da li postoji element sa ID-jem 'teretane-container'
        const container = document.getElementById('teretane-container');
        if (!container) {
            console.error('Greška: Element sa ID-jem "teretane-container" nije pronađen.');
            return;
        }

        // Generisanje kartica za svaku teretanu
        teretane.forEach(teretana => {
            console.log('Teretana:', teretana);

            const card = document.createElement('div');
            card.classList.add('col-md-4'); // Bootstrap grid klasa za raspored

            card.innerHTML = `
                <div class="card h-100">
                    <img src="${teretana.slika}" class="card-img-top" alt="${teretana.naslov}">
                    <div class="card-body">
                        <h5 class="card-title">${teretana.naslov}</h5>
                        <p class="card-text">${teretana.podnaslov}</p>
                        <p class="card-text"><strong>Adresa:</strong> ${teretana.adresa}</p>
                        <p class="card-text"><strong>Radno vrijeme:</strong> ${teretana.radno_vrijeme}</p>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Greška prilikom učitavanja teretana:', error);
    }
}