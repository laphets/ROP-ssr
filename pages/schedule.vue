<template>
    <section class="container">
        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title primary-title>
                <div>
                    <h3 class="headline mb-0">{{instance.name}}同学您好:</h3>
                    <div>接下来希望你能够为你的每个志愿选择一个你认为合适的时间段参加面试~</div>
                </div>
                </v-card-title>
            </v-card>

            <v-card v-for="(intent, index) in instance.intent_groups" :key="index">
                <v-card-title primary-title>
                <div>
                    <h3 class="headline mb-0">{{intent.chinese_stage}}: {{intent.department}}</h3>
                    <div>
                        <v-radio-group @change="change">
                        <v-radio
                            color="primary"
                            v-for="(interview, index1) in intent.interviews" :key="index1"
                            :label="`${prase_time(interview.start_time)} ~ ${prase_time(interview.end_time)}`"
                            :value="`${intent.intent_id}#${interview.ID}`"
                        ></v-radio>
                        </v-radio-group>
                        </div>
                    </div>
                </div>
                </v-card-title>

                <v-card-actions>
                <v-btn @click="submit(intent.intent_id)" flat color="success">提交</v-btn>
                <v-btn @click="reject(intent.intent_id)" flat color="error">拒绝</v-btn>
                </v-card-actions>
            </v-card>
            </v-flex>
        </v-layout>


    </section>
</template>

<script>
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/zh-cn';

export default {
    layout: 'schedule',
    async asyncData (context) {
        // console.log(context)
        // console.log(context.query)
        const { uid } = context.query
        // console.log(this)
        const { data } = ((await axios.get(`http://192.168.199.211:3000/v1/ssr/schedule?uid=${uid}`)).data)
        return { instance: data }
    },
    data() {
        return {
            radioSelectList: ['1'],
            a: 1,
        }
    },
    created() {

    },
    methods: {
        prase_time(time) {
            return moment(new Date(time)).format('LLL')
        },
        reject(intent_id) {
            console.log(intent_id)
        },
        async submit(intent_id) {
            await axios.post(`http://192.168.199.211:3000/v1/ssr/join/${this.radioSelectList[intent_id]}`, {
                intents: [intent_id]
            })
            // console.log(this.radioSelectList[intent_id])
        },
        change(e) {
            const [intent_id, interview_id ]= (e.split('#')).map(item => ~~item)
            this.radioSelectList[~~intent_id] = ~~interview_id
        }
    }
}
</script>

<style>
.headline {
    font-size: 22px !important;
}
.v-card {
    margin-bottom: 20px;
}
</style>