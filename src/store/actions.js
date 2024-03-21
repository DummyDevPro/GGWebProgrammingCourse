import {
    handleCreateUserWithEmailAndPassword,
    handleSignInWithEmailAndPassword,
    handleSignOut,
    handleResetPassword,
    handleSendPasswordResetEmail,
    handleVerifyPasswordResetCode,
    handleSendEmailVerification,
    handleApplyActionCode,
} from '@/firebase/auth'

import {
    readCollectionFB,
    addNewDocumentFB,
    updateExistingDocumentFB,
    readSingleDocument,
    readSingleDocumentByQuery,
    updateExistingDocumentFieldsFB,
    updateUserCollection
} from '@/firebase/datarw'

import {
    handleFileUpload,
    handleFileDelete,
    handleFileDownloadListUp
} from '@/firebase/storage'

import router from '@/router'

export default {
    initializeApp(context) {
        context.commit('initializeAppState')
    },
    loginAction(context, { 'email': email, 'password': password }) {
        return new Promise((resolve, __) => {
            handleSignInWithEmailAndPassword(email, password, (signResponse) => {
                if (signResponse.myStatus == 'success') {
                    delete signResponse.myStatus
                    // get login user information from [users collection]
                    readSingleDocumentByQuery(
                        'users',
                        true,
                        true,
                        [{ key: 'emailAddress', opt: '==', value: email }],
                        (userDataResponse) => {
                            if (userDataResponse.myStatus == 'success') {
                                // if user_id doesn't exist add user_id
                                if (!userDataResponse.uid) {
                                    updateUserCollection(userDataResponse.data.docId, (_) => { })
                                }

                                delete userDataResponse.myStatus
                                let userInfo = {
                                    ...userDataResponse.data,
                                    ...signResponse
                                }
                                context.commit('loginActionState', userInfo)
                            }
                        })
                } else {
                    resolve(signResponse)
                }
            })
        })
    },
    sendEmailVerification(context, user) {
        return new Promise((resolve, __) => {
            handleSendEmailVerification(user, (response) => {
                resolve(response)
            })
        })
    },
    logoutAction(context) {
        handleSignOut((response) => {
            context.commit('logoutActionState')
        });
    },
    updateLoginModal(context) {
        context.commit('updateLoginModalState')
    },
    updateLogoutModal(context) {
        context.commit('updateLogoutModalState')
    },
    getCollectionData(context, obj) {

        return new Promise((resolve, __) => {
            if (obj.docId) {
                readSingleDocument(
                    obj.collectionName,
                    obj.docId,
                    ((response) => {
                        if (response.myStatus == 'error') {
                            // context.commit('alertMsg', { ...response, })
                        } else {
                            if (response.data?.length == 0 && obj.init) {
                                // from profile page(need initialization) 
                                updateExistingDocumentFB(
                                    {
                                        email: context.state.userInfo.emailAddress
                                    },
                                    'users_profile',
                                    obj.docId,
                                    (response) => {
                                        context.commit('getCollectionDataState',
                                            {
                                                response: response.data,
                                                groupName: obj.groupName,
                                                saveCollectionName: obj.saveCollectionName
                                            })
                                    })
                            }
                            else {
                                context.commit('getCollectionDataState',
                                    {
                                        response: response.data,
                                        groupName: obj.groupName,
                                        saveCollectionName: obj.saveCollectionName
                                    })
                            }
                            resolve()
                        }
                    })
                )
            } else {
                readCollectionFB(
                    obj.collectionName
                    , obj.wheres
                    , obj.orders
                    , (response) => {
                        if (response.myStatus == 'error') {
                            // context.commit('alertMsg', { ...response, })
                        } else {
                            context.commit('getCollectionDataState',
                                {
                                    response: response.data,
                                    groupName: obj.groupName,
                                    saveCollectionName: obj.saveCollectionName
                                })
                        }
                        resolve()
                    })
            }
        })
    },
    addNewDocument(context, obj) {
        console.log(obj);
        return new Promise((resolve, reject) => {
            addNewDocumentFB(obj, (response) => {
                if (response != null) {
                    // Redirect somewhere
                    if (obj.redirectPath != null) {
                        router.replace({
                            name: obj.redirectPath
                        })
                    } else {
                        resolve()
                    }
                } else {
                    reject()
                }
            })
        })
    },
    updateExistingDocument(context, obj) {
        updateExistingDocumentFB(
            obj.data,
            obj.collectionName,
            obj.docId,
            (response) => {
                console.log(response);
            })
    },
    updateExistingDocumentFields(context, obj) {
        return new Promise((resolve, reject) => {
            updateExistingDocumentFieldsFB(
                obj.collectionName,
                obj.docId,
                obj.data,
                (response) => {
                    console.log(response);
                    resolve()
                }
            )
        })
    },
    backOneHistory(context) {
        router.go(-1);
    },
    createNewAccountWithEmailAndPassword(context, accInfo) {
        return new Promise((resolve, __) => {
            handleCreateUserWithEmailAndPassword(accInfo.email, accInfo.password, (response) => {
                resolve(response)
            })
        })
    },
    verifyEmailForAccountCreation(context, { oobCode }) {
        return new Promise((resolve, __) => {
            handleApplyActionCode(oobCode, (response) => {
                resolve(response)
            })
        })
    },
    resetPassword(context, { oobCode: oobCode, password: password }) {
        handleResetPassword(oobCode, password, (response) => {
            if (response.myStatus == 'success') {
                context.commit('loginActionState', response)

                router.push({ path: '/' })
                router.removeRoute('mailAuth')
            }
            // TODO Error timing not known
        })
    },
    renewPasswordByMail(context, { email: email }) {
        return new Promise((resolve, __) => {
            // check user account exists or not by using email
            readSingleDocumentByQuery(
                'users',
                false,
                false,
                [{ key: 'emailAddress', opt: '==', value: email }],
                (response) => {

                    // if user doesn't exist send back error message
                    if (response.myStatus == 'error') {
                        resolve(response)
                    }
                    // if user exists 
                    else {
                        // send authentication url to user mail
                        handleSendPasswordResetEmail(email, (response) => {
                            resolve(response)
                        })
                    }
                })
        })
    },
    resetPasswordLinkValidCheck(context, { oobCode: oobCode }) {
        return new Promise((resolve, __) => {
            handleVerifyPasswordResetCode(oobCode, (response) => {
                resolve(response)
                // context.commit('alertMsg', { ...response, })
                // context.commit('shortMsg', { ...response, pageId: 'resetPass' })
            })
        })
    },
    fileUpload(context, { file: file, fileType: fileType, saveFileFolderName: saveFileFolderName, docId: docId }) {

        // update firebase storage/images
        handleFileUpload(
            file,
            fileType,
            saveFileFolderName,
            true,
            (response) => {
                if (response.myStatus === 'success') {
                    // save to firebase/firestore (collection : accounts)
                    if (saveFileFolderName === 'profile') {
                        updateExistingDocumentFB(
                            {
                                profileImageUrl: response.fileUrl,
                            },
                            'users_profile',
                            docId,
                            (__) => {
                                console.log(response.fileUrl);
                                context.commit('updateProfileImageState', response.fileUrl)
                            })

                        // update state
                        context
                            .commit('updateAndSaveProfileImageUrlAsDataUrl',
                                { file: file, key: 'profile-image' })
                    }

                }
            })
    },
    fileDelete(context, obj) {
        handleFileDelete(obj.fileName, obj.fileType, obj.saveFileFolderName, (response) => {
            if (response.myStatus == 'success') {
                context.dispatch('getAllImages')
            }
        })
    },
    getAllImages(context) {
        handleFileDownloadListUp((response) => {
            if (response.myStatus === 'success') {
                context.commit('handleFileDownloadListUpState', response)
            }
        })
    },
    registerStudentProject(context, data) {
        console.log(data);
        // update firebase storage/images
        return new Promise((resolve, __) => {
            handleFileUpload(
                data.projectImageFile,
                'image',
                'student_projects_image',
                false,
                (response) => {
                    if (response.myStatus === 'success') {
                        // save to firebase/firestore (collection : student_projects)
                        addNewDocumentFB(
                            {
                                dataObj: {
                                    projectTitle: data.projectTitle,
                                    projectUrl: data.projectUrl,
                                    projectOwner: data.projectOwner,
                                    projectImageUrl: response.fileUrl
                                },
                                collectionName: 'student_projects',
                                requireUserInfo: true
                            },
                            (__) => {
                                resolve()
                            })
                    }
                })
        })
    }
}