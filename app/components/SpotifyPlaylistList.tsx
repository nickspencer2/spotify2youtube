import * as React from "react";

interface Props {
    spotifyClient: any;
    spotifyUser: any;
    handlePlaylistClick: (playlist: any, spotifyUser: any) => void;
}

interface State {
    playlists: any[];
    results: any[];
    filter: string;
}

export class SpotifyPlaylistList extends React.Component<Props, State> {

    state: State = {
        playlists: null,
        filter: "",
        results: []
    };

    async componentWillMount() {
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
            playlists: playlists,
            results: playlists
        });
    }

    handleInputChange = (filter: string) => {
        this.setState((prevState: State) => {
            return {
                filter: filter,
                results: prevState.playlists.filter((playlist: any) => {
                    return playlist.name.toUpperCase().indexOf(filter.toUpperCase()) > -1;
                })
            }
        });
    }

    render() {
        return (
            this.state.playlists ?
                <div>
                    <div className="row">
                        <div className="col-sm">
                            <div className="input-group mb-3">
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
                                            onClick={e => this.props.handlePlaylistClick(playlist, this.props.spotifyUser)}
                                        >
                                            {playlist.name}
                                        </button>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div> :
                <div className="row">
                    <div className="col-sm">
                        <p>Loading Spotify playlists...</p>
                    </div>
                </div>
        );
    }
}