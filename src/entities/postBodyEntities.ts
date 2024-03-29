import Club from "./clubs";
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
    songId:string;
    userId:string;
}
export interface SuggestedSongsQueryParams{
    clubId:string;
}
export interface AddSongToListBody{
    song:Song;
    clubId:string;
    userId:string;
}
export interface RemoveSongToListBody{
    songId:string;
    clubId:string;
    userId:string;
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

export interface ClubHandlerBody{
    clubId:string;
    email:string;
}

export interface UpdateClubHandlerBody{
    club:Club;
    oldEmail:string;
}

export interface AddClubHandlerBody{
    clubName:string;
    email:string;
    bannerUrl:string;
    logoUrl:string;
}

export interface AddModeratorHandlerBody{
    email:string;
}
