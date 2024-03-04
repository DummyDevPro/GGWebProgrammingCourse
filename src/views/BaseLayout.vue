<template>
    <div class="py-3">
        <div v-if="!data" class="m-auto py-5" style="width: max-content;">
            <div>
                <h3>Loading</h3>
            </div>
            <div class="d-flex gap-1">
                <span v-for="dot in dots" class="p-1 bg-primary">
                    {{ dot }}
                </span>
            </div>
        </div>
        <div v-else-if="data.length == 0">
            {{ stopDotsInterval() }}
            <div class="d-flex flex-column align-items-center">
                <i class="bi bi-database-fill-x" style="font-size: 3rem;"></i>
                <span class="fs-6">NO DATA</span>
            </div>
        </div>
        <div v-else>
            {{ stopDotsInterval() }}

            <!-- layout type = 0 : Row Layout -->
            <div v-if="layoutType == 0" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
                <div v-for="item in data" class="mb-3">
                    <slot name="item" v-bind="item" />
                </div>
            </div>

            <!-- layout type = 1 : Accordion Layout -->
            <div v-if="layoutType == 1" class="col-12 col-sm-12 col-md-12 col-lg-6 m-auto accordion">
                <div v-for="item in data" class="accordion-item">
                    <slot name="item" v-bind="item" />
                </div>
            </div>

            <!-- layout type = 2 : Table Layout -->
            <table v-if="layoutType == 2" class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <slot name="header" />
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, index) in data.slice(start, end)" @click="rowClickComp(item.docId)"
                        style="cursor: pointer;">
                        <th scope="row">{{ start + index + 1 }}</th>
                        <slot name="body" v-bind="item" />
                    </tr>
                </tbody>

            </table>
        </div>
    </div>
</template>
<script>
var dotsInterval;
var isIncrease = true;
export default {
    props: ['data', 'layoutType', 'start', 'end'],
    data() {
        return {
            dots: [""]
        }
    },
    methods: {
        stopDotsInterval() {
            clearInterval(dotsInterval)
        },

        // For ExamHistoryView
        rowClickComp(docId) {
            this.$emit('rowClick', docId)
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
    }
}
</script>