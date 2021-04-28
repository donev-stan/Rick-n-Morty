import { characters, locations, episodes, configureCharactersURL, configureLocationsURL, configureEpisodesURL } from "./services.js";

const router = Sammy("#root", function () {
    this.use("Handlebars", "hbs");

    let searchQuery = '';
    let isSearching = false;

    // Home
    this.get("/", function (context) {
        searchQuery = '';
        this.partial("../templates/home.hbs");
    });

    this.get("/home", function (context) {
        searchQuery = '';
        this.partial("../templates/home.hbs");
    });


    // Characters
    this.get("/characters/:pageID", async function (context) {
        let { pageID, characterName, status, gender } = context.params;

        // Logic to figure out if user is searching
        if (characterName, status, gender) isSearching = true;

        const { url, returnedSearchQuery } = configureCharactersURL({ pageID, characterName, status, gender });
        
        if (isSearching) {
            searchQuery = returnedSearchQuery;
            isSearching = false;
        }

        const { info, results } = await characters.getCharacters(url + searchQuery);

        // Getting indexes only form URLs
        Object.entries(results).map(([id, { location, origin }]) => {
            origin.url = extractIDs(origin.url);
            location.url = extractIDs(location.url);
        });

        // Attach characters to the context
        context.characters = results;

        loadPageNavigation(context, info, "characters").then(function () {
            this.partial("../templates/characters/characters.hbs");
        });
    });

    // Specific Character
    this.get("/character/:characterID", async function (context) {
        const { characterID } = context.params;
        const character = await characters.getCharactersByID(characterID);

        // Getting indexes only form URLs
        character.origin.url = extractIDs(character.origin.url);
        character.location.url = extractIDs(character.location.url);
        const episodeIDs = extractIDs(character.episode);
        const characterEpisodes = await episodes.getEpisodesByID(episodeIDs);

        // Check
        if (episodeIDs.length === 0) { // if theres any episodes
            context.episodes = false;
        } else if (episodeIDs.length === 1){ // if it's only one episode
            const arr = []; // if so, create an array
            arr.push(characterEpisodes); // push object to it
            context.episodes = arr; // attach it to the context so handlebars can read it
        } else {
            context.episodes = characterEpisodes;
        }

        context.character = await character;
        this.partial("../templates/characters/character.hbs");
    });

    // Locations
    this.get("/locations/:pageID", async function (context) {
        const { pageID, locationName, type, dimension } = context.params;

        if (locationName !== '' || type || dimension) isSearching = true;

        const { url, returnedSearchQuery } = configureLocationsURL({ pageID, locationName, type, dimension });

        if (isSearching) {
            searchQuery = returnedSearchQuery;
            isSearching = false;
        }
        
        console.log(url + searchQuery);
        const { info, results } = await locations.getLocations(url + searchQuery);

        context.locations = await results;

        loadPageNavigation(context, info, "locations").then(function () {
            this.partial("../templates/locations/locations.hbs");
        });
    });

   
    // Specific Location
    this.get("/location/:locationID", async function (context) {
        const { locationID } = context.params;

        const location = await locations.getLocationsByID(locationID);

        const residentsIDs = extractIDs(location.residents);
        const residentCharacters = await characters.getCharactersByID(residentsIDs);
        
        // Check 
        if (residentsIDs.length === 0) { // if there are no residents present
            context.residents = false;
        } else if (residentsIDs.length === 1) { // if theres only one resident
            const arr = []; // create an array
            arr.push(residentCharacters); // and push the only object to it
            context.residents = arr; // so handlebars can read it
        } else {
            context.residents = residentCharacters; // else do as normal: [{}, {}, {}...]
        }

        context.location = location;
        this.partial("../templates/locations/location.hbs");
    });

    // Episodes
    this.get("/episodes/:pageID", async function(context) {
        const { pageID, episodeName, episodeCode } = context.params;

        if (episodeName !== '' || episodeCode !== '') isSearching = true;

        const { url, returnedSearchQuery } = configureEpisodesURL({ pageID, episodeName, episodeCode });

        if (isSearching) {
            searchQuery = returnedSearchQuery;
            isSearching = false;
        }

        const { info, results } = await episodes.getEpisodes(url + searchQuery);

        context.episodes = results;
        loadPageNavigation(context, info, "episodes").then(function () {
            this.partial("../templates/episodes/episodes.hbs");
        });
    });

    // Specific Episode
    this.get('/episode/:episodeID', async function(context) {
        const { episodeID } = context.params;
        const episode = await episodes.getEpisodesByID(episodeID);

        const characterIDs = extractIDs(episode.characters);
        const episodeCharacters = await characters.getCharactersByID(characterIDs);

        context.episode = episode;
        context.episodeCharacters = episodeCharacters;

        this.partial('../templates/episodes/episode.hbs');
    });

});

function loadPageNavigation(context, { prev, next }, endpoint) {
    // Configure page urls
    context.previousPage = prev ? `/${endpoint}/` + prev.match(/\d+/)[0] : null;
    context.nextPage = next ? `/${endpoint}/` + next.match(/\d+/)[0] : null;
    
    // If theres no more than one page - don't show page navigation
    if (!prev && !next) context.isMorePages = false;
    else context.isMorePages = true;

    return context.loadPartials({
        pageNavigation: "../templates/common/pageNavigation.hbs",
    });
}

function extractIDs(endpoints){
    if (typeof(endpoints) === 'string') {
        return endpoints !== '' ? endpoints.match(/\d+/)[0] : '';
    } 

    if (typeof(endpoints) === 'object') {
        return endpoints.map(endpoint => (endpoint ? endpoint.match(/\d+/)[0] : null));
    }
}

export default router;