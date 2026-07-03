function obterClienteSupabase() {
  const url =
    window.manifestarSupabaseConfig?.url ||
    (typeof SUPABASE_URL !== "undefined" ? SUPABASE_URL : "")
  const anonKey =
    window.manifestarSupabaseConfig?.anonKey ||
    (typeof SUPABASE_ANON_KEY !== "undefined" ? SUPABASE_ANON_KEY : "")

  const configuracaoIncompleta =
    !url ||
    !anonKey ||
    url.includes("COLE_AQUI") ||
    anonKey.includes("COLE_AQUI")

  if (configuracaoIncompleta || !window.supabase?.createClient) {
    return null
  }

  if (!window.manifestarSupabase) {
    window.manifestarSupabase = window.supabase.createClient(url, anonKey)
  }

  return window.manifestarSupabase
}

function escaparHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

async function obterUsuarioAtual() {
  const supabase = obterClienteSupabase()

  if (!supabase) {
    return { supabase: null, usuario: null, erro: "configuracao" }
  }

  const { data, error } = await supabase.auth.getUser()

  return {
    supabase,
    usuario: error ? null : data.user,
    erro: error || null
  }
}

async function obterPerfilAtual() {
  const { supabase, usuario, erro } = await obterUsuarioAtual()

  if (!supabase || !usuario) {
    return { supabase, usuario, perfil: null, erro }
  }

  const { data: perfil, error: perfilErro } = await supabase
    .from("profiles")
    .select("id, nome, whatsapp, email, role, status, consentimento_whatsapp, termos_versao")
    .eq("id", usuario.id)
    .maybeSingle()

  return {
    supabase,
    usuario,
    perfil,
    erro: perfilErro || null
  }
}

function definirMensagemAuth(elemento, mensagem, tipo = "") {
  if (!elemento) {
    return
  }

  elemento.textContent = mensagem
  elemento.className = `auth-mensagem ${tipo}`.trim()
}

function traduzirErroAuth(erro) {
  const mensagem = erro?.message || ""

  if (mensagem.includes("Invalid login credentials")) {
    return "Email ou senha inválidos."
  }

  if (mensagem.includes("User already registered")) {
    return "Este email já possui cadastro."
  }

  if (mensagem.includes("Password should be")) {
    return "A senha precisa ter pelo menos 6 caracteres."
  }

  if (mensagem.includes("Email not confirmed")) {
    return "Confirme seu email antes de entrar."
  }

  return mensagem || "Não foi possível concluir a ação agora."
}
