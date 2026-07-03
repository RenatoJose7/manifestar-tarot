const cadastroForm = document.getElementById("cadastro-form")
const cadastroMensagem = document.getElementById("cadastro-mensagem")

cadastroForm?.addEventListener("submit", async (evento) => {
  evento.preventDefault()

  const supabase = obterClienteSupabase()

  if (!supabase) {
    definirMensagemAuth(
      cadastroMensagem,
      "Configure a URL e a chave pública do Supabase em frontend/js/supabase-config.js.",
      "erro"
    )
    return
  }

  const dados = new FormData(cadastroForm)
  const nome = String(dados.get("nome") || "").trim()
  const telefone = String(dados.get("telefone") || "").trim()
  const email = String(dados.get("email") || "").trim()
  const senha = String(dados.get("senha") || "")
  const confirmarSenha = String(dados.get("confirmarSenha") || "")
  const consentimentoAceito = dados.get("consentimento") === "on"

  if (senha !== confirmarSenha) {
    definirMensagemAuth(cadastroMensagem, "As senhas não conferem.", "erro")
    return
  }

  if (!consentimentoAceito) {
    definirMensagemAuth(cadastroMensagem, "Aceite os termos de consentimento para continuar.", "erro")
    return
  }

  definirMensagemAuth(cadastroMensagem, "Criando cadastro...")

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        nome,
        telefone,
        consentimento_whatsapp: true,
        consentimento_whatsapp_aceito_em: new Date().toISOString(),
        termos_aceitos: true,
        termos_versao: "2026-07-03"
      }
    }
  })

  if (error) {
    definirMensagemAuth(cadastroMensagem, traduzirErroAuth(error), "erro")
    return
  }

  cadastroForm.reset()

  if (data.session) {
    definirMensagemAuth(cadastroMensagem, "Cadastro criado com sucesso. Redirecionando...", "sucesso")
    window.location.href = "./minha-conta.html"
    return
  }

  definirMensagemAuth(
    cadastroMensagem,
    "Cadastro criado. Verifique seu email para confirmar a conta.",
    "sucesso"
  )
})
