import './ResourceList.scss';
import resourceImage from '../assets/resource.svg';
import closeImage from '../assets/close.svg';
import readImage from '../assets/read.svg';

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

    function ResourceList(params, id, extra) {
        H5P.EventDispatcher.call(this);

        this.params = params;
        this.id = id;

        let wrapper, listContainer;
        this.container = null;

        this.l10n = Object.assign({
            hide: 'Hide',
            read: 'Read',
            resources: 'Resources',
        }, params.l10n);


        const createHeader = () => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('h5p-resource-list-header');

            const headerImage =  document.createElement('img');
            headerImage.setAttribute('aria-hidden', true);
            headerImage.src = resourceImage;
            wrapper.appendChild(headerImage);

            const header = document.createElement('h1');
            header.innerText = this.l10n.resources;
            wrapper.appendChild(header);

            const hideContainer = document.createElement('button');
            hideContainer.onclick = this.hide;
            hideContainer.classList.add('h5p-resource-list-hide');
            hideContainer.setAttribute('aria-labelledby', 'hideButton');

            const hideButton = document.createElement('span');
            hideButton.id = 'hideButton';
            hideButton.innerText = this.l10n.hide;
            hideContainer.appendChild(hideButton);

            const hideIcon = document.createElement('span');
            hideIcon.setAttribute('aria-hidden', true);
            hideIcon.className = 'h5p-icon';
            hideIcon.style.backgroundImage = 'url("' + closeImage + '")';
            hideContainer.appendChild(hideIcon);

            wrapper.appendChild(hideContainer);
            return wrapper;
        };

        const createBackground = () => {
            const listBackground = document.createElement('div');
            listBackground.classList.add('h5p-resource-list-bg');
            //listBackground.onclick = this.hide;

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

                const title = document.createElement('h3');
                let labelAnchor = "title_" + index;
                title.id = labelAnchor;
                title.textContent = resource.title;
                listElement.appendChild(title);

                const contentContainer = document.createElement('div');
                if( resource.hasOwnProperty('introductionImage')){
                    const image = document.createElement('img');
                    image.classList.add('h5p-resource-list-introduction-image');
                    image.role = 'presentation';
                    image.tabIndex = -1;
                    image.alt = resource.title;
                    image.src = H5P.getPath(resource.introductionImage.path, this.id);
                    contentContainer.appendChild(image);
                }

                if( resource.hasOwnProperty('introduction') ){
                    const introduction = document.createElement('p');
                    labelAnchor = 'intro_' + index;
                    introduction.innerHTML = resource.introduction;
                    introduction.id = labelAnchor;
                    contentContainer.appendChild(introduction);
                }

                listElement.appendChild(contentContainer);

                if( resource.hasOwnProperty('url')){
                    const link = document.createElement('a');
                    link.target = '_blank';
                    link.classList.add('h5p-resource-list-link');
                    link.href = resource.url;
                    link.text = this.l10n.read;
                    link.setAttribute('aria-labelledby', labelAnchor);

                    const hideIcon = document.createElement('span');
                    hideIcon.setAttribute('aria-hidden', true);
                    hideIcon.className = 'h5p-icon';
                    hideIcon.style.backgroundImage = 'url("' + readImage + '")';
                    link.appendChild(hideIcon);

                    listElement.appendChild(link);
                }

                resourceList.appendChild(listElement);
            });
            return resourceList;
        };

        this.attach = $container => {
            this.container = $container;
        };

        this.getRect = () => {
            return wrapper.getBoundingClientRect();
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

        this.show = () => {
            wrapper = document.createElement('div');
            wrapper.classList.add('h5p-resource-list-wrapper');

            listContainer = document.createElement('div');
            listContainer.classList.add('h5p-resource-list-container');

            listContainer.appendChild(createHeader());
            listContainer.appendChild(createList(this.params.resourceList));

            wrapper.appendChild(createBackground());
            wrapper.appendChild(listContainer);

            this.container.appendChild(wrapper);
            setTimeout(() => {
                wrapper.classList.add('h5p-resource-active');
                this.resize();
            }, 50);
        };

        this.hide = event => {
            if( !event.keyCode || event.keyCode === 13){
                wrapper.classList.remove('h5p-resource-active');
                setTimeout(() => this.container.removeChild(wrapper), 250);
            }
        };

        H5P.$window.on('resize', this.resize.bind(this));
    }

    // Inherit prototype properties
    ResourceList.prototype = Object.create(H5P.EventDispatcher.prototype);
    ResourceList.prototype.constructor = ResourceList;

    return ResourceList;
})();