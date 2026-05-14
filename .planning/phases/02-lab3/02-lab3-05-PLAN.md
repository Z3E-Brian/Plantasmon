---
phase: 02-lab3
plan: 05
type: execute
wave: 3
depends_on: [02-lab3-03]
files_modified:
  - app/identify.tsx
autonomous: true
gap_closure: true
requirements:
  - Offline support with local storage
must_haves:
  truths:
    - "App works without internet (offline modules)"
  artifacts:
    - path: "app/identify.tsx"
      provides: "Offline fallback with network check before plant identification"
  key_links:
    - from: "app/identify.tsx"
      to: "useNetworkStatus.ts"
      via: "isConnected check before identifyPlant()"
      pattern: "useNetworkStatus"
---

<objective>
Add offline fallback in identify.tsx to handle the case when there's no internet connection.

Purpose: The plant identification feature requires internet to call the Plant.id API. This task adds a network check before attempting identification and shows an appropriate offline message.

Output: identify.tsx gracefully handles offline scenario with user-friendly message.
</objective>

<execution_context>
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/workflows/execute-plan.md
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.planning/phases/02-lab3/02-lab3-03-SUMMARY.md
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.planning/phases/02-lab3/02-lab3-VERIFICATION.md

File to modify:
- app/identify.tsx — needs offline fallback with network status check

Existing hooks available:
- src/hooks/useNetworkStatus.ts — returns { isConnected }
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add offline fallback in identify.tsx</name>
  <files>app/identify.tsx</files>
  <action>
    Modify app/identify.tsx to handle offline scenario:
    1. Import useNetworkStatus hook
    2. Check network status before calling identifyPlant()
    3. Show appropriate message if offline
    
    Add import at top of file (after existing imports):
    ```typescript
    import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
    ```
    
    In the Identify component, add network status (after line 21, with other useState/useEffect):
    ```typescript
    const { isConnected } = useNetworkStatus();
    ```
    
    Modify runIdentification() function (starts at line 37):
    ```typescript
    const runIdentification = async () => {
      if (!photoUri) {
        setLoading(false);
        return;
      }
      
      // Check network status
      if (!isConnected) {
        setError('Sin conexión. No se puede identificar la planta sin internet.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const identification = await identifyPlant(photoUri as string);
        setResult(identification);
      } catch (err: any) {
        console.error('Identification error:', err);
        setError(err.message || 'Error al identificar la planta');
      } finally {
        setLoading(false);
      }
    }
    ```
    
    Note: The SyncStatusIndicator is already rendered in _layout.tsx (from Plan 04), 
    so no need to add it here.
  </action>
  <verify>
    <automated>grep -l "useNetworkStatus\|Sin conexión" app/identify.tsx && echo "offline fallback added"</automated>
  </verify>
  <done>identify.tsx checks network status before identification and shows offline message if no connection</done>
</task>

</tasks>

<verification>
- [ ] identify.tsx imports useNetworkStatus hook
- [ ] identify.tsx checks isConnected before calling identifyPlant()
- [ ] Offline message is shown when trying to identify without internet
- [ ] Error message is user-friendly: "Sin conexión. No se puede identificar la planta sin internet."
</verification>

<success_criteria>
Gap 1 from VERIFICATION.md is fully closed:
- App works without internet (offline modules)
- identify.tsx has offline fallback with network check
- User sees appropriate message when trying to identify plants offline
</success_criteria>

<output>
After completion, create `.planning/phases/02-lab3/02-lab3-05-SUMMARY.md`
</output>
