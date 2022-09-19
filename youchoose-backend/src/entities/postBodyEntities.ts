import Song from "./song";

export interface AddSuggestedSongsHandlerBody{
    song:Song;
    clubId:string;
    userId?:string;
}

export interface SongEntityAtClub{
    song:Song;
    userId?:string;
}

export interface FetchClubSongsHandlerBody{
    clubId:string;
}
export interface FetchUserSuggestedClubSongsHandlerBody{
    clubId:string;
    userId:string;
}
export interface RemoveUserSuggestedSongHandlerBody{
    clubId:string;
    docId?:string;
}
export interface SuggestedSongsQueryParams{
    clubId:string;
}
export interface AddSongToListBody{
    song:Song;
    clubId:string;
}

export interface RemoveSongFromListBody{
    clubId:string;
    songId:string;
}

export interface LikeSongBody{
    userId:string;
    song:Song;
}

export interface FetchLikedSongsBody{
    userId:string;
}