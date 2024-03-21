<template>
    <div class="wrapper">
        <div class="exam-result-header text-center">
            <h1>Check Answers</h1>
        </div>
        <div class="exam-result-detail col-11 col-sm-11 col-md-11 col-md-9 col-lg-7">
            <div v-if="answerDataWrapper && answerDataWrapper['answersData'].length > 0"
                class="question-item overflow-auto">
                <!-- 題名部分 -->
                <div class="question-title d-flex mb-3 p-2">
                    <span class="q-no">{{ `(${currentIndex + 1})` }}</span>
                    <span class="q-text">{{ answerDataWrapper['answersData'][currentIndex]['questionTitle'] }}</span>
                </div>

                <!-- Hint -->
                <div v-if="answerDataWrapper['answersData'][currentIndex]['questionHint']"
                    class="px-4 py-2 mb-3 d-flex gap-2 flex-column">
                    <span class="fw-bold">Keywords for you</span>
                    <span class="d-flex gap-1">
                        <span v-for="hint in answerDataWrapper['answersData'][currentIndex]['questionHint']"
                            class="bg-warning py-1 px-3 rounded">
                            {{ hint }}
                        </span>
                    </span>
                </div>

                <!-- Source Code部分 -->
                <div v-if="answerDataWrapper['answersData'][currentIndex]['questionCode']" class="question-code p-2">
                    <pre v-for="qCode in answerDataWrapper['answersData'][currentIndex]['questionCode']"
                        class="code-layout ps-3"><code><ol><li v-for="(line, index) in formattingJavaCode(qCode)">{{ line.textContent }}</li></ol></code></pre>
                </div>

                <!-- Table Data -->
                <div v-if="answerDataWrapper['answersData'][currentIndex]['questionTableData']"
                    v-for="tData in answerDataWrapper['answersData'][currentIndex]['questionTableData']" class="px-4">
                    <table class="table">
                        <thead>
                            <tr>
                                <th v-for="h in tData['heading']">
                                    {{ h }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="bArr in tData['body']">
                                <td v-for="b in bArr">
                                    {{ b }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Source Codeの実行結果部分 -->
                <div class="question-code-output p-2 mb-3"
                    v-if="answerDataWrapper['answersData'][currentIndex]['questionCodeOutput']">
                    <p>【表示結果】</p>
                    <div class="bg-code-output px-2 py-3">
                        <p class="text-output"
                            v-for="output in answerDataWrapper['answersData'][currentIndex]['questionCodeOutput']">
                            {{ output }}
                        </p>
                    </div>
                </div>

                <!-- Source Codeの実行方法部分 -->
                <div class="question-code-run p-2 mb-3"
                    v-if="answerDataWrapper['answersData'][currentIndex]['questionCodeCommdaLines']">
                    <p>【実行方法】</p>
                    <div class="bg-code-output px-2 py-3">
                        <p class="text-output"
                            v-for="output in answerDataWrapper['answersData'][currentIndex]['questionCodeCommdaLines']">
                            {{
                output
            }}</p>
                    </div>
                </div>

                <div class="question-choice ps-4 pe-4 mb-3 d-flex flex-column gap-3">
                    <div class="d-flex align-items-start"
                        v-for="choice, key in answerDataWrapper['answersData'][currentIndex]['questionMultiChoices']">
                        <div>
                            <input type="checkbox" :value="key" :id="key"
                                :checked="answerDataWrapper['answersData'][currentIndex]['userAnswerKeys']?.indexOf(key) != -1"
                                disabled>
                        </div>
                        <div>
                            <label :for="key" :class="answerDataWrapper['answersData'][currentIndex]['userAnswerKeys']?.indexOf(key) != -1 ?
                answerDataWrapper['answersData'][currentIndex]['questionAnswerKeys'].indexOf(key) != -1 ?
                    'bg-ok' : 'bg-ng' : answerDataWrapper['answersData'][currentIndex]['questionAnswerKeys'].indexOf(key) != -1 ?
                    'bg-ans' : ''" class="ps-2 d-block" v-for="ch in formatChoice(choice)">
                                {{ ch }}
                            </label>
                        </div>
                    </div>

                    <!-- userAnswerSourceCode -->
                    <div v-if="answerDataWrapper['answersData'][currentIndex]['userAnswerSourceCode']">
                        <div class="mb-3 d-flex flex-column gap-2">
                            <textarea
                                v-for="code in answerDataWrapper['answersData'][currentIndex]['userAnswerSourceCode']"
                                v-bind:value="code" class="form-control" rows="10" disabled></textarea>
                        </div>

                        <div class="d-flex justify-content-between">
                            <div>
                                Credit the answer :
                                <span v-if="answerDataWrapper['answersData'][currentIndex].result == false">
                                    ✕
                                </span>
                                <span v-else-if="answerDataWrapper['answersData'][currentIndex].result == true">
                                    〇
                                </span>
                                <span v-else>
                                    &quest;
                                </span>
                            </div>

                            <!-- Teacher/Admin -->
                            <div v-if="getUserRole && getUserRole == 99" class="d-flex gap-1 ">
                                <button class="btn btn-success" @click="giveCredit(true)">〇</button>
                                <button class="btn btn-danger" @click="giveCredit(false)">✕</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="question-change-actions">
                    <button @click="changeQuestion('minus')" class="g-web-bg p-2 back rounded"
                        :class="currentIndex == 0 ? 'btn-remove' : ''">戻る</button>

                    <button @click="changeQuestion('plus')" class="g-web-bg p-2 next rounded"
                        :class="currentIndex == (answerDataWrapper['answersData'].length - 1) ? 'btn-remove' : ''">次</button>

                    <button @click="backToProfile" class="btn btn-secondary"
                        v-if="currentIndex == (answerDataWrapper['answersData'].length - 1)">試験履歴へ戻る</button>

                    <button @click="updateStudentExamData" class="btn btn-success"
                        v-if="currentIndex == (answerDataWrapper['answersData'].length - 1) && markCredit">Credit登録</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['examId'],
    data() {
        return {
            'currentIndex': 0,
            'answerDataWrapper': null,

            // Teacher checks student exam data and marks (〇,✕)
            markCredit: false
        }
    },
    computed: {
        getUserRole() {
            return this.$store.getters.acquireUserInfo?.userRole
        }
    },
    methods: {
        giveCredit(credit) {
            // Remind > Teacher Give Credit
            // Show Flag > Button > Credit登録
            this.markCredit = true;
            this.answerDataWrapper['answersData'][this.currentIndex].result = credit
        },
        updateStudentExamData() {
            console.log(this.answerDataWrapper);
            let totalTrueCount = 0
            this.answerDataWrapper.answersData.forEach(element => {
                if (element['result'] != null && element['result']) {
                    totalTrueCount++
                }
            });

            this.$store
                .dispatch('updateExistingDocumentFields', {
                    data: {
                        answersData: this.answerDataWrapper.answersData,
                        totalCorrectCount: totalTrueCount
                    },
                    collectionName: 'user_answers',
                    docId: this.answerDataWrapper.docId
                })
                .then(() => {
                    this.$store.dispatch('backOneHistory')
                })
        },
        backToProfile() {
            this.$store.dispatch('backOneHistory')
        },
        changeQuestion(action) {
            if (action == 'plus') {
                this.currentIndex++;
            } else {
                this.currentIndex--;
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
        formatChoice(str) {
            return str.split(/\\n/)
        }
    },
    created() {
        this.answerDataWrapper = this.$store.getters.acquireOneAnswersData({
            'key': 'all-answers',
            'docId': this.examId
        })?.[0]
    }
}
</script>

<style scoped>
.btn-remove {
    display: none;
    /* background-color: gray;
    pointer-events: none; */
}

.text-output {
    margin: 0;
}

.code-layout {
    font-size: 1rem;
    background-color: #f5f2f0;
    padding: .75rem .25rem;
}

.question-item {
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

.exam-result-detail {
    margin: 3rem auto;
}

.bg-ng {
    background-color: rgb(231, 73, 73);
}

.bg-ok {
    background-color: rgb(73, 231, 73);
}

.bg-ans {
    background-color: rgb(75, 198, 203);
}
</style>