<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>子域名任务管理</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

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
                        dense
                        loading-text="加载中...请稍等"
                        :search="search"
                        show-select
                        v-model="selected"
                        no-data-text=""
                >
                    <template v-slot:item.name="{ item }">
                        <span @click="getTaskResult(item['tid'])" class="teal--text">{{item['name'] | long}}</span>
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

                    <template v-slot:item.count="{ item }">
                        <v-btn  x-small elevation="0" :color="item['count'] === 0 ? 'grey lighten-3' : 'success'">
                            {{item['count']}}
                        </v-btn>
                    </template>

                    <template v-slot:item.threads="{ item }">
                        <v-btn  x-small elevation="0" color="grey lighten-3">
                            {{item['threads']}}
                        </v-btn>
                    </template>
                    <template v-slot:item.brute="{ item }">
                        <v-btn  x-small elevation="0" color="grey lighten-3">
                            {{item['brute']}}
                        </v-btn>
                    </template>

                    <template v-slot:item.info="{ item }">
                        <v-btn  x-small elevation="0" color="grey lighten-3">
                            {{item['info']}}
                        </v-btn>
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-menu
                                offset-x
                                transition="slide-x-transition"
                                bottom
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn icon class="mr-1" v-on="on">
                                    <v-icon >mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-list>
                                    <v-list-item @click="exportResult(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon class="orange--text">mdi-export</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="orange--text">Export</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="showTaskDetail(item)">
                                        <v-list-item-action>
                                            <v-icon>mdi-book</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span>详情</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="rescanTask(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon class="teal--text">mdi-reload</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="teal--text">Rescan</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="deleteTask(item['tid'])">
                                        <v-list-item-action>
                                            <v-icon class="error--text">mdi-trash-can-outline</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="error--text">删除</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-menu>
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
        <v-dialog v-model="taskDetailDialogOpen" width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{taskDetail.name}}</span>
                </v-card-title>
                <v-card-text>
                    <div>
                        <table class="subtitle-1">
                            <tr>
                                <td><strong class="teal--text">任务名称</strong></td>
                                <td><span class="ml-8">{{taskDetail.name}}</span></td>
                            </tr><tr>
                                <td><strong class="teal--text">目标</strong></td>
                                <td><span class="ml-8">{{taskDetail.target}}</span></td>
                            </tr><tr>
                                <td><strong class="teal--text">线程数</strong></td>
                                <td><span class="ml-8">{{taskDetail.threads}}</span></td>
                            </tr><tr>
                                <td><strong class="teal--text">状态</strong></td>
                                <td><span class="ml-8">{{taskDetail.status}}</span></td>
                            </tr><tr>
                                <td><strong class="teal--text">子域名</strong></td>
                                <td><span class="ml-8">{{taskDetail.count}}</span></td>
                            </tr><tr>
                                <td><strong class="teal--text">操作人</strong></td>
                                <td><span class="ml-8">{{taskDetail.op}}</span></td>
                            </tr><tr>
                                <td><strong class="teal--text">暴力</strong></td>
                                <td><span class="ml-8">{{taskDetail.brute}}</span></td>
                            </tr><tr>
                                <td><strong class="teal--text">网站信息</strong></td>
                                <td><span class="ml-8">{{taskDetail.info}}</span></td>
                            </tr><tr>
                                <td><strong class="teal--text">开始时间</strong></td>
                                <td><span class="ml-8">{{taskDetail.date}}</span></td>
                            </tr><tr>
                                <td><strong class="teal--text">结束时间</strong></td>
                                <td><span class="ml-8">{{taskDetail.end_date}}</span></td>
                            </tr>
                        </table>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="taskDetailDialogOpen = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "SubdomainTaskManagement",
        data: () => ({
            spinShow: true,
            items: [],
            pageCurrent: 1,
            pageSize: 10,
            search: "",
            selected: [],
            headers: [
                { text: '任务名称', value: 'name' },
                { text: '状态', value: 'status' },
                { text: '子域名', value: 'count' },
                { text: '网站信息', value: 'info' },
                { text: '开始时间', value: 'date' },
                { text: '结束时间', value: 'end_date' },
                { text: '操作人', value: 'op' },
                { text: '动作', value: 'action' },
            ],
            deleteMultiDialog: false,
            taskDetailDialogOpen: false,
            taskDetail: {name: "", target: "", threads: 40, date: "", end_date: "",
                op: "", brute: "", info: "", status: "", count: 0}
        }),
        mounted() {
            this.getData();
            this.spinShow = false
        },
        methods: {
            getData() {
                this.$api.discovery.subdomainTaskList().then(res => {
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
                this.$api.discovery.subdomainTaskDelete(tid).then(res => {
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
            rescanTask(tid) {
                this.$api.discovery.subdomainTaskRescan(tid).then(res => {
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
            showTaskDetail(item) {
                this.taskDetailDialogOpen = true;
                this.taskDetail.name = item['name'];
                this.taskDetail.target = item['target'].join(", ");
                this.taskDetail.threads = item['threads'];
                this.taskDetail.date = item['date'];
                this.taskDetail.end_date = item['end_date'];
                this.taskDetail.op = item['op'];
                this.taskDetail.brute = item['brute'];
                this.taskDetail.info = item['info'];
                this.taskDetail.status = item['status'];
                this.taskDetail.count = item['count'];
            },
            getTaskResult(tid){
                window.open('#/discovery/subdomain/result?tid=' + tid, "_blank");
            },
            exportResult(tid) {
                window.open(this.$api.SERVER_ADDER + "/discovery/subdomain/export/" + tid  + "?token=" + this.$api.TOKEN)
            },
        }
    }
</script>

<style scoped>

</style>