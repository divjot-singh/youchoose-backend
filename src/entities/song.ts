export default interface Song{
    title:string;
    etag:string;
    videoId:string;
    channelTitle:string;
    channelId:string;
    imageUrl:string;
    docId?:string;
}

export const getSongFromMap = (data:any):Song => {
    const {title = '', etag = '', videoId = '', channelId = '', channelTitle = '', imageUrl = ''} = data || {}
    const song:Song={
        title,
        channelId,
        channelTitle,
        videoId,
        imageUrl,
        etag
    }
    return song;
}