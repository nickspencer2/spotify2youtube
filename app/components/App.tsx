import * as React from "react";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { HomePage } from "./HomePage";
import { SpotifyPlaylistPage } from "./SpotifyPlaylistPage";
import { ConvertPage } from "./ConvertPage";
import { LandingPage } from "./LandingPage";

interface AppProps {
}

interface AppState {
    googleClient: OAuth2Client;
    spotifyClient: any;
    spotifyPlaylist: any;
    spotifyUser: any;
    spotifyPlaylistTracks: any[];
    currentPage: string;
}

export class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        googleClient: null,
        spotifyClient: null,
        spotifyPlaylist: null,
        spotifyUser: null,
        spotifyPlaylistTracks: null,
        currentPage: "LandingPage"
    };

    youtubeAuthorized = (client: OAuth2Client) => {
        this.setState((prevState: AppState) => {
            return {
                googleClient: client,
                currentPage: prevState.spotifyClient ? "HomePage" : prevState.currentPage
            }
        });
    }

    spotifyAuthorized = (client: any) => {
        this.setState((prevState: AppState) => {
            return {
                spotifyClient: client,
                currentPage: prevState.googleClient ? "HomePage" : prevState.currentPage
            }
        });
    }

    handleSpotifyPlaylistClick = (playlist: any, spotifyUser: any) => {
        this.setState({
            spotifyPlaylist: playlist,
            spotifyUser: spotifyUser,
            currentPage: "SpotifyPlaylistPage"
        });
    }

    onConvertClick = (playlist: any, tracks: any[]) => {
        this.setState({
            spotifyPlaylist: playlist,
            spotifyPlaylistTracks: tracks,
            currentPage: "ConvertPage"
        });
    }

    onConvertBackClick = () => {
        this.setState({
            currentPage: "SpotifyPlaylistPage"
        });
    }

    onSpotifyPlaylistBackClick = () => {
        this.setState({
            currentPage: "HomePage"
        });
    }

    render() {
        if(this.state.currentPage == "ConvertPage") {
            return (
                <ConvertPage
                    spotifyPlaylist={this.state.spotifyPlaylist}
                    spotifyTracks={this.state.spotifyPlaylistTracks}
                    googleClient={this.state.googleClient}
                    onBackClick={this.onConvertBackClick}/>
            );
        }
        else if(this.state.currentPage == "SpotifyPlaylistPage") {
            return (
                <SpotifyPlaylistPage
                    playlist={this.state.spotifyPlaylist}
                    spotifyClient={this.state.spotifyClient}
                    spotifyUser={this.state.spotifyUser}
                    onConvertClick={this.onConvertClick}
                    tracks={this.state.spotifyPlaylistTracks}
                    onBackClick={this.onSpotifyPlaylistBackClick}/>
            );
        }
        else if(this.state.currentPage == "HomePage") {
            return (
                <HomePage
                    googleClient={this.state.googleClient}
                    spotifyClient={this.state.spotifyClient}
                    handlePlaylistClick={this.handleSpotifyPlaylistClick}/>
            );
        }
        else {
            return (
                <LandingPage
                    youtubeAuthorized={this.youtubeAuthorized}
                    spotifyAuthorized={this.spotifyAuthorized}/>    
            );
        }
    }
}