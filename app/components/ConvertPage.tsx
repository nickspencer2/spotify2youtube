import * as React from "react";
import { google, youtube_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { AxiosResponse } from "axios";

interface Props {
    spotifyPlaylist: any;
    spotifyTracks: any[];
    googleClient: OAuth2Client;
    onBackClick: () => void;
}

interface State {
    [field: string]: any;
    youtubePlaylist: AxiosResponse<youtube_v3.Schema$Playlist>;
}

export class ConvertPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            playlistName: this.props.spotifyPlaylist.name,
            playlistDescription: this.props.spotifyPlaylist.description || `Playlist ${this.props.spotifyPlaylist.name} made by yt2sp`,
            playlistPublic: this.props.spotifyPlaylist.public,
            youtubePlaylist: null
        };
    }

    handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }
        const youtube = google.youtube({
            version: "v3",
            auth: this.props.googleClient
        });
        let youtubeTracks: AxiosResponse<youtube_v3.Schema$SearchListResponse>[] = [];
        for(let i = 0; i < this.props.spotifyTracks.length; i++) {
            const track = this.props.spotifyTracks[i];
            try {
                const searchResult = await youtube.search.list({
                    part: "snippet",
                    type: "video",
                    q: `${track.track.name} by ${(track.track.artists as any[]).map((artist: any) => artist.name).join(", ")}`
                });
                youtubeTracks.push(searchResult);
            } catch (err) {
                console.log("Error searching youtube for ", `${track.track.name} by ${(track.track.artists as any[]).map((artist: any) => artist.name).join(", ")}: `, err);
            }
        }
        try {
            // Create the playlist
            const youtubePlaylist = await youtube.playlists.insert({
                part: "contentDetails,snippet,status",
                requestBody: {
                    snippet: {
                        title: this.state["playlistName"],
                        description: this.state["playlistDescription"],
                        privacyStatus: this.state["privacyStatus"]
                    }
                }
            } as youtube_v3.Params$Resource$Playlists$Insert);

            // Insert tracks into playlist
            for(let i = 0; i < youtubeTracks.length; i++) {
                const youtubeTrack = youtubeTracks[i];
                try {
                    const insertResult = await youtube.playlistItems.insert({
                        part: "contentDetails,snippet,status",
                        requestBody: {
                            snippet: {
                                playlistId: youtubePlaylist.data.id,
                                resourceId: youtubeTrack.data.items[0].id
                            }
                        }
                    });
                } catch (err) {
                    console.log("Error adding Youtube track ", `${youtubeTrack.data.items[0].snippet.title}: `, err);
                }
            }

            this.setState({
                youtubePlaylist: youtubePlaylist
            });
            
        } catch (err) {
            console.log("Error creating Youtube playlist: " + err);
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.id;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <button className="btn btn-primary" onClick={this.props.onBackClick}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                    <div className="container">
                        {!this.state.youtubePlaylist ?
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="playlistName">Playlist Name</label>
                                    <input type="text" className="form-control" id="playlistName" placeholder="Playlist Name" onChange={this.handleChange} value={this.state.playlistName} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="playlistDescription">Playlist Description</label>
                                    <input type="text" className="form-control" id="playlistDescription" placeholder="Playlist Description" onChange={this.handleChange} value={this.state.playlistDescription} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="playlistPublic">Public Playlist</label>
                                    <input type="checkbox" className="form-control" id="playlistPublic" placeholder="Public Playlist" onChange={this.handleChange} checked={this.state.playlistPublic} />
                                </div>
                                <button type="submit" className="btn btn-primary" onClick={e => {e.preventDefault(); this.handleSubmit();}}>Submit</button>
                            </form> :
                            <div className="row">
                                <div className="col-sm">
                                    <p>Playlist created!</p>
                                    <a href={"https://www.youtube.com/playlist?list=" + this.state.youtubePlaylist.data.id} target="blank">link</a>
                                </div>
                            </div>
                        }
                    </div>
            </div>
        );
    }
}