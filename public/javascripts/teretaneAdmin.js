document.addEventListener("DOMContentLoaded", async function() {
    const result = await fetch('/teretaneAdmin/uzmiTeretane');
    const teretane = await result.json();

    const teretaneList = document.getElementById("teretaneList");

    console.log(teretane);
    // Generisanje kartica za svaku teretanu
    teretane.forEach(teretana => {
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-4");

        card.innerHTML = `
            <div class="card shadow-sm">
                <img src="/${teretana.slika}" class="card-img-top" alt="${teretana.naslov}">
                <div class="card-body">
                    <h5 class="card-title">${teretana.naslov}</h5>
                    <p class="card-text">${teretana.podnaslov}</p>
                    <p class="card-text"><strong>Adresa:</strong> ${teretana.adresa}</p>
                    <p class="card-text"><strong>Radno vrijeme:</strong> ${teretana.radno_vrijeme}</p>
                    <div class="d-flex justify-content-between">
                        <a href="/teretanaAdminDetalji/${teretana.id}" class="btn btn-orange">Detaljno</a>
                        <button class="btn btn-dark" onclick="deleteGym(${teretana.id}, this)">Obriši</button>
                    </div>
                </div>
            </div>
        `;
        teretaneList.appendChild(card);
    });
});

// Funkcija za brisanje teretane
function deleteGym(id, button) {
  
    button.closest('.col-md-4').remove(); // Uklanja karticu sa strane
    console.log(`Teretana sa ID ${id} je obrisana.`);
}
