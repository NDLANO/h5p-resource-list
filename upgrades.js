var H5PUpgrades = H5PUpgrades || {};

/**
 * Upgrades for the Resource List content type.
 */
H5PUpgrades['H5P.ResourceList'] = (() => {
  return {
    1: {
      /**
       * Asynchronous content upgrade hook.
       * Upgrades internal image widget to Image 1.1.
       * @param {object} parameters Content parameters.
       * @param {function} finished Callback when finished.
       * @param {object} extras Extra parameters such as metadata, etc.
       */
      1: (parameters, finished, extras) => {
        if (Array.isArray(parameters?.resourceList)) {
          parameters.resourceList = parameters.resourceList.map((item) => {
            if (item.introductionImage?.path) {
              item.introductionImage = {
                library: 'H5P.Image 1.1',
                params: {
                  alt: '',
                  decorative: true,
                  file: item.introductionImage,
                },
                subcontentId: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
                  const random = Math.random() * 16 | 0, newChar = char === 'x' ? random : (random & 0x3 | 0x8);
                  return newChar.toString(16);
                }),
              };
              return item;
            }

            return item;
          });
        }

        finished(null, parameters, extras);
      },
    },
  };
})();
