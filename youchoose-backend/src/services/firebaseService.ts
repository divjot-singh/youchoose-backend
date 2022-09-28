import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { Auth, getAuth } from 'firebase-admin/auth';
import { CreateError } from '../utils/createError';
import { Tables } from '../utils/tableEntities';
import serviceAccount from './service-account.json';
import User, { AuthorisedUser, getUserFromSnapshot, UserType } from '../entities/user';
import Club, { getClubFromMap } from '../entities/clubs';
import Song, { getSongFromMap } from '../entities/song';

class FirebaseService{
    private static db:FirebaseFirestore.Firestore;
    private static auth: Auth;
    constructor(){
        try{
            console.log('initialising firebase app')
            initializeApp({
                credential: cert(JSON.parse(JSON.stringify(serviceAccount)))
            });
            FirebaseService.db = getFirestore();
            FirebaseService.auth = getAuth()
        } 
        catch(err){
            console.error(err)
        }
    }
    static async checkIfUserExists(user:User): Promise<User | Error | null>{
        try{
            console.log('inside checkIfUserExists')
            const snapshot:FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.user).doc(user.uid).get()
            if(snapshot.exists){
                await FirebaseService.db.collection(Tables.user).doc(user.uid).update({"token": user.token})
                const snapshotUser:User = getUserFromSnapshot(snapshot.data())
                snapshotUser.token = user.token;
                return snapshotUser
            }
            return null;
        } catch(err){
            return CreateError(err)
        }
    }
    static async isSongLiked(userId:string, songId:string):Promise<boolean>{
        try{
            console.log('inside isSongLiked')
            const data = await FirebaseService.db.collection(Tables.likedSongs).doc(userId).collection(Tables.nestedLikedSongs).doc(songId).get();
            if(data.exists){
                return true
            } else{
                return false
            }
        } catch(err){
            console.error(err)
            return false
        }
    }
    static async likeSong(userId:string, song:Song):Promise<void | Error>{
        try{
            console.log('inside likeSong')
            const isSongLiked = await FirebaseService.isSongLiked(userId, song.videoId)
            if(!isSongLiked){
                await FirebaseService.db.collection(Tables.likedSongs).doc(userId).collection(Tables.nestedLikedSongs).doc(song.videoId).set(song);
            }
        }catch(err){
            return CreateError(err)
        }
    }
    static async unLikeSong(userId:string, song:Song):Promise<void | Error>{
        try{
            console.log('inside unLikeSong')
            const isSongLiked = await FirebaseService.isSongLiked(userId, song.videoId)
            if(isSongLiked){
                await FirebaseService.db.collection(Tables.likedSongs).doc(userId).collection(Tables.nestedLikedSongs).doc(song.videoId).delete();
            }
        }catch(err){
            return CreateError(err)
        }
    }
    static async likeUnlikeSong(userId:string, song:Song):Promise<void | Error>{
        try{
            console.log('inside likeUnlikeSong')
            const isSongLiked = await FirebaseService.isSongLiked(userId, song.videoId)
            if(isSongLiked){
                await FirebaseService.db.collection(Tables.likedSongs).doc(userId).collection(Tables.nestedLikedSongs).doc(song.videoId).delete();
            } else{
                await FirebaseService.db.collection(Tables.likedSongs).doc(userId).collection(Tables.nestedLikedSongs).doc(song.videoId).set(song);
            }
        }catch(err){
            return CreateError(err)
        }
    }
    static async fetchLikedSongs(userId:string):Promise<Song[] | Error>{
        try{
            console.log('inside fetchLikedSongs')
            const data:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.likedSongs).doc(userId).collection(Tables.nestedLikedSongs).get()
            const songs:Song[] = data.docs.map((song:any) => getSongFromMap(song.data()))
            return songs
        } catch(err){
            return CreateError(err)
        }
    }
    static async checkIfUserIsAuthorised(user:AuthorisedUser): Promise<AuthorisedUser | Error | null>{
        try{
            console.log('inside checkIfUserIsAuthorised')
            const data:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.authorised_user).where('email',"==",user.email).get()
            if(data.docs.length){
                const doc = data.docs[0];
                const userData = doc.data();
                const authorisedUser:AuthorisedUser = {
                    user_type: userData.user_type as keyof typeof UserType as UserType,
                    email: userData.email,
                    club:getClubFromMap(userData.club)
                }
                return authorisedUser
            }
            return null;
        } catch(err){
            return CreateError(err)
        }
    }
    static async fetchClubSongs(clubId:string): Promise<Song[] | Error>{
        try{
            console.log('inside fetchClubSongs')
            const res:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.club_songs).doc(clubId).collection(Tables.nested_club_suggested_song).get()
            const songs:Song[] = res.docs.map((doc:FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
                const data = doc.data()
                const {title='', etag = '', videoId = '', channelTitle = '', channelId = '', imageUrl = '', likes=0} = data || {}
                console.log(`${title} likes`, likes)
                return {
                    title,
                    etag,
                    videoId,
                    channelTitle,
                    channelId,
                    imageUrl,
                    likes
                }
            })
            console.log(songs)
            return songs;
        }catch(err){
            return CreateError(err)
        }
    }
    static async fetchUserSuggestedClubSongs(clubId:string, userId:string): Promise<Song[] | Error>{
        try{
            console.log('inside fetchUserSuggestedClubSongs')
            const res:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.club_suggested_songs).doc(clubId).collection(Tables.nested_club_suggested_song).doc(userId).collection(Tables.nestedUserClubSuggestedSong).get()
            const songs:Song[] = res.docs.map((doc:FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
                const data = doc.data()
                const song = data.song
                const {title='', etag = '', videoId = '', channelTitle = '', channelId = '', imageUrl = '', likes=0} = song || {}
                return {
                    title,
                    etag,
                    videoId,
                    channelTitle,
                    channelId,
                    imageUrl,
                    docId: doc.id,
                    likes
                }
            })
            return songs;
        }catch(err){
            return CreateError(err)
        }
    }
    static async updateIfSongIsAdded(clubId:string, song:Song):Promise<number>{
        try{
            console.log('inside updateIfSongIsAdded')
            const doc:FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.club_songs).doc(clubId).collection(Tables.nested_club_suggested_song).doc(song.videoId).get()
            if(doc.exists){
                let docData = doc.data()
                console.log(docData)
                let likes:number = parseInt(docData['likes'] ?? 0)
                await doc.ref.update({"likes": likes+1}) 
                return likes + 1
            } else{
                return 0
            }
        } catch(err){
            return 0
        }
    }
    static async addSongToList(clubId:string, song:Song, userId:string):Promise<number|Error>{
        try{
            console.log('inside addSongToList')
            const songLikes:number = await FirebaseService.updateIfSongIsAdded(clubId, song);
            if(songLikes < 1){
                const songToAdd:Song = {...song, likes:1}
                console.log(`song to add`, songToAdd)
                await FirebaseService.db.collection(Tables.club_songs).doc(clubId).collection(Tables.nested_club_suggested_song).doc(song.videoId).set(songToAdd);
            }
            await FirebaseService.addSongToUserSuggestions(clubId, userId, song)
            return songLikes === 0 ? 1 : songLikes  
        } catch(err){
            return CreateError(err)
        }
    }
    static async addSongToUserSuggestions(clubId:string, userId:string, song:Song):Promise<void|Error>{
        try{
            console.log('addSongToUserSuggestions')
            await FirebaseService.db.collection(Tables.club_suggested_songs).doc(clubId).collection(Tables.nested_club_suggested_song).doc(userId).collection(Tables.nestedUserClubSuggestedSong).doc(song.videoId).set(song)
        } catch(err){
            return CreateError(err)
        }
    }
    
    static async removeSongFromList(clubId:string, songId:string):Promise<void|Error>{
        try{
            console.log('inside removeSongFromList')
            await FirebaseService.db.collection(Tables.club_songs).doc(clubId).collection(Tables.nested_club_suggested_song).doc(songId).delete();
        } catch(err){
            return CreateError(err)
        }
    }
    static async removeUserSuggestedSong(clubId:string, songId:string, userId:string): Promise<number | Error>{
        try{
            console.log('inside removeUserSuggestedSong')
            console.log(clubId)
            console.log(songId)
            console.log(userId)
            await FirebaseService.db.collection(Tables.club_suggested_songs).doc(clubId).collection(Tables.nested_club_suggested_song).doc(userId).collection(Tables.nestedUserClubSuggestedSong).doc(songId).delete()
            const doc:FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.club_songs).doc(clubId).collection(Tables.nested_club_suggested_song).doc(songId).get()
            if(doc.exists){
                let docData = doc.data()
                let likes:number = parseInt(docData['likes'] ?? 1)
                if(likes <= 1){
                    await doc.ref.delete()
                    return 0
                } else{
                    await doc.ref.update({
                        'likes':likes - 1
                    })
                    return likes - 1
                }
            }
            return 0
        } catch(err){
            return CreateError(err)
        }
    }
    static async addUserToTable(user:User): Promise<void | Error>{
        try{
            console.log('inside addUserToTable')
            await FirebaseService.db.collection(Tables.user).doc(user.uid).set(user)
        } catch(err){
            return CreateError(err)
        }
    }
    static async createCustomToken(user:User):Promise<string | Error>{
        try{
            console.log('inside createCustomToken')
           const token:string =  await FirebaseService.auth.createCustomToken(user.uid)
           return token;
        } catch(err){
            return CreateError(err)
        }
    }
    static async fetchClubs():Promise<Club[] | Error>{
        try{
            console.log('inside fetchclubs')
           const snapshot:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =  await FirebaseService.db.collection(Tables.clubs).get()
           if(snapshot.empty){
            return []
           } else{
            return snapshot.docs.map((entry) => {
                const data = entry.data()
                return {
                    clubId:entry.id,
                    clubName:data.name,
                    email:data.email || ''
                } as Club
            })
           }
        } catch(err){
            return CreateError(err)
        }
    }
    static async deleteClub(clubId:string, email:string):Promise<void | Error>{
        try{
            console.log('inside deleteClub')
            await FirebaseService.db.collection(Tables.clubs).doc(clubId).delete()
            const users:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.user).where("email","==", email).get()
            for(const user of users.docs){
                await user.ref.delete()
            }
            const authorisedUsers:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.authorised_user).where("email","==", email).get()
            for(const authUser of authorisedUsers.docs){
                await authUser.ref.delete()
            }
        } catch(err){
            return CreateError(err)
        }
    }
    static async addAuthorisedUser(club:Club):Promise<void | Error>{
        try{
            console.log('inside addAuthorisedUser')
            await FirebaseService.db.collection(Tables.authorised_user).add({
                club:{
                    clubId:club.clubId,
                    clubName:club.clubName,
                    email:club.email
                },
                email:club.email,
                user_type:"dj"
            })
        } catch(err){
            return CreateError(err)
        }
    }
    static async updateClub(club:Club, oldEmail:string):Promise<Club | Error>{
        try{
            console.log('inside updateClub')
            await FirebaseService.db.collection(Tables.clubs).doc(club.clubId).update({
                name:club.clubName,
                email:club.email
            })
            if(club.email !== oldEmail){
                if(oldEmail.length){
                    const users:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.user).where("email","==", oldEmail).get()
                    for(const user of users.docs){
                        await user.ref.update({
                            user_type:'user'
                        })
                    }
                    const authorisedUsers:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.authorised_user).where("email","==", oldEmail).get()
                    for(const authUser of authorisedUsers.docs){
                        await authUser.ref.update({
                            email:club.email
                        })
                    }
                } else{
                    const users:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.user).where("email","==", club.email).get()
                    if(users.docs.length){
                        for(const user of users.docs){
                            await user.ref.update({
                                club,
                                user_type:'dj'
                            })
                        }
                    } else{
                        await FirebaseService.addAuthorisedUser(club)
                    }
                }
            }
        } catch(err){
            return CreateError(err)
        }
    }
    static async addClub(clubName:string, email:string):Promise<Club | Error>{
        try{
            console.log('inside addClub')
            const data:FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.clubs).add({
                name:clubName,
                email
            })
            const club:Club = {
                clubId:data.id,
                clubName,
                email
            }
            await FirebaseService.addAuthorisedUser(club)
            return club;
        } catch(err){
            return CreateError(err)
        }
    }
    static async addModerator(email:string):Promise<void|Error>{
        try{
            console.log('inside addModerator')
            await FirebaseService.db.collection(Tables.authorised_user).add({
                email,
                user_type:'moderator'
            })
        } catch(err){
            return CreateError(err)
        }
    }
    static async getModerators():Promise<string[]|Error>{
        try{
            console.log('inside getModerators')
            const data:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.authorised_user).where("user_type","==", "moderator").get()
            const users = data.docs.map((user) => {
                const userData = user.data()
                return userData.email || ''
            })
            return users
        } catch(err){
            return CreateError(err)
        }
    }
    static async deleteModerator(email:string):Promise<void | Error>{
        try{
            console.log('inside deleteModerator')
            const authorisedUser:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.authorised_user).where("email","==", email).get()
            for(const doc of authorisedUser.docs){
                await doc.ref.delete()
            }
            const user:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.user).where("email","==", email).get()
            for(const doc of user.docs){
                await doc.ref.update({
                    user_type:"user"
                })
            }
        } catch(err){
            return CreateError(err)
        }
    }
}

export default FirebaseService