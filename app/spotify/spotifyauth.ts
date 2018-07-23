import * as express from "express";
const expressApp = express();
const expressServer = require("http").createServer(expressApp);
const SpotifyWebApi = require('spotify-web-api-node');
const { client_id, client_secret, redirect_uris } = require("../../spotify_client_secret.json");
const { ipcRenderer } = (window["require"])('electron');

const scopes = ["user-read-private", "user-read-email", "playlist-read-collaborative", "playlist-read-private"];

export function start(callbacks: ((client) => any)[]) {
    const spotifyApi = new SpotifyWebApi({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uris[0]
    });
    const authorizeUrl = spotifyApi.createAuthorizeURL(scopes);
    ipcRenderer.send("spotify:login", authorizeUrl);
    expressApp.get("/spotifycallback", async (req, res) => {
        const query = req.query;
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
                console.log("Error obtaining Spotify token:", err);
            }
        }
    });
    expressServer.listen(8888);
}