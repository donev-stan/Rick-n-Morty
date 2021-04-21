const baseURL = `https://rickandmortyapi.com/api`;

const characters = {
    getAllCharacters() {
        return fetch(`${baseURL}/character`)
            .then(response => response.json())
            .then(data => { return data });
    },

    getCharacter(id) {
        return fetch(`${baseURL}/character/${id}`)
            .then(response => response.json())
            .then(data => { return data });
    }
};

export {characters};