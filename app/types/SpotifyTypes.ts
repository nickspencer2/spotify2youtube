export type SpotifyPlaylistTrack = {
    added_at: string,
    added_by: SpotifyUser,
    is_local: boolean,
    track: SpotifyTrack
}

export type SpotifyPlaylistTrackWithInclude = SpotifyPlaylistTrack & {
    include: boolean
}

export type SpotifyUser = {
    display_name: string,
    external_urls: SpotifyExternalUrl,
    followers: SpotifyFollowers,
    href: string,
    id: string,
    images: SpotifyImage[],
    type: string,
    uri: string
}

export type SpotifyTrack = {
    album: SpotifySimplifiedAlbum,
    artists: SpotifySimplifiedArtist[],
    available_markets: string[],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_ids: SpotifyExternalId,
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    is_playable: boolean,
    linked_from: SpotifyLinkedTrack,
    restrictions: SpotifyRestrictions,
    name: string,
    popularity: number,
    preview_url: string,
    track_number: number,
    type: string,
    uri: string,
    is_local: boolean
}

export type SpotifySimplifiedAlbum = {
    album_group?: string,
    album_type: string,
    artists: SpotifySimplifiedArtist[],
    available_markets: string[],
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    images: SpotifyImage[],
    name: string,
    release_date: string,
    release_date_precision: string,
    restrictions: SpotifyRestrictions,
    type: string,
    uri: string
}

export type SpotifySimplifiedArtist = {
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    name: string,
    type: string,
    uri: string
}

export type SpotifyExternalId = {
    [key: string]: string
}

export type SpotifyExternalUrl = {
    [key: string]: string
}

export type SpotifyLinkedTrack = {
    external_urls: SpotifyExternalUrl,
    href: string,
    id: string,
    type: string,
    uri: string
}

// Couldn't find decent documentation for this type in the Spotify API docs
export type SpotifyRestrictions = any

export type SpotifyImage = {
    height: number,
    url: string,
    width: number
}

export type SpotifyFollowers = {
    href: string,
    total: number
}