async function carregarComponente(alvoId, caminho, seletor) {
  const alvo = document.getElementById(alvoId)

  if (!alvo) {
    return
  }

  try {
    const resposta = await fetch(caminho)
    const html = await resposta.text()
    const documento = new DOMParser().parseFromString(html, "text/html")
    const elemento = documento.querySelector(seletor)

    alvo.innerHTML = elemento ? elemento.outerHTML : html
  } catch (erro) {
    alvo.innerHTML = ""
  }
}

function ajustarLinksDoHeader() {
  const header = document.querySelector("#header .header")

  if (!header) {
    return
  }

  const links = [...header.querySelectorAll("a")]
  const destinos = ["./index.html", "./sobremim.html", "./leituras.html", "./banhos.html", "#footer"]

  links.forEach((link, index) => {
    if (destinos[index]) {
      link.setAttribute("href", destinos[index])
    }
  })

  const botao = header.querySelector(".header-btn")

  if (botao) {
    botao.addEventListener("click", () => {
      window.location.href = "./leituras.html"
    })
  }

  const logo = header.querySelector(".logo-area")

  if (logo) {
    logo.style.cursor = "pointer"
    logo.addEventListener("click", () => {
      window.location.href = "./index.html"
    })
  }
}

function ajustarLinksDoFooter() {
  const footer = document.querySelector("#footer footer")

  if (!footer) {
    return
  }

  const linksNavegacao = [...footer.querySelectorAll(".linksRodape a")]
  const destinos = ["./index.html", "./sobremim.html", "./leituras.html", "./banhos.html", "#footer"]

  linksNavegacao.forEach((link, index) => {
    if (destinos[index]) {
      link.setAttribute("href", destinos[index])
    }
  })
}

document.addEventListener("DOMContentLoaded", async () => {
  await carregarComponente("header", "../components/header.html", "header")
  ajustarLinksDoHeader()
  await carregarComponente("footer", "../components/footer.html", "footer")
  ajustarLinksDoFooter()
})
