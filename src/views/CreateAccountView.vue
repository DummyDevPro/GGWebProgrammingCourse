<template>
    <div class="col-10 col-sm-8 col-md-6 col-lg-4 mx-auto my-3">
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                tabindex="0">
                <form @submit.prevent="createAccountWithEmailAndPassword">
                    <h3 class="text-center">アカウント登録</h3>
                    <div class="mb-3">
                        <label for="f1email" class="form-label">メールアドレス<small class="text-danger">*</small></label>
                        <input v-model="f1email" type="email" class="form-control" id="f1email" aria-describedby="emailHelp"
                            required>
                        <div id="emailHelp" class="form-text">あなたのメールを他の人と共有することは決してありません。</div>
                    </div>

                    <div class="mb-3">
                        <label for="f2email" class="form-label">パスワード<small class="text-danger">*</small></label>
                        <input v-model="password" type="password" class="form-control" id="f2email" required>
                    </div>

                    <div class="mb-3">
                        <input type="submit" class="btn btn-success full-width" value="アカウント登録">
                    </div>
                </form>
            </div>
            <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                <form @submit:prevent="">
                    <h3 class="text-center">メールの認証コードから登録</h3>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">メールアドレス<small
                                class="text-danger">*</small></label>
                        <input v-model="f2email" disabled type="email" class="form-control" id="exampleInputEmail1"
                            aria-describedby="emailHelp" required>
                        <div id="emailHelp" class="form-text">あなたのメールを他の人と共有することは決してありません。</div>
                    </div>

                    <div class="mb-3">
                        <input type="submit" class="btn btn-success full-width disabled" value="送信">
                    </div>
                </form>
            </div>
        </div>
        <ul class="nav justify-content-center gap-1" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <i class="bi bi-circle-fill active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                    type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true"></i>
            </li>
            <li class="nav-item" role="presentation">
                <span class="bi bi-circle-fill" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                    type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false"></span>
            </li>
        </ul>
    </div>

    <no-action-alert ref="noAlertComp" :alertData="alertData"></no-action-alert>
</template>
<script>
import { firstCharCap } from '@/assets/js/StringFormat';
import NoActionAlert from '@/components/NoActionAlert.vue';

let modal;
export default {
    data() {
        return {
            f1email: '',
            password: '',
            f2email: '',
            alertData: {}
        }
    },
    components: {
        'no-action-alert': NoActionAlert
    },
    methods: {
        createAccountWithEmailAndPassword() {
            if (this.password.length > 7) {
                this.$store.dispatch('createNewAccountWithEmailAndPassword',
                    {
                        email: this.f1email,
                        password: this.password
                    })
                    .then((response) => {
                        this.alertData.type = response.myStatus
                        if (response.code && response.code.split('/').length > 1) {
                            this.alertData.title = firstCharCap(response.code.split('/')[0], ' ')
                            this.alertData.content = firstCharCap(response.code.split('/')[1], '-')
                        } else {
                            this.alertData.title = 'Info'
                            this.alertData.content = response.extraMsg
                        }

                        if (modal != null) {
                            modal.hide()
                            modal = null
                        }

                        modal = new bootstrap.Modal(this.$refs.noAlertComp.$refs.noActionAlert, {})
                        modal.show()
                    })
            }
        }
    }
}
</script>
<style scoped>
.nav-item>i {
    color: gainsboro;
}

.nav-item>i.active {
    color: var(--color-g-web);
}

.tab-pane.active {
    animation: slide-down 1s ease-out;
}

@keyframes slide-down {
    0% {
        opacity: 0;
        transform: translateX(100%);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>