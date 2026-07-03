const loginForm = document.getElementById("login-form")
const loginMensagem = document.getElementById("login-mensagem")

loginForm?.addEventListener("submit", async (evento) => {
  evento.preventDefault()

  const supabase = obterClienteSupabase()

  if (!supabase) {
    definirMensagemAuth(
      loginMensagem,
      "Configure a URL e a chave pública do Supabase em frontend/js/supabase-config.js.",
      "erro"
    )
    return
  }

  const dados = new FormData(loginForm)
  const email = String(dados.get("email") || "").trim()
  const senha = String(dados.get("senha") || "")

  definirMensagemAuth(loginMensagem, "Entrando...")

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  })

  if (error) {
    definirMensagemAuth(loginMensagem, traduzirErroAuth(error), "erro")
    return
  }

  definirMensagemAuth(loginMensagem, "Login realizado. Redirecionando...", "sucesso")
  window.location.href = "./minha-conta.html"
})
