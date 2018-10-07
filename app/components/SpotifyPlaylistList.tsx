import * as React from "react";

interface Props {
    spotifyClient: any;
    spotifyUser: any;
    handlePlaylistClick: (playlist: any, spotifyUser: any) => void;
    playlists: any[];
    setPlaylists: (playlists: any[]) => void;
}

interface State {
    results: any[];
    filter: string;
}

export class SpotifyPlaylistList extends React.Component<Props, State> {
    state: State = {
        results: this.props ? this.props.playlists || [] : [],
        filter: ""
    }

    async componentWillMount() {
        if (!this.props.playlists) {
            const playlists = [];
            let playlistsData = await this.props.spotifyClient.getUserPlaylists(this.props.spotifyUser.body.id);
            playlists.push(...playlistsData.body.items);
            while (playlistsData.body.next) {
                playlistsData = await this.props.spotifyClient.getUserPlaylists(this.props.spotifyUser.body.id, {
                    offset: playlistsData.body.offset + playlistsData.body.limit
                });
                playlists.push(...playlistsData.body.items);
            }
            this.setState({
                results: playlists,
                filter: ""
            });
            this.props.setPlaylists(playlists);
        }
    }

    handleInputChange = (filter: string) => {
        this.setState((prevState: State) => {
            return {
                filter: filter,
                results: this.props.playlists.filter((playlist: any) => {
                    return playlist.name.toUpperCase().indexOf(filter.toUpperCase()) > -1;
                })
            }
        });
    }

    render() {
        if (this.props.playlists) {
            return (
                <div>
                    <div className="row">
                        <div className="col-sm">
                            <h1>Playlists</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            <div className="input-group mb-3">
                                {/* tslint:disable-next-line:jsx-no-lambda */}
                                <input type="text" className="form-control" placeholder="Playlist Name" value={this.state.filter} onChange={e => this.handleInputChange(e.target.value)} />
                                <div className="input-group-append">
                                    <span className="input-group-text">{this.state.results.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            {
                                this.state.results.map((playlist: any, index: number) => {
                                    return (
                                        <button
                                            key={`PlaylistButton-${index}`}
                                            type="button"
                                            className="list-group-item list-group-item-action"
                                            // tslint:disable-next-line:jsx-no-lambda
                                            onClick={e => this.props.handlePlaylistClick(playlist, this.props.spotifyUser)}
                                        >
                                            {playlist.name}
                                        </button>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="row">
                    <div className="col-sm">
                        <p>Loading Spotify playlists...</p>
                    </div>
                </div>
            );
        }
    }
}