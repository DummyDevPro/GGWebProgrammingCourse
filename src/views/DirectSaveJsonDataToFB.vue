<template>
    <div class="d-flex flex-column align-items-center py-5">
        <div class="col-12 col-sm-11 col-md-8 col-lg-6">
            <div class="mb-3">
                <select class="form-select" v-model="collection">
                    <option disabled value="">Please Select Question Type</option>
                    <option v-for="col in getAllQuestionsNameData" :value="col">
                        {{ col['title'] + ' / ' + col['subTitle'] }}
                    </option>
                </select>
            </div>
            <div class="mb-3">
                <label for="jsonInp" class="form-label">Place Json Data</label>
                <textarea class="form-control" id="jsonInp" rows="10" v-model="jsonData"></textarea>
            </div>
            <div class="mb-3">
                <button @click="uploadJsonData" class="form-control btn btn-success">Upload</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            collection: '',
            jsonData: ''
        }
    },
    methods: {
        uploadJsonData() {
            try {
                let data = JSON.parse(this.jsonData)
                this.$store.dispatch('addNewDocument', {
                    dataObj: data,
                    collectionName: this.collection.collectionName,
                    requireUserInfo: false,
                    redirectPath: null
                }).then(() => {
                    console.log('FIN');
                }).catch((error) => {
                    console.log(error);
                })
            } catch (error) {
                console.log(error);
            }
        }
    },
    computed: {
        getAllQuestionsNameData() {
            return this.$store.getters.acquireAllQuestionsNameData('allQuestionsCollection')
        },
    },
    mounted() {
        setTimeout(() => {
            this.$store.dispatch('getCollectionData', {
                firstAccessCode: 'all',
                method: 'get',
                collectionKey: 'listUpQuestionCollection',
                where: [{
                    whereValue: 'question',
                    whereOperator: '=='
                }],
            })
        }, 1500);
    }
}
</script>

<style scoped></style>