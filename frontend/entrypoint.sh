#!/bin/sh
# --- Generar config.js con las variables de entorno de Azure ---
cat <<EOF > /usr/share/nginx/html/config.js
window.env = {
  VITE_API_USER: "${VITE_API_USER}",
  VITE_API_CATALOGO_INVENTARIO: "${VITE_API_CATALOGO_INVENTARIO}",
  VITE_API_HISTORIAL_OPTOMETRICO: "${VITE_API_HISTORIAL_OPTOMETRICO}",
  VITE_API_GESTION_PACIENTE: "${VITE_API_GESTION_PACIENTE}"
};
EOF

echo "✅ Archivo config.js generado con:"
cat /usr/share/nginx/html/config.js

# Iniciar Nginx
exec nginx -g "daemon off;"
