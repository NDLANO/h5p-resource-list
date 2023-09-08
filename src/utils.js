import he from 'he';

/**
 * Decode HTML from text
 * 
 * @param {string} html
 * @return {string} Plain text 
 */
const decodeHTML = (html) => {
  return html ? he.decode(html) : '';
};

/**
 * Trap keys so that the user can't tab outside the container
 * 
 * @param {KeyboardEvent} e - The keyboard event
 * @param {HTMLElement} firstTabElement - The first tab element
 * @param {HTMLElement} lastTabElement - The last tab element
 * @param {() => void} onClose - Close callback when pressing escape
 */
export const trapKeys = (e, firstTabElement, lastTabElement, onClose) => {
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstTabElement) {
        e.preventDefault();
        lastTabElement.focus();
      }
    }
    else {
      if (document.activeElement === lastTabElement) {
        e.preventDefault();
        firstTabElement.focus();
      }
    }
  }
  if (e.key === 'Escape') {
    onClose();
  }
};

/**
 * Make sure that parameters are valid
 * 
 * @param {object} params
 * @return {object} Sanitized params
 */
export const sanitizeParams = (params) => {
  function handleObject(sourceObject) {
    return Object.keys(sourceObject).reduce((aggregated, current) => {
      aggregated[current] = decodeHTML(sourceObject[current]);
      return aggregated;
    }, {});
  }

  const {
    l10n,
    resourceList,
  } = params;

  return {
    ...params,
    l10n: handleObject(l10n),
    resourceList: resourceList.map((resource) => {
      const {
        title
      } = resource;

      return {
        ...resource,
        title: decodeHTML(title),
      };
    }),
  };
};
