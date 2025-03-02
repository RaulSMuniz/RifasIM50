const precoTotal = sessionStorage.getItem("precoTotal");
const rifasCompradas = JSON.parse(sessionStorage.getItem("rifasCompradas"));

const infoRifas = document.querySelector('.info-rifas');
const infoPreco = document.querySelector('.info-preco');

// Exibe os dados
console.log("Preço total: ", precoTotal);
console.log("Rifas compradas: ", rifasCompradas);

rifasCompradas.forEach(rifa => {
    const numero = `Rifa n° ${rifa}`
    const rifaH3 = document.createElement('h3');
    rifaH3.innerHTML = numero;

    infoRifas.appendChild(rifaH3);
});

infoPreco.innerHTML = `Preço total: R$ ${precoTotal}`

