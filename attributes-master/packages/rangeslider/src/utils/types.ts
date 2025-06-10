import type { getSettings } from '../actions/settings';
import type { Handle } from '../components/Handle';

export type HandleInstances = [Handle, Handle | undefined];

export type RangeSliderSettings = NonNullable<ReturnType<typeof getSettings>>;
