import Search from './models/Sesrch';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elems, renderLoader, clearLoader } from './views/base';
//Global state
//- search object
//- current recipe object
//- shopping list object
//- liked recipes
const state = {};
// Search Controller
const controlSearch = async () =>{
    //1. get query from view
    const query = searchView.getInput();
    console.log(query);
    if (query){
        //2. new search object and add to state
        state.search = new Search(query);
        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elems.searchResulutContainer);
        try{
            //4. search for recipes
            await state.search.getResults(); 
            //5. render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error){
            alert('Error processing serach');
            clearLoader();
        }
    }
}

elems.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elems.searchPagenations.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    
    if(btn){
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, gotoPage);
    }

})

// Recipe Controller
const controlRecipe = async () => {
    //Get id from url
    const id = window.location.hash.replace('#', '');

    if(id){
        //predare UI for changes
        recipeView.clearRecipe();
        renderLoader(elems.recipe);
        //highlight selected recipe
        if (state.search) searchView.selectetItemView(id);
        //create new recipe object
        state.recipe = new Recipe(id);
        try{
            //get recipe data
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients)
            state.recipe.parseIngredients();
            //calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            //render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch(error){
            alert('Error processing recipe');
            clearLoader();
        }
    }
    
}
//List controller
const controlList = () => {
    //Create a new list if there is none
    if (!state.List) state.list = new List();
    //Add each ingredient
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}   

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

//Handring delete nand update list item events
elems.shopList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //Delete
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
    } else if(e.target.matches('.shopping__count--value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

//Like controller
const controlLike = () => {
    //Create a new list if there is none
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;
    //User hasn't liked
    if (!state.likes.isLiked(currentId)){
        //Add like to the state
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
        //Toggle the like button
        likesView.toggleLikeBtn(true);
        //Add like to the UI
        likesView.renderLike(newLike);
    } else {
    //User has liked
        //Remove like from the state
        state.likes.deleteLike(currentId);
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //Remove like from the UI
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}   
//Restore likes recipe on page load
window.addEventListener('load', () =>{
    state.likes = new Likes();
    //Restore likes
    state.likes.getStrage();
    //Toggle like menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //Render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

//Handring recipe button clicks
elems.recipe.addEventListener('click', e => {
    
    if(e.target.matches('.btn--decrease, .btn--decrease *')){
        //Decrease button clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('minus')
            recipeView.updateServingsIng(state.recipe);
        }
    } else if(e.target.matches('.btn--increase, .btn--increase *')){
        //Increase button clicked
        state.recipe.updateServings('plus')
        recipeView.updateServingsIng(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredients to shopping list 
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller
        controlLike();

    }
})

