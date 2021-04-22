import {characters, locations} from './services.js';

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

        console.log(results);

        results.origin = results.map(({origin: {name, url}}) => {
            url = url !== '' ? url.match(/\d+/)[0] : '';
            return { name, url };
        });

        console.log(results.origin);
        
        context.characters = await results;
        context.previousPage = await prev ? prev.match(/\d+/).join() : null;
        context.nextPage = await next ? next.match(/\d+/).join() : null;

        this.partial('../templates/characters.hbs');
    });

    // Specific Character
    this.get('/character/:characterID', async function(context) {
        const {characterID} = context.params;
        context.character = await characters.getCharacter(characterID);

        // TO DO: design charater page
        console.log(context.character);

        this.partial('../templates/character.hbs');
    });

    // Locations
    this.get('/locations/:pageID', async function(context) {

        const {pageID} = context.params;

        // const {info: {previous, next}, results}
        const {info: {prev, next}, results} = await locations.getAllLocations(pageID);

        context.locations = await results; 
        context.previousPage = await prev ? prev.match(/\d+/).join() : null;
        context.nextPage = await next ? next.match(/\d+/).join() : null;

        console.log(results);
        this.partial('../templates/locations.hbs');
    });

    // Specific Location
    this.get('/location/:locationID', async function(context) {

        const {locationID} = context.params;

        const result = await locations.getLocation(locationID);
        console.log(result);

        this.partial('../templates/location.hbs');
    });

});

function extendContext(context){
    return context.loadPartials({
        header: '../templates/header.hbs'
    });
}

export default router;