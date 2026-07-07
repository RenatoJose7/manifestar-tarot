const adminPostsConteudo = document.getElementById("admin-posts-conteudo")
const TAMANHO_MAXIMO_CAPA = 12 * 1024 * 1024
const LARGURA_MAXIMA_CAPA = 1800
const QUALIDADE_CAPA = 0.86

function gerarSlug(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
}

function formatarDataBlog(data) {
  if (!data) {
    return ""
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(data))
}

function validarArquivoCapa(arquivo) {
  if (!arquivo || !arquivo.size) {
    return "Selecione uma capa para publicar."
  }

  const nome = arquivo.name || ""
  const extensaoImagem = /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(nome)

  if (!arquivo.type.startsWith("image/") && !extensaoImagem) {
    return "Use um arquivo de imagem."
  }

  if (arquivo.size > TAMANHO_MAXIMO_CAPA) {
    return "A capa precisa ter no máximo 12MB."
  }

  return ""
}

function carregarImagemLocal(arquivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo)
    const imagem = new Image()

    imagem.onload = () => {
      URL.revokeObjectURL(url)
      resolve(imagem)
    }

    imagem.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Não foi possível carregar a imagem escolhida."))
    }

    imagem.src = url
  })
}

async function prepararImagemCapa(arquivo) {
  const imagem = await carregarImagemLocal(arquivo)
  const escala = Math.min(1, LARGURA_MAXIMA_CAPA / imagem.naturalWidth)
  const largura = Math.round(imagem.naturalWidth * escala)
  const altura = Math.round(imagem.naturalHeight * escala)
  const canvas = document.createElement("canvas")

  canvas.width = largura
  canvas.height = altura
  canvas.getContext("2d").drawImage(imagem, 0, 0, largura, altura)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Não foi possível preparar a imagem."))
          return
        }

        resolve(
          new File([blob], `${gerarSlug(arquivo.name.replace(/\.[^.]+$/, "")) || "capa"}.jpg`, {
            type: "image/jpeg"
          })
        )
      },
      "image/jpeg",
      QUALIDADE_CAPA
    )
  })
}

function renderizarFormularioPost() {
  adminPostsConteudo.innerHTML = `
    <div class="blog-admin-grid">
      <form class="auth-form" id="blog-post-form">
        <label>
          Título
          <input type="text" name="title" maxlength="120" required>
        </label>

        <label>
          Capa
          <input id="blog-cover-input" type="file" name="cover" accept="image/*" required>
        </label>

        <div class="blog-cover-preview" id="blog-cover-preview">
          <span>Prévia da capa</span>
        </div>

        <label>
          Prévia
          <textarea name="excerpt" maxlength="260" rows="4" required></textarea>
        </label>

        <label>
          Texto
          <textarea name="content" rows="10" required></textarea>
        </label>

        <button class="auth-btn" type="submit">Publicar post</button>
        <p id="blog-admin-mensagem" class="auth-mensagem"></p>
      </form>

      <aside>
        <h3 class="section-kicker">Posts</h3>
        <div class="blog-admin-lista" id="blog-admin-lista">
          <p class="auth-mensagem">Carregando posts...</p>
        </div>
      </aside>
    </div>
  `
}

function configurarPreviewCapa() {
  const input = document.getElementById("blog-cover-input")
  const preview = document.getElementById("blog-cover-preview")

  input?.addEventListener("change", () => {
    const arquivo = input.files?.[0]

    if (!arquivo) {
      preview.innerHTML = "<span>Prévia da capa</span>"
      return
    }

    const erro = validarArquivoCapa(arquivo)

    if (erro) {
      preview.innerHTML = `<span>${erro}</span>`
      input.value = ""
      return
    }

    const url = URL.createObjectURL(arquivo)
    preview.innerHTML = `<img src="${url}" alt="">`
  })
}

async function carregarPostsAdmin(supabase) {
  const lista = document.getElementById("blog-admin-lista")

  if (!lista) {
    return
  }

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, cover_url, published_at")
    .order("published_at", { ascending: false })
    .limit(8)

  if (error) {
    lista.innerHTML = `<p class="auth-mensagem erro">Não foi possível carregar os posts.</p>`
    return
  }

  if (!posts.length) {
    lista.innerHTML = `<p class="auth-mensagem">Nenhum post publicado.</p>`
    return
  }

  lista.innerHTML = posts
    .map(
      (post) => `
        <article class="blog-admin-post">
          <img src="${escaparHtml(post.cover_url)}" alt="">
          <div>
            <strong>${escaparHtml(post.title)}</strong>
            <span class="blog-data">${formatarDataBlog(post.published_at)}</span>
          </div>
        </article>
      `
    )
    .join("")
}

async function enviarPost(evento, supabase, usuario) {
  evento.preventDefault()

  const form = evento.currentTarget
  const mensagem = document.getElementById("blog-admin-mensagem")
  const botao = form.querySelector("button[type='submit']")
  const dados = new FormData(form)
  const title = String(dados.get("title") || "").trim()
  const excerpt = String(dados.get("excerpt") || "").trim()
  const content = String(dados.get("content") || "").trim()
  const cover = dados.get("cover")
  const erroCapa = validarArquivoCapa(cover)

  if (!title || !excerpt || !content) {
    definirMensagemAuth(mensagem, "Preencha todos os campos do post.", "erro")
    return
  }

  if (erroCapa) {
    definirMensagemAuth(mensagem, erroCapa, "erro")
    return
  }

  const slugBase = gerarSlug(title) || "post"
  const slug = `${slugBase}-${Date.now().toString(36)}`
  let capaPreparada

  botao.disabled = true
  botao.textContent = "Publicando..."
  definirMensagemAuth(mensagem, "Preparando imagem...")

  try {
    capaPreparada = await prepararImagemCapa(cover)
  } catch (erro) {
    botao.disabled = false
    botao.textContent = "Publicar post"
    definirMensagemAuth(mensagem, erro.message, "erro")
    return
  }

  const coverPath = `posts/${slug}.jpg`
  definirMensagemAuth(mensagem, "Enviando publicação...")

  const { error: uploadError } = await supabase.storage
    .from("blog-covers")
    .upload(coverPath, capaPreparada, {
      cacheControl: "3600",
      contentType: capaPreparada.type,
      upsert: false
    })

  if (uploadError) {
    botao.disabled = false
    botao.textContent = "Publicar post"
    definirMensagemAuth(mensagem, traduzirErroAuth(uploadError), "erro")
    return
  }

  const { data: publicUrlData } = supabase.storage
    .from("blog-covers")
    .getPublicUrl(coverPath)

  const { error: insertError } = await supabase.from("blog_posts").insert({
    author_id: usuario.id,
    slug,
    title,
    excerpt,
    content,
    cover_url: publicUrlData.publicUrl,
    cover_path: coverPath,
    status: "published",
    published_at: new Date().toISOString()
  })

  botao.disabled = false
  botao.textContent = "Publicar post"

  if (insertError) {
    definirMensagemAuth(mensagem, traduzirErroAuth(insertError), "erro")
    return
  }

  form.reset()
  document.getElementById("blog-cover-preview").innerHTML = "<span>Prévia da capa</span>"
  definirMensagemAuth(mensagem, "Post publicado com sucesso.", "sucesso")
  await carregarPostsAdmin(supabase)
}

async function carregarAdminPosts() {
  const { supabase, usuario, perfil, erro } = await obterPerfilAtual()

  if (!usuario) {
    window.location.href = "./login.html"
    return
  }

  if (erro || perfil?.role !== "admin" || perfil?.status !== "active") {
    adminPostsConteudo.innerHTML = `
      <p class="auth-mensagem erro">
        Esta área é restrita ao acesso administrativo.
      </p>
      <a class="auth-admin-link" href="./admin.html">Voltar para o painel</a>
    `
    return
  }

  renderizarFormularioPost()
  configurarPreviewCapa()
  document
    .getElementById("blog-post-form")
    ?.addEventListener("submit", (evento) => enviarPost(evento, supabase, usuario))
  await carregarPostsAdmin(supabase)
}

document.addEventListener("DOMContentLoaded", carregarAdminPosts)
