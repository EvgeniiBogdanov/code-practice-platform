import { formatNextReviewDate } from "@/entities/review";
import {
  RobotMessageParams,
  RobotMessageResult,
  getDaysElapsed,
  getOverdueDays,
  getMessageIndex,
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
  EASY_SCHEDULED_MESSAGES,
  MEDIUM_SCHEDULED_MESSAGES,
  HARD_SCHEDULED_MESSAGES,
  DUE_GENERAL_MESSAGES,
  DUE_AFTER_HARD_MESSAGES,
  DUE_MASTER_MESSAGES,
  DUE_REACT_MESSAGES,
  DUE_ALGO_MESSAGES,
  DUE_HARD_DIFFICULTY_MESSAGES,
} from "./robot-messages";

export type { RobotMessageParams, RobotMessageResult };

export function getRobotMessage({
  taskReview,
  canRate,
  task,
  isUnsolved,
  statusUpdatedAt,
}: RobotMessageParams): RobotMessageResult {
  // 1. Задача отмечена как «Не решено»
  if (isUnsolved) {
    const daysElapsed = getDaysElapsed(statusUpdatedAt);

    if (daysElapsed >= 30) {
      const idx = getMessageIndex([task?.id, "unsolved_month", statusUpdatedAt], UNSOLVED_MONTH_MESSAGES.length);
      return { text: UNSOLVED_MONTH_MESSAGES[idx] };
    }

    if (daysElapsed >= 7) {
      const idx = getMessageIndex([task?.id, "unsolved_week", statusUpdatedAt], UNSOLVED_WEEK_MESSAGES.length);
      return { text: UNSOLVED_WEEK_MESSAGES[idx] };
    }

    if (daysElapsed >= 1) {
      const idx = getMessageIndex([task?.id, "unsolved_next_day", statusUpdatedAt], UNSOLVED_NEXT_DAY_MESSAGES.length);
      return { text: UNSOLVED_NEXT_DAY_MESSAGES[idx] };
    }

    const idx = getMessageIndex([task?.id, "unsolved_day0"], UNSOLVED_DAY0_MESSAGES.length);
    return { text: UNSOLVED_DAY0_MESSAGES[idx] };
  }

  const section = task?.section;
  const difficulty = typeof task?.difficulty === "string" ? task.difficulty.toLowerCase() : "";

  // 2. Задача запланирована (в ожидании следующего повторения)
  if (taskReview && !canRate) {
    const nextDate = formatNextReviewDate(taskReview.nextReviewAt, taskReview.dueDate);
    const stage = taskReview.stage || 1;

    if (stage >= 4 || taskReview.intervalDays >= 21) {
      return {
        text: "Впечатляет! Материал отлично закрепился в долговременной памяти. В день проверки подготовлю чистый шаблон для подтверждения мастерства. Следующая проверка:",
        highlight: nextDate,
      };
    }

    if (taskReview.rating === "hard") {
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "hard"], HARD_SCHEDULED_MESSAGES.length);
      return { text: HARD_SCHEDULED_MESSAGES[idx], highlight: nextDate };
    }

    if (taskReview.rating === "medium") {
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "medium"], MEDIUM_SCHEDULED_MESSAGES.length);
      return { text: MEDIUM_SCHEDULED_MESSAGES[idx], highlight: nextDate };
    }

    if (taskReview.rating === "easy") {
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "easy"], EASY_SCHEDULED_MESSAGES.length);
      return { text: EASY_SCHEDULED_MESSAGES[idx], highlight: nextDate };
    }

    if (section === "react") {
      return {
        text: "Отлично! В день повторения подготовлю чистый шаблон, чтобы освежить хуки и логику компонентов. Напомню:",
        highlight: nextDate,
      };
    }

    if (section === "algorithms") {
      return {
        text: "Зафиксировано! В день повторения сброшу код до чистого шаблона для тренировки алгоритмической памяти. Напомню:",
        highlight: nextDate,
      };
    }

    return {
      text: "Отлично! В день повторения подготовлю чистый шаблон для закрепления материала на практике. Напомню:",
      highlight: nextDate,
    };
  }

  // 3. Срок повторения наступил (или просрочен)
  if (canRate && taskReview) {
    const overdueDays = getOverdueDays(taskReview.dueDate, taskReview.nextReviewAt);
    const prevRating = taskReview.rating || "medium";

    // 3.1 Месяц просрочки (30+ дней)
    if (overdueDays >= 30) {
      if (prevRating === "hard") {
        const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "overdue_m_hard"], OVERDUE_MONTH_HARD_MESSAGES.length);
        return { text: OVERDUE_MONTH_HARD_MESSAGES[idx] };
      }
      if (prevRating === "easy") {
        const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "overdue_m_easy"], OVERDUE_MONTH_EASY_MESSAGES.length);
        return { text: OVERDUE_MONTH_EASY_MESSAGES[idx] };
      }
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "overdue_m_med"], OVERDUE_MONTH_MEDIUM_MESSAGES.length);
      return { text: OVERDUE_MONTH_MEDIUM_MESSAGES[idx] };
    }

    // 3.2 Вторая неделя просрочки (8 - 29 дней)
    if (overdueDays >= 8) {
      if (prevRating === "hard") {
        const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "overdue_w2_hard"], OVERDUE_WEEK2_HARD_MESSAGES.length);
        return { text: OVERDUE_WEEK2_HARD_MESSAGES[idx] };
      }
      if (prevRating === "easy") {
        const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "overdue_w2_easy"], OVERDUE_WEEK2_EASY_MESSAGES.length);
        return { text: OVERDUE_WEEK2_EASY_MESSAGES[idx] };
      }
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "overdue_w2_med"], OVERDUE_WEEK2_MEDIUM_MESSAGES.length);
      return { text: OVERDUE_WEEK2_MEDIUM_MESSAGES[idx] };
    }

    // 3.3 Первая неделя просрочки (1 - 7 дней)
    if (overdueDays >= 1) {
      if (prevRating === "hard") {
        const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "overdue_w1_hard"], OVERDUE_WEEK1_HARD_MESSAGES.length);
        return { text: OVERDUE_WEEK1_HARD_MESSAGES[idx] };
      }
      if (prevRating === "easy") {
        const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "overdue_w1_easy"], OVERDUE_WEEK1_EASY_MESSAGES.length);
        return { text: OVERDUE_WEEK1_EASY_MESSAGES[idx] };
      }
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "overdue_w1_med"], OVERDUE_WEEK1_MEDIUM_MESSAGES.length);
      return { text: OVERDUE_WEEK1_MEDIUM_MESSAGES[idx] };
    }

    // 3.4 День в день (не просрочено)
    const stage = taskReview.stage || 1;
    if (stage >= 4) {
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "due_master"], DUE_MASTER_MESSAGES.length);
      return { text: DUE_MASTER_MESSAGES[idx] };
    }

    if (prevRating === "hard") {
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "due_hard_prev"], DUE_AFTER_HARD_MESSAGES.length);
      return { text: DUE_AFTER_HARD_MESSAGES[idx] };
    }

    if (section === "react") {
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "due_react"], DUE_REACT_MESSAGES.length);
      return { text: DUE_REACT_MESSAGES[idx] };
    }

    if (section === "algorithms") {
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "due_algo"], DUE_ALGO_MESSAGES.length);
      return { text: DUE_ALGO_MESSAGES[idx] };
    }

    if (difficulty === "hard" || difficulty === "сложно") {
      const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "due_diff_hard"], DUE_HARD_DIFFICULTY_MESSAGES.length);
      return { text: DUE_HARD_DIFFICULTY_MESSAGES[idx] };
    }

    const idx = getMessageIndex([task?.id, taskReview.lastReviewedAt, "due_general"], DUE_GENERAL_MESSAGES.length);
    return { text: DUE_GENERAL_MESSAGES[idx] };
  }

  // 4. Первичное решение (Новая решённая задача)
  if (difficulty === "hard" || difficulty === "сложно") {
    return {
      text: "Ого, мощно! Решить задачу уровня hard — крутой результат. Оцени свои ощущения, а я подберу правильный интервал для повторения:",
    };
  }

  if (difficulty === "easy" || difficulty === "легко") {
    return {
      text: "Чистая победа! Разминка удалась. Оцени сложность, чтобы я не отвлекал тебя частыми повторениями простых задач:",
    };
  }

  if (section === "react") {
    return {
      text: "Супер, компонент работает как надо! Оцени сложность, а я составлю график, чтобы паттерны React закрепились в памяти:",
    };
  }

  if (section === "algorithms") {
    return {
      text: "Отличный алгоритм! Оцени, насколько гладко сложилась логика — я построю график повторений для мышечной памяти:",
    };
  }

  return {
    text: "Отличное решение! Оцени сложность задачи, а я рассчитаю оптимальный интервал для повторения:",
  };
}
