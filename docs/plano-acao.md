# Plano de Ação - Manifestar Tarot

Atualizado em: 03/07/2026

Este plano organiza a execução das próximas fases do projeto, com foco em Supabase, blog privado, área administrativa, cupons, pedidos e WhatsApp via Twilio.

## Fase 1: Base Supabase

Objetivo: deixar autenticação, perfis e permissões prontos para sustentar o restante do sistema.

Tarefas:

1. Configurar Supabase Auth no projeto novo do site.
2. Validar `Project URL` e `anon public key` no arquivo `frontend/js/supabase-config.js`.
3. Desativar confirmação obrigatória por email, conforme decisão do projeto.
4. Criar tabela `profiles` ligada ao `auth.users`.
5. Criar trigger para gerar perfil automaticamente quando um usuário se cadastrar.
6. Salvar no perfil:
   - nome completo;
   - WhatsApp;
   - email;
   - consentimento para WhatsApp;
   - data do aceite;
   - versão dos termos;
   - status do usuário.
7. Criar forma segura de marcar a Paola como admin.
8. Habilitar RLS nas tabelas.
9. Criar policies:
   - usuário lê e edita apenas o próprio perfil;
   - admin consegue ler perfis conforme necessidade futura;
   - anon não acessa dados privados.
10. Testar cadastro, login, logout, sessão e criação de profile.

Entrega esperada:

- Cadastro real funcionando com Supabase.
- Login funcionando.
- Minha conta puxando dados do Supabase.
- Perfil criado automaticamente no banco.
- Base de permissão pronta para blog/admin.

## Fase 2: Cadastro e Minha Conta

Objetivo: completar a experiência do usuário cadastrado.

Tarefas:

1. Melhorar página `minha-conta.html`.
2. Exibir dados reais do perfil.
3. Permitir edição de nome e WhatsApp se não gerar complexidade excessiva.
4. Proteger páginas privadas.
5. Redirecionar visitante não logado para login.
6. Ajustar header para mostrar:
   - "Cadastro" ou "Entrar" quando deslogado;
   - "Minha conta" quando logado.

Entrega esperada:

- Usuário cadastrado consegue entrar, sair e visualizar seus dados.

## Fase 3: Blog Privado

Objetivo: criar uma área de conteúdo exclusiva para usuários cadastrados.

Tarefas:

1. Criar tabela `blog_posts`.
2. Campos mínimos:
   - título;
   - capa;
   - prévia;
   - texto completo;
   - autor;
   - data de criação;
   - data de publicação.
3. Criar página de listagem pública com prévias.
4. Criar página de post completo para usuários logados.
5. Configurar RLS:
   - anon vê apenas dados de prévia;
   - authenticated vê conteúdo completo.
6. Criar layout visual seguindo o restante do site.

Entrega esperada:

- Visitante vê prévia dos posts.
- Usuário cadastrado vê conteúdo completo.

## Fase 4: Área Administrativa

Objetivo: permitir que apenas a Paola publique posts e gerencie partes essenciais do sistema.

Tarefas:

1. Criar página admin protegida.
2. Garantir acesso apenas para Paola/admin.
3. Criar formulário "Novo post".
4. Permitir upload/uso de capa.
5. Publicar post imediatamente após envio.
6. Criar listagem de posts no admin.
7. Permitir editar e remover posts.

Entrega esperada:

- Paola consegue criar posts sem mexer no código.
- Posts entram no ar automaticamente.

## Fase 5: Curtidas e Comentários

Objetivo: permitir interação de usuários cadastrados com o blog.

Tarefas:

1. Criar tabela `post_likes`.
2. Criar tabela `post_comments`.
3. Usuário logado pode curtir/descurtir.
4. Usuário logado pode comentar.
5. Admin pode remover comentários.
6. Exibir contagem de curtidas.
7. Exibir comentários no post.

Entrega esperada:

- Blog com interação básica de comunidade.

## Fase 6: Cupons

Objetivo: permitir campanhas de cupom para leituras.

Tarefas:

1. Criar tabela `coupons`.
2. Criar tabela `coupon_redemptions`.
3. Campos do cupom:
   - código;
   - descrição;
   - tipo: percentual ou valor fixo;
   - valor;
   - validade;
   - limite total de uso;
   - limite por usuário;
   - ativo/inativo;
   - aplicação inicial: leituras.
4. Criar área admin para cadastrar cupons.
5. Validar cupom no checkout de leituras.
6. Registrar uso do cupom.

Entrega esperada:

- Paola cria campanhas.
- Cliente usa cupom em leituras.
- Sistema controla validade e limite.

## Fase 7: Pedidos, Agendamentos e Histórico

Objetivo: registrar pedidos e agendamentos de forma persistente.

Tarefas:

1. Criar tabela `orders`.
2. Criar tabela `appointments`.
3. Associar pedidos ao usuário logado quando existir.
4. Registrar:
   - leitura;
   - formato;
   - data;
   - horário;
   - valor;
   - cupom;
   - status.
5. Exibir histórico em "Minha conta".
6. Exibir histórico no admin.

Entrega esperada:

- Histórico real de pedidos/agendamentos.

## Fase 8: Pagamento e Frete

Objetivo: finalizar compra de leituras e preparar banhos físicos.

Tarefas:

1. Integrar gateway de pagamento.
2. Preferência inicial: Mercado Pago, salvo decisão futura diferente.
3. Criar webhook de pagamento.
4. Confirmar pedido após pagamento aprovado.
5. Para banhos:
   - solicitar endereço;
   - calcular frete;
   - somar produto + frete.
6. Separar fluxos:
   - leitura: sem frete;
   - banho: com entrega;
   - blog/cadastro: sem pagamento.

Entrega esperada:

- Pagamento confirmado de forma automática.
- Estrutura preparada para frete em banhos.

## Fase 9: WhatsApp via Twilio

Objetivo: enviar comunicações automáticas pelo WhatsApp depois que a base estiver estável.

Tarefas:

1. Configurar Twilio no backend/serverless.
2. Guardar credenciais apenas em variável de ambiente.
3. Ao publicar post, buscar usuários com consentimento WhatsApp ativo.
4. Enviar mensagem com:
   - título;
   - prévia do texto;
   - link para o post;
   - imagem/capa se suportado.
5. Registrar logs em tabela `notifications`.
6. Evitar envio duplicado.
7. Futuramente expandir para lembretes de agendamento.

Entrega esperada:

- Publicação de post dispara WhatsApp automaticamente para cadastrados.

## Fase 10: Deploy e Produção

Objetivo: publicar o projeto com segurança.

Tarefas:

1. Hospedar frontend na Vercel.
2. Configurar variáveis de ambiente.
3. Migrar ações sensíveis para funções serverless ou Supabase Edge Functions.
4. Testar RLS.
5. Testar usuário comum vs admin.
6. Testar cadastro, blog, comentários, cupons e pedidos.
7. Só depois ativar WhatsApp automático.

Entrega esperada:

- Sistema online, com base segura e pronto para crescer.

## Ordem Imediata Recomendada

1. Supabase Auth + `profiles`.
2. Minha conta com dados reais.
3. Blog privado com prévia pública.
4. Admin para criar posts.
5. Curtidas e comentários.
6. Cupons.
7. Histórico de pedidos/agendamentos.
8. Pagamento/frete.
9. Twilio.
