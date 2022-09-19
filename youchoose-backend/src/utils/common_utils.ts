import Song from "../entities/song";

export const getUniqueSongs = (songs:Song[]):Song[] => {
    const songSet:Set<string> = new Set(songs.map((song:Song) => song.videoId))
    const songIds = Array.from(songSet)
    const uniqueSongs:Song[] = []
    songIds.forEach((songId:string) => {
        uniqueSongs.push(songs.find((song:Song) => song.videoId === songId))
    })
    return uniqueSongs
}