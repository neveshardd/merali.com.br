# Remoção do Banco de Dados Local

## O que mudou?

O frontend agora consome **100% dos dados da API do CRM**. Não há mais banco de dados local (SQLite) no projeto frontend.

## Arquivos Removidos

- `src/db/` - Toda a pasta de configuração do banco de dados
- `*.db` - Arquivos de banco de dados SQLite
- `*.sqlite` - Arquivos de banco de dados SQLite

## Dependências Removidas

As seguintes dependências foram removidas do `package.json`:

- `@libsql/client`
- `@types/better-sqlite3`
- `@types/uuid`
- `drizzle-kit`
- `drizzle-orm`
- `uuid`

## Variáveis de Ambiente

A variável `DB_PATH` foi removida dos arquivos `.env`.

## Como Funciona Agora

1. O frontend faz requisições HTTP para o CRM via `CRM_API_URL`
2. O CRM retorna os dados do banco PostgreSQL (Neon)
3. Não há sincronização ou cache local

## Próximos Passos

Se você ainda tem os arquivos antigos:

```bash
# Limpar arquivos de banco de dados
rm -rf src/db *.db *.sqlite

# Reinstalar dependências (remove pacotes não utilizados)
npm install
```

## Benefícios

- ✅ Única fonte de verdade (CRM)
- ✅ Sem sincronização necessária
- ✅ Menos dependências
- ✅ Deploy mais simples
- ✅ Melhor para Vercel (serverless)
