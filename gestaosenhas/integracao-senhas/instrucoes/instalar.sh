#!/bin/bash
# Script de instalação automática do módulo de senhas
# Execute na raiz do projeto: bash instalar.sh

set -e

echo "=========================================="
echo " Instalador - Módulo de Gestão de Senhas"
echo " T. U. Senhora do Rosário"
echo "=========================================="
echo ""

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo "Erro: Execute este script na raiz do projeto Next.js"
    echo "Exemplo: cd /caminho/do/projeto && bash instalar.sh"
    exit 1
fi

echo "[1/6] Verificando estrutura do projeto..."

# Verificar diretório src
if [ ! -d "src" ]; then
    echo "Erro: Diretório 'src' não encontrado. Este script espera estrutura com src/"
    exit 1
fi

echo "[2/6] Instalando dependências (zustand)..."
npm install zustand

echo "[3/6] Criando diretórios..."
mkdir -p src/types
mkdir -p src/store
mkdir -p src/components/senhas
mkdir -p src/app/senhas
mkdir -p "src/app/(auth)/dashboard/senhas"

echo "[4/6] Copiando arquivos..."

# Diretório base do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

# Copiar tipos
cp "$BASE_DIR/types/senhas.ts" src/types/senhas.ts
echo "  ✓ src/types/senhas.ts"

# Copiar store
cp "$BASE_DIR/store/useSenhaStore.ts" src/store/useSenhaStore.ts
echo "  ✓ src/store/useSenhaStore.ts"

# Copiar componentes
for file in "$BASE_DIR"/components/senhas/*.tsx; do
    cp "$file" src/components/senhas/
    echo "  ✓ src/components/senhas/$(basename "$file")"
done

# Copiar páginas
cp "$BASE_DIR/pages/senhas/page.tsx" src/app/senhas/page.tsx
echo "  ✓ src/app/senhas/page.tsx"

cp "$BASE_DIR/pages/dashboard-senhas/page.tsx" "src/app/(auth)/dashboard/senhas/page.tsx"
echo "  ✓ src/app/(auth)/dashboard/senhas/page.tsx"

cp "$BASE_DIR/pages/dashboard-senhas/layout.tsx" "src/app/(auth)/dashboard/senhas/layout.tsx"
echo "  ✓ src/app/(auth)/dashboard/senhas/layout.tsx"

echo ""
echo "[5/6] Verificando integridade..."

FILES_TO_CHECK=(
    "src/types/senhas.ts"
    "src/store/useSenhaStore.ts"
    "src/components/senhas/DisplaySenha.tsx"
    "src/components/senhas/PainelControle.tsx"
    "src/components/senhas/FormularioSenha.tsx"
    "src/components/senhas/Estatisticas.tsx"
    "src/components/senhas/HistoricoAtendimentos.tsx"
    "src/app/senhas/page.tsx"
    "src/app/(auth)/dashboard/senhas/page.tsx"
    "src/app/(auth)/dashboard/senhas/layout.tsx"
)

ALL_OK=true
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (FALHOU)"
        ALL_OK=false
    fi
done

if [ "$ALL_OK" = false ]; then
    echo ""
    echo "⚠️  Alguns arquivos não foram copiados corretamente."
    exit 1
fi

echo ""
echo "[6/6] Instalação concluída!"
echo ""
echo "=========================================="
echo " PRÓXIMOS PASSOS MANUAIS:"
echo "=========================================="
echo ""
echo "1. Edite src/components/layout/header/Header.tsx"
echo "   Adicione { href: '/senhas', label: 'Atendimento' } no array navLinks"
echo ""
echo "2. Adicione as animações CSS no final de src/styles/globals.css:"
echo "   (veja o README para o código completo)"
echo ""
echo "3. Execute: npm run dev"
echo ""
echo "4. Acesse:"
echo "   - http://localhost:3000/senhas (página pública)"
echo "   - http://localhost:3000/dashboard/senhas (painel admin)"
echo ""
echo "✨ Axé! O módulo está instalado."
