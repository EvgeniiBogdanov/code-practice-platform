import { describe, it, expect } from "vitest";
import { getRobotMessage } from "./get-robot-message";
import { ReviewItem } from "@/entities/review";
import { Task } from "@/entities/task";
import {
  UNSOLVED_DAY0_MESSAGES,
  UNSOLVED_NEXT_DAY_MESSAGES,
  UNSOLVED_WEEK_MESSAGES,
  UNSOLVED_MONTH_MESSAGES,
  OVERDUE_WEEK1_HARD_MESSAGES,
  OVERDUE_WEEK1_MEDIUM_MESSAGES,
  OVERDUE_WEEK1_EASY_MESSAGES,
  OVERDUE_WEEK2_HARD_MESSAGES,
  OVERDUE_WEEK2_MEDIUM_MESSAGES,
  OVERDUE_WEEK2_EASY_MESSAGES,
  OVERDUE_MONTH_HARD_MESSAGES,
  OVERDUE_MONTH_MEDIUM_MESSAGES,
  OVERDUE_MONTH_EASY_MESSAGES,
  DUE_MASTER_MESSAGES,
} from "./robot-messages";

describe("getRobotMessage", () => {
  const baseTask: Task = {
    id: "task-1",
    title: "Тестовая задача",
    section: "javascript",
  };

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  describe("Scenario 1: isUnsolved timeframes", () => {
    it("returns day 0 message on the same day", () => {
      const res = getRobotMessage({
        taskReview: null,
        canRate: false,
        isUnsolved: true,
        statusUpdatedAt: Date.now(),
        task: baseTask,
      });
      expect(UNSOLVED_DAY0_MESSAGES).toContain(res.text);
    });

    it("returns next day message mentioning 'Разбор и теория' and articles", () => {
      const res = getRobotMessage({
        taskReview: null,
        canRate: false,
        isUnsolved: true,
        statusUpdatedAt: Date.now() - ONE_DAY_MS * 1.5,
        task: baseTask,
      });
      expect(UNSOLVED_NEXT_DAY_MESSAGES).toContain(res.text);
      expect(res.text).toContain("Разбор и теория");
      expect(res.text).toMatch(/стать|ссылк/);
    });

    it("returns 1 week message with 'вода камень точит' and high motivation", () => {
      const res = getRobotMessage({
        taskReview: null,
        canRate: false,
        isUnsolved: true,
        statusUpdatedAt: Date.now() - ONE_DAY_MS * 8,
        task: baseTask,
      });
      expect(UNSOLVED_WEEK_MESSAGES).toContain(res.text);
      expect(res.text.toLowerCase()).toContain("вода камень точит");
    });

    it("returns 1 month message with lonely assistant waiting", () => {
      const res = getRobotMessage({
        taskReview: null,
        canRate: false,
        isUnsolved: true,
        statusUpdatedAt: Date.now() - ONE_DAY_MS * 35,
        task: baseTask,
      });
      expect(UNSOLVED_MONTH_MESSAGES).toContain(res.text);
      expect(res.text).toMatch(/забыл|скуч|одиночеств|вместе|месяц|пыль/i);
    });
  });

  describe("Scenario 2: Overdue reviews by difficulty", () => {
    const createReview = (daysOverdue: number, rating: "hard" | "medium" | "easy"): ReviewItem => {
      const targetTime = Date.now() - daysOverdue * ONE_DAY_MS;
      const targetDate = new Date(targetTime);
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dd = String(targetDate.getDate()).padStart(2, "0");
      const dueDate = `${yyyy}-${mm}-${dd}`;

      return {
        taskId: "task-1",
        stage: 1,
        intervalDays: 1,
        lastReviewedAt: targetTime - ONE_DAY_MS,
        lastReviewedDate: "2026-08-01",
        dueDate,
        nextReviewAt: targetTime,
        rating,
        history: [],
      };
    };

    it("returns 1st week overdue messages by rating", () => {
      const resHard = getRobotMessage({
        taskReview: createReview(3, "hard"),
        canRate: true,
        task: baseTask,
      });
      expect(OVERDUE_WEEK1_HARD_MESSAGES).toContain(resHard.text);

      const resMed = getRobotMessage({
        taskReview: createReview(4, "medium"),
        canRate: true,
        task: baseTask,
      });
      expect(OVERDUE_WEEK1_MEDIUM_MESSAGES).toContain(resMed.text);

      const resEasy = getRobotMessage({
        taskReview: createReview(5, "easy"),
        canRate: true,
        task: baseTask,
      });
      expect(OVERDUE_WEEK1_EASY_MESSAGES).toContain(resEasy.text);
    });

    it("returns 2nd week overdue messages by rating", () => {
      const resHard = getRobotMessage({
        taskReview: createReview(12, "hard"),
        canRate: true,
        task: baseTask,
      });
      expect(OVERDUE_WEEK2_HARD_MESSAGES).toContain(resHard.text);

      const resMed = getRobotMessage({
        taskReview: createReview(14, "medium"),
        canRate: true,
        task: baseTask,
      });
      expect(OVERDUE_WEEK2_MEDIUM_MESSAGES).toContain(resMed.text);

      const resEasy = getRobotMessage({
        taskReview: createReview(16, "easy"),
        canRate: true,
        task: baseTask,
      });
      expect(OVERDUE_WEEK2_EASY_MESSAGES).toContain(resEasy.text);
    });

    it("returns 1 month overdue messages by rating", () => {
      const resHard = getRobotMessage({
        taskReview: createReview(35, "hard"),
        canRate: true,
        task: baseTask,
      });
      expect(OVERDUE_MONTH_HARD_MESSAGES).toContain(resHard.text);

      const resMed = getRobotMessage({
        taskReview: createReview(40, "medium"),
        canRate: true,
        task: baseTask,
      });
      expect(OVERDUE_MONTH_MEDIUM_MESSAGES).toContain(resMed.text);

      const resEasy = getRobotMessage({
        taskReview: createReview(45, "easy"),
        canRate: true,
        task: baseTask,
      });
      expect(OVERDUE_MONTH_EASY_MESSAGES).toContain(resEasy.text);
    });
  });

  describe("Scheduled and baseline review messages", () => {
    it("returns scheduled message with highlight date", () => {
      const review: ReviewItem = {
        taskId: "1",
        stage: 1,
        intervalDays: 1,
        lastReviewedAt: Date.now(),
        lastReviewedDate: "2026-09-02",
        dueDate: "2026-09-05",
        nextReviewAt: Date.now() + ONE_DAY_MS * 3,
        rating: "easy",
        history: [],
      };

      const res = getRobotMessage({
        taskReview: review,
        canRate: false,
        task: baseTask,
      });
      expect(res.highlight).toBeDefined();
      expect(res.text.length).toBeGreaterThan(10);
    });

    it("returns master stage message when stage >= 4 on the due day", () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");

      const review: ReviewItem = {
        taskId: "1",
        stage: 4,
        intervalDays: 30,
        lastReviewedAt: Date.now() - ONE_DAY_MS * 30,
        lastReviewedDate: "2026-08-01",
        dueDate: `${yyyy}-${mm}-${dd}`,
        nextReviewAt: Date.now(),
        rating: "easy",
        history: [],
      };

      const res = getRobotMessage({
        taskReview: review,
        canRate: true,
        task: baseTask,
      });
      expect(DUE_MASTER_MESSAGES).toContain(res.text);
    });
  });
});
