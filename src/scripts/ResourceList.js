import './ResourceList.scss';
import { trapKeys, sanitizeParams } from '@scripts/utils.js';
import { createHeader, createBackground, createList } from '@scripts/element-utils.js';

export default class ResourceList extends H5P.EventDispatcher {
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

    this.wrapper = null;
    this.listContainer = null;
    this.button = null;
    this.container = null;
    this.currentRatio = null;

    this.mediumTabletSurface = 'h5p-resource-list-medium-tablet';
    this.largeTabletSurface = 'h5p-resource-list-large-tablet';
    this.largeSurface = 'h5p-resource-list-large';

    this.l10n = Object.assign({
      hide: 'Hide',
      resources: 'Resources',
      resourcesLabel: 'See additional resources to get more information',
    }, this.params.l10n);

    /**
     * Handle resize events
     */
    this.on('resize', () => {
      this.resize.bind(this);
    });
  }

  /**
   * Resize the list when the size changes
   */
  resize() {
    if (!this.wrapper) {
      return;
    }

    this.setWrapperClassFromRatio(this.wrapper);
  }

  /**
     * Attach wrapper with resource list to container
     * @param {jQuery} $container
     */
  attach($container) {
    this.container = $container;

    this.wrapper = document.createElement('p');
    this.wrapper.classList.add('h5p-resource-list-wrapper');

    const buttonContent = document.createElement('div');
    buttonContent.className = 'h5p-resource-list-button-content';

    const headerIcon = document.createElement('span');
    headerIcon.className = 'h5p-resource-list-button-icon';
    headerIcon.setAttribute('aria-hidden', 'true');
    buttonContent.appendChild(headerIcon);

    const buttonText = document.createElement('span');
    buttonText.className = 'h5p-resource-list-button-text';
    buttonText.innerText = this.l10n.resources;
    buttonContent.appendChild(buttonText);

    const readIcon = document.createElement('span');
    readIcon.className = 'fa fa-arrow-right';
    buttonContent.appendChild(readIcon);

    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.addEventListener('click', this.toggleResources.bind(this));
    this.button.className = 'h5p-resource-list-button';
    this.button.appendChild(buttonContent);
    this.button.setAttribute('aria-label', this.l10n.resourcesLabel);
    this.wrapper.appendChild(this.button);

    this.listContainer = document.createElement('div');
    this.listContainer.classList.add('h5p-resource-list-container');
    this.listContainer.setAttribute('role', 'dialog');
    this.listContainer.setAttribute('aria-modal', 'true');

    // Make sure dialog is properly labeled
    const listContainerLabelId = H5P.createUUID() + '-label';
    this.listContainer.setAttribute('aria-labelledby', listContainerLabelId);

    this.listContainer.appendChild(createHeader(this.l10n, listContainerLabelId, this.toggleResources.bind(this)));
    this.listContainer.appendChild(createList(this.id, this.l10n, this.params.resourceList));
    this.listContainer.classList.add('hidden');

    this.wrapper.appendChild(createBackground(this.toggleResources.bind(this)));
    this.wrapper.appendChild(this.listContainer);

    this.container.appendChild(this.wrapper);
    setTimeout(this.resize(), 0);
  }

  /**
   * Toggle display of resource list
   */
  toggleResources() {
    const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

    const isActive = this.wrapper.classList.contains('h5p-resource-list-active');
    if (isActive) {
      this.wrapper.onkeydown = () => { };
      this.listContainer.classList.remove('slide-in');
      this.listContainer.classList.add('slide-out');
      setTimeout(() => this.listContainer.classList.add('hidden'), 500);
      this.button.focus(); // Set focus on the resource list button
    }
    else {
      const focusableElements = Array.from(this.listContainer.querySelectorAll(focusableElementsString));
      this.wrapper.onkeydown = (event) => trapKeys(event, focusableElements[0], focusableElements[focusableElements.length - 1], this.toggleResources.bind(this));
      this.listContainer.classList.remove('hidden');
      this.listContainer.classList.remove('slide-out');
      this.listContainer.classList.add('slide-in');
      // Wait for the animation to finish before focusing the first element
      setTimeout(() => focusableElements[0].focus(), 500);
    }
    this.wrapper.classList.toggle('h5p-resource-list-active');
  }

  /**
   * Get the ratio of the container
   *
   * @return {number} Ratio of container width / font size
   */
  getRatio() {
    const computedStyles = window.getComputedStyle(this.container);
    return this.container.offsetWidth / parseFloat(computedStyles.getPropertyValue('font-size'));
  }

  /**
   * Add/remove classname based on the ratio
   * @param {HTMLElement} wrapper
   * @param {number} ratio
   */
  setWrapperClassFromRatio(wrapper, ratio = this.getRatio()) {
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
  }

  /**
   * Get list of classname and conditions for when to add the classname to the content type
   *
   * @return {{className: string, shouldAdd: (ratio: number) => boolean}[]}
   */
  breakpoints() {
    return [
      {
        className: this.mediumTabletSurface,
        shouldAdd: (ratio) => ratio >= 22 && ratio < 42,
      },
      {
        className: this.largeTabletSurface,
        shouldAdd: (ratio) => ratio >= 42 && ratio < 60,
      },
      {
        className: this.largeSurface,
        shouldAdd: (ratio) => ratio >= 60,
      },
    ];
  }
}

H5P.ResourceList = ResourceList;