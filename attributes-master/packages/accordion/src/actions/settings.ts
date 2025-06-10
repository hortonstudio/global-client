import { extractCommaSeparatedValues, isKeyOf, isNotEmpty, parseNumericAttribute } from '@finsweet/attributes-utils';

import { SETTINGS } from '../utils/constants';
import { getAttribute, hasAttributeValue, queryElement } from '../utils/selectors';
import type { AccordionGroupData, InitialState } from '../utils/types';

/**
 * Collects a group's settings.
 * @param group
 * @returns A new {@link AccordionGroupData} object.
 */
export const getGroupSettings = (group: HTMLElement): AccordionGroupData => {
  const single = hasAttributeValue(group, 'single', 'true');
  const rawInitial = getAttribute(group, 'initial');
  const activeClass = getAttribute(group, 'activeclass');

  let initial: InitialState;

  if (rawInitial) {
    if (isKeyOf(rawInitial, SETTINGS.initial.values)) {
      initial = rawInitial;
    } else {
      const rawInitialValues = extractCommaSeparatedValues(rawInitial);
      initial = rawInitialValues.map(parseNumericAttribute).filter(isNotEmpty);
    }
  }

  return { group, single, initial, activeClass, accordions: [] };
};

/**
 * @returns An accordion's settings.
 * @param accordion
 * @param groupData
 */
export const getAccordionSettings = (accordion: HTMLElement, groupData: AccordionGroupData) => {
  const scope = accordion;
  const trigger = queryElement('trigger', { scope });
  const content = queryElement('content', { scope });
  const arrow = queryElement('arrow', { scope });

  if (!trigger || !content) return;

  const groupActiveClass = groupData.activeClass;
  const accordionActiveClass = getAttribute(accordion, 'activeclass');
  const triggerActiveClass = getAttribute(trigger, 'activeclass');
  const contentActiveClass = getAttribute(content, 'activeclass');
  const arrowActiveClass = arrow ? getAttribute(arrow, 'activeclass') : null;

  return {
    accordion,
    trigger,
    content,
    arrow,
    groupActiveClass,
    accordionActiveClass,
    triggerActiveClass,
    contentActiveClass,
    arrowActiveClass,
  };
};
