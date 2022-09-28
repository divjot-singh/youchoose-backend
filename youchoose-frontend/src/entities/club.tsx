export default interface Club{
    clubId:string;
    clubName:string;
    email:string;
}

export function instanceOfClub(data: any): data is Club {
    if(!data) return false
    return 'clubId' in data && 'clubName' in data;
}