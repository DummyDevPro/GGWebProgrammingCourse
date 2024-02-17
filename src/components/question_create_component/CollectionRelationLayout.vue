<script setup>
defineProps(['fsCollection', 'id'])
defineEmits(['update:fsCollection', 'callbackId'])
</script>

<template>
    <div class="d-flex flex-column gap-2">
        <div class="d-flex gap-2 align-items-center">
            <select class="form-select" v-model="fsCollection.selectedCollectionSpecificKey"
                v-on:change="getQuestionChapters" required>
                <option disabled value="">Please Select Question Type</option>
                <option v-for="col in getAllQuestionsNameData" :value="col['specific']">
                    {{ col['title'] + ' / ' + col['subTitle'] }}
                </option>
            </select>
            <a href="" class="btn btn-success fs-6 disabled">
                <i class="bi bi-plus-circle-fill"></i>
            </a>
        </div>

        <div class="d-flex gap-2 align-items-center">
            <select :disabled="fsCollection.selectedCollectionSpecificKey == ''" class="form-select"
                v-model="fsCollection.chapterName" required>
                <option disabled value="">
                    {{ fsCollection.selectedCollectionSpecificKey == '' ? "Please Select Question Type First" :
                        fsCollection.selectedCollectionSpecificKey != '' && chapterList &&
                            chapterList.length == 0 ?
                            "Create Chapter ➤" : "Please Select Chapter" }}
                </option>
                <option v-for="chpt in chapterList" :value="chpt['chapterCodeId']">
                    {{ chpt['chapterTitle'] }}
                </option>
            </select>

            <a href="#" @click.prevent="showCreateChapterModal" class="btn btn-success fs-6"
                :class="fsCollection.selectedCollectionSpecificKey == '' ? 'disabled' : ''">
                <i class="bi bi-plus-circle-fill"></i>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            chapterList: [],
        }
    },
    methods: {
        getQuestionChapters() {
            this.fsCollection.chapterName = ''
            this.chapterList = []
            this.chapterList = this.$store.getters.acquireChapterData(this.fsCollection.selectedCollectionSpecificKey)
            this.$store.dispatch('getCollectionData', {
                collectionName: this.fsCollection.selectedCollectionSpecificKey + "_overview",
                wheres: [],
                orders: [
                    {
                        name: 'chapterCodeId',
                        type: 'asc'
                    }
                ],
                groupName: 'chapterData',
                saveCollectionName: this.fsCollection.selectedCollectionSpecificKey,
            })
        },
        showCreateChapterModal() {
            this.$emit('callbackId', this.id)
        }
    },
    computed: {
        getAllQuestionsNameData() {
            return this.$store.getters.acquireAllQuestionsNameData('allQuestionsCollection')
        }
    },
    mounted() {
        this.$store.watch(
            (_, getters) => getters.acquireChapterData(this.fsCollection.selectedCollectionSpecificKey),
            (newValue, _) => {
                this.chapterList = newValue
            }
        )

        setTimeout(() => {
            this.$store.dispatch('getCollectionData', {
                collectionName: 'all_questions_collection',
                wheres: [
                    { key: 'type', opt: '==', value: 'question' }
                ],
                orders: [],
                groupName: 'firestoreDbList',
                saveCollectionName: 'allQuestionsCollection',
            })
        }, 1500);
    }
}
</script>

<style scoped></style>