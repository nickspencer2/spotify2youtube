import * as React from "react";
import { start as youtubeAuthStart } from "../youtubeauth";
import { start as spotifyAuthStart } from "../spotifyauth";
import { OAuth2Client } from "google-auth-library";

interface Props {
    youtubeAuthorized: (client: OAuth2Client) => void;
    spotifyAuthorized: (client: any) => void;
}

interface State {
    googleClient: OAuth2Client;
    spotifyClient: any;
}

export class LandingPage extends React.Component<Props, State> {
    state: State = {
        googleClient: null,
        spotifyClient: null
    }

    handleGoogleAuthClick = () => {
        youtubeAuthStart([(client) => {
            this.setState({
                googleClient: client
            });
        }, this.props.youtubeAuthorized]);
    }

    handleSpotifyAuthClick = () => {
        spotifyAuthStart([(client) => {
            this.setState({
                spotifyClient: client
            });
        }, this.props.spotifyAuthorized]);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm">
                        <button type="button" className="btn btn-primary" onClick={e => this.handleGoogleAuthClick()} disabled={this.state.googleClient != null}>Authorize Youtube</button>
                    </div>
                    <div className="col-sm">
                        <button type="button" className="btn btn-primary" onClick={e => this.handleSpotifyAuthClick()} disabled={this.state.spotifyClient != null}>Authorize Spotify</button>
                    </div>
                </div>
            </div>
        );
    }
}