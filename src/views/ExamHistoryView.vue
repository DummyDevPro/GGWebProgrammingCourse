<template>
    <section class="exam-result-layout py-5">
        <h4 class="text-center mb-3">全試験履歴</h4>
        <div class="px-3">
            <BaseLayout :data="getUserAnswers" layoutType="2" :start="start" :end="end"
                @rowClick="moveToExamResultDetailsPage">
                <template #header>
                    <th scope="col">Start Time</th>
                    <th scope="col">Finish Time</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Result</th>
                </template>

                <template #body="{ startDateTime, createdTimestamp, totalCorrectCount, totalQuestionsCount, subject }">
                    <td>{{ convertDate(startDateTime, true) + ' ' + convertTime(startDateTime, true) }}</td>
                    <td>
                        {{ convertDate(createdTimestamp) + ' ' + convertTime(createdTimestamp) }}
                    </td>
                    <td>{{ subject }}</td>
                    <td>{{ totalCorrectCount + '/' + totalQuestionsCount }}</td>
                </template>
            </BaseLayout>
            <div v-if="getUserAnswers && getUserAnswers.length != 0"
                class="table-controller d-flex align-items-center gap-2 justify-content-center">

                <i @click="updateFilterAnswersData('minus')" :class="currentFilterPage == 1 ? 'd-none' : 'd-block'"
                    class="bi bi-caret-left left-icon"></i>
                <span>
                    Showing <span>{{ currentFilterPageStartNumber }}</span>
                    to {{ currentFilterPage * filterLimit > totalAnswersDataCount ? totalAnswersDataCount :
                currentFilterPage * filterLimit }}
                    of {{ totalAnswersDataCount }}
                </span>
                <i @click="updateFilterAnswersData('plus')"
                    :class="currentFilterPage == filterCount ? 'd-none' : 'd-block'"
                    class="bi bi-caret-right right-icon"></i>

            </div>
        </div>
    </section>
</template>

<script>
import { convertTimeStampToDate, convertTimeStampToTime } from '@/assets/js/dateUtils.js'
import BaseLayout from '@/views/BaseLayout.vue'
export default {
    props: ['userId'],
    components: { BaseLayout },
    data() {
        return {
            'totalAnswersDataCount': 0,
            'filterLimit': 5,
            'filterCount': 0,
            'currentFilterPageStartNumber': 1,
            'currentFilterPage': 1,
            start: 0,
            end: 5,
        }
    },
    methods: {
        convertDate(tstmp, isSec = false) {
            return convertTimeStampToDate(tstmp, isSec)
        },
        convertTime(tstmp, isSec = false) {
            return convertTimeStampToTime(tstmp, isSec)
        },
        updateFilterAnswersData(key) {
            if (key == 'plus') {
                this.currentFilterPage++
            } else {
                this.currentFilterPage--
            }
            this.start = (this.currentFilterPage - 1) * this.filterLimit
            this.end = this.currentFilterPage * this.filterLimit
            this.currentFilterPageStartNumber = this.start + 1
        },
        moveToExamResultDetailsPage(docId) {
            this.$router.push({
                name: 'exam-result-by-id', params: {
                    'examId': docId
                }
            })
        },
    },
    computed: {
        getUserAnswers() {
            const ans = this.$store.getters.acquireAnswersData('all-answers')
            this.totalAnswersDataCount = ans?.length
            if (this.totalAnswersDataCount > 0) {
                this.filterCount = Math.ceil(this.totalAnswersDataCount / this.filterLimit)
            }
            return ans
        }
    },
    mounted() {
        setTimeout(() => {
            this.$store.dispatch('getCollectionData', {
                collectionName: 'user_answers',
                wheres: [
                    // uid passes from request parameter <or> gets from state(login user id)
                    { key: 'uid', opt: '==', value: this.userId ?? this.$store.getters.acquireUserInfo.uid }
                ],
                orders: [
                    {
                        name: 'createdTimestamp',
                        type: 'desc'
                    }
                ],
                groupName: 'answerData',
                saveCollectionName: 'all-answers',
            })
        }, 1500);
    }
}
</script>

<style scoped>
.exam-result-layout table tbody tr {
    cursor: pointer;
}

.left-icon,
.right-icon {
    color: white;
    height: fit-content;
    width: fit-content;
    background-color: var(--color-g-web);
    padding: .25rem .5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all .3s linear;
}

.left-icon:hover,
.right-icon:hover {
    box-shadow: 2px 0 4px black;
}
</style>