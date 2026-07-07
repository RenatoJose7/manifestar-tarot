const blogPost = document.getElementById("blog-post")
const TAMANHO_MAXIMO_CAPA_POST = 2 * 1024 * 1024
const TIPOS_CAPA_POST_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"]

let postAtual = null
let contextoAtual = null
let postsRecentesAtuais = []
let curtidasAtuais = { total: 0, curtido: false }

function obterSlugPost() {
  return new URLSearchParams(window.location.search).get("slug")
}

function formatarDataBlog(data) {
  if (!data) {
    return ""
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(data))
}

function formatarConteudoPost(conteudo) {
  return String(conteudo || "")
    .split(/\n{2,}/)
    .map((paragrafo) => paragrafo.trim())
    .filter(Boolean)
    .map((paragrafo) => `<p>${escaparHtml(paragrafo).replace(/\n/g, "<br>")}</p>`)
    .join("")
}

function validarArquivoCapaPost(arquivo) {
  if (!arquivo || !arquivo.size) {
    return ""
  }

  if (!TIPOS_CAPA_POST_PERMITIDOS.includes(arquivo.type)) {
    return "Use uma imagem JPG, PNG ou WEBP."
  }

  if (arquivo.size > TAMANHO_MAXIMO_CAPA_POST) {
    return "A capa precisa ter no máximo 2MB."
  }

  return ""
}

function renderizarMenuAdmin() {
  return `
    <div class="blog-post-admin-menu">
      <button class="blog-post-menu-btn" type="button" aria-label="Abrir opções da publicação" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="blog-post-menu-opcoes" hidden>
        <button type="button" data-post-editar>Editar publicação</button>
        <button type="button" data-post-apagar>Apagar publicação</button>
      </div>
    </div>
  `
}

function renderizarPostsRecentes(posts) {
  if (!posts.length) {
    return `<p class="blog-sidebar-vazio">Nenhuma outra publicação por enquanto.</p>`
  }

  return posts
    .map(
      (post) => `
        <a class="blog-recente" href="./post.html?slug=${encodeURIComponent(post.slug)}">
          <img src="${escaparHtml(post.cover_url)}" alt="">
          <span>
            <strong>${escaparHtml(post.title)}</strong>
            <small>${formatarDataBlog(post.published_at)}</small>
          </span>
        </a>
      `
    )
    .join("")
}

function renderizarComentarios(comentarios = []) {
  if (!contextoAtual?.usuario) {
    return `
      <section class="blog-comentarios">
        <h2>Comentários</h2>
        <div class="blog-bloqueio">
          <p class="auth-mensagem">Entre na sua conta para comentar nesta publicação.</p>
          <a class="auth-admin-link" href="./login.html">Entrar</a>
        </div>
      </section>
    `
  }

  const lista = comentarios.length
    ? comentarios
        .map(
          (comentario) => `
            <article class="blog-comentario" data-comment-id="${comentario.id}">
              <div>
                <strong>${escaparHtml(comentario.author_name)}</strong>
                <span>${formatarDataBlog(comentario.created_at)}</span>
              </div>
              <p>${escaparHtml(comentario.content)}</p>
              ${
                contextoAtual.isAdmin || comentario.user_id === contextoAtual.usuario.id
                  ? `<button type="button" data-comment-delete="${comentario.id}">Apagar</button>`
                  : ""
              }
            </article>
          `
        )
        .join("")
    : `<p class="blog-sidebar-vazio">Nenhum comentário ainda. Seja a primeira pessoa a comentar.</p>`

  return `
    <section class="blog-comentarios">
      <h2>Comentários</h2>
      <form class="blog-comentario-form" id="blog-comentario-form">
        <label for="comentario-texto">Escreva um comentário</label>
        <textarea id="comentario-texto" name="content" rows="4" maxlength="800" required></textarea>
        <button class="auth-btn" type="submit">Comentar</button>
        <p id="comentario-mensagem" class="auth-mensagem"></p>
      </form>
      <div class="blog-comentarios-lista" id="blog-comentarios-lista">
        ${lista}
      </div>
    </section>
  `
}

function renderizarCurtidas(curtidas = { total: 0, curtido: false }) {
  const total = Number(curtidas.total || 0)
  const textoCurtidas = total === 1 ? "1 curtida" : `${total} curtidas`

  if (!contextoAtual?.usuario) {
    return `
      <div class="blog-curtidas">
        <span>${textoCurtidas}</span>
        <a href="./login.html">Entre para curtir</a>
      </div>
    `
  }

  return `
    <div class="blog-curtidas">
      <button class="blog-like-btn ${curtidas.curtido ? "ativo" : ""}" type="button" data-like-toggle aria-pressed="${curtidas.curtido}">
        <span aria-hidden="true">♥</span>
        ${curtidas.curtido ? "Curtido" : "Curtir"}
      </button>
      <span>${textoCurtidas}</span>
      <p id="curtida-mensagem" class="auth-mensagem"></p>
    </div>
  `
}

function renderizarPost(post, contexto, postsRecentes = [], comentarios = [], curtidas = { total: 0, curtido: false }) {
  const { usuario, isAdmin } = contexto
  const corpo = usuario
    ? `<div class="blog-post-corpo">${formatarConteudoPost(post.content)}</div>`
    : `
      <div class="blog-post-corpo">
        <p>${escaparHtml(post.excerpt)}</p>
      </div>
      <div class="blog-bloqueio">
        <p class="auth-mensagem">Entre na sua conta para ler a publicação completa.</p>
        <a class="auth-admin-link" href="./login.html">Entrar</a>
      </div>
    `

  blogPost.innerHTML = `
    ${isAdmin ? renderizarMenuAdmin() : ""}

    <header class="blog-post-topo">
      <p class="section-kicker">Egrégora</p>
      <h1>${escaparHtml(post.title)}</h1>
      <p class="blog-data">${formatarDataBlog(post.published_at)}</p>
      <p class="blog-post-resumo">${escaparHtml(post.excerpt)}</p>
      ${renderizarCurtidas(curtidas)}
    </header>

    <div class="blog-post-layout">
      <div class="blog-post-main">
        <div class="blog-post-cover">
          <img src="${escaparHtml(post.cover_url)}" alt="">
        </div>
        ${corpo}
        ${renderizarComentarios(comentarios)}
      </div>

      <aside class="blog-sidebar">
        <section class="blog-sidebar-card">
          <h2>Posts recentes</h2>
          ${renderizarPostsRecentes(postsRecentes)}
        </section>
      </aside>
    </div>
  `

  if (isAdmin) {
    configurarMenuAdmin()
  }

  configurarComentarios()
  configurarCurtidas()
}

function configurarMenuAdmin() {
  const menuBotao = blogPost.querySelector(".blog-post-menu-btn")
  const menuOpcoes = blogPost.querySelector(".blog-post-menu-opcoes")
  const editarBotao = blogPost.querySelector("[data-post-editar]")
  const apagarBotao = blogPost.querySelector("[data-post-apagar]")

  menuBotao?.addEventListener("click", () => {
    const aberto = menuOpcoes?.hidden === false
    menuOpcoes.hidden = aberto
    menuBotao.setAttribute("aria-expanded", String(!aberto))
  })

  editarBotao?.addEventListener("click", () => renderizarFormularioEdicao())
  apagarBotao?.addEventListener("click", apagarPublicacao)
}

function configurarComentarios() {
  const form = document.getElementById("blog-comentario-form")

  form?.addEventListener("submit", enviarComentario)

  blogPost.querySelectorAll("[data-comment-delete]").forEach((botao) => {
    botao.addEventListener("click", () => apagarComentario(botao.dataset.commentDelete))
  })
}

function configurarCurtidas() {
  const botao = blogPost.querySelector("[data-like-toggle]")

  botao?.addEventListener("click", alternarCurtida)
}

function renderizarFormularioEdicao() {
  if (!postAtual || !contextoAtual?.isAdmin) {
    return
  }

  blogPost.innerHTML = `
    <section class="blog-edicao">
      <div class="blog-post-topo">
        <p class="section-kicker">Editar</p>
        <h1>Publicação</h1>
      </div>

      <form class="auth-form blog-edicao-form" id="blog-edicao-form">
        <label>
          Título
          <input type="text" name="title" maxlength="120" value="${escaparHtml(postAtual.title)}" required>
        </label>

        <label>
          Trocar capa
          <input id="blog-edicao-cover" type="file" name="cover" accept="image/png,image/jpeg,image/webp">
        </label>

        <div class="blog-cover-preview" id="blog-edicao-preview">
          <img src="${escaparHtml(postAtual.cover_url)}" alt="">
        </div>

        <label>
          Prévia
          <textarea name="excerpt" maxlength="260" rows="4" required>${escaparHtml(postAtual.excerpt)}</textarea>
        </label>

        <label>
          Texto
          <textarea name="content" rows="10" required>${escaparHtml(postAtual.content)}</textarea>
        </label>

        <div class="blog-edicao-acoes">
          <button class="auth-btn" type="submit">Salvar alterações</button>
          <button class="auth-admin-link" type="button" data-post-cancelar>Cancelar</button>
        </div>
        <p id="blog-edicao-mensagem" class="auth-mensagem"></p>
      </form>
    </section>
  `

  configurarPreviewEdicao()
  blogPost.querySelector("[data-post-cancelar]")?.addEventListener("click", () => {
    carregarPost()
  })
  blogPost.querySelector("#blog-edicao-form")?.addEventListener("submit", salvarEdicao)
}

function configurarPreviewEdicao() {
  const input = document.getElementById("blog-edicao-cover")
  const preview = document.getElementById("blog-edicao-preview")

  input?.addEventListener("change", () => {
    const arquivo = input.files?.[0]
    const erro = validarArquivoCapaPost(arquivo)

    if (!arquivo) {
      preview.innerHTML = `<img src="${escaparHtml(postAtual.cover_url)}" alt="">`
      return
    }

    if (erro) {
      preview.innerHTML = `<span>${erro}</span>`
      input.value = ""
      return
    }

    const url = URL.createObjectURL(arquivo)
    preview.innerHTML = `<img src="${url}" alt="">`
  })
}

async function salvarEdicao(evento) {
  evento.preventDefault()

  const form = evento.currentTarget
  const mensagem = document.getElementById("blog-edicao-mensagem")
  const botao = form.querySelector("button[type='submit']")
  const dados = new FormData(form)
  const title = String(dados.get("title") || "").trim()
  const excerpt = String(dados.get("excerpt") || "").trim()
  const content = String(dados.get("content") || "").trim()
  const cover = dados.get("cover")
  const erroCapa = validarArquivoCapaPost(cover)

  if (!title || !excerpt || !content) {
    definirMensagemAuth(mensagem, "Preencha todos os campos da publicação.", "erro")
    return
  }

  if (erroCapa) {
    definirMensagemAuth(mensagem, erroCapa, "erro")
    return
  }

  botao.disabled = true
  botao.textContent = "Salvando..."
  definirMensagemAuth(mensagem, "Salvando alterações...")

  const atualizacao = {
    title,
    excerpt,
    content,
    updated_at: new Date().toISOString()
  }

  if (cover && cover.size) {
    const extensao = cover.name.split(".").pop()?.toLowerCase() || "jpg"
    const coverPath = `posts/${postAtual.slug}-${Date.now().toString(36)}.${extensao}`
    const { error: uploadError } = await contextoAtual.supabase.storage
      .from("blog-covers")
      .upload(coverPath, cover, {
        cacheControl: "3600",
        contentType: cover.type,
        upsert: false
      })

    if (uploadError) {
      botao.disabled = false
      botao.textContent = "Salvar alterações"
      definirMensagemAuth(mensagem, traduzirErroAuth(uploadError), "erro")
      return
    }

    const { data: publicUrlData } = contextoAtual.supabase.storage
      .from("blog-covers")
      .getPublicUrl(coverPath)

    atualizacao.cover_url = publicUrlData.publicUrl
    atualizacao.cover_path = coverPath
  }

  const { data: postAtualizado, error } = await contextoAtual.supabase
    .from("blog_posts")
    .update(atualizacao)
    .eq("id", postAtual.id)
    .select("id, slug, title, excerpt, content, cover_url, cover_path, published_at")
    .single()

  botao.disabled = false
  botao.textContent = "Salvar alterações"

  if (error) {
    definirMensagemAuth(mensagem, traduzirErroAuth(error), "erro")
    return
  }

  if (atualizacao.cover_path && postAtual.cover_path) {
    await contextoAtual.supabase.storage.from("blog-covers").remove([postAtual.cover_path])
  }

  postAtual = postAtualizado
  await carregarPost()
}

async function apagarPublicacao() {
  if (!postAtual || !contextoAtual?.isAdmin) {
    return
  }

  const confirmado = window.confirm("Deseja apagar esta publicação? Essa ação não pode ser desfeita.")

  if (!confirmado) {
    return
  }

  const { error } = await contextoAtual.supabase
    .from("blog_posts")
    .delete()
    .eq("id", postAtual.id)

  if (error) {
    window.alert(traduzirErroAuth(error))
    return
  }

  if (postAtual.cover_path) {
    await contextoAtual.supabase.storage.from("blog-covers").remove([postAtual.cover_path])
  }

  window.location.href = "./egregora.html"
}

async function carregarCurtidas() {
  if (!contextoAtual?.supabase || !postAtual) {
    return { total: 0, curtido: false }
  }

  const { count } = await contextoAtual.supabase
    .from("post_likes")
    .select("id", { count: "exact", head: true })
    .eq("post_id", postAtual.id)

  if (!contextoAtual.usuario) {
    return { total: count || 0, curtido: false }
  }

  const { data } = await contextoAtual.supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postAtual.id)
    .eq("user_id", contextoAtual.usuario.id)
    .maybeSingle()

  return { total: count || 0, curtido: Boolean(data) }
}

async function alternarCurtida() {
  if (!contextoAtual?.usuario || !postAtual) {
    window.location.href = "./login.html"
    return
  }

  const botao = blogPost.querySelector("[data-like-toggle]")
  const mensagem = document.getElementById("curtida-mensagem")

  botao.disabled = true
  definirMensagemAuth(mensagem, "Atualizando curtida...")

  const consulta = contextoAtual.supabase.from("post_likes")
  const resposta = curtidasAtuais.curtido
    ? await consulta
        .delete()
        .eq("post_id", postAtual.id)
        .eq("user_id", contextoAtual.usuario.id)
    : await consulta.insert({
        post_id: postAtual.id,
        user_id: contextoAtual.usuario.id
      })

  if (resposta.error) {
    botao.disabled = false
    definirMensagemAuth(mensagem, traduzirErroAuth(resposta.error), "erro")
    return
  }

  await recarregarPostComInteracoes()
}

async function carregarComentarios() {
  if (!contextoAtual?.usuario || !postAtual) {
    return []
  }

  const { data, error } = await contextoAtual.supabase
    .from("post_comments")
    .select("id, post_id, user_id, author_name, content, created_at")
    .eq("post_id", postAtual.id)
    .order("created_at", { ascending: false })

  if (error) {
    return []
  }

  return data || []
}

async function enviarComentario(evento) {
  evento.preventDefault()

  const form = evento.currentTarget
  const mensagem = document.getElementById("comentario-mensagem")
  const dados = new FormData(form)
  const content = String(dados.get("content") || "").trim()

  if (!content) {
    definirMensagemAuth(mensagem, "Escreva um comentário antes de enviar.", "erro")
    return
  }

  definirMensagemAuth(mensagem, "Enviando comentário...")

  const authorName =
    contextoAtual.perfil?.nome ||
    contextoAtual.usuario.user_metadata?.nome ||
    contextoAtual.usuario.email ||
    "Cliente"

  const { error } = await contextoAtual.supabase.from("post_comments").insert({
    post_id: postAtual.id,
    user_id: contextoAtual.usuario.id,
    author_name: authorName,
    content
  })

  if (error) {
    definirMensagemAuth(mensagem, traduzirErroAuth(error), "erro")
    return
  }

  form.reset()
  await recarregarPostComComentarios()
}

async function apagarComentario(id) {
  const confirmado = window.confirm("Deseja apagar este comentário?")

  if (!confirmado) {
    return
  }

  const { error } = await contextoAtual.supabase
    .from("post_comments")
    .delete()
    .eq("id", id)

  if (error) {
    window.alert(traduzirErroAuth(error))
    return
  }

  await recarregarPostComComentarios()
}

async function carregarPostsRecentes(supabase, slugAtual) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, cover_url, published_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .neq("slug", slugAtual)
    .order("published_at", { ascending: false })
    .limit(5)

  if (error) {
    return []
  }

  return data || []
}

async function recarregarPostComInteracoes() {
  curtidasAtuais = await carregarCurtidas()
  const comentarios = await carregarComentarios()
  renderizarPost(postAtual, contextoAtual, postsRecentesAtuais, comentarios, curtidasAtuais)
}

async function recarregarPostComComentarios() {
  await recarregarPostComInteracoes()
}

async function carregarPost() {
  const slug = obterSlugPost()
  const { supabase, usuario, perfil } = await obterPerfilAtual()

  if (!slug) {
    blogPost.innerHTML = `<p class="auth-mensagem erro">Publicação não informada.</p>`
    return
  }

  if (!supabase) {
    blogPost.innerHTML = `<p class="auth-mensagem erro">Configure o Supabase para carregar o blog.</p>`
    return
  }

  const isAdmin = perfil?.role === "admin" && perfil?.status === "active"
  const colunas = usuario
    ? "id, slug, title, excerpt, content, cover_url, cover_path, published_at"
    : "id, slug, title, excerpt, cover_url, published_at"

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(colunas)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle()

  if (error || !post) {
    blogPost.innerHTML = `<p class="auth-mensagem erro">Publicação não encontrada.</p>`
    return
  }

  postAtual = post
  contextoAtual = { supabase, usuario, perfil, isAdmin }
  postsRecentesAtuais = await carregarPostsRecentes(supabase, slug)
  await recarregarPostComInteracoes()
}

document.addEventListener("DOMContentLoaded", carregarPost)
