<template>
    <div>
        <v-card-title>
            <v-list-item-action>
                <v-icon class="teal--text">mdi-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content class="ml-n4">
                <v-list-item-title class="teal--text">
                    <span>子域名扫描</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-card-title>

        <v-row class="mt-n2">
            <v-col cols="1">
            </v-col>
            <v-col cols="6">
                <v-col>
                    <v-text-field
                            label="任务名称"
                            v-model="newTaskData.name"
                            :rules="[v => !!v || '任务名称为空']"
                            persistent-hint
                            required
                    ></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-textarea
                            outlined
                            :rules="[v => !!v || '目标为空']"
                            v-model="newTaskData.target"
                            rows="5"
                            label="目标"
                            :placeholder="targetPlaceholder"
                    ></v-textarea>
                </v-col>
                <v-row cols="12">
                    <v-col cols="3" class="mt-n8 ml-3">
                        <v-checkbox v-model="newTaskData.brute" label="暴力猜测"></v-checkbox>
                    </v-col>
                    <v-col cols="3" class="mt-n8">
                        <v-checkbox v-model="newTaskData.info" label="Web信息"></v-checkbox>
                    </v-col>
                </v-row>

                <v-col cols="12" class="mt-n3">
                    <v-slider
                            v-model="newTaskData.threads"
                            label="线程数"
                            thumb-label="always"
                    ></v-slider>
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
        name: "SubdomainNewTask",
        data: () => {
            return {
                newTaskData: {
                    name: "", target: "", brute: false, info: false, threads: 40
                },
                targetPlaceholder: "Example:\ngoogle.com\nfacebook.com\n....",
            }
        },
        mounted() {
            this.newTaskData.name = "subdomain_task_" + this.$tools.getDateTime();
        },
        computed: {},
        methods: {
            newScan() {
                if (this.newTaskData.name.length === 0 || this.newTaskData.target.length === 0) {
                    this.$message.error("请检查输入");
                    return
                }
                this.$api.discovery.subdomainTaskNew(this.newTaskData).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if(status['status'] === "success") {
                        this.$message.success(status['message']);
                        this.newTaskData = {
                            name: "subdomain_task_" + this.$tools.getDateTime(),
                            target: "", brute: false, http: true,
                        };
                        this.$router.push('/discovery/subdomain/tasks');
                    } else {
                        this.$message.error(status['message']);
                    }
                })
            },

        }
    }
</script>

<style scoped>

</style>