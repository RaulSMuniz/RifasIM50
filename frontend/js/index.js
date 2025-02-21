let currentPage = 1;
const rifasPerPage = 8;

let allRifas = [];
let filteredRifas = [];

let selectedRifas = new Set();
let counterCarrinho = 0;

const listaCarrinho = document.getElementById('lista-carrinho');
const listaOverlay = document.getElementById('lista-overlay');
const botaoCarrinho = document.querySelector('.carrinho');
const fecharCarrinho = document.querySelector('.fechar');
const listaRifasSelecionadas = document.querySelector('#rifas-selecionadas');
const limparCarrinho = document.querySelector('#limpar-carrinho');

// #ffffffcb

// Event Listeners sobre abrir, fechar ou limpar o Carrinho de Compras
botaoCarrinho.addEventListener("click", () => {
    listaCarrinho.classList.add("open");
    listaCarrinho.style.display = "block";
    listaOverlay.classList.add("open");
});

fecharCarrinho.addEventListener("click", () => {
    listaCarrinho.classList.remove("open");
    listaCarrinho.style.display = "none";
    listaOverlay.classList.remove("open");
});

listaOverlay.addEventListener("click", () => {
    listaCarrinho.classList.remove("open");
    listaCarrinho.style.display = "none";
    listaOverlay.classList.remove("open");
});

limparCarrinho.addEventListener("click", () => {
    selectedRifas.forEach(numero => {
        selectedRifas.delete(numero);
        counterCarrinho = 0;
        counter.innerHTML = counterCarrinho;

        addAoCarrinho();
        mostrarRifas(filteredRifas, currentPage)
    });
});

// Funções sobre obter as rifas 

async function getRifas() {
    try {
        const response = await fetch('http://localhost:5000/rifas');
        allRifas = await response.json();

        console.log("Rifas recebidas: ", allRifas);

        allRifas.forEach(rifa => {
            rifa.precoOriginal = rifa.preco;
        });

        allRifas.sort((a, b) => a.numero - b.numero);

        filteredRifas = [...allRifas];
        mostrarRifas(filteredRifas, currentPage);
        setupPagination();
        setupBusca();
    } catch (err) {
        console.log("Error: ", err);
    }
}

function mostrarRifas(rifas, page) {
    const rifasContainer = document.getElementById("grid");
    rifasContainer.innerHTML = "";

    const startIndex = (page - 1) * rifasPerPage;
    const endIndex = startIndex + rifasPerPage;

    const paginatedRifas = rifas.slice(startIndex, endIndex);

    if (paginatedRifas.length === 0) {
        rifasContainer.innerHTML = `<p class="rifa-indisponivel">Rifa indisponível...<p>`;
        return;
    }

    paginatedRifas.forEach(rifa => {
        const box = document.createElement("div");
        box.classList.add("box");

        if (!box.classList.contains("selected")) {
            box.backgroundColor = "#6BE038";
            box.color = "rgba(0, 0, 0, 0.774)";
        }

        if (selectedRifas.has(rifa.numero)) {
            box.classList.add("selected");
        }

        const rifaNumber = document.createElement("p");
        rifaNumber.classList.add("rifa-number");
        rifaNumber.textContent = `Rifa nº ${rifa.numero}`;



        const rifaPrice = document.createElement("p");
        rifaPrice.classList.add("rifa-price");

        const preco = counterCarrinho >= 3 ? 5 : rifa.precoOriginal;
        rifaPrice.textContent = `Preço individual: R$ ${preco.toFixed(2)}`;

        const addCarrinho = document.createElement("p");
        addCarrinho.classList.add("add-carrinho");
        addCarrinho.textContent = "Clique para adicionar ao carrinho."

        box.appendChild(rifaNumber);
        box.appendChild(rifaPrice);
        box.appendChild(addCarrinho)

        const counter = document.getElementById('counter');
        addCarrinho.onclick = () => {
            if (selectedRifas.has(rifa.numero)) {
                box.classList.remove("selected");
                addCarrinho.textContent = "Clique para adicionar ao carrinho."
                selectedRifas.delete(rifa.numero)
                counterCarrinho -= 1;
            } else {
                selectedRifas.add(rifa.numero);
                addCarrinho.textContent = "Clique para remover do carrinho."
                box.classList.add("selected");
                counterCarrinho += 1;
            };


            if (counterCarrinho < 0) {
                counterCarrinho = 0;
            }

            counter.innerHTML = counterCarrinho;
            aplicarDesconto(rifa);
            addAoCarrinho(rifa)
        };

        rifasContainer.appendChild(box);
    });

    updatePageIndicator(rifas.length);
}

function aplicarDesconto(rifa) {
    const rifaPriceElements = document.querySelectorAll(".rifa-price");
    rifaPriceElements.forEach(desconto => {
        const preco = counterCarrinho >= 3 ? 5 : rifa.precoOriginal;
        desconto.textContent = `Preço individual: R$ ${preco.toFixed(2)}`;
        addAoCarrinho(rifa)
    });
}

function setupBusca() {
    const inputBusca = document.querySelector('#buscar-rifa');

    inputBusca.addEventListener("input", (event) => {
        const input = event.target.value.trim();


        if (input === "") {
            currentPage = 1;
            filteredRifas = [...allRifas];
            mostrarRifas(filteredRifas, currentPage);
            setupPagination();
            return;
        }

        const numeroBusca = parseInt(input, 10);

        if (isNaN(numeroBusca)) {
            currentPage = 1;
            filteredRifas = [];
            mostrarRifas(filteredRifas, currentPage);
            setupPagination();
            return;
        }

        filteredRifas = allRifas.filter(rifa => rifa.numero === numeroBusca);

        currentPage = 1;
        mostrarRifas(filteredRifas, currentPage);
        setupPagination();
    });
}

function setupPagination() {
    const paginationContainer = document.querySelector(".pagination");

    const prevButton = paginationContainer.querySelector("input[value='◁ Anterior']");
    const nextButton = paginationContainer.querySelector("input[value='Próximo ▷']");

    prevButton.replaceWith(prevButton.cloneNode(true));
    nextButton.replaceWith(nextButton.cloneNode(true));

    const newPrevButton = paginationContainer.querySelector("input[value='◁ Anterior']");
    const newNextButton = paginationContainer.querySelector("input[value='Próximo ▷']");

    newPrevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            mostrarRifas(filteredRifas, currentPage);
        }
    });

    newNextButton.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredRifas.length / rifasPerPage);
        if (totalPages === 0) {
            totalPages = 1;
        };
        if (currentPage < totalPages) {
            currentPage++;
            mostrarRifas(filteredRifas, currentPage);
        };
    });

    updatePageIndicator(filteredRifas.length);
};

function updatePageIndicator(totalRifas) {
    const pageIndicator = document.querySelector(".pagination span");

    const totalPages = Math.ceil(totalRifas / rifasPerPage);
    if (totalPages === 0) {
        totalPages = 1;
    };
    pageIndicator.textContent = `Página ${currentPage} / ${totalPages}`;
};

// Função para adicionar as rifas selecionadas ao carrinho
async function addAoCarrinho() {



    let precoTotal = 0;
    listaRifasSelecionadas.innerHTML = "";
    selectedRifas.forEach(numero => {
        let rifa = allRifas.find(r => r.numero == numero);
        if (rifa) {
            const itemLista = document.createElement("li");

            const precoRifa = counterCarrinho >= 3 ? 5 : rifa.precoOriginal;
            const detalhesRifa = document.createElement("span");
            detalhesRifa.innerHTML = `Rifa n° ${rifa.numero} - R$ ${precoRifa.toFixed(2)}`

            const removerItem = document.createElement("button");
            removerItem.textContent = "Remover";
            removerItem.classList.add("btn-remover");
            removerItem.addEventListener("click", () => {

                selectedRifas.delete(numero);

                counterCarrinho -= 1;
                if (counterCarrinho < 0) {
                    counterCarrinho = 0;
                }
                counter.innerHTML = counterCarrinho;
                mostrarRifas(filteredRifas, currentPage);
                addAoCarrinho();
            });

            itemLista.appendChild(detalhesRifa);
            itemLista.appendChild(removerItem);
            listaRifasSelecionadas.appendChild(itemLista);

            const preco = counterCarrinho >= 3 ? 5 : rifa.precoOriginal;
            precoTotal += preco;
        };
    });


    const valorTotal = document.createElement("li");
    valorTotal.classList.add("total");
    valorTotal.innerHTML = `Preço total: R$ ${precoTotal.toFixed(2)}`;
    if (selectedRifas.size === 0) {
        valorTotal.innerHTML = "O carrinho está vazio.";
    }
    listaRifasSelecionadas.appendChild(valorTotal);
};
getRifas();