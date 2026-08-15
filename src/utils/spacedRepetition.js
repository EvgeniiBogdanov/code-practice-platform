/**
 * spacedRepetition.js
 * Алгоритм интервального повторения задач (Modified SM-2 / Leitner System).
 *
 * Уровни интервалов:
 * - Уровень 1: 1 день (+1d)   - Повторить завтра
 * - Уровень 2: 3 дня (+3d)    - Повторить через 3 дня
 * - Уровень 3: 7 дней (+7d)   - Повторить через неделю
 * - Уровень 4: 14 дней (+14d) - Повторить через 2 недели
 * - Уровень 5: 30 дней (+30d) - Повторить через месяц
 * - Уровень 6: 60 дней (+60d) - Мастер (закреплено)
 */

export const STAGE_INTERVALS = [0, 1, 3, 7, 14, 30, 60];
export const MAX_STAGE = 6;

export const STAGE_LABELS = {
  0: "Новая задача",
  1: "Уровень 1 (1 день)",
  2: "Уровень 2 (3 дня)",
  3: "Уровень 3 (7 дней)",
  4: "Уровень 4 (14 дней)",
  5: "Уровень 5 (30 дней)",
  6: "Мастер (60+ дней)",
};

export const RATINGS = {
  HARD: "hard",     // Сложно / С подсказкой
  MEDIUM: "medium", // Средне
  EASY: "easy",     // Легко
};

/**
 * Рассчитывает параметры следующего повторения на основе текущего состояния и оценки.
 * @param {object | null | undefined} currentReview
 * @param {'hard' | 'medium' | 'easy'} rating
 * @returns {object} Новые параметры повторения
 */
export function calculateNextReview(currentReview, rating) {
  const prevStage = currentReview?.stage || 0;
  const prevHistory = currentReview?.history || [];
  const now = Date.now();

  let nextStage = 1;
  let intervalDays = 1;

  if (rating === RATINGS.HARD) {
    // При сложности сбрасываем на 1 уровень (повтор завтра)
    nextStage = 1;
    intervalDays = 1;
  } else if (rating === RATINGS.MEDIUM) {
    // Средне: обычный шаг вперед
    if (prevStage === 0) {
      nextStage = 2; // при первом решении "средне" -> 3 дня
      intervalDays = 3;
    } else {
      nextStage = Math.min(MAX_STAGE, prevStage + 1);
      intervalDays = STAGE_INTERVALS[nextStage] || 3;
    }
  } else if (rating === RATINGS.EASY) {
    // Легко: быстрый шаг вперед (+2 уровня)
    if (prevStage === 0) {
      nextStage = 3; // при первом решении "легко" -> сразу 7 дней
      intervalDays = 7;
    } else {
      nextStage = Math.min(MAX_STAGE, prevStage + 2);
      intervalDays = STAGE_INTERVALS[nextStage] || 14;
    }
  }

  const nextReviewAt = now + intervalDays * 24 * 60 * 60 * 1000;

  const historyEntry = {
    date: now,
    rating,
    stage: nextStage,
    intervalDays,
  };

  return {
    taskId: currentReview?.taskId,
    stage: nextStage,
    intervalDays,
    lastReviewedAt: now,
    nextReviewAt,
    rating,
    history: [...prevHistory, historyEntry],
  };
}

/**
 * Проверяет, наступил ли срок повторения задачи (сегодня или ранее).
 * @param {object | null | undefined} reviewData
 * @returns {boolean}
 */
export function isTaskDue(reviewData) {
  if (!reviewData || !reviewData.nextReviewAt) return false;
  return reviewData.nextReviewAt <= Date.now();
}

/**
 * Форматирует дату следующего повторения в понятный русскоязычный текст.
 * @param {number} nextReviewAt Timestamp
 * @returns {string}
 */
export function formatNextReviewDate(nextReviewAt) {
  if (!nextReviewAt) return "Не запланировано";

  const now = Date.now();
  const diffMs = nextReviewAt - now;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return "Пора повторить сегодня!";
  }

  if (diffDays <= 1) {
    return "Завтра";
  }

  if (diffDays === 2) {
    return "Через 2 дня";
  }

  if (diffDays <= 4) {
    return `Через ${diffDays} дня`;
  }

  if (diffDays <= 14) {
    return `Через ${diffDays} дней`;
  }

  const date = new Date(nextReviewAt);
  const months = [
    "янв", "фев", "мар", "апр", "мая", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек"
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

/**
 * Возвращает мета-информацию для бейджа задачи в зависимости от уровня и срока повторения.
 * @param {object | null | undefined} reviewData
 * @returns {{ isDue: boolean, stage: number, stageName: string, label: string, isMaster: boolean }}
 */
export function getReviewBadgeMeta(reviewData) {
  if (!reviewData || !reviewData.stage) {
    return {
      isDue: false,
      stage: 0,
      stageName: STAGE_LABELS[0],
      label: "Новая",
      badgeClass: "difficulty-warm-up",
      isMaster: false,
    };
  }

  const isDue = isTaskDue(reviewData);
  const stage = reviewData.stage || 1;
  const isMaster = stage >= MAX_STAGE;

  let label = formatNextReviewDate(reviewData.nextReviewAt);
  let badgeClass = "difficulty-refactoring";

  if (isDue) {
    label = "Повторить сегодня";
    badgeClass = "difficulty-warm-up";
  } else if (isMaster) {
    label = "Мастер";
    badgeClass = "difficulty-middle";
  } else {
    badgeClass = "difficulty-refactoring";
  }

  return {
    isDue,
    stage,
    stageName: STAGE_LABELS[stage] || `Уровень ${stage}`,
    label,
    badgeClass,
    isMaster,
  };
}

/**
 * Pure function: возвращает отсортированный список задач, у которых наступил срок повторения.
 * @param {Array<object>} allTasks
 * @param {Record<string, object>} reviews
 * @returns {Array<object>}
 */
export function getDueTasksList(allTasks = [], reviews = {}) {
  if (!allTasks || allTasks.length === 0) return [];
  return allTasks
    .filter((task) => {
      const rev = reviews[String(task.id)];
      return rev && isTaskDue(rev);
    })
    .map((task) => ({
      ...task,
      reviewData: reviews[String(task.id)],
    }))
    .sort((a, b) => (a.reviewData?.nextReviewAt || 0) - (b.reviewData?.nextReviewAt || 0));
}

/**
 * Pure function: возвращает все задачи с активным графиком повторений,
 * отсортированные по убыванию срочности (сначала самые срочные/просроченные, затем ближайшие).
 * @param {Array<object>} allTasks
 * @param {Record<string, object>} reviews
 * @returns {Array<object>}
 */
export function getAllReviewTasksSorted(allTasks = [], reviews = {}) {
  if (!allTasks || allTasks.length === 0 || !reviews) return [];
  return allTasks
    .filter((task) => {
      const rev = reviews[String(task.id)];
      return rev && rev.stage > 0;
    })
    .map((task) => ({
      ...task,
      reviewData: reviews[String(task.id)],
    }))
    .sort((a, b) => {
      const isDueA = isTaskDue(a.reviewData);
      const isDueB = isTaskDue(b.reviewData);
      if (isDueA && !isDueB) return -1;
      if (!isDueA && isDueB) return 1;
      return (a.reviewData?.nextReviewAt || 0) - (b.reviewData?.nextReviewAt || 0);
    });
}

/**
 * Pure function: рассчитывает статистику по уровням повторений.
 * @param {Array<object>} allTasks
 * @param {Record<string, object>} reviews
 */
export function calculateMasteryStats(allTasks = [], reviews = {}) {
  const totalCount = allTasks ? allTasks.length : 0;
  let dueToday = 0;
  let learning = 0;   // Stage 1-2
  let reviewing = 0;  // Stage 3-4
  let mastered = 0;   // Stage 5-6
  let totalReviewed = 0;

  if (reviews) {
    for (const [id, rev] of Object.entries(reviews)) {
      if (rev && rev.stage > 0) {
        totalReviewed++;
        if (isTaskDue(rev)) {
          dueToday++;
        }
        if (rev.stage >= 5) {
          mastered++;
        } else if (rev.stage >= 3) {
          reviewing++;
        } else {
          learning++;
        }
      }
    }
  }

  const unreviewed = Math.max(0, totalCount - totalReviewed);

  return {
    dueToday,
    learning,
    reviewing,
    mastered,
    totalReviewed,
    unreviewed,
    totalCount,
  };
}

