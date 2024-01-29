<template>
    <div class="col-10 col-sm-8 col-md-6 col-lg-5 mx-auto my-3">
        <div v-if="error === ''">
            <div class="alert alert-info text-center" role="alert">
                Authentication Process
                <br>
                mail redirect url
            </div>
        </div>
        <div v-else-if="error == 'error'">
            <div class="alert alert-danger text-center" role="alert">
                Authentication Failed.
                <br>
                Reset password link is invalid.
            </div>
        </div>
        <div v-else>
            <form @submit.prevent="resetPassword">
                <h3 class="text-center mb-3">パスワードの再設定</h3>

                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">パスワード<small class="text-danger">*</small></label>
                    <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" required>
                </div>

                <div class="mb-3">
                    <label for="exampleInputPassword2" class="form-label">パスワードの再入力<small
                            class="text-danger">*</small></label>
                    <input v-model="repassword" type="password" class="form-control" id="exampleInputPassword2" required>
                </div>

                <div class="mb-3">
                    <input type="submit" class="btn btn-primary full-width" value="パスワードの再設定">
                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    props: ['authData'],
    data() {
        return {
            error: '',
            password: '',
            repassword: '',
        }
    },
    methods: {
        resetPassword() {
            if (this.password && this.password.length > 8 && this.password === this.repassword) {
                this.$store.dispatch('resetPassword',
                    {
                        'oobCode': this.authData.oobCode,
                        'password': this.password
                    }
                )
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.$store
                .dispatch('resetPasswordLinkValidCheck', { 'oobCode': this.authData.oobCode })
                .then((response) => {
                    this.error = response.myStatus
                })
        }, 1500);
    }
}
</script>
<style></style>