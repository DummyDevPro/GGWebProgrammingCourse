<template>
    <div class="container py-5">

        <form @submit.prevent="showResult">
            <div class="d-flex flex-column align-items-center">

                <div class="question-container col-12 col-sm-11 col-md-8 col-lg-6 d-flex flex-column gap-3">
                    <div v-for="(__, idx) in  questions " class="question" :key="idx">
                        <div class="up-action d-flex justify-content-between">
                            <div class="up-action-left bg-dark rounded-top d-flex" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <a href="#" @click.prevent="" class="text-white d-block px-2 py-1 fs-5">
                                    <i class="bi bi-layout-wtf"></i>
                                </a>

                                <ul class="dropdown-menu">
                                    <li>
                                        <h6 class="dropdown-header">Select Layout</h6>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#"
                                            @click.prevent="addSubLayout(idx, 'code')">Code</a>
                                    </li>
                                    <li>
                                        <a :class="questions[idx].items.findIndex((item) => item.type == 'hint') != -1 ? 'disabled' : ''"
                                            class="dropdown-item" href="#"
                                            @click.prevent="addSubLayout(idx, 'hint')">Hint</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#"
                                            @click.prevent="addSubLayout(idx, 'table')">Table</a>
                                    </li>
                                    <li>
                                        <a :class="questions[idx].choice == null ? '' : 'disabled'"
                                            class="dropdown-item" href="#"
                                            @click.prevent="addMultipleChoiceLayout(idx)">Choices</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="up-action-right bg-dark rounded-top d-flex">
                                <a href="#" @click.prevent="duplicateQuestionLayout(idx)"
                                    class="text-white d-block px-2 py-1 fs-5"
                                    title="Duplicate Layout | In the process of developing.">
                                    <i class="bi bi-copy"></i>
                                </a>
                                <a href="#" @click.prevent="addNewQuestionLayout(idx)"
                                    class="text-white d-block px-2 py-1 fs-5">
                                    <i class="bi bi-plus-lg" title="New Layout"></i>
                                </a>
                                <a v-if="idx > 0" href="#" @click.prevent="deleteCurrentQuestionLayout(idx)"
                                    class="text-white d-block px-2 py-1 fs-5" title="Delete Layout">
                                    <i class="bi bi-dash-lg"></i>
                                </a>
                            </div>
                        </div>

                        <div class="d-flex flex-column gap-2 question-content p-2 bg-dark rounded-bottom">
                            <div class="question-title">
                                <textarea v-model="questions[idx].title" class="form-control" rows="2"
                                    placeholder="Type question title..." required></textarea>
                            </div>

                            <div v-if="questions[idx].items.length > 0" class="question-body d-flex flex-column gap-2">
                                <!-- item -->
                                <div class="position-relative" v-for="(item, iidx) in questions[idx].items" :key="iidx">

                                    <button type="button" class="btn-close bg-danger position-absolute"
                                        aria-label="Close" style="top: .25rem;right: .25rem;"
                                        @click="removeSubLayout(idx, iidx)"></button>

                                    <div v-if="item.type == 'code'">
                                        <code-layout v-model:content="questions[idx].items[iidx].data" />
                                    </div>

                                    <div v-if="item.type == 'hint'">
                                        <hint-layout v-model:hints="questions[idx].items[iidx].data" />
                                    </div>

                                    <div v-if="item.type == 'table'">
                                        <table-layout v-model:testData="questions[idx].items[iidx].data" />
                                    </div>
                                </div>
                            </div>

                            <!-- firestore database  -->
                            <collection-relation-layout :id="idx" v-model:fsCollection="questions[idx].fsCollection"
                                @callbackId="showCreateChapterModal" />

                            <!-- Multiple Choice Layout -->
                            <div class="position-relative" v-if="questions[idx].choice != null">
                                <button type="button" class="btn-close bg-danger position-absolute" aria-label="Close"
                                    style="top: .25rem;right: .25rem;"
                                    @click="removeMultipleChoiceLayout(idx)"></button>

                                <multiple-choice-layout v-model:choice="questions[idx].choice"></multiple-choice-layout>
                            </div>
                        </div>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="submitCheck" v-model="checkRequire"
                            required>
                        <label class="form-check-label" for="submitCheck">
                            Confirmation for question creation
                        </label>
                    </div>

                    <div>
                        <button type="submit" class="form-control btn btn-success">Create</button>
                    </div>
                </div>
            </div>
        </form>

        <!-- Modal Dialog : Create Chapter -->
        <div class="modal fade" id="createChapterModal" ref="createChapterModal" role="dialog" tabindex="-1">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalScrollableTitle">Add New Chapter</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="chapterCodeId" class="form-label">Chapter Code Id</label>
                            <input v-model="newChapt['chapterCodeId']" type="text" class="form-control"
                                id="chapterCodeId" placeholder="j-bz-chapter-1,j-b-chapter-2,..." required>
                        </div>
                        <div class="mb-3">
                            <label for="chapterTitle" class="form-label">Chapter Title</label>
                            <input v-model="newChapt['chapterTitle']" type="text" class="form-control" id="chapterTitle"
                                placeholder="Java Basic,Java OOP,...">
                        </div>
                        <div class="mb-3">
                            <label for="chapterSubTitle" class="form-label">Chapter Sub-Title</label>
                            <input v-model="newChapt['chapterSubtitle']" type="text" class="form-control"
                                id="chapterSubTitle" placeholder="Java Basic,Java OOP,...">
                        </div>
                        <div class="mb-3">
                            <label for="chapterDetail" class="form-label">Details</label>
                            <textarea v-model="newChapt['details']" class="form-control" id="chapterDetail" rows="3">
                            </textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="createNewChapter">Create</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import CodeLayout from '@/components/question_create_component/CodeLayout.vue';
import HintLayout from '@/components/question_create_component/HintLayout.vue';
import TableLayout from '@/components/question_create_component/TableLayout.vue';
import MultipleChoiceLayout from '@/components/question_create_component/MultipleChoiceLayout.vue';
import CollectionRelationLayout from '@/components/question_create_component/CollectionRelationLayout.vue';

let modal;
export default {
    components: {
        'code-layout': CodeLayout,
        'hint-layout': HintLayout,
        'table-layout': TableLayout,
        'multiple-choice-layout': MultipleChoiceLayout,
        'collection-relation-layout': CollectionRelationLayout,
    },
    data() {
        return {
            questions: [
                {
                    // FireStore Collection Name & Save Doc's attribute name
                    fsCollection: {
                        selectedCollectionSpecificKey: '',
                        chapterName: ''
                    },
                    title: '',
                    items: [],
                    choice: null,
                }
            ],
            newChapt: {
                'chapterCodeId': '',
                'chapterTitle': '',
                'chapterSubtitle': '',
                'details': '',
            },
            modalAccessId: null,
            checkRequire: false
        }
    },
    methods: {
        // UI Control Methods
        questionObject() {
            return { fsCollection: { selectedCollectionSpecificKey: '', chapterName: '' }, title: '', items: [] }
        },
        chooseLayoutObject() {
            return { items: [{ key: 'opt1', val: '' }, { key: 'opt2', val: '' }, { key: 'opt3', val: '' },], ans: [] }
        },
        questionTotalLength() {
            return this.questions.length - 1;
        },
        questionSubLayout(type) {
            if (type == 'code') {
                return { type: 'code', data: '' }
            }
            if (type == 'hint') {
                return { type: 'hint', data: [] }
            }
            if (type == 'table') {
                return { type: 'table', data: { heading: [], body: [] } }
            }
        },
        duplicateQuestionLayout(pos) {
            const qObj = this.questions[pos]
            const newObj = JSON.parse(JSON.stringify(qObj)) // prevent for object referencing
            if (pos == this.questionTotalLength()) {
                this.questions.push(newObj)
            } else {
                this.questions.splice(pos + 1, 0, newObj)
            }
            console.log(this.questions);
        },
        addNewQuestionLayout(pos) {
            if (pos == this.questionTotalLength()) {
                this.questions.push(this.questionObject())
            } else {
                this.questions.splice(pos + 1, 0, this.questionObject())
            }
        },
        deleteCurrentQuestionLayout(pos) {
            this.questions.splice(pos, 1)
        },
        addMultipleChoiceLayout(pos) {
            this.questions[pos].choice = this.chooseLayoutObject()
        },
        removeMultipleChoiceLayout(pos) {
            this.questions[pos].choice = null
        },

        addSubLayout(pos, type) {
            this.questions[pos].items.push(this.questionSubLayout(type))
        },
        removeSubLayout(pos, ipos) {
            this.questions[pos].items.splice(ipos, 1)
        },

        // Firebase Communication Methods
        showResult() {
            this.checkRequire = false;
            // console.log(this.questions);
            // return;
            for (let i = 0; i < this.questions.length; i++) {
                // Prepare firestore send data
                let data = {};
                const qObj = this.questions[i];

                // Multiple Choices
                if (qObj.choice) {
                    data['questionMultiChoices'] = {}
                    for (let j = 0; j < qObj.choice.items.length; j++) {
                        const element = qObj.choice.items[j];
                        data['questionMultiChoices'][element.key] = element.val
                    }
                    data['questionAnswerKeys'] = qObj.choice.ans
                    data['numOfQuestionAnswers'] = qObj.choice.ans.length
                }
                // Question Title
                data['questionTitle'] = qObj.title

                if (qObj.items && qObj.items.length > 0) {
                    for (let i = 0; i < qObj.items.length; i++) {
                        const element = qObj.items[i];

                        // Question Code Data
                        if (element.type == 'code') {
                            if (!data['questionCode'])
                                data['questionCode'] = []
                            data['questionCode'].push(element.data)
                        }

                        if (element.type == 'hint') {
                            if (!data['questionHint'])
                                data['questionHint'] = {}
                            // data['questionHint'].push(element.data)
                            for (let i = 0; i < element.data.length; i++) {
                                data['questionHint'][i] = element.data[i]
                            }
                        }

                        // Question meta data(table information)
                        if (element.type == 'table') {
                            if (!data['questionTableData'])
                                data['questionTableData'] = []
                            // data['questionTableData'].push({ ...element.data })
                            // heading
                            let heading = {
                                // heading: element.data.heading
                            }
                            for (let i = 0; i < element.data.heading.length; i++) {
                                heading[i] = element.data.heading[i]
                            }
                            // body
                            let body = {
                                // heading: element.data.body
                            }
                            for (let i = 0; i < element.data.body.length; i++) {
                                body[i] = element.data.body[i]
                            }
                            data['questionTableData'].push(
                                {
                                    heading: heading,
                                    body: body
                                }
                            )
                        }
                    }
                }

                data['chapterCodeId'] = qObj.fsCollection.chapterName

                const spfKey = qObj.fsCollection.selectedCollectionSpecificKey

                const collectionName = spfKey + '_questions'

                // console.log(data);
                // return;

                this.$store.dispatch('addNewDocument', {
                    dataObj: { ...data },
                    collectionName: collectionName,
                    requireUserInfo: true,
                    redirectPath: null
                }).then(() => {
                    console.log('FIN');
                }).catch((error) => {
                    console.log(error);
                })
            }
        },
        showCreateChapterModal(id) {
            modal = new bootstrap.Modal(this.$refs.createChapterModal, {})
            this.modalAccessId = id
            modal.show()
        },
        createNewChapter() {
            if (this.newChapt['details'] && typeof this.newChapt['details'] === 'string' && this.newChapt['details'].trim() != '') {
                this.newChapt['details'] = this.newChapt['details'].split('\n')
            } else {
                this.newChapt['details'] = []
            }

            const spfKey = this.questions[this.modalAccessId].fsCollection.selectedCollectionSpecificKey

            const collectionName = spfKey + '_overview'
            this.$store.dispatch('addNewDocument', {
                dataObj: { ...this.newChapt },
                collectionName: collectionName,
                requireUserInfo: true,
                redirectPath: null
            }).then(() => {
                modal.hide()
                // model data reset
                this.newChapt.chapterCodeId = ''
                this.newChapt.chapterTitle = ''
                this.newChapt.chapterSubtitle = ''
                this.newChapt.details = ''
            })
        }
    },
}
</script>