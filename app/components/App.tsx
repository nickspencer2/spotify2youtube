import * as React from "react";
import { OAuth2Client } from "google-auth-library";
import { google, youtube_v3 } from "googleapis";
import { HomePage } from "./HomePage";
import { SpotifyPlaylistPage } from "./SpotifyPlaylistPage";
import { ConvertPage } from "./ConvertPage";
import { LandingPage } from "./LandingPage";
import { Header } from "./Header";
import { SpotifyPlaylistTrack, SpotifyPlaylistTrackWithInclude } from "app/types/SpotifyTypes";

interface AppProps {
}

interface AppState {
    googleClient: OAuth2Client;
    spotifyClient: any;
    spotifyPlaylist: any;
    spotifyUser: any;
    youtubeUser: any;
    spotifyPlaylists: any[];
    spotifyPlaylistTracks: SpotifyPlaylistTrackWithInclude[];
    currentPage: string;
}

export class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        googleClient: null,
        spotifyClient: null,
        spotifyPlaylist: null,
        spotifyUser: null,
        youtubeUser: null,
        spotifyPlaylists: null,
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
        this.setState((prevState: AppState) => {
            return {
                spotifyPlaylist: playlist,
                spotifyPlaylistTracks: prevState.spotifyPlaylist ?  (playlist.id == prevState.spotifyPlaylist.id ? prevState.spotifyPlaylistTracks : null) : prevState.spotifyPlaylist,
                currentPage: "SpotifyPlaylistPage"
            };
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

    setYoutubeUser = (user: youtube_v3.Schema$ChannelListResponse) => {
        this.setState({
            youtubeUser: user
        });
    }

    setSpotifyUser = (user: any) => {
        this.setState({
            spotifyUser: user
        });
    }

    setSpotifyPlaylists = (playlists: any[]) => {
        this.setState({
            spotifyPlaylists: playlists
        })
    }

    setSpotifyPlaylistTracks = (tracks: SpotifyPlaylistTrackWithInclude[]) => {
        this.setState({
            spotifyPlaylistTracks: tracks
        });
    }

    toggleTrackChecked = (index: number) => {
        let tracks = [...this.state.spotifyPlaylistTracks];
        tracks[index].include = !tracks[index].include;
        this.setState({
            spotifyPlaylistTracks: tracks
        });
    }

    render() {
        let currentPage;
        if(this.state.currentPage == "ConvertPage") {
            currentPage =
                <ConvertPage
                    spotifyPlaylist={this.state.spotifyPlaylist}
                    spotifyTracks={this.state.spotifyPlaylistTracks.filter(track => track.include)}
                    googleClient={this.state.googleClient}
                    onBackClick={this.onConvertBackClick}
                />
        }
        else if(this.state.currentPage == "SpotifyPlaylistPage") {
            currentPage = 
                <SpotifyPlaylistPage
                    playlist={this.state.spotifyPlaylist}
                    spotifyClient={this.state.spotifyClient}
                    spotifyUser={this.state.spotifyUser}
                    onConvertClick={this.onConvertClick}
                    tracks={this.state.spotifyPlaylistTracks}
                    onBackClick={this.onSpotifyPlaylistBackClick}
                    setTracks={this.setSpotifyPlaylistTracks}
                    toggleTrackChecked={this.toggleTrackChecked}
                />
        }
        else if(this.state.currentPage == "HomePage") {
            currentPage = 
                <HomePage
                    googleClient={this.state.googleClient}
                    spotifyClient={this.state.spotifyClient}
                    handlePlaylistClick={this.handleSpotifyPlaylistClick}
                    youtubeUser={this.state.youtubeUser}
                    spotifyUser={this.state.spotifyUser}
                    setYoutubeUser={this.setYoutubeUser}
                    setSpotifyUser={this.setSpotifyUser}
                    playlists={this.state.spotifyPlaylists}
                    setPlaylists={this.setSpotifyPlaylists}
                />
        }
        else {
            currentPage = 
                <LandingPage
                    youtubeAuthorized={this.youtubeAuthorized}
                    spotifyAuthorized={this.spotifyAuthorized}
                />    
        }
        return (
            <div>
                <Header youtubeUser={this.state.youtubeUser} spotifyUser={this.state.spotifyUser} />
                <div className="container">
                    {currentPage}
                </div>
            </div>
        )
    }
}