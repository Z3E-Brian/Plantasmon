// Mission Service — Grace Period Tests
// This test file validates:
// 1. assignDailyMissions records assignedDate on new entries
// 2. getExpiredMissions only returns missions from the previous day

jest.mock("@/src/config/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
}));

jest.mock("@/src/services/userService", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("@/src/constants/missionsData", () => {
  const dailyMissions = [
    {
      id: "daily_id_01",
      title: "Identifica 1 planta",
      type: "daily",
      category: "identify",
      icon: "📷",
      requirement: { type: "identifications", count: 1 },
      xpReward: 50,
    },
    {
      id: "daily_id_02",
      title: "Identifica 3 plantas",
      type: "daily",
      category: "identify",
      icon: "📷",
      requirement: { type: "identifications", count: 3 },
      xpReward: 100,
    },
    {
      id: "daily_id_03",
      title: "Identifica 2 plantas diferentes",
      type: "daily",
      category: "identify",
      icon: "🌿",
      requirement: { type: "identifications", count: 2 },
      xpReward: 75,
    },
    {
      id: "daily_id_04",
      title: "Identifica una planta con flor",
      type: "daily",
      category: "identify",
      icon: "🌸",
      requirement: { type: "identifications", count: 1 },
      xpReward: 60,
    },
    {
      id: "daily_id_05",
      title: "Identifica 5 plantas",
      type: "daily",
      category: "identify",
      icon: "📷",
      requirement: { type: "identifications", count: 5 },
      xpReward: 150,
    },
    {
      id: "daily_water_01",
      title: "Riega 1 planta",
      type: "daily",
      category: "water",
      icon: "💧",
      requirement: { type: "waterings", count: 1 },
      xpReward: 50,
    },
  ];

  return {
    DAILY_MISSIONS: dailyMissions,
    WEEKLY_MISSIONS: [],
    ALL_MISSIONS: dailyMissions,
  };
});

import { doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { getCurrentUserId } from "@/src/services/userService";
import {
  assignDailyMissions,
  getExpiredMissions,
} from "@/src/services/missionService";

const mockedDoc = doc as jest.Mock;
const mockedGetDoc = getDoc as jest.Mock;
const mockedUpdateDoc = updateDoc as jest.Mock;
const mockedGetDocs = getDocs as jest.Mock;
const mockedGetCurrentUserId = getCurrentUserId as jest.Mock;

/**
 * Format a date as YYYY-MM-DD (matches toDateStr helper in missionService)
 */
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

describe("missionService grace period", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetCurrentUserId.mockReturnValue("test_user");
    // getMissionDefinitions needs getDocs to return a snapshot
    mockedGetDocs.mockResolvedValue({
      empty: true,
      docs: [],
      forEach: jest.fn(),
      size: 0,
    });
  });

  describe("assignDailyMissions — assignedDate metadata", () => {
    it("adds assignedDate to new mission progress entries", async () => {
      // Mock user doc exists with empty mission progress
      mockedGetDoc
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => ({
            missions: {
              missionProgress: [],
              assignedDailyIds: [],
              lastDailyRefresh: null,
              lastWeeklyRefresh: null,
            },
          }),
        })
        // getMissionDefinitions needs a second call - handled by getDocs mock
        .mockResolvedValue({
          exists: () => true,
          data: () => ({
            missions: {
              missionProgress: [],
              assignedDailyIds: [],
              lastDailyRefresh: null,
              lastWeeklyRefresh: null,
            },
          }),
        });

      await assignDailyMissions("test_user");

      // updateDoc should have been called with missionProgress containing assignedDate
      expect(mockedUpdateDoc).toHaveBeenCalled();
      const updateArg = mockedUpdateDoc.mock.calls[0][1];
      const newProgress = updateArg["missions.missionProgress"];

      expect(newProgress).toBeDefined();
      expect(newProgress.length).toBeGreaterThan(0);
      newProgress.forEach((entry: any) => {
        expect(entry.assignedDate).toBeDefined();
        expect(typeof entry.assignedDate).toBe("string");
        // assignedDate should be a valid ISO date
        expect(() => new Date(entry.assignedDate)).not.toThrow();
      });
    });
  });

  describe("getExpiredMissions — date filtering", () => {
    it("returns only completed+unclaimed missions from the previous day", async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayISO = yesterday.toISOString();

      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoISO = twoDaysAgo.toISOString();

      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          missions: {
            // Yesterday's mission (completed, unclaimed) → should be expired
            // 2-day old mission (completed, unclaimed) → should NOT be expired
            // No assignedDate mission (completed, unclaimed) → should NOT be expired
            // Not completed mission (assigned yesterday) → should NOT be expired
            missionProgress: [
              {
                id: "mission_yesterday",
                progress: 1,
                target: 1,
                completed: true,
                claimed: false,
                assignedDate: yesterdayISO,
              },
              {
                id: "mission_old",
                progress: 1,
                target: 1,
                completed: true,
                claimed: false,
                assignedDate: twoDaysAgoISO,
              },
              {
                id: "mission_no_date",
                progress: 1,
                target: 1,
                completed: true,
                claimed: false,
              },
              {
                id: "mission_not_completed",
                progress: 0,
                target: 1,
                completed: false,
                claimed: false,
                assignedDate: yesterdayISO,
              },
            ],
            assignedDailyIds: ["today_mission"],
          },
        }),
      });

      const expired = await getExpiredMissions("test_user");

      // Only yesterday's completed, unclaimed mission should be returned
      expect(expired).toHaveLength(1);
      expect(expired[0].id).toBe("mission_yesterday");
      expect(expired[0].completed).toBe(true);
      expect(expired[0].claimed).toBe(false);
    });
  });
});
