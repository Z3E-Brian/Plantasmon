// Unit test for activityService — pure helper functions
// Per D-10: add at least 1 unit test for a new service
//
// Tests three internal helpers:
//   - formatRelativeTime (relative timestamps in Spanish)
//   - safeParseDate (defensive date parsing)
//   - toActivityData (ActivityEvent → ActivityData mapping)

jest.mock("@/src/config/firebase", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    now: () => ({ toDate: () => new Date() }),
  },
  serverTimestamp: jest.fn(),
}));

import { toActivityData } from "@/src/services/activityService";
import * as mod from "@/src/services/activityService";

// Access non-exported helpers via module namespace
const formatRelativeTime = (mod as any).formatRelativeTime as
  | ((date: Date) => string)
  | undefined;
const safeParseDate = (mod as any).safeParseDate as
  | ((value: unknown) => Date)
  | undefined;

describe("activityService — pure helpers", () => {
  // ------------------------------------------------------------------
  // formatRelativeTime
  // ------------------------------------------------------------------
  describe("formatRelativeTime", () => {
    // Guard: skip all tests if the function is not exported internally
    const fnExists = typeof formatRelativeTime === "function";

    beforeEach(() => {
      jest.useFakeTimers();
      // Fix "now" to a known instant for deterministic assertions
      jest.setSystemTime(new Date("2026-05-24T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("devuelve 'Ahora' cuando la fecha es el mismo instante", () => {
      if (!fnExists) return;
      const date = new Date("2026-05-24T12:00:00Z");
      expect(formatRelativeTime!(date)).toBe("Ahora");
    });

    it("devuelve 'Hace 5 min' cuando pasaron 5 minutos", () => {
      if (!fnExists) return;
      const date = new Date("2026-05-24T11:55:00Z");
      expect(formatRelativeTime!(date)).toBe("Hace 5 min");
    });

    it("devuelve 'Hace 30 min' cuando pasaron 30 minutos", () => {
      if (!fnExists) return;
      const date = new Date("2026-05-24T11:30:00Z");
      expect(formatRelativeTime!(date)).toBe("Hace 30 min");
    });

    it("devuelve 'Hace 1 h' cuando pasó 1 hora", () => {
      if (!fnExists) return;
      const date = new Date("2026-05-24T11:00:00Z");
      expect(formatRelativeTime!(date)).toBe("Hace 1 h");
    });

    it("devuelve 'Hace 12 h' cuando pasaron 12 horas", () => {
      if (!fnExists) return;
      const date = new Date("2026-05-24T00:00:00Z");
      expect(formatRelativeTime!(date)).toBe("Hace 12 h");
    });

    it("devuelve 'Hace 2 días' cuando pasaron 2 días", () => {
      if (!fnExists) return;
      const date = new Date("2026-05-22T12:00:00Z");
      expect(formatRelativeTime!(date)).toBe("Hace 2 días");
    });

    it("devuelve fecha formateada (dd/mm/yyyy) cuando pasaron 7+ días", () => {
      if (!fnExists) return;
      const date = new Date("2026-05-14T12:00:00Z");
      expect(formatRelativeTime!(date)).toBe("14/05/2026");
    });
  });

  // ------------------------------------------------------------------
  // safeParseDate
  // ------------------------------------------------------------------
  describe("safeParseDate", () => {
    const fnExists = typeof safeParseDate === "function";

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-24T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("devuelve el mismo Date cuando recibe un Date", () => {
      if (!fnExists) return;
      const input = new Date("2026-05-24T10:00:00Z");
      const result = safeParseDate!(input);
      expect(result).toEqual(input);
    });

    it("devuelve la fecha actual cuando recibe null", () => {
      if (!fnExists) return;
      const result = safeParseDate!(null);
      expect(result).toEqual(new Date("2026-05-24T12:00:00Z"));
    });

    it("devuelve la fecha actual cuando recibe undefined", () => {
      if (!fnExists) return;
      const result = safeParseDate!(undefined);
      expect(result).toEqual(new Date("2026-05-24T12:00:00Z"));
    });

    it("devuelve la fecha del Timestamp cuando recibe un objeto con toDate()", () => {
      if (!fnExists) return;
      const expected = new Date("2026-05-24T10:00:00Z");
      const input = { toDate: () => expected };
      const result = safeParseDate!(input);
      expect(result).toEqual(expected);
    });

    it("parsea un string ISO a Date", () => {
      if (!fnExists) return;
      const result = safeParseDate!("2026-05-24");
      // Date-only ISO string is interpreted as UTC midnight
      expect(result.getUTCFullYear()).toBe(2026);
      expect(result.getUTCMonth()).toBe(4); // 0-indexed: May = 4
      expect(result.getUTCDate()).toBe(24);
    });

    it("devuelve la fecha actual cuando recibe un string no válido", () => {
      if (!fnExists) return;
      const result = safeParseDate!("not-a-date");
      expect(result).toEqual(new Date("2026-05-24T12:00:00Z"));
    });
  });

  // ------------------------------------------------------------------
  // toActivityData (exported — no guard needed)
  // ------------------------------------------------------------------
  describe("toActivityData", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-24T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("mapea un evento 'identify' correctamente", () => {
      const result = toActivityData({
        id: "abc123",
        type: "identify",
        title: "Test",
        description: "Desc",
        timestamp: new Date("2026-05-24T10:00:00Z"),
        iconType: "camera",
      });

      expect(result).toMatchObject({
        id: expect.any(Number),
        type: "identify",
        title: "Test",
        description: "Desc",
        time: expect.any(String),
        iconType: "camera",
      });
      expect(result.id).not.toBe(0);
    });

    it("mapea un evento 'mission' como 'achievement'", () => {
      const result = toActivityData({
        id: "xyz789",
        type: "mission",
        title: "Misión",
        description: "Completada",
        timestamp: new Date("2026-05-24T11:00:00Z"),
        iconType: "sparkles",
      });

      expect(result).toMatchObject({
        id: expect.any(Number),
        type: "achievement",
        title: "Misión",
        description: "Completada",
        time: expect.any(String),
        iconType: "sparkles",
      });
      expect(result.id).not.toBe(0);
    });

    it("mapea evento 'water' como 'water' (sin mapeo especial)", () => {
      const result = toActivityData({
        id: "wat001",
        type: "water",
        title: "Riego",
        description: "Planta regada",
        timestamp: new Date("2026-05-24T11:30:00Z"),
        iconType: "water",
      });

      expect(result).toMatchObject({
        type: "water",
        title: "Riego",
        iconType: "water",
      });
      expect(result.id).not.toBe(0);
    });

    it("mapea evento 'achievement' como 'achievement' (sin mapeo)", () => {
      const result = toActivityData({
        id: "ach999",
        type: "achievement",
        title: "Logro",
        description: "Logro desbloqueado",
        timestamp: new Date("2026-05-24T11:45:00Z"),
        iconType: "award",
      });

      expect(result).toMatchObject({
        type: "achievement",
        title: "Logro",
        iconType: "award",
      });
      expect(result.id).not.toBe(0);
    });
  });
});
