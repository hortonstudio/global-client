import { extractCommaSeparatedValues } from '@finsweet/attributes-utils';
import { effect } from '@vue/reactivity';

import type { List } from '../components';
import { listInstancesStore } from '../utils/store';

/**
 * Initializes the list combine feature.
 * @param targetList The target list.
 * @param rawSourceInstances A comma-separated list of source instances.
 * @returns A cleanup function.
 */
export const initListCombine = (targetList: List, rawSourceInstances: string) => {
  const sourceInstances = extractCommaSeparatedValues(rawSourceInstances);

  const sourceLists = [...listInstancesStore.values()].filter(
    (list) => list !== targetList && list.instance && sourceInstances.includes(list.instance)
  );

  if (!sourceLists.length) return;

  const cleanups = sourceLists.map((sourceList) => {
    const runner = effect(() => {
      if (!sourceList.items.value.length) return;

      const elements = sourceList.items.value.map((item) => targetList.createItem(item.element));

      sourceList.items.value = [];
      targetList.items.value = [...targetList.items.value, ...elements];
    });

    return () => runner.effect.stop();
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
};
