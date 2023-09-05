import he from 'he';

/**
 * Strip HTML from text
 * @param html
 * @return {*} Plain text 
 */
const decodeHTML = (html) => {
  return html ? he.decode(html) : '';
};

/**
 * Trap keys so that the user can't tab outside the container
 * @param e
 * @param firstTabElement
 * @param lastTabElement
 * @param onClose
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
 * @param params
 * @return {object}
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
