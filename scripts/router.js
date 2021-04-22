import { characters, locations } from "./services.js";

const router = Sammy("#root", function () {
    this.use("Handlebars", "hbs");

    // Home
    this.get("/", function (context) {
        this.partial("../templates/home.hbs");
    });

    this.get("/home", function (context) {
        this.partial("../templates/home.hbs");
    });

    // Characters
    this.get("/characters/:pageID", async function (context) {
        const { pageID } = context.params;
        const { info, results } = await characters.getAllCharacters(pageID);

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

        context.characters = await results;

        loadPageNavigation(context, info, "characters").then(function () {
            this.partial("../templates/characters.hbs");
        });
    });

    // Specific Character
    this.get("/character/:characterID", async function (context) {
        const { characterID } = context.params;
        const character = await characters.getCharacter(characterID);

        // Getting indexes only form URLs
        character.origin.url =
            character.origin.url != ""
                ? character.origin.url.match(/\d+/)[0]
                : "";
        character.location.url =
            character.location.url != ""
                ? character.location.url.match(/\d+/)[0]
                : "";

        context.character = await character;

        this.partial("../templates/character.hbs");
    });

    // Locations
    this.get("/locations/:pageID", async function (context) {
        const { pageID } = context.params;

        const { info, results } = await locations.getAllLocations(pageID);

        context.locations = await results;

        loadPageNavigation(context, info, "locations").then(function () {
            this.partial("../templates/locations.hbs");
        });
    });

    // Specific Location
    this.get("/location/:locationID", async function (context) {
        const { locationID } = context.params;

        const location = await locations.getLocation(locationID);

        const residentsIDs = location.residents.map(resident => (resident ? resident.match(/\d+/)[0] : null));

        const results = await characters.getSpecificCharacters(residentsIDs);

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

        context.residents = results;
        context.location = location;
        this.partial("../templates/location.hbs");
    });

    // Search Characters
    // this.post('/searchCharacter', function(context) {
    //     const data = context.params;
    //     console.log(data);

    //     this.partial("../templates/characters.hbs");
    // });
});

function loadPageNavigation(context, { prev, next }, endpoint) {
    context.previousPage = prev ? `/${endpoint}/` + prev.match(/\d+/)[0] : null;
    context.nextPage = next ? `/${endpoint}/` + next.match(/\d+/)[0] : null;

    return context.loadPartials({
        pageNavigation: "../templates/pageNavigation.hbs",
    });
}

export default router;