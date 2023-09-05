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
 * @param {object} e - The event object
 * @param {object} firstTabElement - The first tab element
 * @param {object} lastTabElement - The last tab element
 * @param {function} onClose - The function to run when the ESC key is pressed
 */
export const trapKeys = (e, firstTabElement, lastTabElement, onClose) => {
  if (e.keyCode === 9) {
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
  if (e.keyCode === 27) {
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
