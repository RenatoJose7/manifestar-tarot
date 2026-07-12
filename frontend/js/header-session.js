async function sincronizarHeaderComSessao(header = document.querySelector(".header")) {
  if (!header || typeof obterPerfilAtual !== "function") {
    return
  }

  const loginLink = header.querySelector("[data-login-link]")
  const registerLink = header.querySelector("[data-register-link]")
  let adminEgregoraLink = header.querySelector("[data-admin-egregora-link]")
  let usuarioBox = header.querySelector("[data-header-user]")
  let saudacaoHeader = header.querySelector("[data-header-greeting]")
  let logoutBotao = header.querySelector("[data-logout-link]")
  let logoutMobileBotao = header.querySelector("[data-mobile-logout-link]")

  if (!loginLink) {
    return
  }

  const { perfil, usuario, supabase } = await obterPerfilAtual()

  if (!usuario) {
    adminEgregoraLink?.remove()
    usuarioBox?.remove()
    saudacaoHeader?.remove()
    logoutBotao?.remove()
    logoutMobileBotao?.remove()
    loginLink.textContent = "Login"
    loginLink.setAttribute("href", "./login.html")

    if (registerLink) {
      registerLink.textContent = "Cadastro"
      registerLink.setAttribute("href", "./cadastro.html")
    }

    return
  }

  loginLink.textContent = "Minha conta"
  loginLink.setAttribute("href", "./minha-conta.html")
  const nomeHeader = perfil?.nome || usuario.email?.split("@")[0] || "cliente"
  const emailHeader = usuario.email || ""

  if (!usuarioBox) {
    usuarioBox = document.createElement("div")
    usuarioBox.className = "menu-user-status"
    usuarioBox.setAttribute("data-header-user", "")
    header.querySelector("#menu-principal")?.prepend(usuarioBox)
  }

  usuarioBox.innerHTML = `
    <strong>Olá, ${escaparHtml(nomeHeader)}</strong>
    <span>${escaparHtml(emailHeader)}</span>
  `

  if (!saudacaoHeader) {
    saudacaoHeader = document.createElement("div")
    saudacaoHeader.className = "header-user-greeting"
    saudacaoHeader.setAttribute("data-header-greeting", "")
    header.querySelector("#menu-principal")?.before(saudacaoHeader)
  }

  saudacaoHeader.innerHTML = `
    <strong>Olá, ${escaparHtml(nomeHeader)}</strong>
    <span>${escaparHtml(emailHeader)}</span>
  `

  if (!logoutBotao) {
    logoutBotao = document.createElement("button")
    logoutBotao.className = "menu-logout"
    logoutBotao.type = "button"
    logoutBotao.setAttribute("data-logout-link", "")
    logoutBotao.setAttribute("aria-label", "Sair da conta")
    logoutBotao.innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i><span>Sair</span>`
    registerLink?.after(logoutBotao)
  }

  if (!logoutMobileBotao) {
    logoutMobileBotao = document.createElement("button")
    logoutMobileBotao.className = "header-mobile-logout"
    logoutMobileBotao.type = "button"
    logoutMobileBotao.setAttribute("data-mobile-logout-link", "")
    logoutMobileBotao.setAttribute("aria-label", "Sair da conta")
    logoutMobileBotao.innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>`
    header.querySelector(".menu-toggle")?.before(logoutMobileBotao)
  }

  ;[logoutBotao, logoutMobileBotao].forEach((botao) => {
    if (!botao || botao.dataset.logoutReady === "true") {
      return
    }

    botao.dataset.logoutReady = "true"
    botao.addEventListener("click", async () => {
      botao.disabled = true
      await supabase?.auth?.signOut()
      window.location.href = "./index.html"
    })
  })

  if (registerLink && perfil?.role === "admin") {
    if (!adminEgregoraLink) {
      adminEgregoraLink = document.createElement("a")
      adminEgregoraLink.setAttribute("data-admin-egregora-link", "")
      loginLink.before(adminEgregoraLink)
    }

    adminEgregoraLink.textContent = "Egrégora"
    adminEgregoraLink.setAttribute("href", "./egregora.html")
    registerLink.textContent = "Admin"
    registerLink.setAttribute("href", "./admin.html")
  } else if (registerLink) {
    adminEgregoraLink?.remove()
    registerLink.textContent = "Egrégora"
    registerLink.setAttribute("href", "./egregora.html")
  }
}

function carregarFontAwesomeHeader() {
  if (document.getElementById("font-awesome-icons")) {
    return
  }

  const link = document.createElement("link")
  link.id = "font-awesome-icons"
  link.rel = "stylesheet"
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  document.head.appendChild(link)
}

document.addEventListener("DOMContentLoaded", () => {
  carregarFontAwesomeHeader()

  if (typeof atualizarHeaderAuth === "function") {
    atualizarHeaderAuth(document.querySelector(".header"))
    return
  }

  sincronizarHeaderComSessao()
})
