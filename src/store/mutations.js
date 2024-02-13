import { fileToDataUrl } from '@/assets/js/fileRWUtils'
import { loadLocalStorage, saveToLocalStorage, clearSessionStorage } from '@/bstorage'

export default {
    initializeAppState: (state) => {
        const keys = Object.keys(state.userInfo)
        keys.forEach((key) => {
            state.userInfo[key] = loadLocalStorage(key)
        })
    },
    loginActionState: (state, response) => {
        if (response.uid != null) {
            state.userInfo = response
        } else {
            let keys = Object.keys(state.userInfo)
            keys.forEach((key) => {
                state.userInfo[key] = null
            })
        }
        saveToLocalStorage(state.userInfo)
    },
    logoutActionState: (state) => {
        state.userInfo.uid = null
        state.userInfo.displayName = null
        state.userInfo.emailAddress = null

        state.logoutModalState = true
        // saveToLocalStorage(state.userInfo)
        clearSessionStorage()
    },
    updateLoginModalState: (state) => {
        state.loginModalState = null
    },
    updateLogoutModalState: (state) => {
        state.logoutModalState = null
    },
    getCollectionDataState: (state, obj) => {
        state.collectionData[state.collectionDataRefKey[obj.collectionType]][obj.collectionName] = obj.response
    },
    addNewDocumentState: (state, res) => {
    },
    shortMsg: (state, obj) => {
        state.authMsg[obj.pageId][obj.myStatus]['msg'] = obj.code ? obj.code : null
        state.authMsg[obj.pageId][obj.myStatus]['time'] = Date.now()
    },
    updateProfileImageState: (state, url) => {
        console.log(state.collectionData['userProfileData'])
        state.collectionData['userProfileData']['user-profile']['profileImageUrl'] = url
        console.log(state.collectionData['userProfileData'])
    },
    updateAndSaveProfileImageUrlAsDataUrl: (state, obj) => {
        fileToDataUrl(obj.file, (dataUrl) => {
            let saveObj = {}
            saveObj[obj.key] = dataUrl
            saveToLocalStorage(saveObj)
            state.profile.profileImageUrl = dataUrl
        })
    },
    handleFileDownloadListUpState: (state, obj) => {
        state.profile.allImages = obj.allImages
    },
    alertMsg: (state, obj) => {
        // state.alertMsg.status = obj.myStatus
        // state.alertMsg.message = obj.code ? obj.code : null
        // state.alertMsg.time = Date.now()
        // state.alertMsg.extraMsg = obj.extraMsg ? obj.extraMsg : null
    }
}