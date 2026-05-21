async function carregarFooter() {
  const resposta = await fetch("../components/footer.html")

  const dados = await resposta.text()

  document.getElementById("footer").innerHTML = dados
}

carregarFooter()