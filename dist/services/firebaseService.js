"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
const createError_1 = require("../utils/createError");
const tableEntities_1 = require("../utils/tableEntities");
const service_account_json_1 = __importDefault(require("./service-account.json"));
const user_1 = require("../entities/user");
const clubs_1 = require("../entities/clubs");
const song_1 = require("../entities/song");
class FirebaseService {
    constructor() {
        try {
            console.log('initialising firebase app');
            (0, app_1.initializeApp)({
                credential: (0, app_1.cert)(JSON.parse(JSON.stringify(service_account_json_1.default)))
            });
            FirebaseService.db = (0, firestore_1.getFirestore)();
            FirebaseService.auth = (0, auth_1.getAuth)();
        }
        catch (err) {
            console.error(err);
        }
    }
    static checkIfUserExists(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside checkIfUserExists');
                const snapshot = yield FirebaseService.db.collection(tableEntities_1.Tables.user).doc(user.uid).get();
                if (snapshot.exists) {
                    yield FirebaseService.db.collection(tableEntities_1.Tables.user).doc(user.uid).update({ "token": user.token });
                    const snapshotUser = (0, user_1.getUserFromSnapshot)(snapshot.data());
                    snapshotUser.token = user.token;
                    return snapshotUser;
                }
                return null;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static isSongLiked(userId, songId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside isSongLiked');
                const data = yield FirebaseService.db.collection(tableEntities_1.Tables.likedSongs).doc(userId).collection(tableEntities_1.Tables.nestedLikedSongs).doc(songId).get();
                if (data.exists) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    static likeSong(userId, song) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside likeSong');
                const isSongLiked = yield FirebaseService.isSongLiked(userId, song.videoId);
                if (!isSongLiked) {
                    yield FirebaseService.db.collection(tableEntities_1.Tables.likedSongs).doc(userId).collection(tableEntities_1.Tables.nestedLikedSongs).doc(song.videoId).set(song);
                }
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static unLikeSong(userId, song) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside unLikeSong');
                const isSongLiked = yield FirebaseService.isSongLiked(userId, song.videoId);
                if (isSongLiked) {
                    yield FirebaseService.db.collection(tableEntities_1.Tables.likedSongs).doc(userId).collection(tableEntities_1.Tables.nestedLikedSongs).doc(song.videoId).delete();
                }
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static likeUnlikeSong(userId, song) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside likeUnlikeSong');
                const isSongLiked = yield FirebaseService.isSongLiked(userId, song.videoId);
                if (isSongLiked) {
                    yield FirebaseService.db.collection(tableEntities_1.Tables.likedSongs).doc(userId).collection(tableEntities_1.Tables.nestedLikedSongs).doc(song.videoId).delete();
                }
                else {
                    yield FirebaseService.db.collection(tableEntities_1.Tables.likedSongs).doc(userId).collection(tableEntities_1.Tables.nestedLikedSongs).doc(song.videoId).set(song);
                }
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static fetchLikedSongs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside fetchLikedSongs');
                const data = yield FirebaseService.db.collection(tableEntities_1.Tables.likedSongs).doc(userId).collection(tableEntities_1.Tables.nestedLikedSongs).get();
                const songs = data.docs.map((song) => (0, song_1.getSongFromMap)(song.data()));
                return songs;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static checkIfUserIsAuthorised(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside checkIfUserIsAuthorised');
                const data = yield FirebaseService.db.collection(tableEntities_1.Tables.authorised_user).where('email', "==", user.email).get();
                if (data.docs.length) {
                    const doc = data.docs[0];
                    const userData = doc.data();
                    const authorisedUser = {
                        user_type: userData.user_type,
                        email: userData.email,
                        club: (0, clubs_1.getClubFromMap)(userData.club)
                    };
                    return authorisedUser;
                }
                return null;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static fetchClubSongs(clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside fetchClubSongs');
                const res = yield FirebaseService.db.collection(tableEntities_1.Tables.club_songs).doc(clubId).collection(tableEntities_1.Tables.nested_club_suggested_song).get();
                const songs = res.docs.map((doc) => {
                    const data = doc.data();
                    const { title = '', etag = '', videoId = '', channelTitle = '', channelId = '', imageUrl = '', likes = 0, artistName = '' } = data || {};
                    console.log(`${title} likes`, likes);
                    return {
                        title,
                        etag,
                        videoId,
                        channelTitle,
                        channelId,
                        imageUrl,
                        likes,
                        artistName,
                    };
                });
                console.log(songs);
                return songs;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static fetchUserSuggestedClubSongs(clubId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside fetchUserSuggestedClubSongs');
                const res = yield FirebaseService.db.collection(tableEntities_1.Tables.club_suggested_songs).doc(clubId).collection(tableEntities_1.Tables.nested_club_suggested_song).doc(userId).collection(tableEntities_1.Tables.nestedUserClubSuggestedSong).get();
                const songs = res.docs.map((doc) => {
                    const data = doc.data();
                    const song = data.song;
                    const { title = '', etag = '', videoId = '', channelTitle = '', channelId = '', imageUrl = '', likes = 0, artistName = '' } = song || {};
                    return {
                        title,
                        etag,
                        videoId,
                        channelTitle,
                        channelId,
                        imageUrl,
                        docId: doc.id,
                        likes,
                        artistName,
                    };
                });
                return songs;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static updateIfSongIsAdded(clubId, song) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside updateIfSongIsAdded');
                const doc = yield FirebaseService.db.collection(tableEntities_1.Tables.club_songs).doc(clubId).collection(tableEntities_1.Tables.nested_club_suggested_song).doc(song.videoId).get();
                if (doc.exists) {
                    let docData = doc.data();
                    console.log(docData);
                    let likes = parseInt((_a = docData['likes']) !== null && _a !== void 0 ? _a : 0);
                    yield doc.ref.update({ "likes": likes + 1 });
                    return likes + 1;
                }
                else {
                    return 0;
                }
            }
            catch (err) {
                return 0;
            }
        });
    }
    static addSongToList(clubId, song, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside addSongToList');
                const songLikes = yield FirebaseService.updateIfSongIsAdded(clubId, song);
                if (songLikes < 1) {
                    const songToAdd = Object.assign(Object.assign({}, song), { likes: 1 });
                    console.log(`song to add`, songToAdd);
                    yield FirebaseService.db.collection(tableEntities_1.Tables.club_songs).doc(clubId).collection(tableEntities_1.Tables.nested_club_suggested_song).doc(song.videoId).set(songToAdd);
                }
                yield FirebaseService.addSongToUserSuggestions(clubId, userId, song);
                return songLikes === 0 ? 1 : songLikes;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static addSongToUserSuggestions(clubId, userId, song) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('addSongToUserSuggestions');
                yield FirebaseService.db.collection(tableEntities_1.Tables.club_suggested_songs).doc(clubId).collection(tableEntities_1.Tables.nested_club_suggested_song).doc(userId).collection(tableEntities_1.Tables.nestedUserClubSuggestedSong).doc(song.videoId).set(song);
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static removeSongFromList(clubId, songId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside removeSongFromList');
                yield FirebaseService.db.collection(tableEntities_1.Tables.club_songs).doc(clubId).collection(tableEntities_1.Tables.nested_club_suggested_song).doc(songId).delete();
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static removeUserSuggestedSong(clubId, songId, userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside removeUserSuggestedSong');
                console.log(clubId);
                console.log(songId);
                console.log(userId);
                yield FirebaseService.db.collection(tableEntities_1.Tables.club_suggested_songs).doc(clubId).collection(tableEntities_1.Tables.nested_club_suggested_song).doc(userId).collection(tableEntities_1.Tables.nestedUserClubSuggestedSong).doc(songId).delete();
                const doc = yield FirebaseService.db.collection(tableEntities_1.Tables.club_songs).doc(clubId).collection(tableEntities_1.Tables.nested_club_suggested_song).doc(songId).get();
                if (doc.exists) {
                    let docData = doc.data();
                    let likes = parseInt((_a = docData['likes']) !== null && _a !== void 0 ? _a : 1);
                    if (likes <= 1) {
                        yield doc.ref.delete();
                        return 0;
                    }
                    else {
                        yield doc.ref.update({
                            'likes': likes - 1
                        });
                        return likes - 1;
                    }
                }
                return 0;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static addUserToTable(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside addUserToTable');
                yield FirebaseService.db.collection(tableEntities_1.Tables.user).doc(user.uid).set(user);
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static createCustomToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside createCustomToken');
                const token = yield FirebaseService.auth.createCustomToken(user.uid);
                return token;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static fetchClubs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside fetchclubs');
                const snapshot = yield FirebaseService.db.collection(tableEntities_1.Tables.clubs).get();
                if (snapshot.empty) {
                    return [];
                }
                else {
                    return snapshot.docs.map((entry) => {
                        const data = entry.data();
                        return {
                            clubId: entry.id,
                            clubName: data.name,
                            email: data.email || ''
                        };
                    });
                }
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static deleteClub(clubId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside deleteClub');
                yield FirebaseService.db.collection(tableEntities_1.Tables.clubs).doc(clubId).delete();
                const users = yield FirebaseService.db.collection(tableEntities_1.Tables.user).where("email", "==", email).get();
                for (const user of users.docs) {
                    yield user.ref.delete();
                }
                const authorisedUsers = yield FirebaseService.db.collection(tableEntities_1.Tables.authorised_user).where("email", "==", email).get();
                for (const authUser of authorisedUsers.docs) {
                    yield authUser.ref.delete();
                }
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static addAuthorisedUser(club) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside addAuthorisedUser');
                yield FirebaseService.db.collection(tableEntities_1.Tables.authorised_user).add({
                    club: {
                        clubId: club.clubId,
                        clubName: club.clubName,
                        email: club.email
                    },
                    email: club.email,
                    user_type: "dj"
                });
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static updateClub(club, oldEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside updateClub');
                yield FirebaseService.db.collection(tableEntities_1.Tables.clubs).doc(club.clubId).update({
                    name: club.clubName,
                    email: club.email
                });
                if (club.email !== oldEmail) {
                    if (oldEmail.length) {
                        const users = yield FirebaseService.db.collection(tableEntities_1.Tables.user).where("email", "==", oldEmail).get();
                        for (const user of users.docs) {
                            yield user.ref.update({
                                user_type: 'user'
                            });
                        }
                        const authorisedUsers = yield FirebaseService.db.collection(tableEntities_1.Tables.authorised_user).where("email", "==", oldEmail).get();
                        for (const authUser of authorisedUsers.docs) {
                            yield authUser.ref.update({
                                email: club.email
                            });
                        }
                    }
                    else {
                        const users = yield FirebaseService.db.collection(tableEntities_1.Tables.user).where("email", "==", club.email).get();
                        if (users.docs.length) {
                            for (const user of users.docs) {
                                yield user.ref.update({
                                    club,
                                    user_type: 'dj'
                                });
                            }
                        }
                        else {
                            yield FirebaseService.addAuthorisedUser(club);
                        }
                    }
                }
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static addClub(clubName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside addClub');
                const data = yield FirebaseService.db.collection(tableEntities_1.Tables.clubs).add({
                    name: clubName,
                    email
                });
                const club = {
                    clubId: data.id,
                    clubName,
                    email
                };
                yield FirebaseService.addAuthorisedUser(club);
                return club;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static addModerator(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside addModerator');
                yield FirebaseService.db.collection(tableEntities_1.Tables.authorised_user).add({
                    email,
                    user_type: 'moderator'
                });
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static getModerators() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside getModerators');
                const data = yield FirebaseService.db.collection(tableEntities_1.Tables.authorised_user).where("user_type", "==", "moderator").get();
                const users = data.docs.map((user) => {
                    const userData = user.data();
                    return userData.email || '';
                });
                return users;
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static deleteModerator(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside deleteModerator');
                const authorisedUser = yield FirebaseService.db.collection(tableEntities_1.Tables.authorised_user).where("email", "==", email).get();
                for (const doc of authorisedUser.docs) {
                    yield doc.ref.delete();
                }
                const user = yield FirebaseService.db.collection(tableEntities_1.Tables.user).where("email", "==", email).get();
                for (const doc of user.docs) {
                    yield doc.ref.update({
                        user_type: "user"
                    });
                }
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
    static deleteAllClubSongs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside deleteAllClubSongs');
                const clubs = yield FirebaseService.fetchClubs();
                if ((0, createError_1.instanceOfError)(clubs)) {
                    return clubs;
                }
                for (const club of clubs) {
                    console.log(`deleting songs for club ${club.clubId}`);
                    let songList = yield FirebaseService.db.collection(tableEntities_1.Tables.club_songs).doc(club.clubId).collection(tableEntities_1.Tables.nested_club_suggested_song).get();
                    for (const songListItem of songList.docs) {
                        yield songListItem.ref.delete();
                        console.log(`deleted song ${songListItem.id}`);
                    }
                }
            }
            catch (err) {
                return (0, createError_1.CreateError)(err);
            }
        });
    }
}
exports.default = FirebaseService;
//# sourceMappingURL=firebaseService.js.map