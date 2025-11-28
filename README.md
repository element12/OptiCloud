**Sistema de Gestión Óptica**
Descripción breve

Repositorio que contiene las APIs y arquitectura para un sistema de gestión para una óptica (pacientes, historial optométrico, catálogo e inventario, roles y permisos). La solución está pensada para desplegarse en Microsoft Azure con prácticas de CI/CD usando GitHub Actions y contenedores Docker.

Stack Tecnológico

Lenguaje: JavaScript (Node.js)

Framework: Express.js (REST APIs)

Bases de datos:

Relacional: Azure SQL Database (Pacientes, Historial Optométrico)

NoRelacional: Azure Cosmos DB — API MongoDB (Catálogo e Inventario)

Autenticación / Autorización: JWT + middleware de roles 

Contenedores / Registro: Docker + Azure Container Registry (ACR)

Hosting / PaaS: Azure App Service (para APIs) o Azure Kubernetes Service (AKS) si se requiere orquestación.

Gestión de secretos: Azure Key Vault

CI/CD: GitHub Actions


Endpoints (resumen)
API de Gestión de Pacientes (Azure SQL)

POST /api/v1/patients — Crear nuevo paciente

GET /api/v1/patients/:id — Consultar paciente por ID

PUT /api/v1/patients/:id — Actualizar datos del paciente

API de Historial Optométrico (Azure SQL)

POST /api/v1/exams — Registrar nuevo examen o prescripción

GET /api/v1/exams/patient/:patientId — Obtener historial optométrico de un paciente

PUT /api/v1/exams/:id — Actualizar examen existente

API de Catálogo e Inventario (Azure Cosmos DB - MongoDB API)

POST /api/v1/products — Crear nuevo producto

GET /api/v1/products — Listar productos (soporta filtros: ?q=...&minStock=&maxStock=&page=&limit=)

GET /api/v1/products/:id — Ver detalles de producto (HU-09)

PUT /api/v1/products/:id — Actualizar producto o inventario

GET /api/v1/products/low-stock — Listar productos con stock < 10 (HU-10)

GET /api/v1/products/low-stock/csv — Exportar lista low-stock en CSV

API de Roles y Permisos

POST /api/v1/roles — Crear rol

GET /api/v1/roles — Listar roles

PUT /api/v1/roles/:id — Actualizar rol

POST /api/v1/roles/assign — Asignar rol a usuario

Instalación y ejecución local (Paso a paso)

Ejemplo generalizado para cada API (patients-api, exams-api, products-api, roles-api)

Clona el repositorio:

git clone <repo-url>
cd repo

Entra a la carpeta de la API que quieras levantar (ej. apis/products-api):

cd apis/products-api

Instala dependencias:

npm install

Crea el archivo .env y llena con variables (ver sección anterior).

Levanta servicios auxiliares (opcional, local):
