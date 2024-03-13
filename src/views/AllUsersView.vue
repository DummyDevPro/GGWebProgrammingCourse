<template>
    <section class="py-5">
        <h4 class="text-center mb-3">全メンバー</h4>
        <div class="px-3">
            <BaseLayout :data="getAllUsers" layoutType="2" :start="start" :end="end"
                @rowClickByAdmin="moveToUserExamHistory">
                <template #header>
                    <th scope="col">Email</th>
                    <th scope="col">User Role</th>
                    <th scope="col">Created Date</th>
                </template>

                <template #body="{ emailAddress, userRole, createdTimestamp }">
                    <td>{{ emailAddress }}</td>
                    <td>{{ userRole ? 'Admin' : 'User' }}</td>
                    <td>{{ convertDate(createdTimestamp) }}</td>
                </template>
            </BaseLayout>
            <div v-if="getAllUsers && getAllUsers.length != 0"
                class="table-controller d-flex align-items-center gap-2 justify-content-center">
                <i @click="updateFilterAnswersData('minus')" :class="currentFilterPage == 1 ? 'd-none' : 'd-block'"
                    class="bi bi-caret-left left-icon"></i>
                <span>
                    Showing <span>{{ currentFilterPageStartNumber }}</span>
                    to {{ currentFilterPage * filterLimit > totalUsers ? totalUsers :
                currentFilterPage * filterLimit }}
                    of {{ totalUsers }}
                </span>
                <i @click="updateFilterAnswersData('plus')"
                    :class="currentFilterPage == filterCount ? 'd-none' : 'd-block'"
                    class="bi bi-caret-right right-icon"></i>
            </div>
        </div>
    </section>
</template>

<script>
import { convertTimeStampToDate } from '@/assets/js/dateUtils.js'
import router from '@/router'
import BaseLayout from '@/views/BaseLayout.vue'
export default {
    components: { BaseLayout },
    data() {
        return {
            'totalUsers': 0,
            'filterLimit': 5,
            'filterCount': 0,
            'currentFilterPageStartNumber': 1,
            'currentFilterPage': 1,
            start: 0,
            end: 5,
        }
    },
    computed: {
        getAllUsers() {
            const users = this.$store.getters.acquireAllUsers('allUsers')
            this.totalUsers = users?.length
            if (this.totalUsers > 0) {
                this.filterCount = Math.ceil(this.totalUsers / this.filterLimit)
            }
            return users
        }
    },
    methods: {
        convertDate(tstmp) {
            return convertTimeStampToDate(tstmp)
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
        moveToUserExamHistory(uid) {
            router.push({
                name: 'user-exam-history',
                query: {
                    userId: uid
                }
            })
        }
    },
    mounted() {
        setTimeout(() => {
            this.$store.dispatch('getCollectionData', {
                collectionName: 'users',
                wheres: [],
                orders: [
                    {
                        name: 'createdTimestamp',
                        type: 'desc'
                    }
                ],
                groupName: 'allUsersData',
                saveCollectionName: 'allUsers',
            })
        }, 1500);
    }
}
</script>

<style scoped>
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