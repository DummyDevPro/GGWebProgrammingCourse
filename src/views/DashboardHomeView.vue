<template>
    <current-datetime-comp />
    <div class="text-center recent-activity bg-light py-5">
        <span class="fs-6 text-secondary">There is no recent activity.</span>
    </div>

    <div>
        <div class="calendar"></div>
    </div>

    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 text-center gy-4 p-4 m-0">
        <div class="col">
            <router-link :to="{ name: 'java-compiler' }" class="btn g-web-bg d-block py-5 fs-6 text-white category">Java
                Compiler</router-link>
        </div>
        <div class="col">
            <router-link :to="{ name: 'user-exam-history' }"
                class="btn g-web-bg d-block py-5 fs-6 text-white category">試験歴</router-link>
        </div>

        <!-- Only Admin START -->
        <div v-if="getUserRole && getUserRole == 99" class="col">
            <router-link :to="{ name: 'create-exam' }"
                class="btn g-web-bg d-block py-5 fs-6 text-white category">問題作成</router-link>
        </div>

        <div v-if="getUserRole && getUserRole == 99" class="col">
            <router-link :to="{ name: 'all-users' }"
                class="btn g-web-bg d-block py-5 fs-6 text-white category">メンバーリスト</router-link>
            <!-- <a href="" class="btn g-web-bg d-block py-5 fs-6 text-white category">メンバーリスト</a> -->
        </div>
        <!-- Only Admin END -->
    </div>
</template>
<script>
import CurrentDateTimeComp from '@/components/CurrentDateTimeComp.vue';
export default {
    components: {
        'current-datetime-comp': CurrentDateTimeComp
    },
    computed: {
        getUserRole() {
            return this.$store.getters.acquireUserInfo?.userRole
        }
    }
}
</script>
<style scoped>
.category:hover {
    background-color: #047dd9;
}
</style>