<template>
    <div>
        <v-row class="mt-n2">
            <v-col cols="8">
                <v-btn
                        icon
                        class="mr-4 ml-6"
                        v-if="selected.length !== 0"
                        @click="deleteMultiDialog = true">
                    <v-icon large color="teal">mdi-delete-outline</v-icon>
                </v-btn>
                <v-dialog v-model="deleteMultiDialog" max-width="370">
                    <v-card>
                        <v-card-title class="headline">
                            <span style="color: #FFC107">当心</span>
                        </v-card-title>
                        <v-card-text>
                            确认要删除所选项吗？ ？
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="grey darken-1" text @click="deleteMultiDialog = false">
                                取消
                            </v-btn>
                            <v-btn
                                    color="primary darken-1"
                                    text>
                                确认
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-menu
                        :close-on-content-click="false"
                        :nudge-width="200"
                        offset-x
                        transition="slide-x-transition"
                        bottom
                >
                    <template v-slot:activator="{ on }">
                        <v-btn elevation="0" v-on="on"  class="ml-4 mr-4">
                            <span>搜索</span>
                        </v-btn>
                    </template>
                    <v-text-field
                            class="mr-4 ml-4 mb-4"
                            color="teal"
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="搜索"
                            single-line
                            hide-details
                    ></v-text-field>
                </v-menu>
            </v-col>
            <v-col cols="4">
                <v-select
                        class="float-right mr-4"
                        :items="[10, 20, 50, 100]"
                        dense
                        single-line
                        v-model="pageSize"
                        color="teal"
                        style="width: 60px;"
                />
            </v-col>
            <v-col class="mt-n8 ml-4 mr-4" col="12">
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-default-footer
                        :page.sync="pageCurrent"
                        :items-per-page="pageSize"
                        @page-count="pageCount = $event"
                        :loading="spinShow"
                        item-key="tid"
                        loading-text="加载中...请稍等"
                        :search="search"
                        show-select
                        v-model="selected"
                        no-data-text=""
                >
                    <template v-slot:item.name="{ item }">
                        <span @click="getTaskResult(item['tid'])" class="teal--text">{{item['name'] | long}}</span>
                    </template>

                    <template v-slot:item.count="{ item }">
                        <v-btn  x-small elevation="0" :color="item['count'] === 0 ? 'grey lighten-2' : 'success'">
                            {{item['count']}}
                        </v-btn>
                    </template>

                    <template v-slot:item.status="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <div v-on="on">
                                    <v-btn v-if="item.status === 'running'" text icon class="amber--text" x-small>
                                        <v-icon>mdi-checkbox-blank-circle</v-icon>
                                    </v-btn>
                                    <v-btn v-if="item.status === 'waiting'" text icon class="grey--text" x-small>
                                        <v-icon>mdi-checkbox-blank-circle</v-icon>
                                    </v-btn>
                                    <v-btn v-if="item.status === 'completed'" text icon class="teal--text" x-small>
                                        <v-icon>mdi-checkbox-blank-circle</v-icon>
                                    </v-btn>
                                </div>
                            </template>
                            <span>{{item['status'] | capitalize}}</span>
                        </v-tooltip>
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-icon @click="deleteTask(item['tid'])" class="grey--text">mdi-trash-can-outline</v-icon>
                    </template>
                </v-data-table>
                <v-row v-if="items.length === 0" justify="center" class="grey--text mb-12">
                    <h2>没有数据</h2>
                    <br>
                </v-row>
                <v-divider/>
                <v-row>
                    <v-col cols="12">
                        <div class="float-right mb-4 mt-1 mr-3">
                            <v-pagination
                                    color="teal"
                                    v-model="pageCurrent"
                                    :length="Math.ceil(items.length / pageSize)"
                                    :total-visible="7"
                            ></v-pagination>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "WhatwebTasks",
        data: () => ({
            spinShow: true,
            tid: "",
            pid: "",
            items: [],
            pageCurrent: 1,
            pageSize: 10,
            search: "",
            selected: [],
            headers: [
                { text: '任务名称', value: 'name' },
                { text: '状态', value: 'status' },
                { text: '级别', value: 'level' },
                { text: '总计', value: 'count' },
                { text: '开始时间', value: 'date' },
                { text: '结束时间', value: 'end_date' },
                { text: '用户', value: 'op' },
                { text: '操作', value: 'action' },
            ],
            deleteMultiDialog: false,
        }),
        mounted() {
            this.getData();
            this.spinShow = false
        },
        methods: {
            getData() {
                this.$api.discovery.whatwebTaskList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.items = result
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            deleteTask(tid) {
                this.$api.discovery.whatwebTaskDelete(tid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData();
                })
            },
            getTaskResult(tid){
                window.open('#/discovery/whatweb/task?tid=' + tid, "_blank");
            },
        }
    }
</script>

<style scoped>

</style>