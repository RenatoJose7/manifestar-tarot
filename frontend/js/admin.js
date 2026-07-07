const adminConteudo = document.getElementById("admin-conteudo")

function renderizarPainelAdmin() {
  adminConteudo.innerHTML = `
    <div class="admin-lista">
      <a href="./admin-posts.html">
        <span>Blog</span>
        <strong>Criar publicações</strong>
      </a>

      <a href="./egregora.html">
        <span>Egrégora</span>
        <strong>Visualizar blog</strong>
      </a>

      <button type="button" disabled>
        <span>Cupons</span>
        <strong>Gerenciar campanhas</strong>
      </button>

      <button type="button" disabled>
        <span>Histórico</span>
        <strong>Pedidos e agendamentos</strong>
      </button>
    </div>
  `
}

async function carregarAdmin() {
  const { usuario, perfil, erro } = await obterPerfilAtual()

  if (!usuario) {
    window.location.href = "./login.html"
    return
  }

  if (erro || perfil?.role !== "admin" || perfil?.status !== "active") {
    adminConteudo.innerHTML = `
      <p class="auth-mensagem erro">
        Esta área é restrita ao acesso administrativo.
      </p>
      <a class="auth-admin-link" href="./minha-conta.html">Voltar para minha conta</a>
    `
    return
  }

  renderizarPainelAdmin()
}

document.addEventListener("DOMContentLoaded", carregarAdmin)
