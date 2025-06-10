/**
 * CSS string to be injected into the head of the document.
 */
const cssString = `
.copied-text::before {
  content: "";
  color: black;
  position: absolute;
  top: -1.8rem;
  visibility: hidden;
  opacity: 0;
  background-color: white;
  padding: 0rem 0.2rem;
  border-radius: 0.15rem;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 0.8rem;
  font-weight: 500;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

.copied-text.copied-visible::before {
  visibility: visible;
  opacity: 1;
  content: "Copied!";
  transition-delay: 0s;
}

.copied-text{
  position: relative;
}
`;

/**
 * Injects the specified CSS into the head of the document.
 * @param cssString - The CSS string to be injected.
 */
const injectCSS = (cssString: string): void => {
  const style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = cssString;

  document.head.appendChild(style);
};

/**
 * Enable an element by setting its pointer events to auto and toggle the copied text.
 * @param element - The element to enable.
 * @param textToShow - The text to show after copying.
 * @returns
 */
const enableElement = (element: HTMLElement, textToShow = '') => {
  const { textContent } = element;

  if (textToShow) {
    const buttonText = element.querySelector('.button_text');

    if (buttonText) buttonText.textContent = textToShow;
    else element.textContent = textToShow;

    setTimeout(() => {
      if (buttonText) buttonText.textContent = textContent;
      else element.textContent = textContent;

      element.style.pointerEvents = 'auto';
    }, 1000);

    return;
  }

  element.style.pointerEvents = 'auto';
  element.classList.add('copied-visible');

  setTimeout(() => {
    element.classList.remove('copied-visible');
    element.style.pointerEvents = 'auto';
  }, 1000);
};

/**
 * Disable an element by setting its pointer events to none.
 * @param element - The element to disable.
 */
const disableElement = (element: HTMLElement) => {
  element.style.pointerEvents = 'none';
};

/**
 * Copy the text to the clipboard.
 * @param text - The text to copy.
 * @param element - The element to enable after copying.
 * @param textToShow - The text to show after copying.
 */
const copy = (text: string, element: HTMLElement, textToShow = '') => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      enableElement(element, textToShow);
    })
    .catch((err) => {
      console.error('Failed to copy text: ', err);
      enableElement(element, textToShow);
    });
};

/**
 * Copy the Finsweet Attributes Script to the clipboard.
 * @param element - trigger element
 * @param scriptString - script string
 * @param textToShow - text to show after copying
 * @returns
 */
const copyScript = (scriptString: string | null, element: HTMLElement, textToShow = '') => {
  if (!navigator.clipboard || !scriptString) {
    console.error('Clipboard API not available.');

    return;
  }

  const attributes = extractAttributes(scriptString);
  disableElement(element);

  const text = `<!-- Finsweet Attributes -->\n<script async type="module"${attributes}\n></script>`;

  // copy
  copy(text, element, textToShow);
};

/**
 * Copy the Finsweet Attributes Text to the clipboard.
 * @param content - attribute name or value
 * @param element - trigger element
 * @param textToShow - text to show after copying
 * @returns
 */
const copyText = (content: string, element: HTMLElement, textToShow = '') => {
  if (!navigator.clipboard || !content) {
    console.error('Clipboard API not available.');

    return;
  }

  disableElement(element);

  // copy
  copy(content.trim(), element, textToShow);
};

/**
 * Reformat a script tag string with each attribute on a new line using DOMParser.
 * @param scriptString - The script tag as a string.
 * @returns The reformatted attributes.
 */
const extractAttributes = (scriptString: string): string => {
  const parser = new DOMParser();

  const doc = parser.parseFromString(scriptString, 'text/html');
  const scriptElement = doc.querySelector('script');

  if (!scriptElement) return '';

  let attributes = ``;

  // handle 'src' or any other attributes on new lines
  const otherAttributes = Array.from(scriptElement.attributes).filter((attr) => !['async', 'type'].includes(attr.name));

  for (const attr of otherAttributes) {
    attributes += `\n${attr.name}`;
    if (attr.value) {
      attributes += `="${attr.value.trim()}"`;
    }
  }

  return attributes;
};

/**
 * Find the closest target element
 * @param element
 * @returns
 */
const findClosestTarget = (element: HTMLElement): HTMLElement | null => {
  let currentNode: HTMLElement | null = element;

  while (currentNode) {
    // Check all children of current node for target
    const target = currentNode.querySelector<HTMLElement>('[fs-docs-copy="target"]');
    if (target) return target;

    // Move up to parent node
    currentNode = currentNode.parentElement;
  }

  return null;
};

/**
 * Handle the trigger element click event.
 * @param element - The trigger element that was clicked
 * @returns void
 */
const handleTrigger = (element: HTMLElement): void => {
  const instance = element.getAttribute('fs-docs-instance');
  let target: HTMLElement | null = null;

  if (instance) {
    target = document.querySelector<HTMLElement>(`[fs-docs-copy="target"][fs-docs-instance="${instance}"]`);
  } else {
    // If no instance match, look up the DOM tree and find closest target
    target = findClosestTarget(element);
  }

  if (!target) return;

  const { textContent } = target;

  if (!textContent) return;

  // if script tag, check for 'src' attribute
  if (textContent.includes('script') && textContent.includes('src="')) {
    copyScript(textContent, element, 'Copied');
    return;
  }

  copyText(textContent, element, 'Copied');
};

/**
 * Add click event listener to elements.
 * @param elements
 * @param callback
 */
const addClickListener = (elements: NodeListOf<HTMLElement>, callback: (el: HTMLElement) => void) => {
  elements.forEach((el) => {
    el.classList.add('copied-text');

    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      callback(el);
    });
  });
};

// DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  // Inject the CSS into the <head>
  injectCSS(cssString);

  // Get all trigger elements
  const triggers = document.querySelectorAll<HTMLElement>('[fs-docs-copy="trigger"]');
  addClickListener(triggers, handleTrigger);

  // Get all text content triggers
  const textContentTriggers = document.querySelectorAll<HTMLElement>('[fs-docs-copy="text-content"]');
  addClickListener(textContentTriggers, (el) => {
    if (el.textContent) copyText(el.textContent, el);
  });
});
