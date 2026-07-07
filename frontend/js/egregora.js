const egregoraConteudo = document.getElementById("egregora-conteudo")

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

function renderizarCardPost(post, usuario) {
  const textoAcesso = usuario ? "Ler publicação" : "Prévia pública"

  return `
    <a class="blog-card-post" href="./post.html?slug=${encodeURIComponent(post.slug)}">
      <div class="blog-card-cover">
        <img src="${escaparHtml(post.cover_url)}" alt="">
      </div>
      <div class="blog-card-conteudo">
        <span class="blog-data">${formatarDataBlog(post.published_at)}</span>
        <h2>${escaparHtml(post.title)}</h2>
        <p>${escaparHtml(post.excerpt)}</p>
        <span class="blog-card-acesso">${textoAcesso}</span>
      </div>
    </a>
  `
}

async function carregarEgregora() {
  const { supabase, usuario } = await obterUsuarioAtual()

  if (!supabase) {
    egregoraConteudo.innerHTML = `<p class="auth-mensagem erro">Configure o Supabase para carregar a Egrégora.</p>`
    return
  }

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_url, published_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })

  if (error) {
    egregoraConteudo.innerHTML = `<p class="auth-mensagem erro">Não foi possível carregar as publicações.</p>`
    return
  }

  if (!posts.length) {
    egregoraConteudo.innerHTML = `
      <div class="blog-vazio">
        <p class="auth-mensagem">Nenhuma publicação disponível por enquanto.</p>
      </div>
    `
    return
  }

  egregoraConteudo.innerHTML = `
    <div class="blog-lista">
      ${posts.map((post) => renderizarCardPost(post, usuario)).join("")}
    </div>
  `
}

document.addEventListener("DOMContentLoaded", carregarEgregora)
