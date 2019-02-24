<template>
    <div class="index-page">
         <!-- <v-carousel>
            <v-carousel-item
            v-for="(item,i) in instanceList"
            :key="i"
            >
            {{item}}
            </v-carousel-item>
        </v-carousel> -->
        <v-timeline>
            <v-timeline-item
            v-for="(item,i) in instanceList"
            :key="i"
            color="red lighten-2"
            large
            >
            <span slot="opposite">{{`${prase_time(item.start_time)} - ${prase_time(item.end_time)}`}}</span>
            <v-card class="elevation-2">
                <v-card-title class="headline">{{item.name}}</v-card-title>
                <v-card-text>
                    报名人数: {{item.freshman_count}}
                    <br>
                    备注: {{item.remark}}
                    <br>
                    最大志愿数: {{item.max_intent}}
                    <br>
                    状态: {{item.status}}
                    <br>
                    表单名: {{item.form_name}}
                </v-card-text>
                <v-card-actions>
                <v-list-tile class="grow">
                    <v-list-tile-avatar color="grey darken-3">
                    <span class="white--text headline">潮</span>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                    <v-list-tile-title>{{item.association}}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-layout
                    align-center
                    justify-end
                    >
                    <v-btn @click="gotoSubmit(item.ID)" outline color="warning">报名</v-btn>
                    </v-layout>
                </v-list-tile>
                </v-card-actions>
            </v-card>
            </v-timeline-item>
        </v-timeline>
    </div>
</template>

<script>
import axios from "axios";
import request from '../plugins/axios'
import moment from "moment";
import 'moment/locale/zh-cn';

// const parse_time = (time) => {
//     return moment(new Date(time)).format('LLL')
// }

export default {
    layout: 'index',
    async asyncData(context) {
        context.redirect(`/submit?instanceId=${10}`)
        return
        try {
            const { data } = (await request.get('/v1/ssr/instance')).data
            return {instanceList: data}
        } catch(error) {
            console.log(error)
            return {instanceList: []}
        }

    },
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        prase_time(time) {
            return moment(new Date(time)).format('LLL')
        },
        gotoSubmit(id) {
            this.$router.push({
                path: `/submit?instanceId=${id}`
            })
            // console.log(this.$route)
        }
    }
};
</script>

<style lang="less" scoped>
.index-page {

}
</style>
