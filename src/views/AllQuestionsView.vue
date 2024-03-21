<template>

    <div class="py-3 px-3">
        <base-layout :data="getAllQuestionsNameData" layoutType="0">
            <template #item="{ photo, title, subTitle, specific }">
                <div class="card">
                    <img :src="photo" class="card-img-top" style="height: 150px;object-fit: scale-down;">

                    <div class="card-body text-center">
                        <h5 class="card-title">{{ title }}</h5>
                        <h6 class="card-subtitle mb-2 text-muted text-truncate">{{ subTitle }}
                        </h6>
                    </div>

                    <div class="card-footer text-center">
                        <router-link :to="{
            name: 'questions',
            params: {
                'specific': specific
            }
        }" class="btn btn-primary form-control">チャレンジ</router-link>
                    </div>
                </div>
            </template>
        </base-layout>
    </div>

    <div v-if="getUserRole && getUserRole == 99" class="position-sticky p-3 style-float bg-dark text-center rounded">
        <!-- data-bs-toggle="modal" data-bs-target="#myModal" -->
        <button class="btn btn-success rounded-pill" @click="showModal">
            Add New <i class="bi bi-plus-lg"></i>
        </button>
    </div>

    <!-- The Modal -->
    <div class="modal fade" id="myModal" ref="myModal">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">Add New Category/Subject</h4>
                    <button type="button" class="btn-close" @click="hideModal"></button>
                </div>

                <!-- Modal body -->
                <div class="modal-body">
                    <form @submit.prevent="registerNewCategory" ref="registerNewCategoryForm">
                        <div class="mb-3">
                            <label for="categoryTitle" class="form-label">Title</label>
                            <input type="text" id="categoryTitle" class="form-control" v-model="category.title"
                                required>
                        </div>
                        <div class="mb-3">
                            <label for="categorySubTitle" class="form-label">SubTitle</label>
                            <input type="text" id="categorySubTitle" class="form-control" v-model="category.subTitle"
                                required>
                        </div>

                        <div class="mb-3">
                            <label for="categorySpecific" class="form-label">Specific</label>
                            <input type="text" id="categorySpecific" class="form-control" v-model="category.specific"
                                required>
                        </div>

                        <div class="mb-3">
                            <label for="displayImage" class="form-label">Display Image</label>
                            <input type="file" id="displayImage" class="form-control" accept="image/*"
                                @change="selectFile" required>
                        </div>

                        <div class="d-flex">
                            <button type="reset" class="btn btn-danger w-50">Clear</button>
                            <button type="submit" class="btn btn-success w-50" :disabled="btnDisable">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseLayout from "@/views/BaseLayout.vue"

let modal;
export default {
    components: { 'base-layout': BaseLayout },
    data() {
        return {
            category: {
                title: null,
                subTitle: null,
                specific: null,
                photo: null,
                type: 'question'
            },
            // 2回実地防止
            btnDisable: false
        }
    },
    methods: {
        selectFile(event) {
            if (event.target.files && event.target.files[0]) {
                // Image file read & write
                const reader = new FileReader
                reader.onload = e => { }
                reader.readAsDataURL(event.target.files[0])
                this.category.photo = event.target.files[0]
            }
        },
        showModal() {
            if (modal == undefined || modal == null) {
                modal = new bootstrap.Modal(this.$refs.myModal, {})
                modal.show()
            }
        },
        hideModal() {
            if (modal != null) {
                modal.hide()
                modal = null
            }
        },
        registerNewCategory() {
            let emptyCheck = false;
            Object.keys(this.category).forEach((key) => {
                if (!this.category[key]) {
                    emptyCheck = true;
                    return;
                }
            })
            if (!emptyCheck) {
                this.btnDisable = true
                this.$store.dispatch('registerNewCategory', this.category)
                    .then(() => {
                        this.$store.dispatch('getCollectionData', {
                            collectionName: 'all_questions_collection',
                            wheres: [
                                { key: 'type', opt: '==', value: 'question' }
                            ],
                            orders: [],
                            groupName: 'firestoreDbList',
                            saveCollectionName: 'allQuestionsCollection',
                        })
                    })
                    .finally(() => {
                        this.$refs.registerNewCategoryForm.reset();
                        Object.keys(this.category).forEach((key) => {
                            if (key != 'type')
                                this.category[key] = null
                        })
                        this.btnDisable = false
                        this.hideModal()
                    })
            }
        }
    },
    computed: {
        getUserRole() {
            return this.$store.getters.acquireUserInfo?.userRole
        },
        getAllQuestionsNameData() {
            return this.$store.getters.acquireAllQuestionsNameData('allQuestionsCollection')
        }
    },
    mounted() {
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
<style scoped>
.style-float {
    right: 0;
    bottom: 0;
    z-index: 88;
    width: max-content;
    margin: 0 auto;
}
</style>