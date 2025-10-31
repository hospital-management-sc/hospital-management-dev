# 🔐 CONFIGURACIÓN DE PROTECCIONES DE RAMA

**Ubicación:** Archivo local para referencia  
**Propósito:** Instrucciones paso a paso para configurar protecciones en GitHub  
**Audiencia:** Co-líder (quien configura GitHub)  
**Última actualización:** 31 de Octubre, 2025  

---

## 📋 TAREAS A COMPLETAR EN GITHUB UI

### Tarea 1: Proteger Rama `main`

**Acceso:** GitHub > Settings > Branches > Add rule

```
Pattern name: main

Protecciones a habilitar:
✅ Require a pull request before merging
  - Require approvals: 2
  - Dismiss stale pull request approvals when new commits are pushed: YES
  - Require review from Code Owners: NO (si no hay CODEOWNERS file)
  - Require approval of reviews before dismissing: NO

✅ Require status checks to pass before merging
  - Require branches to be up to date before merging: YES
  - Status checks that must pass:
    - ESLint
    - Jest Tests
    - Build

❌ Include administrators: NO (para que admins puedan hacer hotfixes)
✅ Restrict who can push to matching branches: NO

✅ Allow auto-merge: NO
✅ Allow deletions: NO
✅ Allow force pushes: NO
```

---

### Tarea 2: Proteger Rama `develop`

**Acceso:** GitHub > Settings > Branches > Add rule

```
Pattern name: develop

Protecciones a habilitar:
✅ Require a pull request before merging
  - Require approvals: 1
  - Dismiss stale pull request approvals: YES
  - Require review from Code Owners: NO
  - Require approval of reviews before dismissing: NO

✅ Require status checks to pass before merging
  - Require branches to be up to date: YES
  - Status checks que deben pasar:
    - ESLint
    - Jest Tests
    - Build

❌ Include administrators: NO

✅ Allow auto-merge: YES (después de aprobación)
✅ Allow deletions: NO
✅ Allow force pushes: NO
```

---

### Tarea 3: Proteger Rama `leads-only` ⭐ IMPORTANTE

**Acceso:** GitHub > Settings > Branches > Add rule

```
Pattern name: leads-only

Protecciones a habilitar:
✅ Require a pull request before merging
  - Require approvals: 1
  - Dismiss stale PR approvals: NO (strict)
  - Require review from Code Owners: NO
  - Require approval of reviews before dismissing: NO

❌ Require status checks: NO (no hay CI para docs)

✅ Include administrators: YES ⭐ 
  (IMPORTANTE: Esto significa que SOLO admins pueden mergear)

✅ Restrict who can push to matching branches: 
  - Solo: Tú + Co-líder (admins)

✅ Allow auto-merge: NO
✅ Allow deletions: NO
✅ Allow force pushes: NO
```

**¿Por qué "Include administrators"?**
- Asegura que incluso admins siguen el proceso de code review
- Garantiza que hay audit trail de cambios
- Requiere 2+ admins para cambiar documentos sensibles

---

## 👥 Configuración de Acceso a Equipo

**Acceso:** GitHub > Settings > Collaborators and teams

### Paso 1: Crear Roles

```
Roles sugeridos en GitHub:
├─ Admin (2): Tú + Co-líder
│  └─ Full access, puede hacer push a cualquier rama
│
├─ Write (8): Todos los devs
│  └─ Puede hacer push a develop y feature/*, PRs
│
└─ Read (0): Stakeholders (si aplica)
   └─ Solo lectura, puede ver código
```

### Paso 2: Invitar Colaboradores

**Para cada desarrollador:**

```
1. Ve a: GitHub > Settings > Collaborators
2. Click "Add people"
3. Busca por email o username
4. Selecciona rol: "Write"
5. Envía invitación
6. Desarrollador acepta en su email
```

**Usuarios a invitar:**

| Nombre | Email | Rol | Team |
|--------|-------|-----|------|
| Co-líder | [email] | Admin | Leads |
| Dev 1 - Backend Lead | [email] | Write | Backend |
| Dev 2 - Frontend Lead | [email] | Write | Frontend |
| Dev 3 - Backend | [email] | Write | Backend |
| Dev 4 - Backend | [email] | Write | Backend |
| Dev 5 - Backend | [email] | Write | Backend |
| Dev 6 - Frontend | [email] | Write | Frontend |
| Dev 7 - Frontend | [email] | Write | Frontend |
| Dev 8 - Frontend | [email] | Write | Frontend |

### Paso 3: Crear Teams (Opcional pero recomendado)

```
Equipo: Backend
├─ Permisos: Write
├─ Miembros: Dev 1-5
└─ Propósito: Coordinar backend

Equipo: Frontend
├─ Permisos: Write
├─ Miembros: Dev 6-8
└─ Propósito: Coordinar frontend

Equipo: Leads (privado)
├─ Permisos: Admin
├─ Miembros: Tú + Co-líder
└─ Propósito: Decisiones estratégicas
```

---

## 🔍 Verificación Post-Configuración

**Checklist para confirmar que todo está correcto:**

### Rama main

```
GitHub > Settings > Branches > main

✅ Require a pull request: YES
✅ Require 2 approvals: YES
✅ Require status checks: YES (ESLint, Tests, Build)
✅ Require branches up to date: YES
✅ Allow auto-merge: NO
✅ Allow deletions: NO
```

### Rama develop

```
GitHub > Settings > Branches > develop

✅ Require a pull request: YES
✅ Require 1 approval: YES
✅ Require status checks: YES (ESLint, Tests)
✅ Require branches up to date: YES
✅ Allow auto-merge: YES
✅ Allow deletions: NO
```

### Rama leads-only

```
GitHub > Settings > Branches > leads-only

✅ Require a pull request: YES
✅ Require approval: YES
✅ Include administrators: YES (CRÍTICO)
✅ Restrict push: YES (solo admins)
✅ Allow auto-merge: NO
✅ Allow deletions: NO
```

---

## 📝 Pasos Recomendados por Orden

### Semana 1 (Antes del kickoff)

```
Día 1:
├─ [ ] Crear reglas para main
├─ [ ] Crear reglas para develop
└─ [ ] Crear reglas para leads-only

Día 2-3:
├─ [ ] Crear teams en GitHub
└─ [ ] Revisar que todo está configurado

Día 4:
├─ [ ] Invitar usuarios (Tú + Co-líder envían invitaciones)
└─ [ ] Confirmar que todos aceptaron

Día 5:
├─ [ ] Test: Dev hace PR a develop (verify flujo)
├─ [ ] Test: Approver aprueba PR
├─ [ ] Test: Auto-merge funciona
└─ [ ] Documentar cualquier issue
```

---

## 🚨 Troubleshooting

### Problema: Dev no puede hacer push a develop

```
Causas posibles:
1. Dev tiene rol "Read" en lugar de "Write"
   → Solución: GitHub > Settings > Collaborators > Cambiar a Write

2. Dev no tiene SSH key configurada
   → Solución: `ssh-keygen -t ed25519` y agregar a GitHub

3. Rama develop requiere status checks que fallan
   → Solución: Dev debe ejecutar ESLint/Tests localmente primero

4. Rama está protegida contra force push
   → Solución: Dev debe hacer merge limpio, no force push
```

### Problema: Admin no puede mergear a leads-only

```
Causas posibles:
1. Lead-only requiere "Include administrators: YES"
   → Verifica que la regla PERMITE admins (debería)

2. Status checks están fallando
   → Para leads-only NO debería haber status checks
   → Verifica Settings > Branches > leads-only

3. PR no tiene aprobaciones
   → Otro admin debe aprobar antes de mergear
   → Esta es la protección intencional
```

### Problema: No puedo ver rama leads-only en GitHub

```
Posibles causas:
1. Rama no fue pushed todavía
   → Solución: `git push origin leads-only`

2. No tienes permiso de ver
   → Solución: Verifica que eres Admin en el repo

3. Branch se eliminó accidentalmente
   → Solución: `git checkout -b leads-only origin/leads-only`
```

---

## 📞 Referencia Rápida de URLs

```
Configurar protecciones de rama:
https://github.com/[owner]/hospital-management/settings/branches

Ver colaboradores:
https://github.com/[owner]/hospital-management/settings/access

Ver teams:
https://github.com/[owner]/hospital-management/settings/teams

Ver actividad de seguridad:
https://github.com/[owner]/hospital-management/security/audit

Ver status checks de CI/CD:
https://github.com/[owner]/hospital-management/actions
```

---

## ✅ Confirmación de Completación

Una vez que hayas completado todos los pasos, marca:

```
Configuración de Protecciones de Rama
├─ [ ] Rama main protegida (2 reviews)
├─ [ ] Rama develop protegida (1 review)
├─ [ ] Rama leads-only protegida (admin only)
├─ [ ] Status checks configurados (main y develop)
└─ [ ] Teams creados (Backend, Frontend, Leads)

Acceso de Usuarios
├─ [ ] Co-líder = Admin
├─ [ ] Backend devs (5) = Write
├─ [ ] Frontend devs (3) = Write
└─ [ ] Todos aceptaron invitación

Testing
├─ [ ] Test: Dev puede crear branch feature/*
├─ [ ] Test: Dev puede hacer PR a develop
├─ [ ] Test: PR require 1 approval
├─ [ ] Test: Admin puede mergear a main solo con 2 approvals
└─ [ ] Test: Lead-only is not mergeable por devs

Documentación
├─ [ ] RECURSOS_LIDERES.md en main ✅
├─ [ ] LIDERAZGO_DECISION_ESTRATEGICA.md en leads-only ✅
├─ [ ] ACTAS_REUNIONES_LIDERES.md en leads-only ✅
├─ [ ] ACCESO_EQUIPOS.md en leads-only ✅
└─ [ ] Este archivo (como referencia) guardado localmente
```

---

**Documento:** Configuración de Protecciones de Rama  
**Última revisión:** 31 de Octubre, 2025  
**Responsable:** Co-líder (configuración en GitHub)  
**Soporte:** Tú (líder principal) si hay dudas
