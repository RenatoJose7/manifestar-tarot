const listaLeituras = document.getElementById("lista-leituras")
const statusLeituras = document.getElementById("leituras-status")

const iconesPorLeitura = {
  "venus-individual": "../assets/icones/iconeCora\u00e7\u00e3o.png",
  "venus-casal": "../assets/icones/iconeEstrela.png",
  mercurio: "../assets/icones/iconePlaneta.png",
  sol: "../assets/icones/IconeOlho.png",
  jupiter: "../assets/icones/jupiter.png",
  "mandala-cigana": "../assets/icones/iconeMandalaCigana.png",
  "completao-tarot": "../assets/icones/IconeCompletaoTarot.png"
}

const descricoesDosCards = {
  jupiter: "Está com dúvida sobre o que perguntar ao Tarot? Essa leitura traz a mensagem e o direcionamento da espiritualidade.",
  sol: "Observe os principais aspectos da sua essência e da sua alma, abrindo espaço para entender melhor sua personalidade.",
  "venus-individual": "Aborda a forma como você se conecta com a vida amorosa e os caminhos para obter mais satisfação afetiva.",
  "venus-casal": "Análise geral das energias que envolvem sua dinâmica amorosa com alguém específico.",
  mercurio: "Análise das energias da sua vida profissional ou financeira e do que pode estar afastando você do sucesso.",
  "completao-tarot": "Combo com Método Vênus, Método Mercúrio e Método Júpiter para olhar amor, trabalho e espiritualidade.",
  "mandala-cigana": "Previsão e tendência das 12 áreas gerais da sua vida para os próximos 6 meses."
}

function categoriaCurta(categoria) {
  const categorias = {
    "Leitura Amorosa": "Campo amoroso",
    "Leitura Profissional": "Campo profissional",
    "Leitura de Autoconhecimento": "Autoconhecimento",
    "Previs\u00e3o e Tend\u00eancia": "Previs\u00e3o",
    "Leitura Livre": "Leitura livre",
    "Energia Amorosa, Profissional e Espiritual": "Combo"
  }

  return categorias[categoria] || categoria
}

function nomeCurto(nome) {
  return nome.replace(/^M\u00e9todo\s+/, "")
}

function renderizarCard(leitura) {
  const icone = iconesPorLeitura[leitura.id] || "../assets/icones/iconeEstrela.png"

  return `
    <article class="card-leitura-interna card-${leitura.id}">
      <div class="card-icone" aria-hidden="true">
        <img src="${icone}" alt="">
      </div>
      <h3>${nomeCurto(leitura.nome)}</h3>
      <span class="card-categoria">${categoriaCurta(leitura.categoria)}</span>
      <p class="card-descricao">${descricoesDosCards[leitura.id] || leitura.descricao}</p>
      <a class="botao-card" href="./leitura.html?id=${leitura.id}">Saiba mais</a>
    </article>
  `
}

async function carregarLeituras() {
  try {
    const leituras = await buscarLeituras()
    listaLeituras.innerHTML = leituras.map(renderizarCard).join("")
    statusLeituras.textContent = leituras.length ? "" : "Nenhuma leitura encontrada."
  } catch (erro) {
    statusLeituras.textContent = "N\u00e3o foi poss\u00edvel carregar as leituras. Verifique se o backend est\u00e1 rodando."
  }
}

document.addEventListener("DOMContentLoaded", carregarLeituras)
