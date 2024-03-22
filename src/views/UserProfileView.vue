<template>
    <div>
        <div v-if="!getUserBasicInformation" class="m-auto py-5" style="width: max-content;">
            <div>
                <h3>Loading</h3>
            </div>
            <div class="d-flex gap-1">
                <span v-for="dot in dots" class="p-1 bg-primary">
                    {{ dot }}
                </span>
            </div>
        </div>

        <div v-else-if="getUserBasicInformation.length == 0">
            {{ stopDotsInterval() }}
            <div class="d-flex flex-column align-items-center">
                <i class="bi bi-database-fill-x" style="font-size: 3rem;"></i>
                <span class="fs-6">NO DATA</span>
            </div>
        </div>

        <div v-else class="profile-layout">
            {{ stopDotsInterval() }}
            <div class="d-flex flex-column align-items-center my-5">
                <div class="text-center">
                    <h1>Profile</h1>
                </div>
                <div class="col-10 col-sm-8 col-md-6 mb-3">
                    <label for="userName" class="form-label">User Name</label>
                    <input type="text" class="form-control" id="userName" v-model="userBasicInfo.userName"
                        @input="userEditEvent">
                </div>
                <div class="col-10 col-sm-8 col-md-6 mb-3">
                    <label for="emailAddress" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="emailAddress" v-model="userBasicInfo.emailAddress"
                        disabled>
                </div>
                <div class="col-10 col-sm-8 col-md-6 mb-3">
                    <input type="button" class="btn btn-success form-control" value="Update Profile"
                        :disabled="activeProfileUpdateBtn" @click="updateProfile">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var dotsInterval;
var isIncrease = true;
export default {
    data() {
        return {
            activeProfileUpdateBtn: true,
            userBasicInfo: null,
            userBasicInfoClone: null,

            dots: [""],
        }
    },
    methods: {
        stopDotsInterval() {
            clearInterval(dotsInterval)
        },
        userEditEvent() {
            this.activeProfileUpdateBtn = true
            Object.keys(this.userBasicInfo).forEach((key) => {
                if (this.userBasicInfo[key] != this.userBasicInfoClone[key] && key != 'createdTimestamp') {
                    this.activeProfileUpdateBtn = false
                    return;
                }
            })
        },
        updateProfile() {
            this.$store.dispatch('updateExistingDocument', {
                data: { userName: this.userBasicInfo.userName },
                collectionName: 'users',
                docId: this.userBasicInfo.docId
            })
            this.activeProfileUpdateBtn = true
        },
    },
    computed: {
        getFirebaseUserInfo() {
            return this.$store.getters.acquireUserInfo
        },
        getUserBasicInformation() {
            let tmp = this.$store.getters.acquireUserProfileData('basicInfo')
            this.userBasicInfo = tmp == null ? null : tmp[0] ?? []

            if (this.userBasicInfoClone == null) {
                this.userBasicInfoClone = JSON.parse(JSON.stringify(this.userBasicInfo))
            }
            return this.userBasicInfo
        }
    },
    mounted() {
        if (!this.data)
            dotsInterval = setInterval(() => {
                if (this.dots.length < 9 && isIncrease) {
                    this.dots.push("")
                    if (this.dots.length == 8)
                        isIncrease = !isIncrease
                } else {
                    this.dots.pop()
                    if (this.dots.length == 1)
                        isIncrease = !isIncrease
                }
            }, 300)

        setTimeout(() => {
            this.$store.dispatch('getCollectionData', {
                collectionName: 'users',
                wheres: [
                    { key: 'uid', opt: '==', value: this.getFirebaseUserInfo?.uid }
                ],
                orders: [],
                groupName: 'userProfileData',
                saveCollectionName: 'basicInfo',
            })
        }, 1500);
    },
}
</script>
<style scoped>
.gallery-item:hover .hover-view {
    opacity: 1;
}

.hover-view {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 3;

    padding: 1rem;
    background-color: rgba(175, 238, 238, 0.5);

    display: flex;
    flex-direction: column;
    /* align-items: center; */
    justify-content: center;
    gap: .5rem;

    opacity: 0;
    transition: opacity .5s linear;
}

.profile-image-preview {
    position: relative;
    margin: 0 auto;
    width: 180px;
    height: 180px;
    /* background-color: yellow; */
    border-radius: 50%;
    /* overflow: hidden; */
    border: 2px solid var(--color-g-web);
    /* box-shadow: 2px 2px 4px black, -2px -2px 4px black; */
}

.btn-camera-img {
    position: absolute;
    right: 0;
    bottom: 5%;
    padding: 0 .25rem;
    background-color: white;
    border: 2px solid var(--color-g-web);
    width: 50px;
    height: 50px;
    border-radius: 25%;
    cursor: pointer;
}

.btn-camera-img:hover {
    background-color: var(--color-pale-g-web);
}

.image-choose-upload {
    display: flex;
    justify-content: center;
    gap: .5rem;
}

.image-choose-upload>* {
    padding: .125rem .5rem;
    font-size: 1.125rem;
    border: none;
}

.profile-image-preview:hover .image-choose-upload {
    top: 50%;
}

.profile-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.profile-image {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.nav-tabs {
    box-sizing: border-box !important;
    overflow: hidden !important;
}

.nav-tabs .nav-link {
    color: var(--color-black);
}

.nav-tabs .nav-item.show .nav-link,
.nav-tabs .nav-link.active {
    /* border: none; */
    font-weight: bold;
    color: var(--color-g-web);
    border-bottom: 4px solid var(--color-g-web);
}

.gallery {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
}

.gallery>div {
    flex: 0 0 calc((100% - 1.5rem) / 4);
}

.gallery>div>img {
    width: 100%;
    height: 300px;
    object-fit: cover;
}
</style>