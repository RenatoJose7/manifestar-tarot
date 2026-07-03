const egregoraConteudo = document.getElementById("egregora-conteudo")

async function carregarEgregora() {
  const { usuario } = await obterPerfilAtual()

  if (!usuario) {
    window.location.href = "./login.html"
    return
  }

  egregoraConteudo.innerHTML = `
    <p class="auth-mensagem sucesso">
      Acesso liberado. O blog exclusivo será montado nesta área na próxima fase.
    </p>
  `
}

document.addEventListener("DOMContentLoaded", carregarEgregora)
