const SpotifyWebApi = require('spotify-web-api-node');
const { client_id, redirect_uris } = require("../spotify_credentials.json");
const { ipcRenderer } = (window["require"])('electron');

const scopes = ["user-read-private", "user-read-email", "playlist-read-collaborative", "playlist-read-private"];

export function start(callbacks: ((client) => any)[]) {
    const spotifyApi = new SpotifyWebApi({
        clientId: client_id,
        redirectUri: redirect_uris[0]
    });
    const authorizeUrl = "https://accounts.spotify.com/authorize?client_id=" + client_id + "&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fspotifycallback&scope=user-read-private%20user-read-email&response_type=token&state=123"
    ipcRenderer.send("spotify:login", authorizeUrl);

    /*Spotify uses hash fragments to send tokens, one way to get these is to send an event in main.ts when a redirect happens matching our redirect_uri, 
    then parse it into an object ('responseObject'). See https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow .*/
    ipcRenderer.on("spotify:loggedin", (event, urlWithHashParams: string) => {
        const paramsString = (urlWithHashParams.split("#"))[1];
        const responseObject = {};
        const params = paramsString.split("&").map((paramString): [string, string] => {
            const paramStringSplit = paramString.split("=");
            return [paramStringSplit[0], paramStringSplit[1]];
        }).forEach((paramKeyValue) => {
            responseObject[paramKeyValue[0]] = paramKeyValue[1];
        });
        spotifyApi.setAccessToken(responseObject["access_token"]);
        ipcRenderer.send("spotify:loggedin", {});
        // spotifyApi.setRefreshToken(responseObject["refresh_token"]); // No refresh token is returned when using "Implicit Grant"
        callbacks.forEach((callback) => callback(spotifyApi));
    });
}