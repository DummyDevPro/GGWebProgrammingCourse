import { app } from './setup'
import { auth } from './auth'
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage'

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(app);

function handleFileUpload(file, fileType, saveFileType, callback) {
    switch (fileType) {
        case 'image':
            uploadImage(file, saveFileType, callback)
            break;
        default:
            callback({ msg: 'Not supported file type.', 'myStatus': 'error' })
            break;
    }
}

function handleFileDelete(fileName, fileType, saveFileFolderName, callback) {
    switch (fileType) {
        case 'image':
            deleteImage(fileName, saveFileFolderName, callback)
            break;
        default:
            callback({ msg: 'Not supported file type.', 'myStatus': 'error' })
            break;
    }
}

async function handleFileDownloadListUp(callback) {
    let allImages = []

    // User login status check-up
    if (!auth.currentUser) {
        callback({ msg: 'User is not login.', 'myStatus': 'error' })
        return;
    }

    // Create a reference under which you want to list
    const rootFolderRef = ref(storage, `images/${auth.currentUser.uid}`);

    try {
        let listUpFolder = await listAll(rootFolderRef)
        listUpFolder.prefixes.forEach(async (folder) => {
            let items = await listAll(folder)
            items.items.forEach((file) => {
                getDownloadURL(file).then((dUrl) => {
                    allImages.push({
                        name: file.name,
                        urlPath: dUrl
                    })
                })
            })
        })
        callback({ 'myStatus': 'success', allImages: allImages })
    } catch (error) {
        callback({ ...error, 'myStatus': 'error' })
    }
}

function downloadUrl(ref, callback) {
    getDownloadURL(ref).then((url) => {
        callback({ 'myStatus': 'success', fileUrl: url })
    }).catch((error) => {
        callback({ ...error, 'myStatus': 'error' })
    })
}

function uploadImage(file, saveFileType, callback) {
    // User login status check-up
    if (!auth.currentUser) {
        callback({ msg: 'User is not login.', 'myStatus': 'error' })
        return;
    }

    // Create a storage reference from our storage service
    const imgStorageRef = ref(storage, `images/${auth.currentUser.uid}/${saveFileType}/${Date.now() + file.name}`)

    uploadBytes(imgStorageRef, file).then((ss) => {
        downloadUrl(imgStorageRef, callback)
    }).catch((error) => {
        callback({ ...error, 'myStatus': 'error' })
    })
}

function deleteImage(fileName, saveFileFolderName, callback) {
    // User login status check-up
    if (!auth.currentUser) {
        callback({ msg: 'User is not login.', 'myStatus': 'error' })
        return;
    }

    // Create a reference to the file to delete
    const imgStorageRef = ref(storage, `images/${auth.currentUser.uid}/${saveFileFolderName}/${fileName}`)

    // Delete the file
    deleteObject(imgStorageRef).then(() => {
        callback({ 'myStatus': 'success' })
    }).catch((error) => {
        callback({ ...error, 'myStatus': 'error' })
    });
}

export {
    handleFileUpload,
    handleFileDelete,
    handleFileDownloadListUp
}