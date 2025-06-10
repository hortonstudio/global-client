import { isHTMLElement } from './guards';

/**
 * Ensures that an element has a unique ID.
 * If the element already has a unique ID, that one is preserved.
 * @param element
 * @returns Returns the unique ID assigned to the element.
 */
export const ensureUniqueId = (element: Element) => {
  if (!element.id || document.getElementById(element.id) !== element) {
    const id = crypto.randomUUID();
    element.id = id;
    return id;
  }

  return element.id;
};

/**
 * Checks if an element is visible
 * @param element
 */
export const isVisible = (element: HTMLElement): boolean =>
  !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);

/**
 * Clone a node that has the same type as the original one
 * @param node
 */
export const cloneNode = <T extends Node>(node: T, deep = true): T => <T>node.cloneNode(deep);

/**
 * Finds the first child text node of an element
 * @param element The element to search into.
 */
export const findTextNode = (element: HTMLElement): ChildNode | undefined => {
  let textNode: ChildNode | undefined;

  for (const node of element.childNodes) {
    if (isHTMLElement(node) && node.childNodes.length) textNode = findTextNode(node);
    else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) textNode = node;

    if (textNode) break;
  }

  return textNode;
};

/**
 * @returns The first hidden parent element, or the element itself (if hidden).
 * If the element is already visible, the function returns `undefined`.
 *
 * @param element The reference element.
 */
export const getHiddenParent = (element: HTMLElement): HTMLElement | undefined => {
  if (isVisible(element)) return;

  let previousElement = element;

  const checkParent = ({ parentElement }: HTMLElement) => {
    if (!parentElement) return;

    if (isVisible(parentElement)) return;

    previousElement = parentElement;
    checkParent(parentElement);
  };

  checkParent(element);

  return previousElement;
};

/**
 * Check if an element is scrollable
 * @param element
 * @returns True or false
 */
export const isScrollable = (element: Element): boolean => {
  const { overflow } = getComputedStyle(element);
  return overflow === 'auto' || overflow === 'scroll';
};
