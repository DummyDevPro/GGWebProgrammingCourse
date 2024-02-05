import { app } from '@/firebase/setup'
// import { analytics, logEvent } from '@/firebase/analytics'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    verifyPasswordResetCode,
    confirmPasswordReset,
    sendPasswordResetEmail,
    sendEmailVerification,
    applyActionCode,
    // for recovery email
    updateEmail
} from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { sendMail } from '@/assets/js/util'

const auth = getAuth(app)

const actionCodeSettings = {
    url: 'http://localhost:8080',
    handleCodeInApp: false,
}

// logEvent(analytics, "firebase-authorized" + serverTimestamp)

function handleSignInWithEmailAndPassword(email, password, callback) {
    signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
            if (!res.user.emailVerified) {
                callback({ 'myStatus': 'info', rebounce: true, 'user': res.user, 'extraMsg': 'メールの認証を行ってください。<br>又は再認証のボタンをクリックしてください。' })
            } else {
                // callback({ 'myStatus': 'success' })
                callback({ 'uid': res.user.uid, 'displayName': res.user.displayName, 'emailAddress': res.user.email, 'myStatus': 'success' })
            }
        })
        .catch((error) => {
            callback({ 'myStatus': 'error', 'uid': null, ...error })
        })
}

async function handleCreateUserWithEmailAndPassword(email, password, callback) {
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (!user.emailVerified) {
                handleSendEmailVerification(user, email, callback)
            } else {
                callback({ 'myStatus': 'success' })
            }
        })
        .catch((error) => {
            callback({ 'myStatus': 'error', ...error })
        });
}

function handleSendEmailVerification(user, email, callback) {
    // send verification url 
    let acs = actionCodeSettings
    acs.url += `/home?email=${email}`

    sendEmailVerification(user, acs)
        .then(() => {
            callback({ 'myStatus': 'info', 'extraMsg': 'メールを確認してください。' })
        })
        .catch((error) => {
            callback({ 'myStatus': 'error', ...error })
        })
}

async function handleSignOut(callback) {
    try {
        await signOut(auth)
        callback({ 'code': 'signOut/success', 'myStatus': 'success' })
    } catch (error) {
        callback({ 'myStatus': 'error', ...error })
    }
}

function handleResetPassword(actionCode, password, callback) {
    verifyPasswordResetCode(auth, actionCode)
        .then((email) => {
            const accountEmail = email;
            confirmPasswordReset(auth, actionCode, password)
                .then(() => {
                    // send success message to user email
                    sendMail(accountEmail, 'アカウントのパスワード変更', 'パスワードの再設定をしました。')
                    handleSignInWithEmailAndPassword(accountEmail, password, callback)
                    // callback({ 'myStatus': 'success', 'extraMsg': 'パスワードを更新しました。' })
                })
                .catch((error) => {
                    callback({ 'myStatus': 'error', ...error })
                })
        })
        .catch((error) => {
            callback({ 'myStatus': 'error', ...error })
        })
}

function handleVerifyPasswordResetCode(actionCode, callback) {
    verifyPasswordResetCode(auth, actionCode)
        .then((email) => {
            callback({ 'myStatus': 'success' })
        })
        .catch((error) => {
            callback({ 'myStatus': 'error', ...error })
        })
}

function handleSendPasswordResetEmail(email, callback) {
    sendPasswordResetEmail(auth, email, actionCodeSettings)
        .then(() => {
            callback({ 'myStatus': 'success', 'extraMsg': `${email}にパスワードリセットするためのURLを送りました。` })
        })
        .catch((error) => {
            callback({ 'myStatus': 'error', ...error })
        })
}


function handleApplyActionCode(oobCode, callback) {
    applyActionCode(auth, oobCode)
        .then(() => {
            callback({ 'myStatus': 'success' })
        })
        .catch((error) => {
            callback({ 'myStatus': 'error', ...error })
        })
}

export {
    auth,
    handleSignInWithEmailAndPassword,
    handleCreateUserWithEmailAndPassword,
    handleSignOut,
    handleResetPassword,
    handleSendPasswordResetEmail,
    handleVerifyPasswordResetCode,
    handleSendEmailVerification,
    handleApplyActionCode
}