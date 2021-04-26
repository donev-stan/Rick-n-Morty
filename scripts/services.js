const baseURL = `https://rickandmortyapi.com/api`;

function configureCharactersURL({pageID = 1, characterName, status, gender}) {
    const url = `${baseURL}/character/?page=${pageID}`;
    let nameQuery, statusQuery, genderQuery = '';
   
    console.log(url);
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

function configureEpisodesURL({pageID, episodeName, episodeCode}) {
    const url = `${baseURL}/episode/?page=${pageID}`;
    let nameQuery, codeQuery = '';

    if (episodeName !== undefined) {
        if (episodeName !== '') {
            nameQuery = `&name=${episodeName}`;
        }
    }

    if (episodeCode !== undefined) {
        if (episodeCode !== '') {
            codeQuery = `&code=${episodeCode}`;
        }
    }

    const returnedSearchQuery = `${nameQuery ? nameQuery : ''}${codeQuery ? codeQuery : ''}`;
    return { url, returnedSearchQuery};
}

const characters = {
    getCharacters: (url) => fetchURL(url),
    getCharactersByID: (charactersIDs) => fetchURL(`${baseURL}/character/${charactersIDs}`)
};

const locations = {
    getLocations: (url) => fetchURL(url),
    getLocationsByID: (locationsIDs) => fetchURL(`${baseURL}/location/${locationsIDs}`),
};

const episodes = {
    getEpisodes: (url) => fetchURL(url),
    getEpisodesByID: (episodesIDs) => fetchURL(`${baseURL}/episode/${episodesIDs}`)
};

function fetchURL(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.dir(error));
} 

export {
    characters, 
    locations, 
    episodes, 
    configureCharactersURL, 
    configureLocationsURL,
    configureEpisodesURL
};