document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contato-form")

  if (!form) {
    return
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault()

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const dados = new FormData(form)
    const nome = dados.get("nome")
    const assunto = dados.get("assunto")
    const mensagem = dados.get("mensagem")

    const texto = [
      "Olá, Paola! Vim pelo site Manifestar Tarot.",
      `Meu nome é ${nome}.`,
      `Assunto: ${assunto}.`,
      `Mensagem: ${mensagem}`,
    ].join("\n")

    window.open(`https://wa.me/5511976507194?text=${encodeURIComponent(texto)}`, "_blank")
  })
})
