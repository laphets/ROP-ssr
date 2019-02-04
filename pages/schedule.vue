<template>
    <section class="container">
        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title primary-title>
                <div v-if="(instance.intent_groups).length">
                    <h3 class="headline mb-0">{{instance.name}}同学您好:</h3>
                    <div>接下来请您为您的每个志愿选择一个合适的时间段参加面试~</div>
                </div>
                <div v-else>
                    <h3 class="headline mb-0">Oops 页面已失效</h3>                    
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

        <v-dialog
            v-model="dialog"
            width="500"
            >
            <v-card>
                <v-card-title
                class="headline grey lighten-2"
                primary-title
                >
                面试须知
                </v-card-title>

                <v-card-text>
                请在对应面试开始时间15分钟前到达相应场地参与面试
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    flat
                    @click="dialog = false"
                >
                    我同意
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
        v-model="snackbar"
        :color="color"
        multi-line="multi-line"
        :timeout="5000"
        vertical="vertical"
        >
            {{ snackbarText }}
            <v-btn
                dark
                flat
                @click="snackbar = false"
            >
                关闭
            </v-btn>
        </v-snackbar>
    </section>
</template>

<script>
import axios from 'axios'
import request from '../plugins/axios'
import moment from 'moment';
import 'moment/locale/zh-cn';

export default {
    layout: 'schedule',
    async asyncData (context) {
        // console.log(context)
        // console.log(context.query)
        const { uid } = context.query
        // console.log(this)
        const { data } = ((await request.get(`/v1/ssr/schedule?uid=${uid}`)).data)
        return { instance: data }
    },
    data() {
        return {
            radioSelectList: ['1'],
            a: 1,
            dialog: false,
            snackbar: false,
            snackbarText: '',
            color: 'success',
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
            // this.dialog = true
            try {
                const res = (await request.post(`/v1/ssr/join/${this.radioSelectList[intent_id]}`, {
                    intents: [intent_id]
                })).data
                if(res.code != 0) {
                    throw res.data
                }
                this.color = 'success';
                this.snackbarText = '面试时间确认成功~'
                this.snackbar = true;
            } catch (error) {
                this.color = 'error';
                this.snackbarText = `面试时间确认失败: ${error}`
                this.snackbar = true;
            }

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