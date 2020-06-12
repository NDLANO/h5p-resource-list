import './ResourceList.scss';
import resourceImage from '@assets/resources-icon.svg';
import he from 'he';

/*global H5P*/
H5P = H5P || {};
H5P.ResourceList = (function () {

    const breakPoints = [
        {
            "className": "h5p-phone-size",
            "shouldAdd": width => width <= 480
        },
        {
            "className": "h5p-medium-tablet-size",
            "shouldAdd": width => width > 480 && width < 768
        },
        {
            "className": "h5p-large-tablet-size",
            "shouldAdd": width => width >= 768 && width < 1024
        },
        {
            "className": "h5p-large-size",
            "shouldAdd": width => width >= 1024
        },
    ];

    const stripHTML = html => {
        return html ? he.decode(html) : '';
    };

    const trapKeys = (e, firstTabElement, lastTabElement, onClose) => {
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

    const sanitizeParams = params => {

        function handleObject(sourceObject) {
            return Object.keys(sourceObject).reduce((aggregated, current) => {
                aggregated[current] = stripHTML(sourceObject[current]);
                return aggregated;
            }, {})
        }

        const {
            l10n,
            resourceList,
        } = params;

        return {
            ...params,
            l10n: handleObject(l10n),
            resourceList: resourceList.map(resource => {
                const {
                    title
                } = resource;

                return {
                    ...resource,
                    title: stripHTML(title),
                };
            }),
        }
    };
    function ResourceList(params, id) {
        H5P.EventDispatcher.call(this);

        this.params = sanitizeParams(params);
        this.id = id;

        let wrapper, listContainer;
        this.container = null;

        this.firstTabElement = [];
        this.lastTabElement = [];

        this.l10n = Object.assign({
            hide: 'Hide',
            read: 'Read',
            resources: 'Resources',
            resourcesHeaderLogo: 'Resources logo',
        }, this.params.l10n);

        const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

        const createHeader = () => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('h5p-resource-list-header');

            const headerImage =  document.createElement('img');
            headerImage.setAttribute('aria-hidden', true);
            headerImage.src = resourceImage;
            headerImage.alt = this.l10n.resourcesHeaderLogo;
            wrapper.appendChild(headerImage);

            const header = document.createElement('h2');
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
            hideIcon.setAttribute('aria-hidden', true);
            hideIcon.className = "fa fa-close";
            hideContainer.appendChild(hideIcon);

            wrapper.appendChild(hideContainer);
            return wrapper;
        };

        const createBackground = () => {
            const listBackground = document.createElement('div');
            listBackground.classList.add('h5p-resource-list-bg');
            listBackground.onclick = this.onClick;

            return listBackground;
        };

        const createList = resources => {
            const resourceList = document.createElement('ul');
            resourceList.classList.add('h5p-resource-list');

            resources.map((resource, index) => {
                if (!resource.hasOwnProperty('title') || resource.title.length === 0) {
                    return;
                }
                const listElement = document.createElement('li');
                listElement.classList.add('h5p-resource-list-element');
                listElement.setAttribute('role', 'article');

                const title = document.createElement('h2');
                let labelAnchor = "title_" + index;
                title.id = labelAnchor;
                title.textContent = resource.title;
                listElement.appendChild(title);

                const contentContainer = document.createElement('div');
                if( resource.hasOwnProperty('introduction') && resource.introduction ){
                    const introduction = document.createElement('p');
                    labelAnchor = 'intro_' + index;
                    introduction.innerHTML = resource.introduction;
                    introduction.id = labelAnchor;
                    contentContainer.appendChild(introduction);
                }

                if( resource.hasOwnProperty('introductionImage') && resource.introductionImage){
                    const image = document.createElement('img');
                    image.classList.add('h5p-resource-list-introduction-image');
                    image.role = 'presentation';
                    image.tabIndex = -1;
                    image.alt = resource.title;
                    image.src = H5P.getPath(resource.introductionImage.path, this.id);
                    contentContainer.appendChild(image);
                }

                listElement.appendChild(contentContainer);

                if( resource.hasOwnProperty('url') && resource.url){
                    const link = document.createElement('a');
                    link.target = '_blank';
                    link.classList.add('h5p-resource-list-link');
                    link.href = resource.url;
                    link.text = this.l10n.read;
                    link.setAttribute('aria-labelledby', labelAnchor);

                    const readIcon = document.createElement('span');
                    readIcon.setAttribute('aria-hidden', true);
                    readIcon.className = 'fa fa-arrow-right';
                    link.appendChild(readIcon);

                    listElement.appendChild(link);
                }

                resourceList.appendChild(listElement);
            });
            return resourceList;
        };

        this.getRect = () => {
            return this.container.getBoundingClientRect();
        };

        this.resize = () => {
            if( !wrapper){
                return;
            }
            const rect = this.getRect();
            breakPoints.forEach(item => {
                if (item.shouldAdd(rect.width)) {
                    wrapper.classList.add(item.className);
                } else {
                    wrapper.classList.remove(item.className);
                }
            });
        };

        this.attach = $container => {
            this.container = $container;

            wrapper = document.createElement('div');
            wrapper.classList.add('h5p-resource-list-wrapper');

            const buttonContent = document.createElement('div');
            const headerIcon = document.createElement('img');
            headerIcon.setAttribute('aria-hidden', true);
            headerIcon.src = resourceImage;
            buttonContent.appendChild(headerIcon);

            const buttonText = document.createElement('span');
            buttonText.innerText = this.l10n.resources;
            buttonContent.appendChild(buttonText);

            const readIcon = document.createElement('span');
            readIcon.setAttribute('aria-hidden', true);
            readIcon.className = "fa fa-arrow-right";
            buttonContent.appendChild(readIcon);

            const button = document.createElement('button');
            button.type = "button";
            button.onclick = this.onClick;
            button.className = 'h5p-resource-list-button';
            button.appendChild(buttonContent);
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

        this.onClick = event => this.toggleResources(event);

        this.toggleResources = event => {
            const isActive = wrapper.classList.contains('h5p-resource-list-active');
            if( !isActive ){
                const focusableElements = Array.from(listContainer.querySelectorAll(focusableElementsString));
                wrapper.onkeydown = event => trapKeys(event, focusableElements[0], focusableElements[focusableElements.length - 1], this.toggleResources);
                listContainer.classList.remove('hidden');
                listContainer.classList.remove('slide-out');
                listContainer.classList.add('slide-in');
            } else {
                wrapper.onkeydown = () => {};
                listContainer.classList.remove('slide-in');
                listContainer.classList.add('slide-out');
                setTimeout(() => listContainer.classList.add('hidden'), 500);
            }
            wrapper.classList.toggle('h5p-resource-list-active');
        };

        H5P.$window.on('resize', this.resize.bind(this));
    }

    // Inherit prototype properties
    ResourceList.prototype = Object.create(H5P.EventDispatcher.prototype);
    ResourceList.prototype.constructor = ResourceList;

    return ResourceList;
})();