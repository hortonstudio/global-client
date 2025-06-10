import type { List } from '@finsweet/attributes-list';

import { queryAllElements } from '../utils/selectors';

/**
 * @returns All the accordion elements on the page.
 * @param lists The `list` instances. If provided, all the loaded accordions will also be added.
 */
export const queryAllAccordions = (lists?: List[]) => {
  const allAccordions = queryAllElements('accordion');

  if (!lists) return allAccordions;

  const allAccordionsSet = new Set(allAccordions);

  for (const list of lists) {
    for (const { element } of list.items.value) {
      const accordions = queryAllElements('accordion', { scope: element });

      for (const accordion of accordions) {
        allAccordionsSet.add(accordion);
      }
    }
  }

  return [...allAccordionsSet];
};
