import * as React from "react";
import { AxiosResponse } from "axios";
import { youtube_v3 } from "googleapis";

interface Props {
    // Form values
    [field: string]: any;
    // Other parent state
    youtubePlaylist: AxiosResponse<youtube_v3.Schema$Playlist>,
    playlistStatus: {
        status: string,
        successful: boolean
    }[]
}

export class LoadingScreen extends React.PureComponent<Props> {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <h1>{this.props.youtubePlaylist ? 
                        <a style={{fontSize: "1.75em"}} href={"https://www.youtube.com/playlist?list=" + this.props.youtubePlaylist.data.id} target="blank">New Playlist</a>  : 
                        "Creating Playlist..."}</h1>
                </div>
                <div>
                    <div className="row">
                        <ul className="list-group">
                            {this.props.playlistStatus.map((statusItem, index: number) => {
                                return (
                                    <li className={`list-group-item ${index == 0 ? "list-group-item-primary" : ""}`} key={`playlistStatus-${index}`}>
                                        {statusItem.status}
                                        <i style={statusItem.successful ? {color: "green"} : {color: "red"}} className={"fas " + (statusItem.successful ? "fa-check": "fa-exclamation-triangle")} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}