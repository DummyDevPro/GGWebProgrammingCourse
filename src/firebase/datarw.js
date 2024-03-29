import { app } from '@/firebase/setup'
import { auth } from '@/firebase/auth'
// import { analytics, logEvent } from '@/firebase/analytics'
import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import router from '@/router';

const db = getFirestore(app);

// logEvent(analytics, "make-db-connection");

async function readSingleDocument(collectionName, docId, callback) {
    if (!auth.currentUser) {
        callback({ 'code': 'Access Denined!', 'myStatus': 'error' })
        return;
    }

    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        callback({ 'data': docSnap.exists() ? docSnap.data() : [], 'myStatus': 'success' })
    } catch (error) {
        console.error(error);
        callback({ ...error, 'myStatus': 'error' })
    }
}

async function readSingleDocumentByQuery(collectionName, requiresAuth, backUserData, condition, callback) {
    if (!auth.currentUser && requiresAuth) {
        callback({ 'code': 'Access Denined!', 'myStatus': 'error' })
        return;
    }

    try {
        let userData = {};
        let whereList = generateWhereList(condition)
        const q = query(collection(db, collectionName), ...whereList)
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (doc.data()?.emailAddress) {
                userData = { ...doc.data(), docId: doc.id }
                return;
            }
        });

        if (Object.keys(userData).length != 0) {
            if (!backUserData) {
                callback({ 'myStatus': 'success' })
            } else {
                callback({ 'myStatus': 'success', data: userData })
            }
        } else {
            callback({ 'myStatus': 'error', 'extraMsg': 'このメールで登録したアカウントがありません。' })
        }
    } catch (error) {
        console.error(error);
        callback({ ...error, 'myStatus': 'error' })
    }
}

async function addNewDocumentByCustomDocId(collectionName, docId, data, callback) {
    if (!auth.currentUser) {
        callback({ 'code': 'Access Denined!', 'myStatus': 'error' })
        return;
    }

    try {
        const docRef = doc(db, collectionName, docId)
        await setDoc(docRef, data, { merge: true })
        callback({ 'myStatus': 'success' })
    } catch (error) {
        console.error(error);
        callback({ ...error, 'myStatus': 'error' })
    }
}

async function readCollectionFB(collectionName, condition, order, callback) {

    if (!auth.currentUser && router.currentRoute.value.meta.requiresAuth) {
        callback({ 'code': 'Access Denined!', 'myStatus': 'error' })
        return;
    }

    try {
        let responseArr = [];
        let whereList = generateWhereList(condition)
        let orderList = generateOrderList(order)
        const q = query(collection(db, collectionName), ...whereList, ...orderList);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            responseArr.push({ ...doc.data(), 'docId': doc.id })
        });

        callback({ 'data': responseArr, 'myStatus': 'success' })
    } catch (error) {
        console.error(error);
        callback({ ...error, 'myStatus': 'error' })
    }
}

async function addNewDocumentFB(data, callback) {
    if (data.requireUserInfo && !auth.currentUser) {
        callback({ 'code': 'Access Denined!', 'myStatus': 'error' })
        return;
    }

    try {
        const dataObj = data.requireUserInfo ? {
            ...data.dataObj,
            'uid': auth.currentUser.uid,
            'createdTimestamp': serverTimestamp()
        } : {
            ...data.dataObj,
            'createdTimestamp': serverTimestamp()
        }
        const docRef = await addDoc(collection(db, data.collectionName), dataObj);

        callback({ 'data': docRef.id, 'myStatus': 'success' })
    } catch (error) {
        console.error(error);
        callback({ ...error, 'myStatus': 'error' })
    }
}

async function updateUserCollection(docId, callback) {
    if (!auth.currentUser) {
        callback({ 'code': 'Access Denined!', 'myStatus': 'error' })
        return;
    }

    try {
        await updateExistingDocumentFB(
            { uid: auth.currentUser.uid },
            'users',
            docId,
            callback
        )
    } catch (error) {
        console.error(error);
        callback({ ...error, 'myStatus': 'error' })
    }
}

async function updateExistingDocumentFB(data, collectionName, docId, callback) {
    if (!auth.currentUser) {
        callback({ 'code': 'Access Denined!', 'myStatus': 'error' })
        return;
    }

    try {
        await addNewDocumentByCustomDocId(collectionName, docId, data, callback)
    } catch (error) {
        console.error(error);
        callback({ ...error, 'myStatus': 'error' })
    }
}

async function updateExistingDocumentFieldsFB(collectionName, docId, data, callback) {
    if (!auth.currentUser) {
        callback({ 'code': 'Access Denined!', 'myStatus': 'error' })
        return;
    }

    try {
        const dataRef = doc(db, collectionName, docId);
        await updateDoc(dataRef, data);
        callback({ 'myStatus': 'success' })
    } catch (error) {
        console.error(error);
        callback({ ...error, 'myStatus': 'error' })
    }
}

function generateOrderList(data) {
    let list = []
    for (let i = 0; i < data.length; i++) {
        if (data[i])
            list.push(orderBy(data[i].name, data[i].type))
    }
    return list
}

function generateWhereList(data) {
    let list = []
    for (let i = 0; i < data.length; i++) {
        if (data[i])
            list.push(where(data[i].key, data[i].opt, data[i].value))
    }
    return list
}

export {
    readCollectionFB,
    readSingleDocument,
    addNewDocumentFB,
    updateExistingDocumentFB,
    readSingleDocumentByQuery,
    updateExistingDocumentFieldsFB,
    updateUserCollection
}