<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>端口扫描</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n2">
            <v-col cols="1">
            </v-col>
            <v-col cols="6">
                <span v-if="!nmapExe" class="error--text ml-2">
                    ** Nmap未安装
                    <a href="/#/settings" class="ml-2">Go to</a>
                </span>
                <v-col>
                    <v-text-field
                            label="任务名称"
                            v-model="newTaskData.name"
                            :rules="[v => !!v || '任务名称必填']"
                            persistent-hint
                            required
                    ></v-text-field>
                </v-col>

                <v-col cols="6" class="mt-n8" style="font-size:12px;">
                    <v-combobox
                            v-model="newTaskData.portType"
                            :items="['默认', '自定义', '全部']"
                            label="端口"
                            
                    ></v-combobox>
                </v-col>

                <v-col cols="12" class="mt-n6" v-if="newTaskData.portType === '自定义'">
                    <v-textarea
                            outlined
                            :placeholder="portPlaceholder"
                            v-model="newTaskData.portList"
                            rows="2"
                            label="端口"
                    ></v-textarea>
                </v-col>

                <v-col cols="6" class="mt-n8">
                    <v-combobox
                            v-model="newTaskData.option"
                            :items="defaultOption"
                            label="选项"
                    ></v-combobox>
                </v-col>

                <v-col cols="12" class="mt-n4">
                    <v-textarea
                            outlined
                            :rules="[v => !!v || '目标必填']"
                            v-model="newTaskData.target"
                            rows="5"
                            label="目标"
                            :placeholder="targetPlaceholder"
                    ></v-textarea>
                </v-col>

                <v-col class="mb-4 text-right">
                    <v-btn class="teal" @click="newScan">
                        <v-icon class="white--text">mdi-plus</v-icon>
                        <span class="white--text ml-2 mr-1">开始扫描</span>
                    </v-btn>
                </v-col>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "NewNetPortScan",
        data: () => {
            return {
                target: "",
                newTaskData: {
                    name: "", target: "", portType: "默认", portList: "", option: {text: "默认", value: "10001"},
                },
                nmapExe: true,
                defaultOption: [
                    {text: "默认", value: "10001"},
                    {text: "-sT -T4", value: "10002"},
                    {text: "-Pn", value: "10003"},
                ],
                targetPlaceholder: "例如:\n192.168.1.1\n192.168.2.0/24\nwww.test.com",
                portPlaceholder: "例如: 22,23,80,8080,9090",
            }
        },
        mounted() {
            this.nmapExeCheck();
            this.target = this.$route.query.target;
            if (this.target !== undefined) {
                this.newTaskData.target = this.target.split(",").join("\n");
            }
            this.newTaskData.name = "port_task_" + this.$tools.getDateTime();
        },
        methods: {
            newScan() {
                if (!this.nmapExe) {
                    this.$message.error("Nmap未安装")
                    return;
                }
                let port = "";
                if (this.newTaskData.portType === "自定义") {
                    port = this.newTaskData.portList.split("\n").join(",");
                    if (port.length === 0) {
                        this.$message.error("请指定端口");
                        return
                    }
                }
                if (this.newTaskData.portType === "全部") {
                    port = "1-65535";
                }
                let data = {
                    name: this.newTaskData.name,
                    target: this.newTaskData.target.split("\n").join(","),
                    port: port,
                    option: this.newTaskData.option.value
                };
                if (data.name.length === 0 || data.target.length === 0) {
                    this.$message.error("输入内容不完整");
                    return
                }
                this.$api.discovery.portTaskNew(data).then(res => {
                    this.newTaskData = {
                        name: "", target: "", portType: "默认", portList: "", option: {text: "默认", value: "10001"},
                    };

                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                        this.$router.push('/discovery/port/tasks');
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },
            nmapExeCheck() {
                this.$api.setting.settingList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if (status['status'] === "success") {
                        this.nmapExe = false;
                        for (let i=0; i<result.length; i++) {
                            if (result[i]['key'] === "nmap_exe") {
                                if (result[i]['value'].length > 0) {
                                    this.nmapExe = true;
                                    // this.nmapExe = false;
                                }
                            }
                        }
                    } else {
                        this.$message.error(status['message']);
                    }
                });
            }
        }
    }
</script>
