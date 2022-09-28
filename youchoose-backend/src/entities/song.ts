export default interface Song{
    title:string;
    etag:string;
    videoId:string;
    channelTitle:string;
    channelId:string;
    imageUrl:string;
    docId?:string;
    likes:number;
}

export const getSongFromMap = (data:any):Song => {
    const {title = '', etag = '', videoId = '', channelId = '', channelTitle = '', imageUrl = '', likes=0} = data || {}
    const song:Song={
        title,
        channelId,
        channelTitle,
        videoId,
        imageUrl,
        etag,
        likes
    }
    return song;
}