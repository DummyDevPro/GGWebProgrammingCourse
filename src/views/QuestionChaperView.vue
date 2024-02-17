<template>
    <div class="wrapper">
        <div v-if="getChapterInfo" class="bg-dark text-white px-3 d-flex align-items-center"
            style="position: sticky;top:72px;">
            <span class="fs-5">{{ getChapterInfo['chapterTitle'] }}</span>
            <span class="fs-5 text-warning"><i class="bi bi-chevron-compact-right"></i></span>
            <span class="small">{{ getChapterInfo['chapterSubtitle'] }}</span>

            <span class="ms-auto">{{ startDateTimeFormatted }}</span>
        </div>

        <div v-if="!questionsList" class="m-auto py-5" style="width: max-content;">
            <div>
                <h3>Fetching Data</h3>
            </div>
            <div class="d-flex gap-1">
                <span v-for="dot in dots" class="p-1 bg-primary">
                    {{ dot }}
                </span>
            </div>
        </div>
        <div v-else-if="questionsList.length == 0" class="py-5">
            {{ stopDotsInterval() }}
            <div class="d-flex flex-column align-items-center">
                <i class="bi bi-database-fill-x" style="font-size: 3rem;"></i>
                <span class="fs-6">NO DATA</span>
            </div>
        </div>
        <div v-else class="questions-grid col-11 col-sm-11 col-md-11 col-md-9 col-lg-7">
            {{ stopDotsInterval() }}
            {{ recordStartDate() }}
            <!-- v-if="questionsList != null && questionsList.length != 0" -->
            <div class="qiestion-item overflow-auto">
                <div class="question-title d-flex mb-3 p-2">
                    <span class="q-no">{{ `(${currentIndex + 1})` }}</span>
                    <span class="q-text">{{ questionsList[currentIndex]['questionTitle'] }}</span>
                </div>

                <div v-if="questionsList[currentIndex]['questionCode']" class="question-code p-2">
                    <pre v-for="qCode in questionsList[currentIndex]['questionCode']"
                        class="code-layout ps-3"><code><ol><li v-for="(line, index) in formattingJavaCode(qCode)">{{ line.textContent }}</li></ol></code></pre>
                    <!-- <span v-for="(line, index) in formattingJavaCode(qCode)"><span class="d-flex"><span class="pe-3 prevent-select" style="flex: 0 0 3.5rem;text-align: right;">{{ index + 1 + '.' }}</span><span style="display: inline-block;">{{ line.textContent }}</span></span></span> -->
                </div>

                <div class="question-code-output p-2 mb-3" v-if="questionsList[currentIndex]['questionCodeOutput']">
                    <p>【表示結果】</p>
                    <div class="bg-code-output px-2 py-3">
                        <p class="m-0" v-for="output in questionsList[currentIndex]['questionCodeOutput']">{{ output
                        }}
                        </p>
                    </div>
                </div>

                <div class="question-code-run p-2 mb-3" v-if="questionsList[currentIndex]['questionCodeCommdaLines']">
                    <p>【実行方法】</p>
                    <div class="bg-dark text-white  px-2 py-3">
                        <p class="m-0" v-for="output in questionsList[currentIndex]['questionCodeCommdaLines']">{{
                            output }}
                        </p>
                    </div>
                </div>

                <div class="question-choice ps-4 pe-4 mb-3 d-flex flex-column gap-3">
                    <div class="d-flex align-items-start"
                        v-for="choice, key in questionsList[currentIndex]['questionMultiChoices']">
                        <div>
                            <input type="checkbox" :value="key" v-model="selectedItems" :id="key" :disabled="selectedItems.length == questionsList[currentIndex]['numOfQuestionAnswers']
                                && selectedItems.indexOf(key) == -1" @click="userTakeAction">
                        </div>
                        <div>
                            <label :for="key" class="ps-2 d-block" v-for="ch in formatChoice(choice)">{{ ch }}</label>
                        </div>
                    </div>
                </div>

                <div class="question-change-actions">
                    <button @click="changeQuestion('minus')" class="g-web-bg p-2 back rounded"
                        :class="currentIndex == 0 ? 'btn-remove' : ''">戻る</button>

                    <button @click="changeQuestion('plus')" class="g-web-bg p-2 next rounded"
                        :class="currentIndex == (questionsList.length - 1) ? 'btn-remove' : ''">次</button>

                    <button @click="addNewDocument" class="btn btn-success"
                        v-if="currentIndex == (questionsList.length - 1)">完了</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { convertTimeStampToDateTime } from '@/assets/js/dateUtils';

var dotsInterval;
var isIncrease = true;
export default {
    props: ['specific', 'chapter'],
    data() {
        return {
            'questionName': this.specific,
            'chapterId': this.chapter,
            'questionsList': null,
            'currentIndex': 0,
            'selectedItems': [],
            'isSubmit': false,
            'isChanges': false,

            // Data Fetching...
            dots: [""],

            chapterInfo: null,
            startDateTime: null,
            startDateTimeFormatted: null,
        }
    },
    methods: {
        recordStartDate() {
            if (!this.startDateTime) {
                this.startDateTime = Date.now()
                this.startDateTimeFormatted = convertTimeStampToDateTime(this.startDateTime, true)
            }
        },
        stopDotsInterval() {
            clearInterval(dotsInterval)
        },
        userTakeAction() {
            this.isChanges = true;
        },
        beforeUnloadListener(event) {
            event.preventDefault();
            event.returnValue = "Check";
            return false
        },
        changeQuestion(action) {
            if (action == 'plus') {
                this.currentIndex++;
            } else {
                this.currentIndex--;
            }

            if (this.questionsList != null && this.questionsList[this.currentIndex]['userAnswerKeys']) {
                this.selectedItems = this.questionsList[this.currentIndex]['userAnswerKeys']
            } else {
                this.selectedItems = []
            }
        },
        formattingJavaCode(data) {
            const codeArray = data.trim().split(/[\s]{4}/)
            let htmlCode = []
            let spaceCount = 0
            codeArray.forEach(element => {
                if (element == '') {
                    spaceCount += 1
                } else {
                    let spaceText = '';
                    for (let i = 0; i < spaceCount; i++) {
                        spaceText += '\xa0\xa0\xa0\xa0'
                    }
                    htmlCode.push({
                        'textContent': spaceText + element.trim()
                    })
                    spaceCount = 0
                }
            })
            return htmlCode
        },
        shuffleArray(arr) {
            // return arr
            return arr.sort(() => Math.random() - 0.5)
        },
        formatChoice(str) {
            return str.split(/\\n/)
        },
        addNewDocument() {
            window.removeEventListener('beforeunload', this.beforeUnloadListener, { capture: true })
            if (confirm("試験完了で宜しいですか？") == true) {
                this.isSubmit = true
                let totalTrueCount = 0
                this.questionsList.forEach(element => {
                    if (element['result'] != null && element['result']) {
                        totalTrueCount++
                    }
                });
                this.$store.dispatch('addNewDocument', {
                    dataObj: {
                        'answersData': this.questionsList,
                        'totalCorrectCount': totalTrueCount,
                        'totalQuestionsCount': this.questionsList.length,
                        'chapterCodeId': this.chapter,
                        'subject': this.chapterInfo?.[0]?.subject ?? '',
                        'startDateTime': this.startDateTime
                    },
                    collectionName: 'user_answers',
                    requireUserInfo: true,
                    // After data insertion to firestore is finished
                    // Redirect to your exam history page
                    redirectPath: 'user-exam-history'
                })
            }
        }
    },
    unmounted() {
        window.removeEventListener('beforeunload', this.beforeUnloadListener, { capture: true })
    },
    created() {
        window.addEventListener('beforeunload', this.beforeUnloadListener, { capture: true })
    },
    beforeMount() {
        window.addEventListener('beforeunload', this.beforeUnloadListener, { capture: true })
    },
    beforeRouteUpdate() { },
    beforeRouteLeave(to, from, next) {
        if (!this.isSubmit && this.isChanges) {
            const answer = window.confirm('Do you really want to leave? You have unsaved changes!')
            if (!answer) {
                next(false)

                return;
            }
        }
        next()
    },
    computed: {
        getChapterInfo() {
            this.chapterInfo = this.$store.getters.acquireOneChapterData({ 'questionName': this.questionName, 'chapterId': this.chapterId })
            if (!this.chapterInfo) {
                setTimeout(() => {
                    this.$store.dispatch('getCollectionData', {
                        collectionName: this.questionName + "_overview",
                        wheres: [],
                        orders: [
                            {
                                name: 'chapterCodeId',
                                type: 'asc'
                            }
                        ],
                        groupName: 'chapterData',
                        saveCollectionName: this.questionName,
                    })
                }, 1500);
            }
            // console.log(this.chapterInfo);
            return this.chapterInfo?.[0] ?? null
        }
    },
    mounted() {

        // console.log(this.specific);
        // console.log(this.chapter);

        this.$store.watch(
            (_, getters) => getters.acquireQuestionsData(this.questionName),
            (newValue, _) => {
                this.questionsList = this.shuffleArray(newValue)
                if (this.questionsList != null && this.questionsList.length > 0) {
                    this.questionsList[0]['userAnswerKeys'] = []
                }
            }
        )

        setTimeout(() => {
            this.$store.dispatch('getCollectionData', {
                collectionName: this.questionName + "_questions",
                wheres: [
                    { key: 'chapterCodeId', opt: '==', value: this.chapterId }
                ],
                orders: [],
                groupName: 'questionData',
                saveCollectionName: this.questionName,
            })
        }, 1500);

        // Loading
        if (!this.data)
            dotsInterval = setInterval(() => {
                if (this.dots.length < 9 && isIncrease) {
                    this.dots.push("")
                    if (this.dots.length == 8)
                        isIncrease = !isIncrease
                } else {
                    this.dots.pop()
                    if (this.dots.length == 1)
                        isIncrease = !isIncrease
                }
            }, 300)
    },
    watch: {
        selectedItems: function (value) {
            if (this.questionsList[this.currentIndex]['questionAnswerKeys'].length == value.length) {
                let flg = true;
                value.forEach(ans => {
                    if ((this.questionsList[this.currentIndex]['questionAnswerKeys']).indexOf(ans) == -1) {
                        flg = false;
                    }
                });
                this.questionsList[this.currentIndex]['result'] = flg;
            } else {
                this.questionsList[this.currentIndex]['result'] = false;
            }
            this.questionsList[this.currentIndex]['userAnswerKeys'] = value

            // console.log(JSON.stringify(this.questionsList[this.currentIndex]))
        }
    }
}
</script>

<style scoped>
.text-output {
    margin: 0;
}

.code-layout {
    font-size: 1rem;
    background-color: #f5f2f0;
    padding: .75rem .25rem;
}

.prevent-select {
    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and IE 11 */
    user-select: none;
    /* Standard syntax */
}

.btn-remove {
    display: none;
    /* background-color: gray;
    pointer-events: none; */
}

.qiestion-item {
    border: 1px solid var(--color-g-web);
    border-radius: .25rem;
}

.question-change-actions {
    display: flex;
}

.question-change-actions>button {
    flex: 1;
    border: 1px solid var(--color-white);
    color: var(--color-white);
    font-weight: bold;
    transition: all .5s;
}

.question-change-actions>button.back {
    border-bottom-left-radius: .25rem;
}

.question-change-actions>button.next {
    border-bottom-right-radius: .25rem;
}

.question-change-actions>button:hover {
    color: var(--color-g-web);
    background-color: var(--color-pale-g-web);
}

.q-no {
    font-weight: bold;
}

.q-text {
    display: inline-block;
    text-indent: .25rem;
}

.questions-grid {
    margin: 3rem auto;
    display: flex;
    justify-content: center;
}

.questions-grid>div {
    width: 100%;
    /* flex: 0 0 75%; */
}

.questions-grid ol {
    margin: 0;
}

@media (max-width: 991.98px) {
    /* .questions-grid>div { */
    /* flex: 0 0 95%; */
    /* } */
}
</style>