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
            <div className="container-fluid text-center">
                <div className="row">
                    <div className="col">
                        <h1>Spotify to Youtube</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col" />
                    <div className="col">
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={e => this.handleGoogleAuthClick()}
                            disabled={this.state.googleClient != null}
                            style={{width: "83.27px"}}>
                            <i className="fab fa-youtube"></i>
                            Login
                        </button>
                    </div>
                    <div className="col" />
                </div>
                <hr />
                <div className="row">
                    <div className="col" />
                    <div className="col">
                        <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={e => this.handleSpotifyAuthClick()}
                            disabled={this.state.spotifyClient != null}
                            style={{width: "83.27px"}}>
                            <i className="fab fa-spotify"></i>
                            Login
                        </button>
                    </div>
                    <div className="col" />
                </div>
            </div>
        );
    }
}