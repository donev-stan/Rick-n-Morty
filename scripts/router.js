import {characters} from './services.js';

const router = Sammy('#root', function() {
    this.use('Handlebars', 'hbs');

    // Home
    this.get('/home', function(context) {
        this.partial('../templates/home.hbs');
    });

    // Characters
    this.get('/characters/:pageID', async function(context) {

        const {pageID} = context.params;
        const {info: {prev, next}, results} = await characters.getAllCharacters(pageID);
        
        context.characters = await results;
        context.previousPage = await prev ? prev.match(/\d+/).join() : null;
        context.nextPage = await next ? next.match(/\d+/).join() : null;

        this.partial('../templates/characters.hbs');
    });

    // // Characters page
    // this.get('/character?page=pageID', function(context){
    //     this.partial('../templates/characters.hbs');
    // });

    // Specific Character
    this.get('/character/:characterID', async function(context) {
        const {characterID} = context.params;
        context.character = await characters.getCharacter(characterID);

        // TO DO: design charater page

        this.partial('../templates/character.hbs');
    });


});

function extendContext(context){
    return context.loadPartials({
        header: '../templates/header.hbs'
    });
}

export default router;