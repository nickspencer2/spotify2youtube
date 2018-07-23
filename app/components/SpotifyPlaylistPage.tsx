import * as React from "react";

interface Props {
    playlist: any;
    spotifyClient: any;
    spotifyUser: any;
    onConvertClick: (playlist: any, tracks: any[]) => void;
    tracks: any[] | null;
    onBackClick: () => void;
}

interface State {
    tracks: any[];
}

export class SpotifyPlaylistPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            tracks: props.tracks
        };
    }

    async componentWillMount() {
        if (!this.props.tracks) { // Only load playlist's tracks if we haven't before
            console.log("Loading tracks...")
            let tracksData = await this.props.spotifyClient.getPlaylistTracks(this.props.spotifyUser.body.id, this.props.playlist.id);
            const tracks = [...tracksData.body.items];
            while (tracksData.body.next) {
                tracksData = await this.props.spotifyClient.getPlaylistTracks(this.props.spotifyUser.body.id, this.props.playlist.id, {
                    offset: tracksData.body.offset + tracksData.body.limit
                });
                tracks.push(...tracksData.body.items);
            }
            this.setState({
                tracks: tracks
            });
        }
    }

    render() {
        if (this.state.tracks) {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm">
                            <button className="btn btn-primary" onClick={this.props.onBackClick}>
                                <i className="fas fa-arrow-left"></i>
                            </button>
                        </div>
                        <div className="col-sm">
                            <h2>{this.props.playlist.name}</h2>
                        </div>
                        <div className="col-sm">
                            <button type="button" className="btn btn-primary" onClick={e => { this.props.onConvertClick(this.props.playlist, this.state.tracks) }}>Convert to Youtube playlist</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            {
                                this.state.tracks.map((track: any, index: number) =>
                                    <button
                                        key={`PlaylistButton-${index}`}
                                        type="button"
                                        className="list-group-item list-group-item-action"
                                    >
                                        {track.track.name} by {(track.track.artists as any[]).map((artist: any) => artist.name).join(", ")}
                                    </button>
                                )
                            }
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm">
                            <h2>{this.props.playlist.name}</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            <p>Loading playlist tracks...</p>
                        </div>
                    </div>
                </div>
            );
        }
    }
}