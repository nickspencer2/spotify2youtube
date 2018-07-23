import * as React from "react";
import { OAuth2Client } from "../../node_modules/google-auth-library";
import { google, youtube_v3 } from "googleapis";
import { SpotifyPlaylistList } from "./SpotifyPlaylistList";

interface Props {
    googleClient: OAuth2Client;
    spotifyClient: any;
    handlePlaylistClick: (playlist: any, spotifyUser: any) => void;
}

interface State {
    currentYoutubeUser: youtube_v3.Schema$ChannelListResponse;
    currentSpotifyUser: any;
}

export class HomePage extends React.Component<Props, State> {
    
    state: State = {
        currentYoutubeUser: null,
        currentSpotifyUser: null
    };

    async componentWillMount() {
        const currentYoutubeUser = (await google.youtube("v3").channels.list({
            auth: this.props.googleClient,
            part: "snippet,contentDetails,statistics",
            mine: true
        })).data;
        const currentSpotifyUser = await this.props.spotifyClient.getMe();
        this.setState({
            currentYoutubeUser: currentYoutubeUser,
            currentSpotifyUser: currentSpotifyUser
        });
        const spotifyPlaylists = await this.props.spotifyClient.getUserPlaylists(currentSpotifyUser.body.id);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    {(this.state.currentYoutubeUser && this.state.currentSpotifyUser) &&
                    <div className="col-sm">
                        <h2>
                            Logged into Youtube as {JSON.stringify(this.state.currentYoutubeUser.items![0].snippet!.title)}
                        </h2>
                        <h2>
                            Logged into Spotify as {JSON.stringify(this.state.currentSpotifyUser.body.display_name)}
                        </h2>
                    </div>}
                </div>
                {this.state.currentSpotifyUser ? 
                    <SpotifyPlaylistList handlePlaylistClick={this.props.handlePlaylistClick} spotifyClient={this.props.spotifyClient} spotifyUser={this.state.currentSpotifyUser}/>:
                    <div className="row">
                        <p>Loading current Spotify user...</p>
                    </div>
                }
            </div>
        );
    }
}