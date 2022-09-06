export default interface Song{
    title:string;
    etag:string;
    videoId:string;
    channelTitle:string;
    channelId:string;
    imageUrl:string;
}


export const getSongFromMap = (data:any) => {
    let song:any={}
    song['title']=data?.['snippet']?.['title']
    song['etag']=data?.['etag']
    song['videoId']=data?.['id']?.['videoId']
    song['channelTitle']=data?.['snippet']?.['channelTitle']
    song['imageUrl']=data?.['snippet']?.['thumbnails']?.['default']?.['url']
    const songWithType:Song = song;
    return songWithType
}