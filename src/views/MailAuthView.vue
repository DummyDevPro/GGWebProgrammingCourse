<template>
    <div v-if="authData.mode == 'verifyEmail'">
        <verify-email :authData="authData"></verify-email>
    </div>

    <div v-else-if="authData.mode == 'recoverEmail'">
        <recover-email :authData="authData"></recover-email>
    </div>

    <div v-else-if="authData.mode == 'resetPassword'">
        <reset-password :authData="authData"></reset-password>
    </div>

    <div v-else>
        <error-page></error-page>
    </div>
</template>

<script>
import ErrorPage from '@/views/404.vue';
import VerifyEmail from '@/components/mail_auth_component/VerifyEmail.vue';
import RecoverEmail from '@/components/mail_auth_component/RecoverEmail.vue';
import ResetPassword from '@/components/mail_auth_component/ResetPassword.vue';

export default {
    data() {
        return {
            authData: {
                mode: '',
                oobCode: '',
                continueUrl: ''
            }
        }
    },
    components: {
        'error-page': ErrorPage,
        'verify-email': VerifyEmail,
        'recover-email': RecoverEmail,
        'reset-password': ResetPassword,
    },
    created() {
        console.log({ ...this.$route.query });
        this.authData.mode = this.$route.query.mode
        this.authData.oobCode = this.$route.query.oobCode
        this.authData.continueUrl = this.$route.query.continueUrl
    }
}
</script>

<style scoped></style>