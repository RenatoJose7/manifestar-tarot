async function sincronizarHeaderComSessao(header = document.querySelector(".header")) {
  if (!header || typeof obterPerfilAtual !== "function") {
    return
  }

  const loginLink = header.querySelector("[data-login-link]")
  const registerLink = header.querySelector("[data-register-link]")

  if (!loginLink) {
    return
  }

  const { perfil, usuario } = await obterPerfilAtual()

  if (!usuario) {
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

  if (registerLink && perfil?.role === "admin") {
    registerLink.textContent = "Admin"
    registerLink.setAttribute("href", "./admin.html")
  } else if (registerLink) {
    registerLink.textContent = "Egrégora"
    registerLink.setAttribute("href", "./egregora.html")
  }
}

document.addEventListener("DOMContentLoaded", () => {
  sincronizarHeaderComSessao()
})
