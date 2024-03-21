<template>
    <div class="py-3 px-3">
        <BaseLayout :data="getAllStudentProjects" layoutType="0">
            <template #item="{ projectTitle, projectOwner, projectUrl, projectImageUrl }">
                <div class="card">
                    <img class="card-img-top card-image" :src="projectImageUrl" alt="Default Image">
                    <div class="card-body">
                        <h5 class="card-title">{{ projectTitle }}</h5>
                        <p class="card-text">
                            <span class="badge bg-dark d-flex flex-column">
                                <span>Developer</span>
                                <span>{{ projectOwner }}</span>
                            </span>
                        </p>
                        <a :href="projectUrl" class="btn btn-link" target="_blank">Visit
                            Site</a>
                    </div>
                </div>
            </template>
        </BaseLayout>
    </div>

    <div v-if="getUserRole && getUserRole == 99" class="position-sticky p-3 style-float bg-dark text-center rounded">
        <button class="btn btn-success" @click="showModal">
            Add New Project <i class="bi bi-plus fs-6"></i>
        </button>
    </div>

    <!-- The Modal -->
    <div class="modal fade" id="myModal" ref="myModal">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">Add New Student Project</h4>
                    <button type="button" class="btn-close" @click="hideModal"></button>
                </div>

                <!-- Modal body -->
                <div class="modal-body">
                    <form @submit.prevent="registerStudentProject" ref="registerProjectForm">
                        <div class="mb-3">
                            <label for="projectTitle" class="form-label">Project Title</label>
                            <input type="text" id="projectTitle" class="form-control" v-model="project.projectTitle"
                                required>
                        </div>
                        <div class="mb-3">
                            <label for="projectOwner" class="form-label">Developer Name</label>
                            <input type="text" id="projectOwner" class="form-control" v-model="project.projectOwner"
                                required>
                        </div>
                        <div class="mb-3">
                            <label for="projectImage" class="form-label">Project Demo Image</label>
                            <input type="file" id="projectImage" class="form-control" accept="image/*"
                                @change="selectFile" required>
                        </div>
                        <div class="mb-3">
                            <label for="projectUrl" class="form-label">Project URL</label>
                            <input type="text" id="projectUrl" class="form-control" v-model="project.projectUrl"
                                required>
                        </div>

                        <div class="d-flex">
                            <button type="reset" class="btn btn-danger w-50">Clear</button>
                            <button type="submit" class="btn btn-success w-50" :disabled="btnDisable">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BaseLayout from "@/views/BaseLayout.vue"

let modal;
export default {
    components: { BaseLayout },
    data() {
        return {
            project: {
                projectTitle: null,
                projectUrl: null,
                projectOwner: null,
                projectImageFile: null
            },
            btnDisable: false
        }
    },
    methods: {
        showModal() {
            if (modal == undefined || modal == null) {
                modal = new bootstrap.Modal(this.$refs.myModal, {})
                modal.show()
            }
        },
        hideModal() {
            if (modal != null) {
                modal.hide()
                modal = null
            }
        },
        selectFile(event) {
            if (event.target.files && event.target.files[0]) {
                // Image file read & write
                const reader = new FileReader
                reader.onload = e => { }
                reader.readAsDataURL(event.target.files[0])
                this.project.projectImageFile = event.target.files[0]
            }
        },
        registerStudentProject() {
            let emptyCheck = false;
            Object.keys(this.project).forEach((key) => {
                if (!this.project[key]) {
                    emptyCheck = true;
                    return;
                }
            })

            if (!emptyCheck) {
                this.btnDisable = true
                this.$store
                    .dispatch('registerStudentProject', this.project)
                    .then(() => {
                        this.$store.dispatch('getCollectionData', {
                            collectionName: 'student_projects',
                            wheres: [],
                            orders: [
                                {
                                    name: 'createdTimestamp',
                                    type: 'desc'
                                }
                            ],
                            groupName: 'projectData',
                            saveCollectionName: 'all-projects',
                        })
                    })
                    .finally(() => {
                        this.$refs.registerProjectForm.reset();
                        Object.keys(this.project).forEach((key) => {
                            this.project[key] = null
                        })
                        this.btnDisable = false
                        this.hideModal()
                    })
            }
        }
    },
    computed: {
        getUserRole() {
            return this.$store.getters.acquireUserInfo?.userRole
        },
        getAllStudentProjects() {
            return this.$store.getters.acquireProjectData('all-projects')
        },
    },
    mounted() {
        setTimeout(() => {
            this.$store.dispatch('getCollectionData', {
                collectionName: 'student_projects',
                wheres: [],
                orders: [
                    {
                        name: 'createdTimestamp',
                        type: 'desc'
                    }
                ],
                groupName: 'projectData',
                saveCollectionName: 'all-projects',
            })
        }, 1500);
    }
}
</script>
<style scoped>
.card {
    box-shadow: 0 2px 8px gray;
    transition: all .3s linear;
}

.card:hover {
    box-shadow: none;
}

.card-image {
    background-image: url('../assets/img/default.png');

    width: 100%;
    height: 12rem;

    object-fit: cover;
    object-position: top center;
}

.style-float {
    right: 0;
    bottom: 0;
    z-index: 88;
    width: max-content;
    margin: 0 auto;
}
</style>