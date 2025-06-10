import { adjustValueToStep, isNotEmpty } from '@finsweet/attributes-utils';

import { Fill } from './components/Fill';
import { Handle } from './components/Handle';
import { getAttribute } from './utils/selectors';
import type { HandleInstances, RangeSliderSettings } from './utils/types';

/**
 * Creates {@link Handle} instances and sets them up.
 * @param settings The {@link RangeSliderSettings}.
 * @returns The new {@link Handle} instances.
 */
export const createHandleInstances = ({
  handleElements,
  inputElements,
  displayValueElements,
  formatValueDisplay,
  minRange,
  maxRange,
  trackWidth,
  step,
  precision,
  isLazy,
}: RangeSliderSettings): HandleInstances | undefined => {
  const handles = handleElements
    .slice(0, 2)
    .map((handleElement, index) => {
      const rawStartValue = parseFloat(getAttribute(handleElement, 'start') || `${index === 0 ? minRange : maxRange}`);

      let startValue = adjustValueToStep(rawStartValue, step, precision, minRange);

      const inputElement = inputElements[index];
      const displayValueElement = displayValueElements[index];

      if (startValue < minRange) {
        console.error(
          `The Handle start value [${startValue}] doesn't match the range, so it has been set to the min value [${minRange}].`
        );
        startValue = minRange;
      }

      if (startValue > maxRange) {
        console.error(
          `The Handle start value [${startValue}] doesn't match the range, so it has been set to the max value [${maxRange}].`
        );
        startValue = maxRange;
      }

      const handle = new Handle(handleElement, {
        index,
        minRange,
        maxRange,
        trackWidth,
        step,
        precision,
        startValue,
        inputElement,
        displayValueElement,
        formatValueDisplay,
        isLazy,
      });

      return handle;
    })
    .filter(isNotEmpty);

  if (!handles.length) return;

  // Sort them by start value
  if (handles.length > 1) handles.sort((handle1, handle2) => handle1.getValue() - handle2.getValue());

  const [handle1, handle2] = handles;

  // Add relationships
  if (handle2) {
    handle1.addSibling(handle2);
    handle2.addSibling(handle1);
  } else handle1.setConstraints(minRange, maxRange);

  return [handle1, handle2];
};

/**
 * Creates a `Fill` instance and adds it to the Handles.
 * @param settings The settings returned by {@link getSettings}.
 * @param handles The {@link HandleInstances} tuple.
 * @returns
 */
export const createFillInstance = (
  { fillElement, minRange, maxRange, trackWidth }: RangeSliderSettings,
  handles: HandleInstances
) => {
  if (!fillElement) return;

  const fill = new Fill(fillElement, { minRange, maxRange, trackWidth, handles });
  const [handle1, handle2] = handles;

  handle1.addFill(fill);
  handle2?.addFill(fill);
};
