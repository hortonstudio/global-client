# @finsweet/attributes-smartlightbox

## 1.7.7

### Patch Changes

- Updated dependencies [2af0bad]
  - @finsweet/attributes-utils@0.1.0

## 1.7.6

### Patch Changes

- Updated dependencies [378d74d]
  - @finsweet/attributes-utils@0.0.6

## 1.7.5

### Patch Changes

- Updated dependencies [01973d8]
  - @finsweet/attributes-utils@0.0.5

## 1.7.4

### Patch Changes

- Updated dependencies [deef758]
  - @finsweet/attributes-utils@0.0.4

## 1.7.3

### Patch Changes

- Updated dependencies [d21cbca]
  - @finsweet/attributes-utils@0.0.3

## 1.7.2

### Patch Changes

- c7b544d: chore: updated dependencies
- Updated dependencies [c7b544d]
  - @finsweet/attributes-utils@0.0.2

## 1.7.1

### Patch Changes

- b56e5e5: rename fsAttribute in places of usage to finsweetAttribute
- Updated dependencies [b56e5e5]
  - @finsweet/attributes-utils@0.0.1

## 1.7.0

### Minor Changes

- e4b3b680: Created new `window.fsAttributes.destroy()` method to support SPA environments.
  This new method allows users to destroy all Attributes instances, cleaning up event listeners, observers, states, global variables, etc.

  Websites that use a client-side router that simulates an SPA environment like [barba.js](https://barba.js.org/) or [Swup](https://swup.js.org/) can now properly init and destroy Attributes.
  After destroying, Attributes can be manually re-initted by calling `window.fsAttribute[ATTRIBUTE_KEY].init()`.

  Updated changesets system, now all updates will be correctly reflected in [the official updates page](https://www.finsweet.com/attributes/updates).

## 1.6.6

### Patch Changes

- Updated dependencies [4792998a]
  - @global/constants@1.2.0
  - @global/factory@1.1.5

## 1.6.5

### Patch Changes

- Updated dependencies [07f32375]
  - @global/constants@1.1.0
  - @global/factory@1.1.4

## 1.6.4

### Patch Changes

- Updated dependencies [7542dcdb]
  - @global/constants@1.0.2
  - @global/factory@1.1.3

## 1.6.3

### Patch Changes

- Updated dependencies [bdd1a78]
  - @global/constants@1.0.1
  - @global/factory@1.1.2

## 1.6.2

### Patch Changes

- Updated dependencies [13c3e23]
  - @global/factory@1.1.1

## 1.6.1

### Patch Changes

- Updated dependencies [627bf25]
  - @global/factory@1.1.0

## 1.6.0

### Minor Changes

- Added support wizard and publishing new schema version

## 1.5.0

### Minor Changes

Included a new `window.fsAttributes.push()` method in the developer API that provides a standarized way to safely access any Attribute internals once it has fully loaded.
It can be used like:

```html
<script>
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'smartlightbox',
    () => {
      console.log('Attribute has successfully loaded!');
    },
  ]);
</script>
```

## 1.4.2

### Patch Changes

- Fixed small issue when querying the triggers after the new attributes renaming.

## 1.4.1

### Patch Changes

- Updated `schema.json` descriptions with the new attributes naming.

## 1.4.0

### Minor Changes

- Renamed the package from `untransform` to `smartlightbox`. This implies that:

  - This update is published under a new NPM Package `@finsweet/attributes-smartlightbox`, and the previous `@finsweet/attributes-untransform` will be kept for backwards compatibility.
  - Users currently using the `untransform` package won't be affected by this update and their sites will continue working as expected.
  - If users want to receive any new updates of the package, they will have to switch to this new one. The old `untransform` package won't receive any more updates, but will be classified as [Long-term support (LTS)](https://en.wikipedia.org/wiki/Long-term_support).

- Renamed attributes to accomodate the new package:

  - `fs-untransform-element="fixed"` => `fs-smartlightbox-element="lightbox"`
  - `fs-untransform-element="trigger-on"` => `fs-smartlightbox-element="trigger-open"`
  - `fs-untransform-element="trigger-off"` => `fs-smartlightbox-element="trigger-close"`
  - `fs-untransform-element="toggle"` => `fs-smartlightbox-element="trigger-toggle"`
  - `fs-untransform-timeout="TIMEOUT_VALUE"` => `fs-smartlightbox-wait="TIME_IN_MS"`

- Updated the copy/paste examples with the new attributes.

## 1.2.0

### Minor Changes

- Released `v1.2.0-beta`.

## 1.1.0

### Minor Changes

- Created `changesets.json` API.

## 1.0.8

### Patch Changes

- Added `initAttributes` call to make sure `window.fsAttributes` exists.

## 1.0.7

### Patch Changes

- Updated `examples.json`.

## 1.0.6

### Patch Changes

- Implemented the `generateSelectors` util.

## 1.0.0

### Major Changes

- Created the attribute package.
