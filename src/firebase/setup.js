import { initializeApp } from 'firebase/app';

// htun@osfl.ac.jp
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBFzSM3hYoFvNXCsixg22_kvprFUfmemzs",
    authDomain: "gaigo-web-app.firebaseapp.com",
    projectId: "gaigo-web-app",
    storageBucket: "gaigo-web-app.appspot.com",
    messagingSenderId: "770342086519",
    appId: "1:770342086519:web:99a00f7a71914dda7de372",
    measurementId: "G-58WNRNY8XT"
};

// htunmyatmaw1995ucsy@gmail.com
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBb02u8O0xSzGQynNd_-TzVPp1EnD-VRWo",
//     authDomain: "gaigo-6a1df.firebaseapp.com",
//     databaseURL: "https://gaigo-6a1df-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "gaigo-6a1df",
//     storageBucket: "gaigo-6a1df.appspot.com",
//     messagingSenderId: "20940403760",
//     appId: "1:20940403760:web:8c2f3e815afc343bdb29f5",
//     measurementId: "G-C2FH3SXCY7"
// };

const app = initializeApp(firebaseConfig);

export { app }