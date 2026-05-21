async function carregarLeituras() {
    const resposta = await fetch("http://localhost:3000/leituras")

    const leituras = await resposta.json()

    const lista = document.getElementById("lista-leituras")

    leituras.forEach((leitura) => {
        lista.innerHTML += `
      <div class="card">
        <h2>${leitura.nome}</h2>
        <p>${leitura.descricao}</p>
        <strong>R$ ${leitura.preco}</strong>
        <br>
        
      </div>
    `
    });


}
    
    carregarLeituras()