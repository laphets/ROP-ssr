<template>
    <div class="root">
        <!-- error load-->
        <v-snackbar
        v-model="snackbar"
        :multi-line="true"
        :timeout="3000"
        :bottom="true"
        >
        表单加载出现问题了呢~ 请刷新或确认地址无误后重试
        <v-btn
            color="pink"
            flat
            @click="snackbar = false"
        >
            关闭
        </v-btn>
        </v-snackbar>


        <!-- error submit -->
        <v-snackbar
        v-model="submiterror"
        :multi-line="true"
        :timeout="5000"
        :top="true"
        >
        {{errorMsg}}
        <v-btn
            color="pink"
            flat
            @click="submiterror = false"
        >
            关闭
        </v-btn>
        </v-snackbar>

        <!-- Loading -->
        <v-dialog
        v-model="loading"
        hide-overlay
        persistent
        width="300"
        >
        <v-card
            color="deep-purple"
            dark
        >
            <v-card-text>
            潮潮正在努力的为你提交报名表~
            <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
            ></v-progress-linear>
            </v-card-text>
        </v-card>
        </v-dialog>

        <!-- Success Info -->
<v-dialog v-model="submitted" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card height="100%;">
        <v-toolbar dark color="deep-purple">
          <v-btn icon dark @click.native="submitted = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>表单提交成功</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="submitted = false">关闭</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="submitted-container">
            <img src="~/assets/logo.svg" alt="head logo">
            <div>
                <h1>潮潮已经成功收到了你的表单呢~</h1>
            </div>
        </div>
      </v-card>
    </v-dialog>

        <header>
            <div class="header-container">
                <h1>{{instanceData.name}}<br>报名表</h1>
                <div class="sub-title">
                    <!-- {{instanceData.remark}} - {{instanceData.association}} -->
                    截止时间:{{prase_time(instanceData.end_time)}}
                </div>
            </div>
            <img src="~/assets/logo.svg" alt="head logo">
        </header>

        <main v-if="!error">
            <!-- {{form}} -->
            <v-form v-model="valid">
                <div v-for="(item, index) in form" :key="item.tag">
                    <div v-if="item.type === 'INPUT'">
                        <v-text-field
                        name="input-1"
                        :label="`${item.text}${item.required ? '': '(选填)'}`"
                        :rules="item.required? [v => !!v || '这个字段是必须的'] : []"
                        v-model="data[item.tag]"
                        ></v-text-field>
                    </div>
                        <!-- {{item.type}} -->
                    <div v-if="item.type === 'TEXT'">
                        <p class="text">{{item.text}}</p>
                    </div>
                    <div v-if="item.type === 'SELECT'">
                        <div v-if="item.available_cnt === 1">
                            <!-- only one -->
                            <v-select
                            :items="item.choices"
                            v-model="data[item.tag]"
                            :label="item.text"
                            :rules="item.required? [v => !!v || '这个字段是必须的'] : []"
                            item-value="tag"
                            single-line
                            ></v-select>
                        </div>
                        <div v-else>
                            <!-- multi -->
                            <div v-if="item.default_jump === false">
                                <v-select
                                :items="item.choices"
                                v-model="data[item.tag]"
                                :label="`${item.text}(最多${item.available_cnt}项)`"
                                :rules="item.required? [v => !!v || '这个字段是必须的', v => v.length<=item.available_cnt || '选择了过多的选项'] : []"
                                multiple
                                chips
                                :item-disabled="[1]"
                                max-height="400"
                                item-value="tag"
                                persistent-hint
                                ></v-select>
                                <div>
                                    <!-- Render Choice -->
                                    <div v-for="(cur, index) in item.choices" :key="index">
                                        <div v-if=" data[item.tag] && data[item.tag].indexOf(cur.tag) != -1">
                                            <p class="subtext">{{cur.text}}</p>
                                            <div v-for="(subItem, index1) in cur.child">

                                                <div v-if="subItem.type==='BOX'">
                                                    <div class="box">
                                                        <div class="input">
                                                            <v-text-field
                                                            name="input-1"
                                                            :label="`${subItem.text}${subItem.required ? '': '(选填)'}`"
                                                            v-model="data[subItem.tag]"
                                                            ></v-text-field>
                                                        </div>
                                                        <div class="button">
                                                            <a href="https://box.zjuqsc.com" target="_blank">求是潮Box</a>
                                                            <img src="~/assets/box.svg" alt="">
                                                        </div>
                                                    </div>
                                                </div>

                                                <div v-if="subItem.type==='TEXTAREA'">
                                                    <div class="textarea-title" v-html="`${subItem.text}${subItem.required ? '': '(选填)'}`">
                                                    </div>
                                                    <v-textarea
                                                        :title="subItem.text"
                                                        v-model="data[subItem.tag]"
                                                        auto-grow
                                                        
                                                        rows="3"
                                                    ></v-textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>

                            </div>

                        </div>
                    </div>
                    <div v-if="item.type==='UPLOAD'">
                        <div class="upload">
                            <div class="input">
                                <v-text-field
                                @click.native="callUpload(item.tag)"
                                readonly
                                :label="`${item.text}${item.required ? '': '(选填)'}`"
                                v-model="fileListMap[item.tag]"
                                ></v-text-field>
                            </div>

                            <div @click="callUpload(item.tag)" class="label">
                                <div>点击上传</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.type==='BOX'">
                        <v-text-field
                        :rules="item.required? [v => !!v || '这个字段是必须的'] : []"
                        v-model="data[item.tag]"
                        name="input-1"
                        :label="`${item.text}${subItem.required ? '': '(选填)'}`"
                        ></v-text-field>
                    </div>
                    <div v-if="item.type==='TEXTAREA'">
                        <v-textarea
                            :rules="item.required? [v => !!v || '这个字段是必须的'] : []"
                            v-model="data[item.tag]"
                            auto-grow
                            :label="`${item.text}${item.required ? '': '(选填)'}`"
                            rows="3"
                        ></v-textarea>
                    </div>
                </div>
                <div class="submit">
                    <button :disabled="!valid" :class="valid? '': 'disable'" @click.prevent="submit()">提交</button>
                </div>
            </v-form>
        </main>
        <footer>
            <div>
            报名如有问题请及时与我们(<a style="color: #9A9A9A" href="mailto:tech@zjuqsc.com">tech@zjuqsc.com</a>)联系
            </div>
            <p>©浙江大学求是潮 All rights reserved</p>
            <p>
            <a style="color: #64ACF9" href="https://www.qsc.zju.edu.cn" target="_blank">求是潮网站</a>
            </p>
        </footer>
        <input ref="fileInput" style="display: none;" type="file" @change="fileSelected($event)">
    </div>
</template>

<script>
import axios from "axios";
import request from '../plugins/axios'
// import moment from "moment";
import UploadButton from '../components/uploadBtn';
import moment from 'moment';
import 'moment/locale/zh-cn';

import shuffle from 'shuffle-array'

import { AESEncrypto } from '../plugins/encrypt'

const dfs = (rootTag, formMap) => {
    // console.log(rootTag)
    const renderList = [];
    const root = formMap.get(rootTag);
    // let next = root.next;
    let cur = rootTag
    while (cur != -1) {
        // const cur = next;
        let curForm = formMap.get(cur);
        // next = curForm.next;
        // console.log(curForm)
        if (curForm.type === "SELECT" && !curForm.default_jump && curForm.choices.length ) {
            // jump
            //   console.log(curForm.choices);
            for (let x in curForm.choices) {
                let cur = curForm.choices[x];
                const child = [];
                let next1 = cur.next;
                while (next1 != -1) {
                    const curChild = next1;
                    let curChildForm = formMap.get(curChild);
                    next1 = curChildForm.next;
                    child.push(curChildForm);
                }
                // console.log(child);
                curForm.choices[x].child = child;
            }
        }
        renderList.push(curForm);
        cur = curForm.next
    }
    return renderList
};

const waitFor1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 3000)
    })
}

export default {
    components: {
        UploadButton
    },
    // layout: 'schedule',    
    async asyncData(context) {
        try {
            const { instanceId } = context.query
            // console.log("instanceId")
            // console.log(instanceId)
            const { data } = (await request.get(
                `/v1/ssr/form?instanceId=${instanceId}`
            )).data;

            const { data: instanceList } = (await request.get('/v1/ssr/instance')).data
            let instanceData = null;
            instanceList.forEach((item) => {
                if(item.ID == instanceId)
                    instanceData = item;
            })

            const root_tag = data.root_tag;
            let formList = (JSON.parse(data.data)).map((item) => {
                const rule = []
                if(item.required) {
                    rule.push(v => !!v || '这个字段是必须的')
                    // console.log(1)
                }
                // if(item.re) {
                //     rule.push(v => (new RegExp(item.Re)).test(v) || '当前输入不符合')
                //     // console.log(2)
                // }
                return {...item, rule: rule}
            })
            // console.log(formList)
            let root = {};
            const formMap = new Map();
            formList.forEach((item, index) => {
                formMap.set(item.tag, item);
            });
            // console.log(formMap)
            // console.log(root_tag);

            const renderList = dfs(root_tag, formMap);
            // console.log(renderList)
            // console.log(renderList[renderList.length - 1].choices[0].child);
            // console.log()
            return { form: renderList, snackbar: false, error: false, instanceData };
        } catch(error) {
            console.log(error)
            return {snackbar: true, error: true, form: []}
        }

    },
    data() {
        return {
            nameRules: [
                v => !!v || 'Name is required',
                v => v.length <= 10 || 'Name must be less than 10 characters'
            ],
            valid: false,
            e1: "",
            e6: "",
            bio: "",
            data: [],
            submitted: false,
            loading: false,
            submiterror: false,
            errorMsg: '',
            hhh1: '',
            filecurTag: '',
            fileListMap: [],
        };
    },
    mounted() {
        const instanceId = this.$route.query.instanceId || 1
        const store = window.localStorage.getItem(`instance${instanceId}`)
        if(store) {
            const cur = JSON.parse(store)
            cur.forEach((item, index) => {
                if(item) {
                    this.data[index] = item
                }
            })
        }
        // this.data = window.
    },
    methods: {
        prase_time(time) {
            return moment(new Date(time)).format('LLL')
        },
        selectChange(e, tag, choiceLimit) {
            
            // console.log(this.data[tag])
            // console.log(e, choiceLimit)
            if(e.length>choiceLimit) {
                e.pop()
                console.log(this.data[tag])
            }
        },
        callUpload(tag) {
            // console.log(this.$refs.fileInput)
            this.filecurTag = tag
            // console.log(this.filecurTag)
            this.$refs.fileInput.click()
        },
        async fileSelected(e) {
            this.submitFile(e.target.files[0], this.filecurTag)
        },
        log() {
            console.log(this.e6)
        },
        async submitFile(file, tag) {
            try {
                const formData = new FormData()
                formData.append('file', file)
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                const res = await request.post(`/v1/file/upload/img`, formData, config)
                if (((res.data).code) != 0) {
                    throw res.data
                }
                this.data[tag] = (res.data).data
                // this.fileListMap[tag] = file.name
                this.$set(this.fileListMap, tag, file.name)
                // console.log([tag])
                console.log(this.data)
                return
            } catch (error) {
                this.errorMsg = error.data
                this.submiterror = true
                return Promise.reject(error)
            }

        },
        clearMulti() {

        },
        async submit() {
            if(this.valid) {
                try {
                    console.log(111)
                    this.loading = true
                    const submitData = this.data.map((item) => {
                        if(item instanceof Array) {
                            // console.log('here', item)
                            return item.map((it) => `${it}`)
                        } else {
                            // console.log('other', item)
                            return [`${item}`]
                        }
                    })
                    const real = []
                    for(let x in submitData) {
                        if(submitData[x]) {
                            real.push({
                                key: AESEncrypto(`${~~x}`),
                                value: (submitData[x]).map(item => AESEncrypto(item))
                            })
                        }
                    }
                    // console.log(real)
                    shuffle(real)
                    // console.log(real)
                    const instanceId = this.$route.query.instanceId
                    const res = await request.post(`/v1/freshman/submit?instanceId=${instanceId}`, {data: real})
                    if (((res.data).code) != 0) {
                        throw res.data
                    }
                    window.localStorage.setItem(`instance${instanceId}`, JSON.stringify(this.data))
                    this.loading = false;
                    this.submitted = true;
                } catch (error) {
                    console.log(error)
                    this.loading = false;
                    this.errorMsg = error.data
                    this.submiterror = true
                    // console.log(error.data)
                }

            }
        }
    }
};
</script>

<style lang="less">
.textarea-title {
    margin-top: 10px;
    margin-bottom: -20px;
    font-size: 15px;
}
.upload {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .input {
        width: 100%;
        padding-right: 20px;
        input {
            cursor: default !important;
        }
    }
    .label {
        // display: inline;
        width: 114px;
        height: 37px;
        background-color: #4E9BEE;
        text-decoration: none;
        color: #FFF;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.box {
    display: flex;
    justify-content: space-between;
    .input {
        padding-right: 20px;
        width: 100%;
    }
    .button {
        width: 140px;
        display: flex;
        align-items: center;
        a {
            width: 100px;
            display: block;
            flex-grow: 1;
            background-color: #4E9BEE;
            text-decoration: none;
            color: #FFF;
            padding: 9px 11px 11px 11px;
            font-size: 16px;
            font-weight: 600;
            white-space: nowrap;
            height: 40px;
        }
        img {
            height: 40px;
        }
    }
}
.text {
    font-weight: 600;
    font-size: 22px;
    padding: 24px 0px 16px 0px;
    display: flex;
}
.subtext {
    font-weight: 600;
    font-size: 19px;
    padding: 20px 0px 0px 0px;

}
.submitted-container {
    img {
        height: 200px;
        width: 200px;
    }
    margin-top: 20vh;
    vertical-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
header {
    flex-grow: 1;
    display: flex;
    background-color: #FFFFFF;
    box-shadow: #9a9a9a 0 0 20px 1px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    position: relative;
    .header-container {
        margin: 25px 50px;
        h1 {
            color: #212121;
            text-align: left;
            font-weight: 700;
            font-size: 25px;
            line-height: 1.3;
            letter-spacing: 5px;
            white-space: nowrap;
        }
        .sub-title {
            font-size: 12px;
            margin-top: 30px;
            white-space: nowrap;
        }
    }
    img {
        width: 80px;
        position: absolute;
        bottom: 20px;
        right: 20px;
    }
}
main {
    background-color: #FFFFFF;
    box-shadow: #9a9a9a 0 0 20px 1px;
    border-radius: 5px;
    margin-top: 20px;
    padding-top: 10px !important;
    padding: 25px;
    .submit {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        button {
            width: 175px;
            height: 40px;
            background: none;
            border: #000 solid 1px;
            border-radius: 5px;
        }
        .disable {
            cursor: not-allowed;
            border: rgba(128, 125, 125, 0.293) dashed 1px !important;
            color: rgb(128, 125, 125, 0.093) !important;
        }
    }
}
footer {
    p {
        margin-bottom: 0px;
    }
    text-align: center;
    width: 100%;
    color: #9A9A9A;
    margin-top: 40px;
    margin-bottom: 40px;
    font-size: 13px;
    letter-spacing: 1px;
    line-height: 22px;
}
// main::after {
//     content: '';
//     display: block;
//     width: 100%;
//     border-bottom-left-radius: 5px;
//     border-bottom-right-radius: 5px;
//     height: 20px;
//     background: #D1E6FC;

// }
</style>
