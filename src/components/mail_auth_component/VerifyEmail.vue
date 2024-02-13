<template>
    <div class="col-10 col-sm-8 col-md-6 col-lg-5 mx-auto my-3">
        <div v-if="responseStatus === ''">
            <div class="alert alert-info text-center" role="alert">
                Verifying your email address.
            </div>
        </div>
        <div v-else-if="responseStatus == 'error'">
            <div class="alert alert-danger text-center" role="alert">
                Your email address had already been verified or expired.
            </div>
        </div>
        <div v-else>
            <div class="alert alert-success text-center" role="alert">
                <div class="mb-3">Your email has been verified.</div>
                <button class="btn btn-success" @click="redirectURL">
                    Go Login
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { saveToLocalStorage } from '@/bstorage';
import router from '@/router';

export default {
    props: ['authData'],
    data() {
        return {
            responseStatus: ''
        }
    },
    methods: {
        redirectURL() {
            if (this.authData && this.authData.continueUrl) {
                let splitUrl = this.authData.continueUrl.split('?')[0]?.split('/')
                saveToLocalStorage({
                    email: this.authData?.continueUrl?.split('?')?.[1]?.split('=')?.[1]
                })
                router.push({ name: splitUrl[splitUrl.length - 1], })
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.$store
                .dispatch('verifyEmailForAccountCreation', { 'oobCode': this.authData.oobCode })
                .then((response) => {
                    this.responseStatus = response.myStatus
                    if (response.myStatus == 'success') {
                        // after user's response
                        // save user email to firebase users collection
                        this.$store.dispatch('addNewDocument', {
                            dataObj: {
                                emailAddress: this.authData?.continueUrl?.split('?')?.[1]?.split('=')?.[1]
                            },
                            collectionName: 'users',
                            requireUserInfo: false,
                            redirectPath: null
                        })
                    }
                })
        }, 1500);
    }
}
</script>

<style scoped></style>