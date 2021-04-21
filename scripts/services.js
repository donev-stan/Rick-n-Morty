const baseURL = `https://rickandmortyapi.com/api`;

const characters = {
    getAllCharacters(pageID) {
        return fetch(`${baseURL}/character?page=${pageID}`)
            .then(response => response.json())
            .then(data => data);
    },

    getCharacter(id) {
        return fetch(`${baseURL}/character/${id}`)
            .then(response => response.json())
            .then(data => data);
    }
};

const locations = {
    getAllLocations(pageID) {
        return fetch(`${baseURL}/location?page=${pageID}`)
            .then(response => response.json())
            .then(data => data);
    }
};

export {characters, locations};