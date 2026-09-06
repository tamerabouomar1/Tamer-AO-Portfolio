import { useEffect, useRef } from "react";

/* Keyboard handling for a modal dialog.
 *
 * The three modals on this site (buy a template, become a member, claim a
 * free offer) already had the easy half right: role="dialog", aria-modal,
 * an aria-label, and Escape to close. What they did not have is the half that
 * decides whether a keyboard user can actually use them.
 *
 * Three separate problems, all invisible with a mouse:
 *
 *   1. FOCUS NEVER ENTERED THE DIALOG. Opening it left focus on the button
 *      behind it. A screen reader user pressed "Buy", heard nothing, and was
 *      still standing in the page underneath. aria-modal tells assistive tech
 *      the rest of the page is inert; it does not move anyone into the thing
 *      that just opened.
 *
 *   2. TAB WALKED OUT THE BACK. From the last field, Tab went to whatever
 *      came next in the DOM — the page behind the overlay, which is visually
 *      covered and, thanks to aria-modal, hidden from screen readers. Focus
 *      would then be on an element the user could neither see nor hear. This
 *      is the actual definition of a keyboard trap in reverse, and it is the
 *      most common reason a modal is unusable without a mouse.
 *
 *   3. FOCUS WAS LOST ON CLOSE. Closing returned focus to <body>, so the next
 *      Tab started again from the top of the page. Someone who opened a modal
 *      from the bottom of the store was sent back to the skip link.
 *
 * WCAG 2.1.2 (No Keyboard Trap) and 2.4.3 (Focus Order).
 *
 * Usage: const ref = useFocusTrap(isOpen); then put ref on the dialog element.
 */
export default function useFocusTrap(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;

    // Where focus was before the dialog opened, so it can go back there.
    const previous = document.activeElement;

    /* Everything focusable inside the dialog, in DOM order.
     *
     * Recomputed on every Tab rather than cached once: these dialogs change
     * shape as you use them (the claim form is replaced by a confirmation,
     * the buy modal reveals a download link), so a list captured at open time
     * would be pointing at elements that no longer exist by the time somebody
     * reaches the end of it.
     *
     * :not([disabled]) matters because the submit button disables itself
     * while sending, and a disabled button is not focusable — leaving it in
     * the list would make Tab appear to do nothing at exactly the moment the
     * user is waiting to find out whether their form went through. */
    const focusable = () =>
      [
        ...node.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
            "select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
        ),
      ].filter((el) => el.offsetParent !== null || el === document.activeElement);

    /* Move focus in. The first field is better than the dialog itself when
       there is one: it puts the user where the work is, and the dialog's
       aria-label is announced on the way past either way. Falls back to the
       container, which is why the dialog carries tabIndex={-1}. */
    const first = focusable()[0];
    (first || node).focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const items = focusable();
      if (!items.length) {
        // Nothing to move to. Keep focus in the dialog rather than letting it
        // escape to the hidden page behind.
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];

      // Wrap at both ends, so Tab and Shift+Tab both cycle within the dialog.
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      /* Put focus back where it came from. The guard matters: by the time a
         modal closes, the button that opened it may have been unmounted (a
         filter changed, the card re-rendered), and calling .focus() on a
         detached node silently sends focus to <body> — the very thing this is
         here to prevent. Checking it is still in the document means the
         fallback is at least deliberate. */
      if (previous instanceof HTMLElement && document.contains(previous)) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [active]);

  return ref;
}
