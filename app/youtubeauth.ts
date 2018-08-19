import * as fs from "fs";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import * as express from "express";
const expressApp = express();
const expressServer = require("http").createServer(expressApp);
const { ipcRenderer } = (window["require"])('electron');
const OAuth2 = google.auth.OAuth2;
const clientSecretFile = require("../google_credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/youtube"];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + "/.credentials/";
const TOKEN_PATH = TOKEN_DIR + "youtube-token.json";

//Load client secrets from a local file.
export function start(callbacks: ((client: OAuth2Client) => any)[]) {
    try {
        authorize(clientSecretFile, callbacks);
    } catch (err) {
        console.log("Error loading client secret file: " + err);
    }
}

function authorize(clientSecretFile: any, callbacks: ((client: OAuth2Client) => any)[]) {
    let clientId = clientSecretFile.web.client_id;
    let redirectUrl = clientSecretFile.web.redirect_uris[0];
    let oauth2Client = new OAuth2({
        clientId: clientId,
        redirectUri: redirectUrl
    });
    getNewToken(oauth2Client, callbacks);
}

function getNewToken(oauth2Client: OAuth2Client, callbacks: ((client: OAuth2Client) => any)[]) {
    let authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline", // Should this be online? With offline, it returns a refresh token on first authentication.
        scope: SCOPES
    });
    ipcRenderer.send("youtube:login", authUrl);
    expressApp.get("/googlecallback", async (req, res) => {
        const query = req.query;
        if (query.error) {
            console.log("Error getting youtube authorization: " + query.error);
        }
        else {
            const code = query.code;
            try {
                const token = (await oauth2Client.getToken(code)).tokens;
                oauth2Client.credentials = token;
                expressServer.close();
                ipcRenderer.send("youtube:loggedin", {});
                callbacks.forEach((callback) => callback(oauth2Client));
            } catch (err) {
                console.log("Error while trying to retrieve youtube access token: " + err);
            }
        }
    });
    expressServer.listen(8888);
}