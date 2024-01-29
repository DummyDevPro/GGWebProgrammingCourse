import query from "./query"
export default {
    userRole: 0, // 0 : everyone, 1 : member, 2 : admin
    // fireabse user
    userInfo: {
        'uid': null,
        'displayName': null,
        'emailAddress': null,
        'userRole': null,
        'profileImageUrl': null
    },
    // user profile
    profile: {
        profileImageByteData: '',
        profileImageUrl: '',
        allImages: []
    },
    loginModalMsg: '',
    loginModalState: null,
    logoutModalState: null,

    // Firebase Collection Relation START
    collectionRelation: query,
    collectionData: {
        'userProfileData': {},
        'chapterData': {},
        'questionData': {},
        'answerData': {},
        'projectData': {},
        'schedulesData': {},
        'firestoreDbList': {}
    },
    // collectionDataType: {
    collectionDataRefKey: {
        'account': 'userProfileData',
        'chapter': 'chapterData',
        'question': 'questionData',
        'answer': 'answerData',
        'project': 'projectData',
        'listUpQuestionCollection': 'firestoreDbList',
        'schedules': 'schedulesData'
    },
    // Firebase Collection Relation END

    errorToast: null,
    authMsg: {
        renewPass: {
            success: {
                msg: '',
                time: ''
            },
            error: {
                msg: '',
                time: ''
            }
        },
        resetPass: {
            success: {
                msg: '',
                time: ''
            },
            error: {
                msg: '',
                time: ''
            }
        }
    },
    alertMsg: {
        status: null,
        message: null,
        time: null,
        extraMsg: null
    }
}