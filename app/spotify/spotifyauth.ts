import * as express from "express";
const expressApp = express();
const expressServer = require("http").createServer(expressApp);
const SpotifyWebApi = require('spotify-web-api-node');
const { client_id, /*client_secret,*/ redirect_uris } = require("../../spotify_client_secret.json");
const { ipcRenderer } = (window["require"])('electron');

const scopes = ["user-read-private", "user-read-email", "playlist-read-collaborative", "playlist-read-private"];

export function start(callbacks: ((client) => any)[]) {
    const spotifyApi = new SpotifyWebApi({
        clientId: client_id,
        redirectUri: redirect_uris[0]
    });
    const authorizeUrl = "https://accounts.spotify.com/authorize?client_id=" + client_id + "&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fspotifycallback&scope=user-read-private%20user-read-email&response_type=token&state=123"
    console.log("authorizeUrl: " + authorizeUrl);
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
        // spotifyApi.setRefreshToken(responseObject["refresh_token"]);
        callbacks.forEach((callback) => callback(spotifyApi));
    });
    // Below is commented because we can't obtain the hash fragment in 'server' requests sent to express, which is where Spotify sends the access token in Implicit Grant
    /*expressApp.get("/spotifycallback", async (req, res) => {
        const query = req.query;
        console.log("req:");
        console.log(req);
        console.log("req.body:");
        console.log(req.body);
        if (query.error) {
            console.log("Error obtaining authorization for Spotify: " + query.error);
        } else {
            try {
                const data = await spotifyApi.authorizationCodeGrant(query.code);
                spotifyApi.setAccessToken(data.body["access_token"]);
                spotifyApi.setRefreshToken(data.body["refresh_token"]);
                expressServer.close();
                callbacks.forEach((callback) => callback(spotifyApi));
            } catch (err) {
                console.log("Error obtaining Spotify token2:", err);
            }
        }
    });
    expressServer.listen(8888);*/
}