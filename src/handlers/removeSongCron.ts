import FirebaseService from "../services/firebaseService";


export const RemoveSongsCron = async () => {
    try{
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours()
        let minutes = date_ob.getMinutes()
        console.log(`running RemoveSongsCron job on ${date} - ${month} - ${year} at ${hours}:${minutes}`)
        let response:void | Error = await FirebaseService.deleteAllClubSongs()
        if(response){
            console.log('RemoveSongsCron failed ')
            console.error(response)
        } else {
            console.log(`songs successfully deleted`)
        }
    } catch(err){
        console.log('RemoveSongsCron failed')
        console.error(err)
    }
}