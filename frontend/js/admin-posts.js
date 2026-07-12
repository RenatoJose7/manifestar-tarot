const adminPostsConteudo = document.getElementById("admin-posts-conteudo")
const TAMANHO_MAXIMO_CAPA = 12 * 1024 * 1024
const TAMANHO_MAXIMO_UPLOAD = 1.8 * 1024 * 1024
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
  const larguras = [LARGURA_MAXIMA_CAPA, 1500, 1200, 960, 760]
  const qualidades = [QUALIDADE_CAPA, 0.78, 0.68, 0.58]

  for (const larguraMaxima of larguras) {
    const escala = Math.min(1, larguraMaxima / imagem.naturalWidth)
    const largura = Math.round(imagem.naturalWidth * escala)
    const altura = Math.round(imagem.naturalHeight * escala)
    const canvas = document.createElement("canvas")

    canvas.width = largura
    canvas.height = altura
    canvas.getContext("2d").drawImage(imagem, 0, 0, largura, altura)

    for (const qualidade of qualidades) {
      const arquivoPreparado = await new Promise((resolve, reject) => {
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
          qualidade
        )
      })

      if (arquivoPreparado.size <= TAMANHO_MAXIMO_UPLOAD) {
        return arquivoPreparado
      }
    }
  }

  throw new Error("Não foi possível preparar a imagem.")
}

function gerarCaminhoImagem(pasta, nomeBase = "imagem") {
  const nome = gerarSlug(nomeBase) || "imagem"
  const sufixo = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

  return `${pasta}/${nome}-${sufixo}.jpg`
}

async function enviarImagemBlog(supabase, arquivo, pasta = "media") {
  const imagem = await prepararImagemCapa(arquivo)
  const caminho = gerarCaminhoImagem(pasta, arquivo.name)
  const { error } = await supabase.storage
    .from("blog-covers")
    .upload(caminho, imagem, {
      cacheControl: "3600",
      contentType: imagem.type,
      upsert: false
    })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from("blog-covers").getPublicUrl(caminho)

  return { url: data.publicUrl, caminho }
}

function pareceHtml(conteudo) {
  return /<\/?[a-z][\s\S]*>/i.test(String(conteudo || ""))
}

function sanitizarHtmlBlog(html) {
  const permitido = new Set(["A", "B", "BLOCKQUOTE", "BR", "EM", "H2", "H3", "I", "IMG", "LI", "OL", "P", "STRONG", "UL"])
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html")
  const raiz = doc.body.firstElementChild

  ;[...raiz.querySelectorAll("*")].forEach((elemento) => {
    if (!permitido.has(elemento.tagName)) {
      elemento.replaceWith(...elemento.childNodes)
      return
    }

    if (elemento.tagName === "A") {
      const href = elemento.getAttribute("href") || ""

      ;[...elemento.attributes].forEach((atributo) => elemento.removeAttribute(atributo.name))

      if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) {
        elemento.setAttribute("href", href)
        elemento.setAttribute("target", "_blank")
        elemento.setAttribute("rel", "noopener noreferrer")
      }

      return
    }

    if (elemento.tagName === "IMG") {
      const src = elemento.getAttribute("src") || ""
      const alt = elemento.getAttribute("alt") || ""

      ;[...elemento.attributes].forEach((atributo) => elemento.removeAttribute(atributo.name))

      if (/^https?:\/\//i.test(src)) {
        elemento.setAttribute("src", src)
        elemento.setAttribute("alt", alt)
        elemento.setAttribute("loading", "lazy")
      }

      return
    }

    ;[...elemento.attributes].forEach((atributo) => elemento.removeAttribute(atributo.name))
  })

  return raiz.innerHTML
}

function formatarConteudoBlog(conteudo) {
  if (pareceHtml(conteudo)) {
    return sanitizarHtmlBlog(conteudo)
  }

  return String(conteudo || "")
    .split(/\n{2,}/)
    .map((paragrafo) => paragrafo.trim())
    .filter(Boolean)
    .map((paragrafo) => `<p>${escaparHtml(paragrafo).replace(/\n/g, "<br>")}</p>`)
    .join("")
}

function obterConteudoEditor() {
  const editor = window.tinymce?.get("blog-content-editor")

  if (editor) {
    return editor.getContent().trim()
  }

  return String(document.getElementById("blog-content-editor")?.value || "").trim()
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
          <textarea id="blog-content-editor" name="content" rows="12" required></textarea>
        </label>

        <div class="blog-edicao-acoes">
          <button class="auth-admin-link" type="button" data-preview-post>Visualizar</button>
          <button class="auth-btn" type="submit">Publicar post</button>
        </div>
        <p id="blog-admin-mensagem" class="auth-mensagem"></p>
      </form>

      <aside>
        <h3 class="section-kicker">Posts</h3>
        <div class="blog-admin-lista" id="blog-admin-lista">
          <p class="auth-mensagem">Carregando posts...</p>
        </div>
      </aside>
    </div>

    <section class="blog-preview-post" id="blog-preview-post" hidden></section>
  `
}

async function configurarEditorTexto(supabase) {
  if (!window.tinymce) {
    return
  }

  const editorAnterior = window.tinymce.get("blog-content-editor")

  if (editorAnterior) {
    editorAnterior.remove()
  }

  await window.tinymce.init({
    selector: "#blog-content-editor",
    height: 440,
    menubar: false,
    branding: false,
    promotion: false,
    plugins: "autoresize image link lists preview",
    toolbar: "undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | link image | preview",
    block_formats: "Parágrafo=p;Título=h2;Subtítulo=h3;Citação=blockquote",
    images_file_types: "jpg,jpeg,png,webp,gif,heic,heif",
    automatic_uploads: true,
    paste_data_images: true,
    images_upload_handler: async (blobInfo, progress) => {
      progress(20)
      const arquivo = new File([blobInfo.blob()], blobInfo.filename() || "imagem.jpg", {
        type: blobInfo.blob().type || "image/jpeg"
      })
      const { url } = await enviarImagemBlog(supabase, arquivo, "media")

      progress(100)
      return url
    },
    content_style: `
      body { color: #1f1f1f; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.75; }
      h2, h3 { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; text-transform: uppercase; }
      img { max-width: 100%; height: auto; display: block; margin: 24px auto; }
      blockquote { border-left: 3px solid #ae8746; margin-left: 0; padding-left: 18px; color: #555; }
    `
  })
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

function obterDadosFormularioPost() {
  const form = document.getElementById("blog-post-form")
  const dados = new FormData(form)

  return {
    title: String(dados.get("title") || "").trim(),
    excerpt: String(dados.get("excerpt") || "").trim(),
    content: obterConteudoEditor(),
    cover: dados.get("cover")
  }
}

function renderizarPreviewPost() {
  const preview = document.getElementById("blog-preview-post")
  const { title, excerpt, content, cover } = obterDadosFormularioPost()

  if (!preview) {
    return
  }

  if (!title && !excerpt && !content && (!cover || !cover.size)) {
    preview.hidden = true
    preview.innerHTML = ""
    return
  }

  const capa = cover && cover.size ? URL.createObjectURL(cover) : ""

  preview.hidden = false
  preview.innerHTML = `
    <div class="blog-post-topo">
      <p class="section-kicker">Prévia</p>
      <h1>${escaparHtml(title || "Título da publicação")}</h1>
      <p class="blog-post-resumo">${escaparHtml(excerpt || "Prévia da publicação")}</p>
    </div>
    ${capa ? `<div class="blog-post-cover blog-post-cover-preview"><img src="${capa}" alt=""></div>` : ""}
    <div class="blog-post-corpo">
      ${content ? formatarConteudoBlog(content) : "<p>O texto da publicação aparecerá aqui.</p>"}
    </div>
  `
  preview.scrollIntoView({ behavior: "smooth", block: "start" })
}

function configurarPreviewPost() {
  document.querySelector("[data-preview-post]")?.addEventListener("click", renderizarPreviewPost)
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
  const { title, excerpt, content, cover } = obterDadosFormularioPost()
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
  window.tinymce?.get("blog-content-editor")?.setContent("")
  document.getElementById("blog-preview-post").hidden = true
  document.getElementById("blog-preview-post").innerHTML = ""
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
  await configurarEditorTexto(supabase)
  configurarPreviewPost()
  document
    .getElementById("blog-post-form")
    ?.addEventListener("submit", (evento) => enviarPost(evento, supabase, usuario))
  await carregarPostsAdmin(supabase)
}

document.addEventListener("DOMContentLoaded", carregarAdminPosts)
