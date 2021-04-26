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
        // if (context.path === '/characters/1') searchQuery = '';

        console.log(url + searchQuery);
        const { info, results } = await characters.getCharacters(url + searchQuery);

        // Getting indexes only form URLs
        Object.entries(results).map(([id, { location, origin }]) => {
            origin.url = origin.url != "" 
                ? origin.url.match(/\d+/)[0] 
                : "";

            location.url =
                location.url != "" 
                    ? location.url.match(/\d+/)[0] 
                    : "";
        });

        // Attach characters to the context
        context.characters = results;
        console.log(results);

        loadPageNavigation(context, info, "characters").then(function () {
            this.partial("../templates/Characters/characters.hbs");
        });
    });

    // Specific Character
    this.get("/character/:characterID", async function (context) {
        const { characterID } = context.params;
        const character = await characters.getCharactersByID(characterID);

        // Getting indexes only form URLs
        character.origin.url =
            character.origin.url != ""
                ? character.origin.url.match(/\d+/)[0]
                : "";
        character.location.url =
            character.location.url != ""
                ? character.location.url.match(/\d+/)[0]
                : "";
        const episodeIDs = 
            character.episode.map(episode => episode.match(/\d+/)[0]);

        context.episodes = await episodes.getEpisodesByID(episodeIDs);
        context.character = await character;
        this.partial("../templates/Characters/character.hbs");
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
        if (context.path === '/locations/1') searchQuery = '';
        
        console.log(url + searchQuery);
        const { info, results } = await locations.getLocations(url + searchQuery);

        context.locations = await results;

        loadPageNavigation(context, info, "locations").then(function () {
            this.partial("../templates/Locations/locations.hbs");
        });
    });

    // Specific Location
    this.get("/location/:locationID", async function (context) {
        const { locationID } = context.params;

        const location = await locations.getLocationsByID(locationID);

        const residentsIDs = location.residents.map(resident => (resident ? resident.match(/\d+/)[0] : null));

        const results = await characters.getCharactersByID(residentsIDs);

        // // Getting indexes only form URLs
        // Object.entries(results).map(([id, { location, origin }]) => {
        //     origin.url = origin.url != "" 
        //         ? origin.url.match(/\d+/)[0] 
        //         : "";

        //     location.url =
        //         location.url != "" 
        //             ? location.url.match(/\d+/)[0] 
        //             : "";
        // });
        
        // Check if a single character is returned
        if (!results.length) {
            const arr = [];
            arr.push(results);
            context.residents = arr;
        } else {
            context.residents = results;
        }

        context.location = location;
        this.partial("../templates/Locations/location.hbs");
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
        if (context.path === '/episodes/1') searchQuery = '';

        const { info, results } = await episodes.getEpisodes(url + searchQuery);

        context.episodes = results;
        loadPageNavigation(context, info, "episodes").then(function () {
            this.partial("../templates/Episodes/episodes.hbs");
        });
    });

});

function loadPageNavigation(context, { prev, next }, endpoint) {
    context.previousPage = prev ? `/${endpoint}/` + prev.match(/\d+/)[0] : null;
    context.nextPage = next ? `/${endpoint}/` + next.match(/\d+/)[0] : null;
    
    if (!prev && !next) context.isMorePages = false;
    else context.isMorePages = true;

    return context.loadPartials({
        pageNavigation: "../templates/pageNavigation.hbs",
    });
}

export default router;