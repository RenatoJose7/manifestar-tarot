# Manifestar Tarot — Aplicação web Full Stack

**Plataforma web para apresentação e contratação de serviços de leitura, com autenticação, agendamentos e gerenciamento de pedidos.**

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=black)](https://supabase.com/)

## Sobre

O projeto digitaliza etapas de apresentação de serviços, cadastro, agendamento e contratação, mantendo frontend e backend organizados em módulos separados.

## Recursos no código

- Apresentação de serviços e leituras.
- Cadastro e autenticação via Supabase no frontend.
- Agendamento e formulários de atendimento.
- Resumo de pedido, cálculo de totais e cupons.
- Rotas Express para leituras, agendamentos, pedidos e cupons.
- Páginas e scripts de administração.

> Os recursos dependentes de serviços externos exigem configuração adequada. A presença no código não significa que estejam ativos em um ambiente público.

## Arquitetura

```text
manifestar-tarot/
├── frontend/
│   ├── index.html
│   ├── components/
│   ├── css/
│   ├── js/
│   └── pages/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
├── supabase/
└── docs/
```

## API

O servidor Express registra os endpoints base `/leituras`, `/agendamentos`, `/pedidos` e `/cupons`.

## Executar localmente

Na pasta `backend/`:

```bash
npm install
npm run dev
```

O servidor escuta a porta **3000**. Sirva a pasta `frontend/` com um servidor HTTP estático. Integrações de autenticação e serviços externos exigem suas próprias configurações.

## Habilidades demonstradas

Arquitetura de aplicação web, desenvolvimento de API com Express, integração com autenticação, JavaScript no frontend e implementação de regras de negócio.

---

**[Renato José](https://github.com/RenatoJose7)** · **[Mireva Design & Sistemas](https://mirevadesign.com.br/)**
