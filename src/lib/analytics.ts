/**
 * Lightweight event tracking. Dispatch custom events so GA/Mixpanel/GTM can listen.
 * Example: window.addEventListener('calmparent:track', (e) => { gtag('event', e.detail.event, e.detail); });
 */
export type TrackEvent =
  | "page_view"
  | "cta_guidance_now"
  | "guidance_requested"
  | "guidance_completed"
  | "guidance_error"
  | "skip_breathing"
  | "cta_get_guidance"
  | "cta_personalised"
  | "cta_home"
  | "onboarding_drop_off";

export function track(
  event: TrackEvent,
  payload?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent("calmparent:track", {
        detail: { event, ...payload, timestamp: Date.now() },
      })
    );
  } catch {
    // ignore
  }
}
