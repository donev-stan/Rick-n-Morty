const baseURL = `https://rickandmortyapi.com/api`;

const characters = {
    getAllCharacters(pageID) {
        return fetch(`${baseURL}/character?page=${pageID}`)
            .then(response => response.json())
            .then(data => data);
    },

    getCharacter(characterID) {
        return fetch(`${baseURL}/character/${characterID}`)
            .then(response => response.json())
            .then(data => data);
    },

    getSpecificCharacters(IDs) {
        return fetch(`${baseURL}/character/${IDs}`)
            .then(response => response.json())
            .then(data => data);
    }
};

const locations = {
    getAllLocations(pageID) {
        return fetch(`${baseURL}/location?page=${pageID}`)
            .then(response => response.json())
            .then(data => data);
    },

    getLocation(locationID) {
        return fetch(`${baseURL}/location/${locationID}`)
        .then(response => response.json())
        .then(data => data);
    }


};

export {characters, locations};