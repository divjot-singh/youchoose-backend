import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { Auth, getAuth } from 'firebase-admin/auth';
import { CreateError } from '../utils/createError';
import { Tables } from '../utils/tableEntities';
import serviceAccount from './service-account.json';
import User, { AuthorisedUser, getUserFromSnapshot, UserType } from '../entities/user';
import Club, { getClubFromMap } from '../entities/clubs';
import { AddSuggestedSongsHandlerBody, SongEntityAtClub } from '../entities/postBodyEntities';
import Song, { getSongFromMap } from '../entities/song';
import { getUniqueSongs } from '../utils/common_utils';

class FirebaseService{
    private static db:FirebaseFirestore.Firestore;
    private static auth: Auth;
    constructor(){
        initializeApp({
            credential: cert(JSON.parse(JSON.stringify(serviceAccount)))
          });
        FirebaseService.db = getFirestore();
        FirebaseService.auth = getAuth()
    }
    static async checkIfUserExists(user:User): Promise<User | Error | null>{
        try{
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
    static async addSuggestedSongToClub(songData:AddSuggestedSongsHandlerBody): Promise<string | Error>{
        try{
            const dataAtDoc:SongEntityAtClub = {
                song:songData.song,
            }
            if(songData?.userId){
                dataAtDoc.userId = songData.userId
            }
            const res = await FirebaseService.db.collection(Tables.club_suggested_songs).doc(songData.clubId).collection(Tables.nested_club_suggested_song).add(dataAtDoc);
            return res.id
        }catch(err){
            return CreateError(err)
        }
    }
    static async isSongLiked(userId:string, songId:string):Promise<boolean>{
        try{
            const data = await FirebaseService.db.collection(Tables.likedSongs).doc(userId).collection(Tables.nestedLikedSongs).doc(songId).get();
            if(data.exists){
                return true
            } else{
                return false
            }
        } catch(err){
            return false
        }
    }
    static async likeUnlikeSong(userId:string, song:Song):Promise<void | Error>{
        try{
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
            const data:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.likedSongs).doc(userId).collection(Tables.nestedLikedSongs).get()
            const songs:Song[] = data.docs.map((song:any) => getSongFromMap(song.data()))
            return songs
        } catch(err){
            return CreateError(err)
        }
    }
    static async checkIfUserIsAuthorised(user:AuthorisedUser): Promise<AuthorisedUser | Error | null>{
        try{
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
            const res:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.club_songs).doc(clubId).collection(Tables.nested_club_suggested_song).get()
            const songs:Song[] = res.docs.map((doc:FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
                const data = doc.data()
                const {title='', etag = '', videoId = '', channelTitle = '', channelId = '', imageUrl = ''} = data || {}
                return {
                    title,
                    etag,
                    videoId,
                    channelTitle,
                    channelId,
                    imageUrl
                }
            })
            return songs;
        }catch(err){
            return CreateError(err)
        }
    }
    static async fetchUserSuggestedClubSongs(clubId:string, userId:string): Promise<Song[] | Error>{
        try{
            const res:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.club_suggested_songs).doc(clubId).collection(Tables.nested_club_suggested_song).where('userId', "==", userId).get();
            const songs:Song[] = res.docs.map((doc:FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
                const data = doc.data()
                const song = data.song
                const {title='', etag = '', videoId = '', channelTitle = '', channelId = '', imageUrl = ''} = song || {}
                return {
                    title,
                    etag,
                    videoId,
                    channelTitle,
                    channelId,
                    imageUrl,
                    docId: doc.id
                }
            })
            return songs;
        }catch(err){
            return CreateError(err)
        }
    }
    static async getSuggestedSongs(clubId:string): Promise<Song[] | Error>{
        try{
            const res:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.club_suggested_songs).doc(clubId).collection(Tables.nested_club_suggested_song).get();
            const songs:Song[] = res.docs.map((doc:FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
                const data = doc.data()
                const song = data.song
                const {title='', etag = '', videoId = '', channelTitle = '', channelId = '', imageUrl = ''} = song || {}
                return {
                    title,
                    etag,
                    videoId,
                    channelTitle,
                    channelId,
                    imageUrl,
                    docId: doc.id
                }
            })
            return getUniqueSongs(songs);
        }catch(err){
            return CreateError(err)
        }
    }
    static async checkIfSongIsAdded(clubId:string, song:Song):Promise<string|Error>{
        try{
            const data:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.club_songs).doc(clubId).collection(Tables.nested_club_suggested_song).where("videoId", "==", song.videoId).get()
            if(data.docs.length){
                return data.docs[0].id
            } else{
                return
            }
        } catch(err){
            return CreateError(err)
        }
    }
    static async addSongToList(clubId:string, song:Song):Promise<string|Error>{
        try{
            const isSongAdded:string | Error = await FirebaseService.checkIfSongIsAdded(clubId, song);
            if(typeof isSongAdded === 'string'){
                return isSongAdded
            } else{
                const res = await FirebaseService.db.collection(Tables.club_songs).doc(clubId).collection(Tables.nested_club_suggested_song).add(song);
                return res.id
            }
        } catch(err){
            return CreateError(err)
        }
    }
    static async removeSongFromList(clubId:string, song:Song):Promise<void|Error>{
        try{
            const data:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await FirebaseService.db.collection(Tables.club_songs).doc(clubId).collection(Tables.nested_club_suggested_song).where("videoId", "==", song.videoId).get()
            if(data.docs.length){
                for(const doc of data.docs){
                    await doc.ref.delete()
                }
            }
        } catch(err){
            return CreateError(err)
        }
    }
    static async removeUserSuggestedSong(clubId:string, docId:string): Promise<void | Error>{
        try{
            await FirebaseService.db.collection(Tables.club_suggested_songs).doc(clubId).collection(Tables.nested_club_suggested_song).doc(docId).delete()
        } catch(err){
            return CreateError(err)
        }
    }
    static async removeSuggestedSong(clubId:string, songId:string): Promise<void | Error>{
        try{
            const data:FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =  await FirebaseService.db.collection(Tables.club_suggested_songs).doc(clubId).collection(Tables.nested_club_suggested_song).get()
            if(data.docs.length){
                for(const doc of data.docs){
                    const docData = doc.data()
                    const song = docData.song
                    if(song && song.videoId === songId){
                        await doc.ref.delete()
                    }
                }
            }
        } catch(err){
            return CreateError(err)
        }
    }
    static async addUserToTable(user:User): Promise<void | Error>{
        try{
            await FirebaseService.db.collection(Tables.user).doc(user.uid).set(user)
        } catch(err){
            return CreateError(err)
        }
    }
    static async createCustomToken(user:User):Promise<string | Error>{
        try{
           const token:string =  await FirebaseService.auth.createCustomToken(user.uid)
           return token;
        } catch(err){
            return CreateError(err)
        }
    }
    static async fetchClubs():Promise<Club[] | Error>{
        try{
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