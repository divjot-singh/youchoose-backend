export default interface Song{
    title:string;
    etag:string;
    videoId:string;
    channelTitle:string;
    channelId:string;
    imageUrl:string;
    docId?:string;
    likes:number;
    artistName:string;
}

export const getSongFromMap = (data:any):Song => {
    const {title = '', etag = '', videoId = '', channelId = '', channelTitle = '', imageUrl = '', likes=0, artistName = ''} = data || {}
    const song:Song={
        title,
        channelId,
        channelTitle,
        videoId,
        imageUrl,
        etag,
        likes,
        artistName,
    }
    return song;
}