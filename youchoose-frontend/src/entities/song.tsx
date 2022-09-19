export default interface Song{
    title:string;
    etag:string;
    videoId:string;
    channelTitle:string;
    channelId:string;
    imageUrl:string;
    docId?:string;
}


export const getSongFromMap = (data:any) => {
    let song:any={}
    song['title']=data?.['snippet']?.['title']
    song['etag']=data?.['etag']
    song['videoId']=data?.['id']?.['videoId']
    song['channelTitle']=data?.['snippet']?.['channelTitle']
    song['imageUrl']=data?.['snippet']?.['thumbnails']?.['default']?.['url']
    song['channelId'] = data?.['snippet']?.['channelId']
    const songWithType:Song = song;
    return songWithType
}
export const instanceOfSong = (data:any):data is Song => {
    if(!data) return false
    return 'title' in data && 'etag' in data && 'videoId' in data && 'channelTitle' in data && 'channelId' in data && 'imageUrl' in data;
}