const baseURL = `https://rickandmortyapi.com/api`;

function configureCharactersURL({pageID, characterName, status, gender}) {
    const url = `${baseURL}/character/?page=${pageID}`;
    let nameQuery, statusQuery, genderQuery = '';
   
    if (characterName !== undefined) {
        if (characterName !== '') {
            nameQuery = `&name=${characterName}`;
        }
    }

    if (status !== undefined) {
        if (status !== 'Status') {
            statusQuery = `&status=${status}`;
        }
    }
    
    if (gender !== undefined) {
        if (gender !== 'Gender') {
            genderQuery = `&gender=${gender}`;
        }
    }
    
    const returnedSearchQuery = `${nameQuery ? nameQuery : ''}${statusQuery ? statusQuery : ''}${genderQuery ? genderQuery : ''}`;
    return { url, returnedSearchQuery };
}

function configureLocationsURL({pageID, locationName, type, dimension}) {
    const url = `${baseURL}/location/?page=${pageID}`;
    let nameQuery, typeQuery, dimensionQuery = '';

    if (locationName !== undefined) {
        if (locationName !== '') {
            nameQuery = `&name=${locationName}`;
        }
    }

    if (type !== undefined) {
        if (type !== 'Type') {
            typeQuery = `&type=${type}`;
        }
    }
    
    if (dimension !== undefined) {
        if (dimension !== 'Dimension') {
            dimensionQuery = `&dimension=${dimension}`;
        }
    }

    const returnedSearchQuery = `${nameQuery ? nameQuery : ''}${typeQuery ? typeQuery : ''}${dimensionQuery ? dimensionQuery : ''}`;
    return { url, returnedSearchQuery };
}

const characters = {
    getCharacters(url){
        return fetchURL(url);
        // return fetch(url)
        //     .then(response => response.json())
        //     .then(data => data);
    },

    getCharactersByID(IDs) {
        return fetchURL(`${baseURL}/character/${IDs}`);
        // return fetch(`${baseURL}/character/${IDs}`)
        //     .then(response => response.json())
        //     .then(data => data);
    }
};

const locations = {
    getLocations(url) {
        return fetchURL(url);
        // return fetch(url)
        //     .then(response => response.json())
        //     .then(data => data);
    },

    getLocationsByID(locationID) {
        return fetchURL(`${baseURL}/location/${locationID}`);
        // return fetch(`${baseURL}/location/${locationID}`)
        //     .then(response => response.json())
        //     .then(data => data);
    }
};

function fetchURL(url) {
    return fetch(url).then(response => response.json()).then(data => data);
} 

export {characters, locations, configureCharactersURL, configureLocationsURL};