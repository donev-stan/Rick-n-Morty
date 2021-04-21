import {characters} from './services.js';

const router = Sammy('#root', function() {
    this.use('Handlebars', 'hbs');

    // Home
    this.get('/home', function(context) {
        this.partial('../templates/home.hbs');
    });

    // Characters
    this.get('/characters', async function(context) {

        const {info, results} = await characters.getAllCharacters();
        context.characters = await results;
        await console.log(results);
        context.status = await results.forEach(({status}) => {
            return status = Boolean(status === 'Alive');
        });

        await console.log(context.status);

        this.partial('../templates/characters.hbs');
    });

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