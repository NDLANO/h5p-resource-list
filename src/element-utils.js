import resourceImage from '@assets/resources-icon.svg';

/**
   * Create the header for the list
   * @param {object} l10n - Localization object
   * @param {() => void} toggleResources - Toggle resources callback
   * @return {HTMLDivElement} Header element
   */
export const createHeader = (l10n, toggleResources) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('h5p-resource-list-header');

  const headerImage = document.createElement('img');
  headerImage.className = 'h5p-resource-list-header-image';
  headerImage.src = resourceImage;
  headerImage.alt = ''; // Merely decorational
  wrapper.appendChild(headerImage);

  const header = document.createElement('div');
  header.classList.add('h5p-resource-list-header-text');
  header.innerText = l10n.resources;
  wrapper.appendChild(header);

  const hideContainer = document.createElement('button');
  hideContainer.addEventListener('click', toggleResources);
  hideContainer.classList.add('h5p-resource-list-hide');
  hideContainer.setAttribute('aria-labelledby', 'hideButton');

  const buttonText = document.createElement('span');
  buttonText.className = 'h5p-resource-list-hide-text';
  buttonText.id = 'hideButton';
  buttonText.innerText = l10n.hide;
  hideContainer.appendChild(buttonText);

  const hideIcon = document.createElement('span');
  hideIcon.className = 'fa fa-close';
  hideContainer.appendChild(hideIcon);

  wrapper.appendChild(hideContainer);
  return wrapper;
};

/**
 * Create background to make a modal look of the list
 * @param {() => void} toggleResources - Toggle resources callback
 * @return {HTMLDivElement} Background element
 */
export const createBackground = (toggleResources) => {
  const listBackground = document.createElement('div');
  listBackground.classList.add('h5p-resource-list-bg');
  listBackground.addEventListener('click', toggleResources);

  return listBackground;
};

/**
 * Create the resource list
 * 
 * @param {Array} resources
 * @return {HTMLUListElement} List of resources as HTML element
 */
export const createList = (contentId, l10n, resources) => {
  const resourceList = document.createElement('ul');
  resourceList.classList.add('h5p-resource-list');

  resources.map((resource, index) => {
    if (!resource.title || resource.title.length === 0) {
      return;
    }
    const listElement = document.createElement('li');
    listElement.classList.add('h5p-resource-list-element');
    listElement.setAttribute('role', 'article');

    const title = document.createElement('div');
    title.classList.add('h5p-resource-list-title');
    let labelAnchor = 'title_' + index;
    title.id = labelAnchor;
    title.textContent = resource.title;
    listElement.appendChild(title);

    const contentContainer = document.createElement('div');
    contentContainer.className = 'h5p-resource-list-content';

    if (resource.introduction && resource.introduction) {
      const introduction = document.createElement('p');
      labelAnchor = 'intro_' + index;
      introduction.className = 'h5p-resource-list-introduction';
      introduction.innerHTML = resource.introduction;
      introduction.id = labelAnchor;
      contentContainer.appendChild(introduction);
    }

    if (resource.introductionImage && resource.introductionImage) {
      const image = document.createElement('img');
      image.classList.add('h5p-resource-list-introduction-image');
      image.role = 'presentation';
      image.tabIndex = -1;
      image.alt = resource.title;
      image.src = H5P.getPath(resource.introductionImage.path, contentId);
      contentContainer.appendChild(image);
    }

    listElement.appendChild(contentContainer);

    if (resource.url && resource.url) {
      const link = document.createElement('a');
      link.target = '_blank';
      link.classList.add('h5p-resource-list-link');
      link.href = resource.url;
      link.text = l10n.read;
      link.setAttribute('aria-labelledby', labelAnchor);

      const readIcon = document.createElement('span');
      readIcon.className = 'fa fa-arrow-right';
      link.appendChild(readIcon);

      listElement.appendChild(link);
    }

    resourceList.appendChild(listElement);
  });
  return resourceList;
};
