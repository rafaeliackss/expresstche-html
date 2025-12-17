// --- Banco de Dados Simulado ---
const excursoesData = [
  {
    id: 1,
    destino: "Beto Carrero World",
    dataIda: "15/10/2024",
    dataVolta: "17/10/2024",
    img: "BetoCarrero.png",
    assentosTotais: 40,
    assentosOcupados: 12,
    preco: 450.0,
  },
  {
    id: 2,
    destino: "Canela & Gramado",
    dataIda: "20/11/2024",
    dataVolta: "22/11/2024",
    img: "Gramado.jpg",
    assentosTotais: 40,
    assentosOcupados: 36,
    preco: 380.0,
  },
];

const listaExcursoes = document.getElementById("lista-excursoes");
const modal = document.getElementById("modal-reserva");
const closeModal = document.querySelector(".close-modal");
const form = document.getElementById("form-cadastro");
const pixArea = document.getElementById("pix-area");
const statusBadge = document.querySelector(".status-box");
const btnSubmit = document.getElementById("btn-confirmar");
const imgQr = document.getElementById("qrcode-img");

let excursaoSelecionada = null;

function renderizarExcursoes() {
  listaExcursoes.innerHTML = "";
  excursoesData.forEach((exc) => {
    const assentosLivres = exc.assentosTotais - exc.assentosOcupados;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <div class="card-img" style="background-image: url('${exc.img}')"></div>
            <div class="card-content">
                <span class="card-tag">Excursão Rodoviária</span>
                <h3>${exc.destino}</h3>
                <div class="card-dates">
                    <span>📅 Ida: ${exc.dataIda}</span>
                    <span>🔙 Volta: ${exc.dataVolta}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                    <div class="seats-badge">🚍 ${assentosLivres} vagas</div>
                    <button class="btn-primary" onclick="abrirReserva(${exc.id})">Reservar</button>
                </div>
            </div>`;
    listaExcursoes.appendChild(card);
  });
}

window.abrirReserva = (id) => {
  excursaoSelecionada = excursoesData.find((e) => e.id === id);
  if (
    excursaoSelecionada.assentosOcupados >= excursaoSelecionada.assentosTotais
  ) {
    alert("Desculpe, este ônibus está lotado!");
    return;
  }
  document.getElementById("modal-titulo").innerText =
    excursaoSelecionada.destino;
  document.getElementById(
    "modal-data"
  ).innerText = `Data: ${excursaoSelecionada.dataIda} - R$ ${excursaoSelecionada.preco},00`;
  document.getElementById("assentos-restantes").innerText =
    excursaoSelecionada.assentosTotais - excursaoSelecionada.assentosOcupados;
  pixArea.classList.add("hidden");
  form.reset();
  btnSubmit.style.display = "block";
  statusBadge.className = "status-box";
  statusBadge.innerHTML =
    '<div class="loader"></div><span id="texto-status">Aguardando pagamento...</span>';
  modal.classList.remove("hidden");
};

closeModal.onclick = () => modal.classList.add("hidden");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  pixArea.classList.remove("hidden");
  btnSubmit.style.display = "none";
  imgQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ExpressTche|${cpf}`;
  imgQr.classList.add("qrcode-blur");
  imgQr.onload = () => imgQr.classList.remove("qrcode-blur");

  let segundos = 5;
  const elementoTexto = document.querySelector("#texto-status");
  const intervalo = setInterval(() => {
    if (elementoTexto)
      elementoTexto.innerText = `Aguardando pagamento... (${segundos}s)`;
    segundos--;
    if (segundos < 0) {
      clearInterval(intervalo);
      confirmarPagamento(nome);
    }
  }, 1000);
});

function confirmarPagamento(nome) {
  const box = document.querySelector(".status-box");
  box.classList.add("pago");
  box.innerHTML = `<span>✅ Pagamento Aprovado!</span>`;
  excursaoSelecionada.assentosOcupados++;
  renderizarExcursoes();

  setTimeout(() => {
    modal.classList.add("hidden");
    document.getElementById("sucesso-nome").innerText = nome;
    document.getElementById("modal-sucesso").classList.remove("hidden");
  }, 1500);
}

window.fecharSucesso = () => {
  document.getElementById("modal-sucesso").classList.add("hidden");
};

renderizarExcursoes();
