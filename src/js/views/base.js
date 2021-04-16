export const elems = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchResulutContainer: document.querySelector('.results'),
    searchPagenations: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elemStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
    <div class="${elemStrings.loader}">
            <img src="img/loader.svg#icon-cw"></img>
    </div>
    `;
    parent.insertAdjacentHTML("afterbegin", loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elemStrings.loader}`);

    if(loader){
        loader.parentElement.removeChild(loader)
    }
}