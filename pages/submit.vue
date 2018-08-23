<template>
    <div>
        <!-- {{form}} -->
        <div v-for="(item, index) in form" :key="item.tag">
            {{item.tag}}
            <div v-if="item.type === 'INPUT'">
                <v-text-field
                id="testing"
                name="input-1"
                :label="item.text"
                v-model="data[item.tag]"
                ></v-text-field>
            </div>
            <div v-if="item.type === 'TEXT'">
                {{item.text}}
            </div>
            <div v-if="item.type === 'SELECT'">
                <div v-if="item.available_cnt === 1">
                    <!-- only one -->
                    <v-select
                    :items="item.choices"
                    v-model="data[item.tag]"
                    :label="item.text"
                    single-line
                    ></v-select>
                </div>
                <div v-else>
                    <!-- multi -->
                    <div v-if="item.default_jump === false">
                        <v-select
                        :items="item.choices"
                        v-model="data[item.tag]"
                        :label="item.text"
                        @change="log()"
                        multiple
                        max-height="400"
                        hint="Pick your favorite states"
                        item-value="tag"
                        persistent-hint
                        ></v-select>
                        <div>
                            <!-- Render Choice -->
                            <div v-for="(cur, index) in item.choices" :key="index">
                                <div v-if=" data[item.tag] && data[item.tag].indexOf(cur.tag) != -1">
                                    <div v-for="(subItem, index1) in cur.child">
                                        <div v-if="subItem.type==='BOX'">
                                            <v-text-field
                                            id="testing"
                                            name="input-1"
                                            :label="`Box ${subItem.text}`"
                                            v-model="data[subItem.tag]"
                                            ></v-text-field>
                                        </div>
                                        <div v-if="subItem.type==='TEXTAREA'">
                                            <v-textarea
                                                v-model="data[subItem.tag]"
                                                auto-grow
                                                :label="subItem.text"
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
            <div v-if="item.type==='BOX'">
                <v-text-field
                v-model="data[item.tag]"
                id="testing"
                name="input-1"
                :label="`Box ${item.text}`"
                ></v-text-field>
            </div>
            <div v-if="item.type==='TEXTAREA'">
                <v-textarea
                    v-model="data[item.tag]"
                    auto-grow
                    :label="item.text"
                    rows="3"
                ></v-textarea>
            </div>
            <div>

            </div>
            <div>

            </div>
        </div>
         <v-btn color="success" @click="submit()">提交</v-btn>
    </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

const renderList = [];

const dfs = (rootTag, formMap) => {
    const root = formMap.get(rootTag);
    let next = root.next;
    while (next != -1) {
        const cur = next;
        let curForm = formMap.get(cur);
        next = curForm.next;
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
    }
};

export default {
    async asyncData(context) {
        const { uid } = context.query;
        const { data } = (await axios.get(
            "http://101.132.66.238/api/v1/ssr/form?uid=Hfhlx4ejXps04qkKA3gXmezlvypBvkeamlnp9CNrTzw"
        )).data;
        const root_tag = data.root_tag;
        const formList = JSON.parse(data.data);
        let root = {};
        const formMap = new Map();
        formList.forEach((item, index) => {
            formMap.set(item.tag, item);
        });
        // console.log(formMap)
        // console.log(root_tag);

        dfs(root_tag, formMap);
        // console.log(renderList[renderList.length - 1].choices[0].child);
        return { form: renderList };
    },
    data() {
        return {
            e1: "",
            e6: "",
            bio: "",
            data: []
        };
    },
    methods: {
        log() {
            console.log(this.e6)
        },
        submit() {
            console.log(this.data)
        }
    }
};
</script>

<style>
</style>
