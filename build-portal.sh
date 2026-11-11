#!/bin/sh
# Gera portal/app.bundle.js (JSX pré-compilado). Rode depois de editar qualquer .jsx do portal:  sh build-portal.sh
# Precisa de Node 18+. Sem Babel no navegador: o app abre mais rápido e funciona sem vendor/babel.min.js.
set -e
cd "$(dirname "$0")"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
echo 'module.exports = window.React;' > "$T/react.js"; echo 'module.exports = window.ReactDOM;' > "$T/react-dom.js"
printf 'import App from "%s/portal/App.jsx";\nwindow.App = App;\n' "$(pwd)" > "$T/entry.jsx"
npx --yes esbuild@0.25.0 "$T/entry.jsx" --bundle --format=iife --minify --target=es2019 \
  --alias:react="$T/react.js" --alias:react-dom="$T/react-dom.js" --loader:.js=jsx --loader:.json=json \
  --outfile=portal/app.bundle.js --legal-comments=none
echo "ok: portal/app.bundle.js"
