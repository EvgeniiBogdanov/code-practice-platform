/**
 * spacedRepetition.js
 * Алгоритм интервального повторения задач (Modified SM-2 / Leitner System).
 *
 * Расчет интервалов привязан к календарным дням с учетом локального часового пояса пользователя.
 * Если задача решена сегодня (в любое время, даже в 23:59), при интервале +1 день срок
 * повторения наступает на следующий календарный день (начиная с 00:00:00 местного времени).
 *
 * Уровни интервалов:
 * - Уровень 1: 1 день (+1d)   - Повторить завтра (следующий календарный день)
 * - Уровень 2: 3 дня (+3d)    - Повторить через 3 календарных дня
 * - Уровень 3: 7 дней (+7d)   - Повторить через неделю (7 дней)
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
 * Возвращает строковую дату 'YYYY-MM-DD' в текущем локальном часовом поясе пользователя.
 * @param {Date | number} [dateInput=new Date()]
 * @returns {string} Например '2026-08-16'
 */
export function getLocalDateString(dateInput = new Date()) {
  const d = typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  if (!d || isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Возвращает объект Date, установленный на начало календарного дня (00:00:00.000) по местному времени.
 * @param {Date | number} [dateInput=new Date()]
 * @returns {Date}
 */
export function getStartOfLocalDay(dateInput = new Date()) {
  const d = typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput.getTime());
  if (!d || isNaN(d.getTime())) return new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Рассчитывает целевую календарную дату повторения с добавлением N дней по местному времени.
 * @param {Date | number} [fromDate=new Date()] Базовая дата решения
 * @param {number} [intervalDays=1] Количество календарных дней до следующего повторения
 * @returns {{ dueDate: string, nextReviewAt: number }}
 */
export function calculateNextReviewDay(fromDate = new Date(), intervalDays = 1) {
  const base = typeof fromDate === "number" ? new Date(fromDate) : fromDate;
  // Рассчитываем целевой день: год, месяц, день + intervalDays в 00:00:00.000
  const target = new Date(base.getFullYear(), base.getMonth(), base.getDate() + intervalDays, 0, 0, 0, 0);
  const dueDate = getLocalDateString(target);
  const nextReviewAt = target.getTime();
  return { dueDate, nextReviewAt };
}

/**
 * Рассчитывает параметры следующего повторения на основе текущего состояния и оценки.
 * Сохраняет точные даты и таймстампы с привязкой к календарным дням.
 * @param {object | null | undefined} currentReview
 * @param {'hard' | 'medium' | 'easy'} rating
 * @returns {object} Новые параметры повторения
 */
export function calculateNextReview(currentReview, rating) {
  const prevStage = currentReview?.stage || 0;
  const prevHistory = currentReview?.history || [];
  const now = Date.now();
  const todayDate = getLocalDateString(now);

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

  const { dueDate, nextReviewAt } = calculateNextReviewDay(now, intervalDays);

  let userTimezone = "";
  try {
    userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    // fallback
  }

  const historyEntry = {
    date: now,
    localDate: todayDate,
    rating,
    stage: nextStage,
    intervalDays,
    dueDate,
  };

  return {
    taskId: currentReview?.taskId,
    stage: nextStage,
    intervalDays,
    lastReviewedAt: now,
    lastReviewedDate: todayDate,
    dueDate,
    nextReviewAt, // 00:00:00.000 целевого дня по местному времени
    userTimezone,
    rating,
    history: [...prevHistory, historyEntry],
  };
}

/**
 * Проверяет, наступил ли срок повторения задачи (сегодня или ранее) в локальном часовом поясе.
 * @param {object | null | undefined} reviewData
 * @returns {boolean}
 */
export function isTaskDue(reviewData) {
  if (!reviewData) return false;
  if (!reviewData.stage || reviewData.stage === 0) return false;

  const todayStr = getLocalDateString();

  // 1. При наличии явной календарной даты dueDate ('YYYY-MM-DD'):
  if (reviewData.dueDate) {
    return todayStr >= reviewData.dueDate;
  }

  // 2. Обратная совместимость для записей с timestamp (nextReviewAt):
  if (reviewData.nextReviewAt) {
    const targetDateStr = getLocalDateString(reviewData.nextReviewAt);
    const todayStart = getStartOfLocalDay().getTime();
    return todayStr >= targetDateStr || reviewData.nextReviewAt <= todayStart || reviewData.nextReviewAt <= Date.now();
  }

  return false;
}

/**
 * Форматирует дату следующего повторения в понятный русскоязычный текст
 * на основе календарных дней (Сегодня / Завтра / Через N дней).
 * @param {number | object} nextReviewAtOrReview Timestamp или объект reviewData
 * @param {string} [dueDateInput] 'YYYY-MM-DD'
 * @returns {string}
 */
export function formatNextReviewDate(nextReviewAtOrReview, dueDateInput) {
  const isObj = nextReviewAtOrReview && typeof nextReviewAtOrReview === "object";
  const nextReviewAt = isObj ? nextReviewAtOrReview.nextReviewAt : nextReviewAtOrReview;
  const dueDate = isObj ? nextReviewAtOrReview.dueDate : dueDateInput;

  if (!nextReviewAt && !dueDate) return "Не запланировано";

  const todayStr = getLocalDateString();
  const targetStr = dueDate || (nextReviewAt ? getLocalDateString(nextReviewAt) : "");

  if (!targetStr) return "Не запланировано";

  // Если дата повторения сегодня или в прошлом
  if (todayStr >= targetStr) {
    return "Пора повторить сегодня!";
  }

  const todayStart = getStartOfLocalDay().getTime();
  const targetDate = nextReviewAt ? new Date(nextReviewAt) : new Date(`${targetStr}T00:00:00`);
  const targetStart = getStartOfLocalDay(targetDate).getTime();
  const diffDays = Math.round((targetStart - todayStart) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Пора повторить сегодня!";
  }
  if (diffDays === 1) {
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

  const months = [
    "янв", "фев", "мар", "апр", "мая", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек",
  ];
  return `${targetDate.getDate()} ${months[targetDate.getMonth()]}`;
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

  let label = formatNextReviewDate(reviewData.nextReviewAt, reviewData.dueDate);
  let badgeClass = "difficulty-refactoring";

  if (isDue) {
    label = "Повтор";
    badgeClass = "difficulty-review-due";
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


