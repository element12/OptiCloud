# Sistema de Gestión Óptica — MVP

## Visión del proyecto

Desarrollar una aplicación móvil sencilla y funcional que permita a una óptica gestionar de manera centralizada la información básica de sus pacientes, exámenes optométricos, productos e inventario.

El proyecto está planteado como un **Producto Mínimo Viable (MVP)**, priorizando la funcionalidad, facilidad de uso y una implementación tecnológica sencilla que permita demostrar el funcionamiento completo de una aplicación móvil con frontend, backend y base de datos.

---

## Problema a resolver

Las ópticas pueden manejar información de pacientes, exámenes y productos de manera manual o mediante diferentes herramientas, lo que puede dificultar el acceso y organización de la información.

El sistema busca solucionar este problema proporcionando una aplicación móvil que permita:

- Registrar y consultar pacientes.
- Mantener el historial de exámenes optométricos.
- Registrar y consultar productos.
- Controlar el inventario.
- Identificar productos con bajo stock.

De esta manera, se busca centralizar la información principal de la óptica en una aplicación sencilla y fácil de utilizar.

---

## Stack tecnológico elegido

### Frontend — Aplicación móvil

**Flutter + Dart**

Se utilizará Flutter para desarrollar la aplicación móvil y Dart como lenguaje de programación.

Se eligió Flutter porque permite desarrollar una aplicación móvil con una estructura sencilla y facilita la creación de interfaces para Android.

### Backend

**Node.js + Express.js**

Se utilizará Node.js junto con Express.js para desarrollar una API REST encargada de procesar las solicitudes realizadas desde la aplicación móvil.

El backend permitirá realizar las operaciones principales de creación, consulta, actualización y eliminación de información.

### Base de datos

**MongoDB**

MongoDB será utilizada para almacenar la información de:

- Usuarios.
- Pacientes.
- Exámenes optométricos.
- Productos.
- Inventario.

Se eligió MongoDB por su estructura sencilla y facilidad de integración con Node.js.

### Autenticación

**JWT (JSON Web Token)**

Se utilizará JWT para implementar un sistema básico de autenticación y permitir el acceso de usuarios registrados a la aplicación.

### Funcionalidades

Autenticación
Inicio de sesión.
Validación de usuario.
Cierre de sesión.

Pacientes
Registrar pacientes.
Consultar pacientes.
Buscar pacientes.
Editar pacientes.
Eliminar pacientes.

Historial optométrico
Registrar exámenes.
Consultar historial de un paciente.
Editar exámenes.
Eliminar exámenes.

Productos e inventario
Registrar productos.
Consultar productos.
Buscar productos.
Editar productos.
Eliminar productos.
Actualizar stock.
Consultar productos con bajo stock.

### Herramientas adicionales

- **Git / GitHub:** control de versiones.
- **Postman:** pruebas de la API.
- **Android Studio:** desarrollo y ejecución de la aplicación móvil.
- **Visual Studio Code:** desarrollo del frontend y backend.

---

## Arquitectura general

```text
┌─────────────────────┐
│    Aplicación       │
│  Flutter + Dart     │
└──────────┬──────────┘
           │
        HTTP / REST
           │
           ▼
┌─────────────────────┐
│      Backend        │
│ Node.js + Express   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      MongoDB        │
│     Base de datos   │
└─────────────────────┘
```

El objetivo es mantener una arquitectura simple, funcional y adecuada, evitando tecnologías o servicios adicionales que no sean necesarios para el alcance inicial del proyecto.
