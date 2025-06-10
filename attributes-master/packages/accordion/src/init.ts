import { type FinsweetAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { initListAccordions } from './actions/list';
import { initAccordionGroup } from './factory';
import { LIST_ELEMENT_SELECTOR } from './utils/constants';
import { queryAllElements } from './utils/selectors';
import type { AccordionGroupData } from './utils/types';

export const init: FinsweetAttributeInit = async () => {
  await waitWebflowReady();

  // Get all accordions
  const accordions = queryAllElements('accordion');

  // Init all groups
  const groupsData: AccordionGroupData[] = [];

  for (const accordion of accordions) {
    initAccordionGroup(accordion, groupsData);
  }

  // Listen for List instances, if any
  const usesList = accordions.some((accordion) => accordion.closest(LIST_ELEMENT_SELECTOR));
  const listsCleanup = usesList ? await initListAccordions(groupsData) : undefined;

  // Finalize
  return {
    result: groupsData,
    destroy() {
      for (const { accordions } of groupsData) {
        for (const { controls } of accordions) controls.destroy();
      }

      listsCleanup?.();
    },
  };
};
