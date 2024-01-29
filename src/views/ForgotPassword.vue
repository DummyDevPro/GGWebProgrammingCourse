<template>
    <div class="col-10 col-sm-8 col-md-6 col-lg-4 mx-auto my-3">
        <form @submit.prevent="renewPasswordByMail">
            <h3 class="text-center mb-3">パスワードを忘れた場合</h3>
            <p class="text-center m-0 p-0">
                <small>メールアドレスを入力してください。</small> <br>
                <small>新しいパスワードを発行するリンクを送信します。</small>
            </p>
            <div class="input-group mb-3">
                <input type="email" class="form-control" placeholder="yourmail@gmail.com" aria-label="Renew Password"
                    aria-describedby="button-addon2" v-model="email" required>
                <input type="submit" value="送信" class="btn btn-primary">
            </div>
        </form>

        <div v-show="alertShow">
            <div v-if="alertType == 'success'" class="alert alert-success" role="alert">
                <p class="fs-4">
                    メールを確認してください。
                </p>
                <p>
                    メールに新しいパスワードを発行するためリンクを送りました。
                    そのリンクをクリックして<strong>パスワード</strong>を再設定してください。
                </p>
            </div>
            <div v-else class="alert alert-danger" role="alert">{{ alertMessage }}</div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            email: '',
            alertShow: false,
            alertType: '',
            alertMessage: ''
        }
    },
    methods: {
        renewPasswordByMail() {
            this.alertShow = false
            this.$store
                .dispatch('renewPasswordByMail', { email: this.email })
                .then((response) => {
                    this.alertShow = true
                    this.alertType = response.myStatus
                    if (response.extraMsg) {
                        this.alertMessage = response.extraMsg
                    } else {
                        this.alertMessage = response.code
                    }
                })
        }
    },
}
</script>