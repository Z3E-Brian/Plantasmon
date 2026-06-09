# Phase 5: binnacle-test-and-qa-clase-asincronica-pdf - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Documentar avance completo del milestone v1.0 (fases 1-9): bitácora de todos los módulos con decisiones, problemas y capturas; funcionalidad propia (Achievements/Rewards); investigación de testing/QA en React Native/Expo; implementar pruebas básicas para módulos existentes y nuevos; PDF final con capturas de pantallas clave, resultados de tests, y link al repo.

</domain>

<decisions>
## Implementation Decisions

### Bitácora de avance — alcance completo
- **D-01:** Bitácora cubre TODAS las fases del milestone v1.0 (1 a 9), no solo Lab 4.
- **D-02:** Formato: tabla por módulo/fase con % avance, decisiones clave, problemas encontrados, y módulos nuevos agregados.
- **D-03:** Módulos a documentar: Auth, Home Dashboard, Lab3/API, Explore, Journal, Profile, Achievements, Missions & Rewards, Popups, Activity Feed, Calendar.
- **D-04:** Funcionalidad propia a documentar: Achievements/Rewards (sigue siendo la misma).

### Investigación de testing/QA
- **D-05:** Comparar herramientas: Jest + React Native Testing Library.
- **D-06:** Criterio principal: facilidad de setup en Expo.
- **D-07:** Conclusión recomendada: Jest + RTL.
- **D-08:** E2E solo investigación, sin implementar.

### Pruebas a implementar
- **D-09:** Mantener las 2 pruebas existentes (unit test plantValidation + component test LoginScreen).
- **D-10:** Agregar tests para módulos nuevos: al menos 1 test unitario para un servicio nuevo (activityService, missionService, o similar) y 1 test de componente para una pantalla nueva (CalendarScreen, HomeTimeline, o similar). Según lo que indique la rúbrica del PDF: si pide por cada elemento, cubrir los que faltan; si pide algunos, agregar uno nuevo.
- **D-11:** Tests existentes se actualizan si es necesario (cambios en LoginScreen, etc.).

### Entrega PDF
- **D-12:** Estructura PDF: Portada + Bitácora completa + Investigación testing + Tests implementados (código + resultados + capturas de terminal) + Funcionalidad propia + Link al repo.
- **D-13:** Capturas de pantallas clave: Home (dashboard + misiones), Identify, Explore, Journal, Profile (achievements + vitrina + actividad), Calendar, más capturas de terminal con tests pasando.
- **D-14:** Link al repo en sección principal.

### the agent's Discretion
- Selección de herramientas extra para comparación en investigación.
- Definición exacta de qué nuevo test unitario y de componente crear.
- Mensajes de error y validación en tests (mantener español).
- Formato exacto de tablas en bitácora.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Instrucciones y rúbrica
- `Clase_Asincronica.pdf` — Objetivo, partes, entregables, rúbrica.

### Proyecto y requisitos
- `.planning/ROADMAP.md` — Phase 5 entry y milestone completo.
- `.planning/PROJECT.md` — Contexto proyecto.
- `.planning/REQUIREMENTS.md` — Requisitos v1/v2 completos.

### Contexto de fases posteriores (módulos nuevos)
- `.planning/phases/07-missions-and-rewards/07-CONTEXT.md` — Decisiones de misiones y rewards.
- `.planning/phases/08-informative-pop-boxes/08-CONTEXT.md` — Decisiones de popups.
- `.planning/phases/09-activity-in-profile-and-calendar-in-app/09-CONTEXT.md` — Decisiones de actividad y calendario.

### Testing y riesgos
- `.planning/codebase/TESTING.md` — Estado de testing.
- `.planning/codebase/CONCERNS.md` — Áreas no testeadas.
- `.planning/research/PITFALLS.md` — Pitfalls de QA/testing.

### Stack y convenciones
- `.planning/codebase/STACK.md` — Stack RN/Expo.
- `.planning/codebase/CONVENTIONS.md` — Convenciones de código.
- `.planning/codebase/STRUCTURE.md` — Estructura de archivos.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/services/activityService.ts` — Activity service (candidato a test unitario)
- `src/services/missionService.ts` — Mission service (candidato a test unitario)
- `src/screens/calendar/CalendarScreen.tsx` — Calendar screen (candidato a test de componente)
- `src/components/home/HomeTimeline.tsx` — Home timeline (candidato a test de componente)
- `src/screens/auth/loginScreen.tsx` — LoginScreen (test de componente existente)
- `src/lib/plantValidation.ts` — Plant validation helper (test unitario existente)
- `src/schemas/` — Zod schemas existentes

### Established Patterns
- Jest + React Native Testing Library configurado.
- React Hook Form + Zod para validación.
- UI labels en español.
- Service layer pattern en `src/services/*`.
- Tests ubicados en `src/**/__tests__` o co-localizados.

### Integration Points
- Tests nuevos deben importar servicios/componentes existentes.
- activityService.ts con `logActivity`, `getUserActivities`, `getRecentActivities`.
- missionService.ts con lógica de claims, progreso, expiración.

</code_context>

<specifics>
## Specific Ideas

- Bitácora usa tabla por fase/módulo con % avance, decisiones y problemas.
- PDF incluye capturas de Home (misiones), Profile (vitrina, actividad), Calendar, y terminal con tests.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-binnacle-test-and-qa-clase-asincronica-pdf*
*Context gathered: 2026-05-25*
