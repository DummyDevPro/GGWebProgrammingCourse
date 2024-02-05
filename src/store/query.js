export default {
    'profile': {
        get: {
            account: {
                saveCollectionName: 'user-profile',
                collectionName: 'users_profile',
            }
        }
    },
    'all': {
        get: {
            answer: {
                saveCollectionName: 'all-answers',
                collectionName: 'user_answers',
                where: ['uid'],
                order: {
                    name: 'createdTimestamp',
                    type: 'desc'
                }
            },
            project: {
                saveCollectionName: 'all-projects',
                collectionName: 'student_projects',
                where: null,
                order: {
                    name: 'createdTimestamp',
                    type: 'desc'
                }
            },
            listUpQuestionCollection: {
                saveCollectionName: 'allQuestionsCollection',
                collectionName: 'all_questions_collection',
                where: ['type'],
            },
            users: {
                saveCollectionName: 'allUsers',
                collectionName: 'users',
                where: null,
                order: {
                    name: 'createdTimestamp',
                    type: 'desc'
                }
            }
        }
    },
    'java-bronze': {
        get: {
            chapter: {
                saveCollectionName: 'java-bronze',
                collectionName: 'java_bronze_overview',
                where: null,
                order: {
                    name: 'chapterCodeId',
                    type: 'asc'
                },
            },
            question: {
                saveCollectionName: 'java-bronze',
                collectionName: 'java_bronze_questions',
                where: ['chapterCodeId'],
                // order: {
                //     name: 'id',
                //     type: 'asc'
                // },
            }
        },
        post: {
        },
    },
    'java-basic': {
        get: {
            chapter: {
                saveCollectionName: 'java-basic',
                collectionName: 'java_basic_overview',
                where: null,
                order: {
                    name: 'chapterCodeId',
                    type: 'asc'
                },
            },
            question: {
                saveCollectionName: 'java-basic',
                collectionName: 'java_basic_questions',
                where: ['chapterCodeId'],
                // order: {
                //     name: 'id',
                //     type: 'asc'
                // },
            }
        },
        post: {
        },
    },
    'java-word-problem': {
        get: {
            chapter: {
                saveCollectionName: 'java-word-problem',
                collectionName: 'java_word_problem_overview',
                where: null,
                order: {
                    name: 'chapterCodeId',
                    type: 'asc'
                },
            },
            question: {
                saveCollectionName: 'java-bronze',
                collectionName: 'java_word_problem_questions',
                where: ['chapterCodeId'],
                // order: {
                //     name: 'id',
                //     type: 'asc'
                // },
            }
        },
        post: {
        },
    },
    'itf': {
        get: {
            chapter: {
                saveCollectionName: 'itf',
                collectionName: 'it_fundamental_overview',
                where: null,
                order: {
                    name: 'chapterCodeId',
                    type: 'asc'
                },
            },
            question: {
                saveCollectionName: 'itf',
                collectionName: 'it_fundamental_questions',
                where: ['chapterCodeId'],
                // order: {
                //     name: 'id',
                //     type: 'asc'
                // },
            }
        },
        post: {
        },
    },
    'year-schedule': {
        get: {
            schedules: {
                saveCollectionName: 'year-schedule',
                collectionName: 'all_years_schedule',
                where: ['school_year', 'grade'],
                order: {
                    name: 'part',
                    type: 'asc'
                }
            }
        },
        post: {}
    }
}