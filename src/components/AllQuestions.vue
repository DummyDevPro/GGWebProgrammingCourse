<template>
    <div class="row gy-4">
        <div class="col-xs-7 col-sm-6 col-md-4 col-lg-3" v-for="item in qnl">
            <div class="card">
                <img :src="item.photo" class="card-img-top" style="height: 150px;object-fit: scale-down;">

                <div class="card-body text-center">
                    <h5 class="card-title">{{ item.title }}</h5>
                    <h6 class="card-subtitle mb-2 text-muted text-truncate">{{ item.subTitle }}
                    </h6>
                </div>

                <div class="card-footer text-center">
                    <router-link :to="{
                        name: 'questions', params: {
                            'specific': item.specific
                        }
                    }" class="btn btn-primary">チャレンジ</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['qnl']
}
</script>

<style scoped>
.card img {
    width: 75%;
    margin: 0 auto;
}
</style>