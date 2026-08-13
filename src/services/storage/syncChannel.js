/**
 * Cross-tab Realtime Synchronization Channel
 *
 * Uses the Web standard BroadcastChannel API to synchronize solution updates,
 * task completion statuses, and checklist toggles across multiple browser tabs
 * in real time without page reload.
 */

const CHANNEL_NAME = "code_practice_platform_sync";

let broadcastChannel = null;
const listeners = new Set();

/**
 * Initializes the BroadcastChannel if supported.
 * @returns {BroadcastChannel | null}
 */
export function getBroadcastChannel() {
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

/**
 * Broadcasts an event to all other open tabs as well as local subscribers in the current tab.
 * @param {'TASK_STATUS_CHANGED' | 'CHECKLIST_CHANGED' | 'SOLUTION_SAVED' | 'SOLUTIONS_CLEARED' | 'PROGRESS_RESET'} type
 * @param {object} payload
 */
export function broadcastSyncEvent(type, payload = {}) {
  const data = { type, ...payload, timestamp: Date.now() };

  // 1. Notify local subscribers in the current tab
  for (const callback of Array.from(listeners)) {
    try {
      callback(data);
    } catch (err) {
      console.error("[SyncChannel] Local listener error:", err);
    }
  }

  // 2. Broadcast to other tabs via Web BroadcastChannel
  const channel = getBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage(data);
    } catch (err) {
      console.error("[SyncChannel] Failed to post message:", err);
    }
  }
}

/**
 * Subscribes to cross-tab synchronization events.
 * @param {(event: { type: string, [key: string]: any }) => void} callback
 * @returns {() => void} Unsubscribe function
 */
export function subscribeToSyncEvents(callback) {
  getBroadcastChannel();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
