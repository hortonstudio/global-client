import { cloneNode } from '@finsweet/attributes-utils';

import type { List, ListItem } from '../components';
import { getAttribute } from '../utils/selectors';

/**
 * Inits the static items for a list.
 * @param list
 * @param staticItems
 */
export const initStaticItems = (list: List, staticItems: HTMLElement[]) => {
  const { interactiveItems, nonInteractiveItems } = staticItems.reduce<{
    interactiveItems: Array<{ position: number; item: ListItem }>;
    nonInteractiveItems: Array<{ position: number; item: ListItem; repeat?: number }>;
  }>(
    (acc, staticItem) => {
      const position = getAttribute(staticItem, 'position') - 1; // Users define positions starting from 1
      const repeat = getAttribute(staticItem, 'repeat');
      const interactive = getAttribute(staticItem, 'interactive');

      const item = list.createItem(staticItem);

      if (interactive) {
        acc.interactiveItems.push({ position, item });
      } else {
        acc.nonInteractiveItems.push({ position, item, repeat });
      }

      return acc;
    },
    { interactiveItems: [], nonInteractiveItems: [] }
  );

  interactiveItems.sort((a, b) => a.position - b.position);
  nonInteractiveItems.sort((a, b) => a.position - b.position);

  // Non-interactive items are injected before rendering
  const cleanup = list.addHook('beforeRender', (items) => {
    const newItems = [...items];

    for (const { position, item, repeat } of nonInteractiveItems) {
      newItems.splice(position, 0, item);

      if (!repeat) continue;

      let index = position + repeat;

      while (index < newItems.length) {
        const elementClone = cloneNode(item.element);
        const itemClone = list.createItem(elementClone);

        newItems.splice(index, 0, itemClone);
        index += repeat;
      }
    }

    return newItems;
  });

  // Interactive items are added as regular elements
  for (const { position, item } of interactiveItems) {
    list.items.value.splice(position, 0, item);
  }

  // Manually trigger the beforeRender hook if there are no interactive items
  // This is necessary because the beforeRender hook will not be triggered if there are no
  // mutations to the items array
  if (!interactiveItems.length) {
    list.triggerHook('beforeRender');
  }

  return cleanup;
};
