# @finsweet/attributes-sliderdots

## 1.8.7

### Patch Changes

- Updated dependencies [2af0bad]
  - @finsweet/attributes-utils@0.1.0

## 1.8.6

### Patch Changes

- 378d74d: fix: unify public API under FinsweetAttributes and remove finsweetAttributes
- Updated dependencies [378d74d]
  - @finsweet/attributes-utils@0.0.6

## 1.8.5

### Patch Changes

- Updated dependencies [01973d8]
  - @finsweet/attributes-utils@0.0.5

## 1.8.4

### Patch Changes

- Updated dependencies [deef758]
  - @finsweet/attributes-utils@0.0.4

## 1.8.3

### Patch Changes

- Updated dependencies [d21cbca]
  - @finsweet/attributes-utils@0.0.3

## 1.8.2

### Patch Changes

- c7b544d: chore: updated dependencies
- Updated dependencies [c7b544d]
  - @finsweet/attributes-utils@0.0.2

## 1.8.1

### Patch Changes

- b56e5e5: rename fsAttribute in places of usage to finsweetAttribute
- Updated dependencies [b56e5e5]
  - @finsweet/attributes-utils@0.0.1

## 1.8.0

### Minor Changes

- e4b3b680: Created new `window.fsAttributes.destroy()` method to support SPA environments.
  This new method allows users to destroy all Attributes instances, cleaning up event listeners, observers, states, global variables, etc.

  Websites that use a client-side router that simulates an SPA environment like [barba.js](https://barba.js.org/) or [Swup](https://swup.js.org/) can now properly init and destroy Attributes.
  After destroying, Attributes can be manually re-initted by calling `window.fsAttribute[ATTRIBUTE_KEY].init()`.

  Updated changesets system, now all updates will be correctly reflected in [the official updates page](https://www.finsweet.com/attributes/updates).

## 1.7.1

### Patch Changes

- Updated dependencies [4792998a]
  - @global/constants@1.2.0
  - @global/factory@1.1.5

## 1.7.0

### Minor Changes

- 07f32375: Created `fs-cmsattribute` Attribute

### Patch Changes

- Updated dependencies [07f32375]
  - @global/constants@1.1.0
  - @global/factory@1.1.4

## 1.6.6

### Patch Changes

- dd4d7f61: `sliderdots`: removed cmsslider promise timeout

## 1.6.5

### Patch Changes

- Updated dependencies [7542dcdb]
  - @global/constants@1.0.2
  - @global/factory@1.1.3

## 1.6.4

### Patch Changes

- Updated dependencies [bdd1a78]
  - @global/constants@1.0.1
  - @global/factory@1.1.2

## 1.6.3

### Patch Changes

- Updated dependencies [13c3e23]
  - @global/factory@1.1.1
  - @finsweet/attributes-cmsslider@1.5.3

## 1.6.2

### Patch Changes

- Updated dependencies [627bf25]
  - @global/factory@1.1.0
  - @finsweet/attributes-cmsslider@1.5.2

## 1.6.1

### Patch Changes

- Selector for slider and slider-nav updated in Schema.

## 1.6.0

### Minor Changes

- Added support wizard and publishing new schema version

## 1.5.0

### Minor Changes

- Added support to use the native `Slider Nav` element as the container of the custom slider dots.
  The user can now completely skip adding the `fs-sliderdots-element="slider-nav"` attribute to any element.
  When this is the case, the library will use the native `Slider Nav` as a fallback.

## 1.4.1

### Patch Changes

- Added support for using `cmsslider` + `sliderdots` together.
  If both attributes are detected, now `sliderdots` will wait until `cmsslider` has finished populating all Slides before creating the Custom Slider Dots.

## 1.4.0

### Minor Changes

Included a new `window.fsAttributes.push()` method in the developer API that provides a standarized way to safely access any Attribute internals once it has fully loaded.
It can be used like:

```html
<script>
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'sliderdots',
    (sliders) => {
      console.log('Attribute has successfully loaded!');
      console.log(sliders);
    },
  ]);
</script>
```

## 1.3.0

### Minor Changes

- Added support to apply `fs-sliderdots-remove="true"` to the `fs-sliderdots-element="slider-nav"` element.
  If applied, all existing content inside the custom slider nav will be removed before appending the custom dots.
- Released `v1.3.0-beta.0`.

## 1.2.0

### Minor Changes

- Created `changesets.json` API.

## 1.1.2

### Patch Changes

- Added `initAttributes` call to make sure `window.fsAttributes` exists.

## 1.1.1

### Patch Changes

- Updated `examples.json`.

## 1.1.0

### Minor Changes

- Added `fs-sliderdots-element="slider-nav"` functionality. Now all dots will become custom dots that are synced with the original dots.

## 1.0.2

### Patch Changes

- Renamed the property in `window.fsAttributes` to the original Attribute key name.

## 1.0.1

### Patch Changes

- Implemented the `generateSelectors` util.

## 1.0.0

### Major Changes

- Created the attribute package.
