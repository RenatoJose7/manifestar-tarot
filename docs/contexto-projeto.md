# Contexto do Projeto Manifestar Tarot

Atualizado em: 03/07/2026

Este arquivo registra as decisões tomadas em conversa para orientar as próximas etapas do projeto.

## Visão Geral

O site Manifestar Tarot terá uma área de cadastro integrada ao Supabase para liberar recursos exclusivos para usuários cadastrados.

A ideia principal é criar uma base de clientes para:

- permitir acesso a um blog exclusivo;
- criar campanhas e cupons para usuários cadastrados;
- futuramente disparar novidades pelo WhatsApp via Twilio;
- centralizar pedidos, agendamentos e histórico de atendimento;
- permitir uma área administrativa simples para a Paola.

O WhatsApp automático deve ficar para uma etapa posterior.

## Cadastro e Acesso

- Todos os usuários cadastrados terão acesso ao conteúdo restrito, sem aprovação manual.
- Não haverá confirmação obrigatória por email neste primeiro momento.
- Dados obrigatórios no cadastro:
  - nome completo;
  - WhatsApp;
  - email;
  - senha;
  - aceite dos termos de consentimento.
- Não haverá Instagram no cadastro.
- Se não gerar muito trabalho, o usuário poderá editar os próprios dados depois.
- O cadastro deve registrar consentimento para receber mensagens pelo WhatsApp.

## Supabase

- O banco Supabase está criado, mas ainda está vazio.
- A URL e a chave pública do Supabase já foram colocadas no projeto pelo usuário.
- Ainda não há tabelas criadas.
- Auth ainda precisa ser configurado/validado no Supabase.
- É recomendado criar uma tabela `profiles` ligada ao `auth.users`.
- Papéis administrativos não devem depender de `user_metadata`, porque esse campo pode ser alterado pelo usuário.
- Para permissões de admin, usar preferencialmente:
  - `app_metadata` configurado fora do frontend; ou
  - tabela/controlador protegido no backend.

## Blog Fechado

O blog será um recurso exclusivo para usuários cadastrados.

Decisões:

- Usuários não logados podem ver uma prévia pública dos posts.
- Usuários cadastrados/logados podem ver o conteúdo completo.
- Cada post deve ter:
  - capa;
  - título;
  - texto.
- A Paola deve conseguir criar posts por uma área administrativa do site.
- Não precisa de fluxo de rascunho no início: publicou, entra no ar.
- Usuários cadastrados poderão:
  - curtir posts;
  - comentar posts.

## WhatsApp e Twilio

Integração escolhida inicialmente: Twilio.

Ficará para a última etapa.

Ideia futura:

- Ao publicar um post, enviar automaticamente uma mensagem para todos os usuários cadastrados.
- De preferência, enviar uma prévia do texto com imagem/capa.
- O envio deve acontecer automaticamente ao publicar.
- É desejável registrar quem recebeu, quem falhou e quando foi enviado, mas isso pode ser uma evolução.

Observação: como há consentimento para WhatsApp no cadastro, os disparos devem respeitar esse aceite.

## Cupons

Cupons serão usados inicialmente apenas para leituras.

Decisões:

- A Paola cria campanhas de cupom pela área administrativa.
- Cupom pode ser único por pessoa.
- Cupom deve ter:
  - validade;
  - limite de uso;
  - tipo de desconto: percentual ou valor fixo;
  - regra de uso para leituras.
- Neste primeiro momento, o cupom provavelmente será divulgado em lives.
- Não é obrigatório exibir cupom automaticamente dentro da área do usuário agora.

## Área Administrativa

Admin principal: Paola.

Recursos desejados:

- criar posts do blog;
- criar campanhas de cupom;
- visualizar histórico de pedidos/agendamentos;
- bloquear/remover usuários.

Recursos que não são prioridade agora:

- lista completa de clientes cadastrados;
- botão "Conversar no WhatsApp" na área admin;
- gestão manual complexa de usuários.

## Pedidos, Agendamentos e Histórico

O sistema deve caminhar para registrar:

- pedidos de leituras;
- pedidos de banhos;
- agendamentos;
- status de pagamento;
- uso de cupons;
- histórico por usuário.

Isso será necessário para a área "Minha conta" e para a área administrativa.

## Deploy e Backend

Hospedagem escolhida: Vercel.

Recomendação técnica:

- Frontend hospedado na Vercel.
- Supabase para Auth, banco de dados e possivelmente Storage das capas do blog.
- Para operações sensíveis, usar backend/rotas serverless na Vercel ou Supabase Edge Functions.
- Evitar colocar chaves secretas no frontend.
- O backend Express atual pode continuar como base local, mas para produção na Vercel tende a ser melhor migrar as ações sensíveis para funções serverless.

Operações sensíveis que devem ficar no backend/serverless:

- uso de `service_role`;
- criação de post como admin, se exigir validação extra;
- disparos Twilio;
- webhooks de pagamento;
- geração/validação avançada de cupons;
- rotinas automáticas.

## Segurança e RLS

Todas as tabelas expostas pelo Supabase devem ter RLS habilitado.

Diretrizes:

- usuário autenticado pode ler posts completos;
- visitante anônimo pode ler apenas prévias públicas;
- comentários e curtidas exigem login;
- usuário pode editar apenas o próprio perfil;
- apenas admin pode criar/editar/remover posts e cupons;
- roles de admin não devem depender de metadados editáveis pelo usuário.

## Tabelas Prováveis

Sugestão inicial de schema:

- `profiles`
  - dados públicos/operacionais do usuário;
  - ligação com `auth.users`.
- `blog_posts`
  - posts do blog;
  - capa, título, conteúdo, prévia, status e autor.
- `post_likes`
  - curtidas por usuário.
- `post_comments`
  - comentários dos usuários.
- `coupons`
  - campanhas de cupom.
- `coupon_redemptions`
  - controle de uso de cupom.
- `orders`
  - pedidos de leituras e banhos.
- `appointments`
  - agendamentos de leitura.
- `notifications`
  - futuro controle de emails/WhatsApp enviados.

## Ordem Recomendada de Implementação

1. Ajustar Supabase Auth e criar tabela `profiles`.
2. Finalizar cadastro/login/minha conta com edição de perfil.
3. Criar blog privado com prévia pública.
4. Criar área admin simples para Paola publicar posts.
5. Adicionar curtidas e comentários.
6. Criar sistema de cupons para leituras.
7. Vincular cupons a pedidos/checkout.
8. Criar histórico de pedidos/agendamentos.
9. Implementar WhatsApp via Twilio.
10. Registrar logs de notificações e disparos.

## Decisão Atual

O próximo passo recomendado é estruturar o Supabase com:

- Auth funcionando;
- `profiles`;
- roles/admin;
- blog com RLS;
- admin simples para posts.

WhatsApp automático deve ficar para o final.
