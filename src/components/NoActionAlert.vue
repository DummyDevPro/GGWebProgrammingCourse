<template>
    <div class="modal" tabindex="-1" id="noActionAlert" ref="noActionAlert">
        <div class="modal-dialog">
            <div class="modal-content position-relative">
                <button type="button" class="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close"
                    style="top: 1rem;right: 1rem;z-index: 9;"></button>
                <!-- <div class="modal-header">
                    <h5 class="modal-title">{{ alertData.title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div> -->
                <div class="modal-body d-flex flex-column justify-content-center align-items-center gap-2">
                    <span>
                        <i v-if="alertData.type == 'error'" class="bi bi-exclamation-triangle-fill text-danger"
                            style="font-size: 3.5rem;"></i>
                        <i v-else-if="alertData.type == 'success'" class="bi bi-check-circle-fill text-success"
                            style="font-size: 3.5rem;"></i>
                        <i v-else-if="alertData.type == 'info'" class="bi bi-info-circle-fill text-info"
                            style="font-size: 3.5rem;"></i>

                    </span>
                    <span v-for="obj in brSplit(alertData.content)">{{ obj }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['alertData'],
    methods: {
        brSplit(str) {
            if (str)
                return str.split('<br>')
            return []
        }
    }
}
</script>

<style scoped></style>