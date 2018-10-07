import * as React from "react";
import { OAuth2Client } from "google-auth-library";
import { google, youtube_v3 } from "googleapis";
import { SpotifyPlaylistList } from "./SpotifyPlaylistList";

interface Props {
    googleClient: OAuth2Client;
    spotifyClient: any;
    spotifyUser: any;
    youtubeUser: any;
    handlePlaylistClick: (playlist: any, spotifyUser: any) => void;
    setSpotifyUser: (spotifyUser: any) => void;
    setYoutubeUser: (youtubeUser: youtube_v3.Schema$ChannelListResponse) => void;
    playlists: any[];
    setPlaylists: (playlists: any[]) => void;
}

export class HomePage extends React.Component<Props> {
    async componentWillMount() {
        if (!this.props.spotifyUser) {
            const currentSpotifyUser = await this.props.spotifyClient.getMe();
            this.props.setSpotifyUser(currentSpotifyUser);
            console.log("Got Spotify user");
        }
        if (!this.props.youtubeUser) {
            const currentYoutubeUser = (await google.youtube("v3").channels.list({
                auth: this.props.googleClient,
                part: "snippet,contentDetails,statistics",
                mine: true
            })).data;
            this.props.setYoutubeUser(currentYoutubeUser);
            console.log("Got Youtube user");
        }
    }

    render() {
        return (
            <div className="container-fluid">
                {this.props.spotifyUser ?
                    <SpotifyPlaylistList
                        handlePlaylistClick={this.props.handlePlaylistClick}
                        spotifyClient={this.props.spotifyClient}
                        spotifyUser={this.props.spotifyUser}
                        playlists={this.props.playlists}
                        setPlaylists={this.props.setPlaylists} 
                    /> :
                    <div className="row">
                        <p>Loading current Spotify user...</p>
                    </div>
                }
            </div>
        );
    }
}