# Phase 5: binnacle-test-and-qa-clase-asincronica-pdf - Context

**Gathered:** 2026-05-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Documentar avance Lab 4 (bitacora de modulos, decisiones, problemas, plan de accion), documentar funcionalidad propia, investigar herramientas de testing/QA en React Native/Expo, implementar al menos 2 pruebas basicas, reflexion breve, y armar PDF final con capturas y link a repo.

</domain>

<decisions>
## Implementation Decisions

### Investigacion de testing/QA
- **D-01:** Comparar herramientas: Jest + React Native Testing Library.
- **D-02:** Criterio principal de comparacion: facilidad de setup en Expo.
- **D-03:** Conclusion recomendada en PDF: Jest + RTL.
- **D-04:** E2E solo investigacion, sin implementar en esta fase.

### Pruebas a implementar
- **D-05:** Implementar 2 pruebas: 1) unit test validacion de datos de planta, 2) component test error de formulario en LoginScreen.
- **D-06:** Extraer logica de validacion a helper en `src/lib` para unit test.
- **D-07:** Component test enfocado en `LoginScreen` (error en campo vacio/invalid).

### Bitacora de avance Lab 4
- **D-08:** Formato bitacora: tabla por modulo.
- **D-09:** Modulos en bitacora: Home, Identify, Explore, Journal, Profile, Achievements.
- **D-10:** Funcionalidad propia a documentar: Achievements/Rewards.

### Entrega PDF
- **D-11:** Estructura PDF: Portada + Parte 1 + Parte 2 + Link repo.
- **D-12:** Capturas: pantallas clave + pruebas corriendo (terminal).
- **D-13:** Link repo en main.

### the agent's Discretion
- Seleccion de 2 herramientas extra para comparacion (ademas de Jest + RTL) en investigacion (solo research).
- Definicion exacta de validacion de datos de planta (campos y reglas) para unit test.
- Mensaje exacto de error a verificar en LoginScreen (mantener español y estilo existente).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Instrucciones y rubrica
- `Clase_Asincronica.pdf` — Objetivo, partes, entregables, rubrica.

### Proyecto y requisitos
- `.planning/ROADMAP.md` — Phase 5 entry y dependencia.
- `.planning/PROJECT.md` — Contexto proyecto, issues de testing.
- `.planning/REQUIREMENTS.md` — Requisitos v1/v2 y alcance general.

### Testing y riesgos
- `.planning/codebase/TESTING.md` — No hay framework de tests; recomendaciones.
- `.planning/codebase/CONCERNS.md` — No tests y areas no testeadas.
- `.planning/research/PITFALLS.md` — Pitfalls de QA/testing en proyecto.

### Stack y convenciones
- `.planning/codebase/STACK.md` — Stack RN/Expo y dependencias.
- `.planning/codebase/CONVENTIONS.md` — Convenciones de codigo.
- `.planning/codebase/STRUCTURE.md` — Ubicacion de archivos y rutas.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/screens/auth/loginScreen.tsx` — Form login y errores actuales (base para test de componente).
- `src/services/` — Logica de negocio donde extraer helpers si aplica.
- `src/schemas/` — Zod schemas existentes (referencia de validacion).

### Established Patterns
- React Hook Form + Zod para validacion.
- UI labels en español.
- Service layer pattern en `src/services/*`.

### Integration Points
- Helper en `src/lib` usado por servicio o schema para validar datos de planta.
- Tests ubicados en `src/**/__tests__` o co-localizados (definir en plan).

</code_context>

<specifics>
## Specific Ideas

- Bitacora usa tabla por modulo con % avance, decisiones y problemas.
- PDF incluye capturas de pantallas clave y terminal con tests pasando.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-binnacle-test-and-qa-clase-asincronica-pdf*
*Context gathered: 2026-05-21*
