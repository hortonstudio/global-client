import {
  ARIA_LABEL_KEY,
  ARIA_LABELLEDBY_KEY,
  ARIA_ROLE_KEY,
  ARIA_ROLE_VALUES,
  TABINDEX_KEY,
} from '@finsweet/attributes-utils';

/**
 * Sets the required `a11ty` attributes to a `Handle` element.
 * @param element The `Handle` element.
 * @param inputElement The correspondent `<input>` for the `Handle`, if existing.
 */
export const setHandleA11Y = (element: HTMLElement, inputElement?: HTMLInputElement) => {
  element.setAttribute(ARIA_ROLE_KEY, ARIA_ROLE_VALUES.slider);
  element.setAttribute(TABINDEX_KEY, '0');

  if (![ARIA_LABEL_KEY, ARIA_LABELLEDBY_KEY].some((key) => element.getAttribute(key)) && inputElement) {
    element.setAttribute(ARIA_LABEL_KEY, inputElement.name);
  }
};
