import "core-js";
import './ResourceList.scss';
import * as languages from '../language';

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

    const supportedLanguages = {en: languages.languageEn, nb: languages.languageNb};

    function ResourceList(params, id, language) {
        H5P.EventDispatcher.call(this);

        this.params = params;
        this.id = id;

        this.language = typeof language !== 'undefined' && supportedLanguages.hasOwnProperty(language) ? language : 'en';

        let wrapper, listContainer;

        this.l10n = Object.assign({
            hide: 'Hide',
            read: 'Read',
        }, supportedLanguages[this.language]);


        const createHeader = () => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('h5p-resource-list-header');

            const hideButton = document.createElement('a');
            hideButton.onclick = this.hide;
            hideButton.classList.add('h5p-resource-list-hide');
            hideButton.text = this.l10n.hide;

            wrapper.appendChild(hideButton);
            return wrapper;
        };

        const createBackground = () => {
            const listBackground = document.createElement('div');
            listBackground.classList.add('h5p-resource-list-bg');
            listBackground.onclick = this.hide;

            return listBackground;
        };

        const createList = resources => {
            const resourceList = document.createElement('ul');
            resourceList.classList.add('h5p-resource-list');

            resources.map(resource => {
                if (!resource.hasOwnProperty('title') || resource.title.length === 0) {
                    return;
                }
                const listElement = document.createElement('li');
                listElement.classList.add('h5p-resource-list-element');

                const title = document.createElement('h3');
                title.textContent = resource.title;
                listElement.appendChild(title);

                if( resource.hasOwnProperty('introductionImage')){
                    const image = document.createElement('img');
                    image.classList.add('h5p-resource-list-introduction-image');
                    image.role = 'presentation';
                    image.tabIndex = -1;
                    image.alt = resource.title;
                    image.src = H5P.getPath(resource.introductionImage.path, this.id);
                    listElement.appendChild(image);
                }

                if( resource.hasOwnProperty('introduction') ){
                    const introduction = document.createElement('p');
                    introduction.innerHTML = resource.introduction;
                    listElement.appendChild(introduction);
                }

                if( resource.hasOwnProperty('url')){
                    const link = document.createElement('a');
                    link.target = '_blank';
                    link.classList.add('h5p-resource-list-link');
                    link.href = resource.url;
                    link.onclick = event => console.log(event);
                    link.text = this.l10n.read;
                    listElement.appendChild(link);
                }

                resourceList.appendChild(listElement);
            });
            return resourceList;
        };

        this.attach = $container => {
            wrapper = document.createElement('div');
            wrapper.classList.add('h5p-resource-list-wrapper');

            listContainer = document.createElement('div');
            listContainer.classList.add('h5p-resource-list-container');

            listContainer.appendChild(createHeader());
            listContainer.appendChild(createList(this.params.resourceList));

            wrapper.appendChild(createBackground());
            wrapper.appendChild(listContainer);

            $container.appendChild(wrapper);
        };

        this.getRect = () => {
            return wrapper.getBoundingClientRect();
        };

        this.onResize = () => {
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
            wrapper.classList.add('h5p-resource-active');
            this.trigger('resize');
        };

        this.hide = () => wrapper.classList.remove('h5p-resource-active');

        this.on('resize', this.onResize);
    }

    return ResourceList;
})();