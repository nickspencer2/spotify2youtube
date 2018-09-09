import * as React from "react";

interface Props {
    marginRight?: string;
    fontSize?: string;
    youtubeUser?: any;
    spotifyUser?: any;
}

export class Header extends React.Component<Props> {

    public static defaultProps: Partial<Props> = {
        marginRight: "0.5vw",
        fontSize: "2em"
    }

    render() {
        return (
            <div className="row" style={{ fontSize: this.props.fontSize }}>
                <div className="col-sm-8">
                    <i className="fab fa-spotify" style={{ marginRight: this.props.marginRight }}></i>
                    <i className="fas fa-long-arrow-alt-right" style={{ marginRight: this.props.marginRight }}></i>
                    <i className="fab fa-youtube" style={{ marginRight: this.props.marginRight }}></i>
                </div>
                <div className="col-sm text-right">
                    {this.props.youtubeUser &&
                        <span>
                            <i style={{ color: "#bb0000", display: "inline-block" }} className="fab fa-youtube"></i>
                            <h3 style={{ display: "inline-block" }}>{this.props.youtubeUser.items![0].snippet!.title}</h3>
                        </span>}
                </div>
                <div className="col-sm text-right">
                    {this.props.spotifyUser &&
                        <span>
                            <i style={{ color: "#1ED760", display: "inline-block" }} className="fab fa-spotify"></i>
                            <h3 style={{ display: "inline-block" }}>{this.props.spotifyUser.body.display_name}</h3>
                        </span>}
                </div>
            </div>
        );
    }
}