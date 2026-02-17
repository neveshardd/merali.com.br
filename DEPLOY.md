# Guia de Deploy - Vercel

Este guia explica como fazer o deploy do CRM (backend) e do Frontend (site) na Vercel.

## Pré-requisitos

- Conta na Vercel
- Vercel CLI instalado: `npm i -g vercel`
- Repositório Git configurado

## Ordem de Deploy

**IMPORTANTE:** Faça o deploy do CRM primeiro para obter a URL de produção.

---

## 1. Deploy do CRM (Backend)

### 1.1. Preparar Variáveis de Ambiente

No painel da Vercel do projeto CRM:

1. Acesse: **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

| Nome             | Valor                                                 | Ambiente   |
| ---------------- | ----------------------------------------------------- | ---------- |
| `DATABASE_URL`   | Sua URL do Neon PostgreSQL                            | Production |
| `JWT_SECRET`     | Chave secreta forte (ex: `merali_prod_secret_xyz123`) | Production |
| `ADMIN_PASSWORD` | Senha forte do admin                                  | Production |
| `FRONTEND_URL`   | `https://seu-site.vercel.app`                         | Production |
| `NODE_ENV`       | `production`                                          | Production |

**Nota:** A `FRONTEND_URL` será preenchida após o deploy do frontend (etapa 2.3).

### 1.2. Deploy

```bash
cd crm
vercel --prod
```

### 1.3. Anotar URL do CRM

Após o deploy, anote a URL gerada (ex: `https://meralis-crm.vercel.app`)

---

## 2. Deploy do Frontend (Site)

### 2.1. Preparar Variáveis de Ambiente

No painel da Vercel do projeto frontend:

1. Acesse: **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

| Nome             | Valor                                | Ambiente   |
| ---------------- | ------------------------------------ | ---------- |
| `CRM_API_URL`    | `https://meralis-crm.vercel.app/api` | Production |
| `ADMIN_PASSWORD` | Mesma senha do CRM                   | Production |
| `NODE_ENV`       | `production`                         | Production |

**IMPORTANTE:** Use a URL real do seu CRM obtida na etapa 1.3.

### 2.2. Deploy

```bash
cd code
vercel --prod
```

### 2.3. Atualizar FRONTEND_URL no CRM

Após obter a URL do frontend (ex: `https://meralis.vercel.app`):

1. Volte ao painel da Vercel do **CRM**
2. Acesse: **Settings** → **Environment Variables**
3. Edite a variável `FRONTEND_URL` com a URL real do frontend
4. Faça um redeploy do CRM para aplicar a mudança:

```bash
cd crm
vercel --prod
```

---

## 3. Verificação

### 3.1. Testar o Frontend

- Acesse seu site em produção
- Verifique se os projetos estão carregando corretamente
- Teste o modal de projetos
- Confirme que as imagens estão sendo exibidas

### 3.2. Testar o CRM

- Acesse `https://seu-crm.vercel.app`
- Faça login com a senha configurada
- Verifique se consegue criar/editar projetos
- Confirme que as imagens estão sendo salvas

---

## 4. Desenvolvimento Local

### 4.1. Frontend (.env)

```env
CRM_API_URL=http://localhost:3000/api
ADMIN_PASSWORD=Jenn@28901*
NODE_ENV=development
```

### 4.2. CRM (.env)

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="merali_dev_secret_2024_xyz"
ADMIN_PASSWORD="Jenn@28901*"
FRONTEND_URL="http://localhost:4321"
NODE_ENV="development"
```

---

## 5. Troubleshooting

### Projetos não aparecem em produção

- ✅ Verifique se `CRM_API_URL` está configurada corretamente no frontend
- ✅ Confirme que o CRM está rodando e acessível
- ✅ Verifique os logs da Vercel para erros de fetch
- ✅ Teste a URL da API diretamente: `https://seu-crm.vercel.app/api/projects`

### Imagens não carregam

- ✅ Certifique-se de que as imagens estão sendo servidas pelo CRM
- ✅ Verifique se o CORS está configurado corretamente (variável `FRONTEND_URL`)
- ✅ Confirme que a URL base está correta (sem `/api` para imagens)
- ✅ Teste o acesso direto à imagem no navegador

### CORS Errors

- ✅ Verifique se `FRONTEND_URL` no CRM está configurada com a URL correta do frontend
- ✅ Confirme que não há barra `/` no final da URL
- ✅ Faça um redeploy do CRM após alterar `FRONTEND_URL`
- ✅ Limpe o cache do navegador

### Erro 500 no CRM

- ✅ Verifique se `DATABASE_URL` está correta
- ✅ Confirme que o banco de dados está acessível
- ✅ Verifique os logs da Vercel para detalhes do erro
- ✅ Teste a conexão com o banco localmente

---

## 6. Comandos Úteis

### Redeploy sem mudanças

```bash
vercel --prod --force
```

### Ver logs em tempo real

```bash
vercel logs --follow
```

### Listar deployments

```bash
vercel ls
```

### Remover deployment

```bash
vercel rm [deployment-url]
```

---

## 7. Checklist Final

- [ ] CRM deployado e acessível
- [ ] Frontend deployado e acessível
- [ ] Variáveis de ambiente configuradas em ambos
- [ ] `FRONTEND_URL` no CRM aponta para o frontend correto
- [ ] `CRM_API_URL` no frontend aponta para o CRM correto
- [ ] Projetos carregam corretamente no site
- [ ] Imagens são exibidas corretamente
- [ ] Modal de projetos funciona
- [ ] Login no CRM funciona
- [ ] CORS não apresenta erros no console

---

## 8. Suporte

Em caso de problemas:

1. Verifique os logs da Vercel
2. Teste as URLs da API diretamente no navegador
3. Confirme que todas as variáveis de ambiente estão configuradas
4. Verifique o console do navegador para erros de CORS ou fetch
