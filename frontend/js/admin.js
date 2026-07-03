const adminConteudo = document.getElementById("admin-conteudo")

async function carregarAdmin() {
  const { usuario, perfil, erro } = await obterPerfilAtual()

  if (!usuario) {
    window.location.href = "./login.html"
    return
  }

  if (erro || perfil?.role !== "admin" || perfil?.status !== "active") {
    adminConteudo.innerHTML = `
      <p class="auth-mensagem erro">
        Esta area e restrita ao acesso administrativo.
      </p>
      <a class="auth-admin-link" href="./minha-conta.html">Voltar para minha conta</a>
    `
    return
  }

  adminConteudo.innerHTML = `
    <div class="admin-lista">
      <button type="button" disabled>
        <span>Blog</span>
        <strong>Criar publicacoes</strong>
      </button>
      <button type="button" disabled>
        <span>Cupons</span>
        <strong>Gerenciar campanhas</strong>
      </button>
      <button type="button" disabled>
        <span>Historico</span>
        <strong>Pedidos e agendamentos</strong>
      </button>
    </div>
  `
}

document.addEventListener("DOMContentLoaded", carregarAdmin)
