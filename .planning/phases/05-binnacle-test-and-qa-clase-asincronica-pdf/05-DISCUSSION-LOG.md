# Phase 5: binnacle-test-and-qa-clase-asincronica-pdf - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the Q&A.

**Date:** 2026-05-21
**Phase:** 05-binnacle-test-and-qa-clase-asincronica-pdf
**Mode:** discuss
**Areas discussed:** Framework testing, Tipos de pruebas, Bitacora estructura, Entrega PDF

## Q&A

### Framework testing
- Q: Para investigacion, cuales 2+ herramientas vas a comparar en el PDF?
  - A: Jest + React Native Testing Library
  - Options: Jest + React Native Testing Library; Jest + RTL + Detox; Jest + RTL + Maestro; Otra combinacion
- Q: Criterio clave de comparacion para tu proyecto?
  - A: Facilidad de setup en Expo
  - Options: Facilidad de setup en Expo; Cobertura de tipos de prueba; Velocidad/estabilidad; Aprendizaje/recursos
- Q: Herramienta final recomendada en conclusion del PDF?
  - A: Jest + RTL
  - Options: Jest + RTL; Jest + RTL + Detox; Jest + RTL + Maestro; Otra
- Q: Quieres incluir E2E en esta fase o solo investigacion sin implementar?
  - A: Solo investigar E2E, no implementar
  - Options: Solo investigar E2E, no implementar; Implementar 1 E2E; You decide

### Tipos de pruebas
- Q: Define 2 pruebas a implementar. Elige combo.
  - A: Unit: validacion datos planta + Component: error form login
  - Options: Unit: validacion datos planta + Component: error form login; Unit: streak calc + Component: achievements lock state; Integration: login flow + Component: register validation; Otra combinacion
- Q: Para unit test, donde ubicar logica?
  - A: Extraer helper en src/lib
  - Options: Extraer helper en src/lib; Testear servicio existente; You decide
- Q: Para component test, pantalla objetivo?
  - A: LoginScreen
  - Options: LoginScreen; RegisterScreen; EditProfile; Otro

### Bitacora estructura
- Q: Bitacora modulos: cual formato quieres en PDF?
  - A: Tabla por modulo
  - Options: Tabla por modulo; Seccion por modulo; Mixto
- Q: Lista modulos Lab 4 a incluir (segun tu app actual).
  - A: Home + Identify + Explore + Journal + Profile + Achievements
  - Options: Home + Identify + Explore + Journal + Profile + Achievements; Solo modulos implementados en fases 1-4; Custom list
- Q: Funcionalidad propia: nombre corto para documentar?
  - A: Achievements/Rewards
  - Options: Achievements/Rewards; Offline identify + sync; StatsBar/Home insights; Otra

### Entrega PDF
- Q: Estructura doc final?
  - A: Portada + Parte 1 + Parte 2 + Link repo
  - Options: Portada + Parte 1 + Parte 2 + Link repo; Portada + Indice + Partes; Tu estructura
- Q: Capturas requeridas?
  - A: Pantallas clave + pruebas corriendo
  - Options: Pantallas clave + pruebas corriendo; Solo pruebas corriendo; Extensivo
- Q: Link repo: main o branch?
  - A: Main
  - Options: Branch; Main
