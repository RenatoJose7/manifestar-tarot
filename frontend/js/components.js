async function carregarComponente(alvoId, caminho, seletor) {
  const alvo = document.getElementById(alvoId)

  if (!alvo) {
    return
  }

  try {
    const resposta = await fetch(caminho)
    const html = await resposta.text()
    const documento = new DOMParser().parseFromString(html, "text/html")
    const elemento = documento.querySelector(seletor)

    alvo.innerHTML = elemento ? elemento.outerHTML : html
  } catch (erro) {
    alvo.innerHTML = ""
  }
}

function carregarScriptGlobal(src, id) {
  if (id && document.getElementById(id)) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.defer = true

    if (id) {
      script.id = id
    }

    script.addEventListener("load", resolve)
    script.addEventListener("error", reject)
    document.head.appendChild(script)
  })
}

async function prepararSupabaseParaHeader() {
  try {
    if (!window.supabase?.createClient) {
      await carregarScriptGlobal("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2", "supabase-js-client")
    }

    if (!window.manifestarSupabaseConfig && typeof SUPABASE_URL === "undefined") {
      await carregarScriptGlobal("../js/supabase-config.js", "manifestar-supabase-config")
    }

    if (typeof obterPerfilAtual !== "function") {
      await carregarScriptGlobal("../js/auth-client.js", "manifestar-auth-client")
    }

    return typeof obterPerfilAtual === "function"
  } catch (erro) {
    return false
  }
}

async function atualizarHeaderAuth(header) {
  const loginLink = header.querySelector("[data-login-link]")
  const registerLink = header.querySelector("[data-register-link]")

  if (!loginLink || !(await prepararSupabaseParaHeader())) {
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

async function ajustarLinksDoHeader() {
  const header = document.querySelector("#header .header")

  if (!header) {
    return
  }

  const links = [...header.querySelectorAll("a")]
  const destinos = ["./index.html", "./leituras.html", "./banhos.html", "./contato.html", "./login.html", "./cadastro.html"]

  links.forEach((link, index) => {
    if (destinos[index]) {
      link.setAttribute("href", destinos[index])
    }
  })

  const logo = header.querySelector(".logo-area")

  if (logo) {
    logo.style.cursor = "pointer"
    logo.addEventListener("click", () => {
      window.location.href = "./index.html"
    })
  }

  await atualizarHeaderAuth(header)

  const menuToggle = header.querySelector(".menu-toggle")
  const menu = header.querySelector("#menu-principal")

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open")
      menuToggle.classList.toggle("is-open", isOpen)
      menuToggle.setAttribute("aria-expanded", String(isOpen))
    })

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open")
        menuToggle.classList.remove("is-open")
        menuToggle.setAttribute("aria-expanded", "false")
      })
    })
  }
}

function ajustarLinksDoFooter() {
  const footer = document.querySelector("#footer footer")

  if (!footer) {
    return
  }

  const linksNavegacao = [...footer.querySelectorAll(".linksRodape a")]
  const destinos = ["./index.html", "./sobremim.html", "./leituras.html", "./banhos.html", "./contato.html", "./cadastro.html", "./termos.html"]

  linksNavegacao.forEach((link, index) => {
    if (destinos[index]) {
      link.setAttribute("href", destinos[index])
    }
  })
}

function carregarFontAwesome() {
  const id = "font-awesome-icons"

  if (document.getElementById(id)) {
    return
  }

  const link = document.createElement("link")
  link.id = id
  link.rel = "stylesheet"
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  document.head.appendChild(link)
}

document.addEventListener("DOMContentLoaded", async () => {
  carregarFontAwesome()
  await carregarComponente("header", "../components/header.html", "header")
  await ajustarLinksDoHeader()
  await carregarComponente("footer", "../components/footer.html", "footer")
  ajustarLinksDoFooter()
})
