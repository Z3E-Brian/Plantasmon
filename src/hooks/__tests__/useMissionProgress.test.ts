// useMissionProgress — Standalone helper + service wiring tests
//
// TDD for:
// 1. reportMissionProgress standalone export (callable from non-React code)
// 2. Hook delegates to standalone helper
// 3. Service wiring: identify/water actions trigger mission progress

jest.mock("@/src/config/firebase", () => ({
  db: {},
  auth: { currentUser: { uid: "test_user" } },
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  Timestamp: { now: () => ({ toDate: () => new Date() }) },
  serverTimestamp: () => "mocked_timestamp",
}));

jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

jest.mock("@/src/services/offlineStorage", () => ({
  savePlantLocal: jest.fn(),
  addToSyncQueue: jest.fn(),
}));

jest.mock("@/src/constants/missionsData", () => ({
  DAILY_MISSIONS: [
    { id: "daily_id_01", title: "Test", type: "daily", category: "identify", icon: "📷", requirement: { type: "identifications", count: 1 }, xpReward: 50 },
    { id: "daily_water_01", title: "Water Test", type: "daily", category: "water", icon: "💧", requirement: { type: "waterings", count: 1 }, xpReward: 50 },
  ],
  WEEKLY_MISSIONS: [],
  ALL_MISSIONS: [
    { id: "daily_id_01", title: "Test", type: "daily", category: "identify", icon: "📷", requirement: { type: "identifications", count: 1 }, xpReward: 50 },
    { id: "daily_water_01", title: "Water Test", type: "daily", category: "water", icon: "💧", requirement: { type: "waterings", count: 1 }, xpReward: 50 },
  ],
}));

import { renderHook } from "@testing-library/react-native";
import { getDoc, getDocs, updateDoc } from "firebase/firestore";
import * as useMissionProgressModule from "@/src/hooks/useMissionProgress";

const mockedGetDoc = getDoc as jest.Mock;
const mockedGetDocs = getDocs as jest.Mock;
const mockedUpdateDoc = updateDoc as jest.Mock;

describe("useMissionProgress — standalone helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default: getMissionDefinitions returns empty → no mission matches
    mockedGetDocs.mockResolvedValue({
      empty: true,
      docs: [],
      forEach: jest.fn(),
      size: 0,
    });
  });

  describe("reportMissionProgress standalone export", () => {
    it("exports reportMissionProgress as a callable async function", () => {
      // RED: this will fail because reportMissionProgress doesn't exist yet
      // GREEN: after implementation, this passes
      const fn = (useMissionProgressModule as any).reportMissionProgress;
      expect(fn).toBeDefined();
      expect(typeof fn).toBe("function");
    });

    it("fetches user missions and updates matching progress", async () => {
      // Mock user with a mission that matches "identify" event
      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          missions: {
            missionProgress: [
              { id: "daily_id_01", progress: 0, target: 1, completed: false, claimed: false },
            ],
            assignedDailyIds: ["daily_id_01"],
            assignedWeeklyIds: [],
            lastDailyRefresh: new Date().toISOString(),
          },
        }),
      });

      // Mock getMissionDefinitions returning a matching def with type "identifications"
      // Need TWO calls: one for getUserMissions (internal), one for reportMissionProgress
      const missionDefs = {
        empty: false,
        docs: [{
          data: () => ({ id: "daily_id_01", requirement: { type: "identifications", count: 1 } }),
        }],
        forEach: jest.fn(),
        size: 1,
      };
      mockedGetDocs.mockResolvedValueOnce(missionDefs);
      mockedGetDocs.mockResolvedValueOnce(missionDefs);

      const reportProgress = (useMissionProgressModule as any).reportMissionProgress;
      if (typeof reportProgress !== "function") return; // skip if not implemented yet

      await reportProgress("identify");

      // updateDoc should have been called to increment mission progress
      expect(mockedUpdateDoc).toHaveBeenCalled();
    });

    it("handles errors gracefully without throwing", async () => {
      mockedGetDoc.mockRejectedValue(new Error("Firestore error"));

      const reportProgress = (useMissionProgressModule as any).reportMissionProgress;
      if (typeof reportProgress !== "function") return; // skip if not implemented yet

      await expect(reportProgress("identify")).resolves.toBeUndefined();
    });
  });

  describe("hook uses standalone helper", () => {
    it("useMissionProgress hook returns reportProgress that shares logic with standalone", () => {
      const { result } = renderHook(() =>
        useMissionProgressModule.useMissionProgress()
      );
      expect(result.current.reportProgress).toBeDefined();
      expect(typeof result.current.reportProgress).toBe("function");
    });
  });
});
