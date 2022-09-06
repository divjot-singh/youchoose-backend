import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { Auth, getAuth } from 'firebase-admin/auth';
import { CreateError } from '../utils/createError';
import { Tables } from '../utils/tableEntities';
import serviceAccount from './service-account.json';
import User from '../entities/user';
import Club from '../entities/clubs';

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
                    clubName:data.name
                } as Club
            })
           }
        } catch(err){
            return CreateError(err)
        }
    }
}

export default FirebaseService