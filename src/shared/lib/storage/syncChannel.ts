/**
 * Cross-tab Realtime Synchronization Channel
 */

const CHANNEL_NAME = "code_practice_platform_sync";

export type SyncEventType =
  | "TASK_STATUS_CHANGED"
  | "CHECKLIST_CHANGED"
  | "SOLUTION_SAVED"
  | "SOLUTIONS_CLEARED"
  | "PROGRESS_RESET"
  | "TASK_REVIEWED"
  | "TASK_REVIEW_DELETED"
  | "REVIEWS_RESET"
  | "TASK_EXCLUSION_CHANGED"
  | "ASSISTANT_NAME_CHANGED";

export interface SyncEventPayload {
  type: SyncEventType;
  taskId?: string | number;
  status?: string | boolean;
  key?: string;
  checked?: boolean;
  review?: unknown;
  all?: boolean;
  idsToRemove?: string[];
  taskIds?: string[];
  name?: string;
  [key: string]: unknown;
}

let broadcastChannel: BroadcastChannel | null = null;
const listeners = new Set<(event: SyncEventPayload & { timestamp: number }) => void>();

export function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return null;
  }

  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = (event) => {
        if (event && event.data) {
          for (const callback of listeners) {
            try {
              callback(event.data);
            } catch (err) {
              console.error("[SyncChannel] Listener error:", err);
            }
          }
        }
      };
    } catch (err) {
      console.warn("[SyncChannel] Could not initialize BroadcastChannel:", err);
      broadcastChannel = null;
    }
  }

  return broadcastChannel;
}

export function broadcastSyncEvent(
  type: SyncEventType,
  payload: Record<string, unknown> = {}
): void {
  const data: SyncEventPayload & { timestamp: number } = {
    type,
    ...payload,
    timestamp: Date.now(),
  };

  for (const callback of Array.from(listeners)) {
    try {
      callback(data);
    } catch (err) {
      console.error("[SyncChannel] Local listener error:", err);
    }
  }

  const channel = getBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage(data);
    } catch (err) {
      console.error("[SyncChannel] Failed to post message:", err);
    }
  }
}

export function subscribeToSyncEvents(
  callback: (event: SyncEventPayload & { timestamp: number }) => void
): () => void {
  getBroadcastChannel();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
