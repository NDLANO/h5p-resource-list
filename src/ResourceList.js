import './ResourceList.scss';
import resourceImage from '@assets/resources-icon.svg';
import { trapKeys, sanitizeParams } from './utils';

class ResourceList extends H5P.EventDispatcher {
  /**
   * @constructor
   * 
   * @param {object} params
   * @param {number} id
   */
  constructor(params, id) {
    super();

    this.params = sanitizeParams(params);
    this.id = id;

    let wrapper, listContainer;
    this.container = null;
    this.currentRatio = null;

    this.mediumTabletSurface = 'h5p-resource-list-medium-tablet';
    this.largeTabletSurface = 'h5p-resource-list-large-tablet';
    this.largeSurface = 'h5p-resource-list-large';

    this.l10n = Object.assign({
      hide: 'Hide',
      read: 'Read',
      resources: 'Resources',
      resourcesLabel: 'See additional resources to get more information',
    }, this.params.l10n);

    const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

    /**
     * Create the header for the list
     * @return {HTMLDivElement} Header element
     */
    const createHeader = () => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('h5p-resource-list-header');

      const headerImage = document.createElement('img');
      headerImage.src = resourceImage;
      headerImage.alt = ''; // Merely decorational
      wrapper.appendChild(headerImage);

      const header = document.createElement('div');
      header.classList.add('h5p-resource-list-header-text');
      header.innerText = this.l10n.resources;
      wrapper.appendChild(header);

      const hideContainer = document.createElement('button');
      hideContainer.onclick = this.onClick;
      hideContainer.classList.add('h5p-resource-list-hide');
      hideContainer.setAttribute('aria-labelledby', 'hideButton');

      const buttonText = document.createElement('span');
      buttonText.id = 'hideButton';
      buttonText.innerText = this.l10n.hide;
      hideContainer.appendChild(buttonText);

      const hideIcon = document.createElement('span');
      hideIcon.className = 'fa fa-close';
      hideContainer.appendChild(hideIcon);

      wrapper.appendChild(hideContainer);
      return wrapper;
    };

    /**
     * Create background to make a modal look of the list
     * @return {HTMLDivElement} Background element
     */
    const createBackground = () => {
      const listBackground = document.createElement('div');
      listBackground.classList.add('h5p-resource-list-bg');
      listBackground.onclick = this.onClick;

      return listBackground;
    };

    /**
     * Create the resource list
     *
     * @param {Array} resources
     * @return {HTMLUListElement} List of resources as HTML element
     */
    const createList = (resources) => {
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
        if (resource.introduction && resource.introduction) {
          const introduction = document.createElement('p');
          labelAnchor = 'intro_' + index;
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
          image.src = H5P.getPath(resource.introductionImage.path, this.id);
          contentContainer.appendChild(image);
        }

        listElement.appendChild(contentContainer);

        if (resource.url && resource.url) {
          const link = document.createElement('a');
          link.target = '_blank';
          link.classList.add('h5p-resource-list-link');
          link.href = resource.url;
          link.text = this.l10n.read;
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

    /**
     * Resize the list when the size changes
     */
    this.resize = () => {
      if (!wrapper) {
        return;
      }

      this.setWrapperClassFromRatio(wrapper);
    };

    /**
     * Attach wrapper with resource list to container
     * @param {jQuery} $container
     */
    this.attach = ($container) => {
      this.container = $container;

      wrapper = document.createElement('p');
      wrapper.classList.add('h5p-resource-list-wrapper');

      const buttonContent = document.createElement('div');
      const headerIcon = document.createElement('img');
      headerIcon.alt = ''; // Merely decorational
      headerIcon.src = resourceImage;
      buttonContent.appendChild(headerIcon);

      const buttonText = document.createElement('span');
      buttonText.innerText = this.l10n.resources;
      buttonContent.appendChild(buttonText);

      const readIcon = document.createElement('span');
      readIcon.className = 'fa fa-arrow-right';
      buttonContent.appendChild(readIcon);

      const button = document.createElement('button');
      button.type = 'button';
      button.onclick = this.onClick;
      button.className = 'h5p-resource-list-button';
      button.appendChild(buttonContent);
      button.setAttribute('aria-label', this.l10n.resourcesLabel);
      wrapper.appendChild(button);

      listContainer = document.createElement('div');
      listContainer.classList.add('h5p-resource-list-container');

      listContainer.appendChild(createHeader());
      listContainer.appendChild(createList(this.params.resourceList));
      listContainer.classList.add('hidden');

      wrapper.appendChild(createBackground());
      wrapper.appendChild(listContainer);

      this.container.appendChild(wrapper);
      setTimeout(this.resize, 0);
    };

    this.onClick = (event) => this.toggleResources(event);

    /**
     * Toggle display of resource list
     * @param event
     */
    this.toggleResources = () => {
      const isActive = wrapper.classList.contains('h5p-resource-list-active');
      if (!isActive) {
        const focusableElements = Array.from(listContainer.querySelectorAll(focusableElementsString));
        wrapper.onkeydown = (event) => trapKeys(event, focusableElements[0], focusableElements[focusableElements.length - 1], this.toggleResources);
        listContainer.classList.remove('hidden');
        listContainer.classList.remove('slide-out');
        listContainer.classList.add('slide-in');
      }
      else {
        wrapper.onkeydown = () => { };
        listContainer.classList.remove('slide-in');
        listContainer.classList.add('slide-out');
        setTimeout(() => listContainer.classList.add('hidden'), 500);
      }
      wrapper.classList.toggle('h5p-resource-list-active');
    };

    /**
     * Get the ratio of the container
     *
     * @return {number} Ratio of container width / font size
     */
    this.getRatio = () => {
      const computedStyles = window.getComputedStyle(this.container);
      return this.container.offsetWidth / parseFloat(computedStyles.getPropertyValue('font-size'));
    };

    /**
     * Add/remove classname based on the ratio
     * @param {HTMLElement} wrapper
     * @param {number} ratio
     */
    this.setWrapperClassFromRatio = (wrapper, ratio = this.getRatio()) => {
      if (ratio === this.currentRatio) {
        return;
      }
      this.breakpoints().forEach((item) => {
        if (item.shouldAdd(ratio)) {
          wrapper.classList.add(item.className);
        }
        else {
          wrapper.classList.remove(item.className);
        }
      });
      this.currentRatio = ratio;
    };

    /**
     * Get list of classname and conditions for when to add the classname to the content type
     *
     * @return {[{className: string, shouldAdd: (function(*): boolean)}, {className: string, shouldAdd: (function(*): boolean|boolean)}, {className: string, shouldAdd: (function(*): boolean)}]}
     */
    this.breakpoints = () => {
      return [
        {
          'className': this.mediumTabletSurface,
          'shouldAdd': (ratio) => ratio >= 22 && ratio < 42,
        },
        {
          'className': this.largeTabletSurface,
          'shouldAdd': (ratio) => ratio >= 42 && ratio < 60,
        },
        {
          'className': this.largeSurface,
          'shouldAdd': (ratio) => ratio >= 60,
        },
      ];
    };

    /**
     * Handle resize events
     */
    this.on('resize', () => {
      this.resize.bind(this);
    });
  }
}

H5P.ResourceList = ResourceList;
