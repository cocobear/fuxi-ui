<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>端口</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n2">
            <v-col cols="6">
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
                            <span style="color: #FFC107">警告</span>
                        </v-card-title>
                        <v-card-text>
                            确认要删除吗？
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="grey darken-1" text @click="deleteMultiDialog = false">
                                取消
                            </v-btn>
                            <v-btn
                                    color="primary darken-1"
                                    @click="deleteSelectedHost(selected)"
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

            <v-col cols="6">
                <v-btn @click="sendTargetToWhatweb" elevation="0" color="teal" class="mr-8">
                    <v-icon class="white--text mr-2">mdi-credit-card-scan-outline</v-icon>
                    <span class="white--text">Whatweb</span>
                </v-btn>
                <v-btn @click="sendTargetToPocScanner" elevation="0" color="teal">
                    <v-icon class="white--text mr-2">mdi-credit-card-scan-outline</v-icon>
                    <span class="white--text">PoC扫描</span>
                </v-btn>
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
                        item-key="hid"
                        loading-text="加载中...请稍等"
                        :search="search"
                        show-select
                        v-model="selected"
                        no-data-text=""
                >

                    <template v-slot:item.name="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{item['name'] | long}}</span>
                            </template>
                            <span>{{item['name']}}</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.port_str="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{item['port_str'] | long}}</span>
                            </template>
                            <span>{{item['port_str']}}</span>
                        </v-tooltip>
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
                                    <v-list-item @click="hostDetail(item['hid'])">
                                        <v-list-item-action>
                                            <v-icon class="teal--text">mdi-book-open-outline</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content class="ml-n4 mr-4">
                                            <v-list-item-title>
                                                <span class="teal--text">详情</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item @click="deleteHost(item['hid'])">
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
        <v-dialog v-model="hostDetailDialogOpen" width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{hostData.name}}</span>
                </v-card-title>
                <v-card-text>
                    <div>
                        <div v-if="hostData.length===0">
                            <h6  class="text-center mt-4">Not Found Open Port</h6>
                            <br>
                            <br>
                        </div>
                        <table id="host_detail_table">
                            <tr v-for="(item, index) in hostData" :key="index">
                                <td><span class="mr-3">{{item['host']}}</span></td>
                                <td><span class="mr-3">{{item['hostname']}}</span></td>
                                <td><span class="mr-3">{{item['port']}}</span></td>
                                <td><span class="mr-3">{{item['name']}}</span></td>
<!--                                <td><span class="mr-3">{{item['extrainfo']}}</span></td>-->
                            </tr>
                        </table>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="hostDetailDialogOpen = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "PortTaskResult",
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
                { text: '主机名', value: 'hostname' },
                { text: 'IP', value: 'host' },
                { text: '端口', value: 'port_str' },
                { text: '时间', value: 'date' },
                { text: '操作', value: 'action' },
            ],
            deleteMultiDialog: false,
            hostDetailDialogOpen: false,
            hostData: {name: "", data: ""}
        }),
        mounted() {
            this.tid = this.$route.query.tid;
            if (this.tid !== undefined) {
                this.getData(this.tid);
            }
            this.spinShow = false
        },
        methods: {
            getData(tid) {
                this.$api.discovery.portTaskResult(tid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.items = result
                    } else {
                        this.$message.error(status['message']);
                    }
                })
//                 let a = {"status": {"status": "success", "code": 10200, "message": ""}, "result": [{"hid": "5ed27dc036bb97dd2d32811c", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.12", "hostname": "-", "port": [8080], "port_str": "8080", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d32811d", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.14", "hostname": "-", "port": [80, 443], "port_str": "80,443", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d32811e", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.15", "hostname": "-", "port": [80, 1723, 6000, 8081], "port_str": "80,1723,6000,8081", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328120", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.30", "hostname": "-", "port": [], "port_str": "-", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328121", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.40", "hostname": "-", "port": [], "port_str": "-", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328122", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.41", "hostname": "-", "port": [80, 5001, 5002, 5003, 5004, 49154, 49165], "port_str": "80,5001,5002,5003,5004,49154,49165", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328123", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.42", "hostname": "-", "port": [80, 443, 30000], "port_str": "80,443,30000", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328124", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.46", "hostname": "-", "port": [], "port_str": "-", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328125", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.5", "hostname": "-", "port": [21], "port_str": "21", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328126", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.54", "hostname": "-", "port": [], "port_str": "-", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328127", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.55", "hostname": "-", "port": [], "port_str": "-", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328128", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.56", "hostname": "-", "port": [], "port_str": "-", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d328129", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.57", "hostname": "-", "port": [], "port_str": "-", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d32812a", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.60", "hostname": "-", "port": [80, 443], "port_str": "80,443", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d32812b", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.65", "hostname": "-", "port": [], "port_str": "-", "date": "2020-05-30 15:37:36"}, {"hid": "5ed27dc036bb97dd2d32812c", "tid": "5ed27ce0ecc711e64e821ebd", "name": "\u897f\u519c\u7aef\u53e3\u626b\u63cf\u6d4b\u8bd5", "host": "61.150.47.8", "hostname": "-", "port": [53], "port_str": "53", "date": "2020-05-30 15:37:36"}], "timestamp": 1592124658}
// ;               
//                 this.items = a['result'];
            },
            deleteHost(hid) {
                this.$api.discovery.portHostDelete(hid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData(this.tid);
                })


            },
            deleteSelectedHost(selected) {
                let hids = [];
                for (let i=0; i<selected.length; i++) {
                    hids.push(selected[i]['hid'])
                }
                this.deleteMultiDialog = false
                this.deleteHost(hids.join(","));

            },
            hostDetail(hid) {
                this.$api.discovery.portHostDetail(hid).then(res => {
                    this.hostDetailDialogOpen = true;
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        this.hostData = result;
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            sendTargetToPocScanner(){
                let target = [];
                for (let i=0; i<this.selected.length; i++) {
                    target.push(this.selected[i]['host'])
                }
                window.open("#/scanner/poc/new?target=" + target.join(","), "_bank")
            },
            sendTargetToWhatweb(){
                let target = [];
                for (let i=0; i<this.selected.length; i++) {
                    for (let c=0; c<this.selected[i]['port'].length; c++) {
                        target.push(this.selected[i]['host'] + ":" + this.selected[i]['port'][c].toString())
                    }
                }
                window.open("#/discovery/whatweb?target=" + target.join(","), "_bank")
            },
        }
    }
</script>

<style scoped>

</style>