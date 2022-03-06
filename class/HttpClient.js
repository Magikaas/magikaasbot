const { XMLHttpRequest } = require("xmlhttprequest");

class HttpClient {
    constructor(baseUrl, path) {
        this._baseUrl = baseUrl;
        this._path = path;
    }

    get() {
        return this._doRequest('GET');
    }

    post() {
        return this._doRequest('POST');
    }

    setOptions(query) {
        this._query = query;
    }

    _doRequest(method) {
        const that = this;

        return new Promise(function(resolve, reject) {

            const options = {
                hostname: that._baseUrl,
                port: 443,
                path: that._path,
                method: method
            };

            const req = that._runRequest(options, resolve, reject);
        });
    }

    _runRequest(options, resolve, reject) {
        const Http = new XMLHttpRequest();

        const fullUrl = this._baseUrl + this._path;

        console.log(fullUrl);
        Http.open(options.method, fullUrl);
        Http.send();

        Http.onreadystatechange = () => {
            switch(Http.readyState) {
                case Http.UNSENT:
                    break;
                case Http.OPENED:
                    break;
                case Http.HEADERS_RECEIVED:
                    break;
                case Http.LOADING:
                    break;
                case Http.DONE:
                    resolve(Http.responseText);
                    break;
            }
        };
    }
}

module.exports = HttpClient;