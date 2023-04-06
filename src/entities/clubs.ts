export default interface Club{
    clubId:string;
    clubName:string
    email:string;
    bannerUrl:string;
    logoUrl:string;
}

export function instanceOfClub(data: any): data is Club {
    if(!data) return false
    return 'clubId' in data && 'clubName' in data;
}

export function getClubFromMap(data:any): Club{
    if(!data) return
    const {clubId = '', clubName = '', email = '', bannerUrl = '', logoUrl = ''} = data || {}
    const club:Club = {
        clubId,
        clubName,
        email,
        bannerUrl,
        logoUrl,
    }
    return club
}