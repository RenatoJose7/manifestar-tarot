const contaConteudo = document.getElementById("conta-conteudo")
const contaMensagem = document.getElementById("conta-mensagem")
const sairBotao = document.getElementById("sair-conta")

function montarFormularioConta({ usuario, perfil }) {
  const nome = perfil?.nome || usuario.user_metadata?.nome || ""
  const whatsapp = perfil?.whatsapp || usuario.user_metadata?.telefone || ""
  const email = perfil?.email || usuario.email || ""
  const role = perfil?.role || "user"
  const status = perfil?.status || "active"
  const isAdmin = role === "admin"

  contaConteudo.innerHTML = `
    <form class="auth-form conta-form" id="conta-form">
      <label>
        Nome completo
        <input type="text" name="nome" autocomplete="name" value="${escaparHtml(nome)}" required>
      </label>

      <label>
        WhatsApp
        <input type="tel" name="whatsapp" autocomplete="tel" value="${escaparHtml(whatsapp)}" required>
      </label>

      <label>
        Email
        <input type="email" value="${escaparHtml(email)}" disabled>
      </label>

      <dl class="conta-dados conta-status">
        <div>
          <dt>Status</dt>
          <dd>${status === "active" ? "Ativo" : "Bloqueado"}</dd>
        </div>
        <div>
          <dt>Acesso</dt>
          <dd>${isAdmin ? "Administrativo" : "Cliente"}</dd>
        </div>
      </dl>

      ${isAdmin ? '<a class="auth-admin-link" href="./admin.html">Acessar painel administrativo</a>' : ""}

      <button class="auth-btn" type="submit">Salvar alteracoes</button>
    </form>
  `

  const contaForm = document.getElementById("conta-form")
  contaForm?.addEventListener("submit", (evento) => salvarPerfil(evento, usuario.id))
}

async function carregarMinhaConta() {
  const { supabase, usuario, perfil, erro } = await obterPerfilAtual()

  if (!supabase) {
    contaConteudo.innerHTML = `
      <p class="auth-mensagem erro">
        Configure a URL e a chave publica do Supabase em frontend/js/supabase-config.js.
      </p>
    `
    return
  }

  if (!usuario) {
    window.location.href = "./login.html"
    return
  }

  if (erro) {
    definirMensagemAuth(contaMensagem, traduzirErroAuth(erro), "erro")
  }

  montarFormularioConta({ usuario, perfil })
}

async function salvarPerfil(evento, usuarioId) {
  evento.preventDefault()

  const supabase = obterClienteSupabase()
  const form = evento.currentTarget
  const botao = form.querySelector("button[type='submit']")
  const dados = new FormData(form)
  const nome = String(dados.get("nome") || "").trim()
  const whatsapp = String(dados.get("whatsapp") || "").trim()

  if (!nome || !whatsapp) {
    definirMensagemAuth(contaMensagem, "Preencha nome e WhatsApp para salvar.", "erro")
    return
  }

  botao.disabled = true
  botao.textContent = "Salvando..."
  definirMensagemAuth(contaMensagem, "Atualizando cadastro...")

  const { error } = await supabase
    .from("profiles")
    .update({ nome, whatsapp })
    .eq("id", usuarioId)

  botao.disabled = false
  botao.textContent = "Salvar alteracoes"

  if (error) {
    definirMensagemAuth(contaMensagem, traduzirErroAuth(error), "erro")
    return
  }

  definirMensagemAuth(contaMensagem, "Cadastro atualizado com sucesso.", "sucesso")
}

sairBotao?.addEventListener("click", async () => {
  const supabase = obterClienteSupabase()

  if (supabase) {
    await supabase.auth.signOut()
  }

  window.location.href = "./login.html"
})

document.addEventListener("DOMContentLoaded", carregarMinhaConta)
