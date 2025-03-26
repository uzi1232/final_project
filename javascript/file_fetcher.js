export { JsonFileFetcher };

class JsonFileFetcher {
    constructor(jsonFilePath, serverUrl=null) {
        this.jsonFilePath = jsonFilePath
        this.url = serverUrl
        this.#generateUrl()
    }

    #generateUrl() {
        if (this.url === null) {
            this.url = this.jsonFilePath
        } else {
            this.url += this.jsonFilePath
        }
    }

    loadJsonData(jsonLoader) {
        fetch(this.url)
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Network error while fetching ${this.url}`)
            })
            .then(function(json) {
                jsonLoader(json)
            })
            .catch(function(error) {
                console.error(`JsonFileFetcher.getJsonFile - ${error}`)
            })
    }
}