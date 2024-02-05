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
</template>

<script>
import BaseLayout from "@/views/BaseLayout.vue"
export default {
    components: { 'base-layout': BaseLayout },
    computed: {
        getAllQuestionsNameData() {
            return this.$store.getters.acquireAllQuestionsNameData('allQuestionsCollection')
        }
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