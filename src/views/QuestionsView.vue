<template>
    <div class="py-3 px-3">
        <BaseLayout :data="getChaptersData" layoutType="1">
            <template #item="{ docId, chapterTitle, chapterSubtitle, details, chapterCodeId }">
                <h2 class="accordion-header" :id="'heading' + docId">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#' + 'collapse' + docId" aria-expanded="true" :aria-controls="'collapse' + docId">
                        {{ chapterTitle }}
                    </button>
                </h2>
                <div :id="'collapse' + docId" class="accordion-collapse collapse" :aria-labelledby="'heading' + docId"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <h6 class="mb-2 color-g-web fw-bold">{{ chapterSubtitle }}</h6>
                        <ul class="ul-wrapper">
                            <li v-for="detail in details" class="">
                                <small>{{ detail }}</small>
                            </li>
                        </ul>
                    </div>
                    <div class="p-2 accordion-footer">
                        <router-link :to="{
                            name: 'questions-chapter',
                            params: {
                                'chapter': chapterCodeId,
                            }
                        }" class="btn btn-primary">チャレンジ</router-link>
                    </div>
                </div>
            </template>
        </BaseLayout>
    </div>
</template>

<script>
import BaseLayout from "@/views/BaseLayout.vue"

export default {
    components: { BaseLayout },
    props: ['specific'],
    data() {
        return {
            'collectionName': this.specific
        }
    },
    computed: {
        getChaptersData() {
            let allChaptersList = this.$store.getters.acquireChapterData(this.collectionName)
            if (allChaptersList && allChaptersList.length > 0) {
                allChaptersList.sort((a, b) => a['chapterCodeId']?.split('-')[2] - b['chapterCodeId']?.split('-')[2])
            }
            return allChaptersList
        }
    },
    mounted() {
        setTimeout(() => {
            this.$store.dispatch('getCollectionData', {
                firstAccessCode: this.collectionName,
                method: 'get',
                collectionKey: 'chapter',
            })
        }, 1500);
    }
}
</script>

<style scoped>
.ul-wrapper {
    color: var(--color-g-web);
    margin: 0;
    padding-left: 1.5rem;
    text-indent: 1rem;
}

.ul-wrapper li::marker {
    content: '✓';
    color: var(--color-g-web);
    font-weight: bold;
    font-size: 1.25rem;
}

.accordion-footer {
    background-color: var(--bs-accordion-active-bg);
}
</style>