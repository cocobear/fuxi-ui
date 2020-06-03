<template>
    <div>
        <v-data-table
                :headers="headers"
                :items="items"
                hide-default-footer
                :page.sync="pageCurrent"
                :items-per-page="pageSize"
                @page-count="pageCount = $event"
                :loading="spinShow"
                item-key="uid"
                loading-text="加载中...请稍等"
                :search="search"
                show-select
                v-model="selected"
                no-data-text=""
        >
            <template v-slot:item.action="{ item }">
                <v-icon @click="openUpdateUserEditDialog(item)" class="teal--text mr-3">mdi-account</v-icon>
                <v-icon @click="openChangePasswdDialog(item)" class="orange--text lighten-3 mr-3">mdi-cog</v-icon>
                <v-icon @click="deleteUser(item['uid'])" class="error--text">mdi-trash-can-outline</v-icon>
            </template>
        </v-data-table>
        <v-row v-if="items.length === 0" justify="center" class="grey--text mb-12">
            <h2>没有数据</h2>
            <br>
        </v-row>
        <v-divider/>
        <v-row>
            <v-col cols="12">
                <v-btn @click="newUserDialogOpen = true" class="mt-3" elevation="0" color="teal">
                    <span class="white--text">添加用户</span>
                </v-btn>
                <div class="float-right mt-1 mr-3">
                    <v-pagination
                            color="teal"
                            v-model="pageCurrent"
                            :length="Math.ceil(items.length / pageSize)"
                            :total-visible="7"
                    ></v-pagination>
                </div>
            </v-col>
        </v-row>
        <v-dialog v-model="newUserDialogOpen" width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">添加用户</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                    label="用户名"
                                    class="mr-2 ml-2"
                                    v-model="newUserData.username"
                                    :rules="[v => !!v || '用户名必填']"
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="mt-n8">
                            <v-text-field
                                    label="昵称"
                                    class="mr-2 ml-2"
                                    v-model="newUserData.nick"
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="mt-n8">
                            <v-text-field
                                    label="邮箱"
                                    class="mr-2 ml-2"
                                    v-model="newUserData.email"
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="mt-n8">
                            <v-text-field
                                    label="密码"
                                    class="mr-2 ml-2"
                                    v-model="newUserData.password"
                                    :rules="[v => !!v || '密码必填']"
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" >
                            <v-btn @click="newUser" color="teal" class="float-right ml-2 mr-2 mb-4">
                                <span class="white--text">添加</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editUserDialogOpen" width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">编辑账号</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                    label="用户名"
                                    class="mr-2 ml-2"
                                    v-model="editUserData.username"
                                    :rules="[v => !!v || '用户名必填']"
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="mt-n8">
                            <v-text-field
                                    label="昵称"
                                    class="mr-2 ml-2"
                                    v-model="editUserData.nick"
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="mt-n8">
                            <v-text-field
                                    label="邮箱"
                                    class="mr-2 ml-2"
                                    v-model="editUserData.email"
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" >
                            <v-btn @click="updateUser" color="teal" class="float-right ml-2 mr-2 mb-4">
                                <span class="white--text">更新</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="changePasswdDialogOpen" width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">修改密码</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                    label="新密码"
                                    class="mr-2 ml-2"
                                    v-model="changePasswdData.password"
                                    persistent-hint
                                    type="password"
                                    required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="mt-n8">
                            <v-text-field
                                    label="新密码(再输一次)"
                                    class="mr-2 ml-2"
                                    type="password"
                                    v-model="changePasswdData.verify"
                                    persistent-hint
                                    required
                            ></v-text-field>
                        </v-col>
                        <v-col class="mt-n8 ml-2">
                            <span
                                    v-if="changePasswdData.password !== changePasswdData.verify"
                                    class="error--text">* 两次输入的密码不一致 </span>
                        </v-col>
                        <v-col cols="12" >
                            <v-btn @click="changePassword" color="teal" class="float-right ml-2 mr-2 mb-4">
                                <span class="white--text">更新</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "AccountSetting",
        data: () => ({
            spinShow: true,
            items: [],
            pageCurrent: 1,
            pageSize: 10,
            search: "",
            selected: [],
            headers: [
                { text: '用户名', value: 'username' },
                { text: '昵称', value: 'nick' },
                { text: '邮箱', value: 'email' },
                { text: '角色', value: 'role' },
                { text: '添加日期', value: 'date' },
                { text: '操作', value: 'action' },
            ],
            newUserData: {
                username: "",
                nick: "",
                email: "",
                password: "",
            },
            editUserData: {
                username: "",
                nick: "",
                email: "",
                uid: "",
            },
            changePasswdData: {
                username: "",
                password: "",
                verify: "",
            },
            deleteMultiDialog: false,
            newUserDialogOpen: false,
            editUserDialogOpen: false,
            changePasswdDialogOpen: false,
        }),
        mounted() {
            this.getData();
            this.spinShow = false
        },
        methods: {
            getData() {
                this.$api.setting.userList().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if (status['status'] === "success") {
                        this.items = result
                    } else {
                        this.$message.error(status['message']);
                    }
                });
            },

            deleteUser(uid) {
                this.$api.setting.userDelete(uid).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if (status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData();
                })
            },
            newUser() {
                if (this.newUserData.username.length === 0 || this.newUserData.password.length === 0) {
                    this.$message.error("请检查输入");
                    return
                }
                this.newUserDialogOpen = false;
                this.$api.setting.userAdd(this.newUserData).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if (status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData();
                })
            },
            openUpdateUserEditDialog(item){
                this.editUserData = {
                    username: "",
                    nick: "",
                    email: "",
                    uid: "",
                };
                this.editUserData = {
                    username: item['username'],
                    nick: item['nick'],
                    email: item['email'],
                    uid: item['uid'],
                };
                this.editUserDialogOpen = true;
            },
            openChangePasswdDialog(item){
                this.changePasswdData = {
                    username: item['username'],
                    password: "",
                    verify: "",
                };
                this.changePasswdDialogOpen = true;
            },
            updateUser() {
                if (this.editUserData.uid.length === 0 || this.editUserData.username.length === 0) {
                    this.$message.error("请检查输入");
                    return
                }
                this.editUserDialogOpen = false;
                this.$api.setting.userUpdate(this.editUserData.uid, this.editUserData).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if (status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData();
                })
            },
            changePassword() {
                let data = {
                    username: this.changePasswdData.username,
                    password: this.changePasswdData.password,
                };
                if (data.username.length === 0 || data.password.length === 0) {
                    this.$message.error("请检查输入");
                    return
                }
                this.changePasswdDialogOpen = false;
                this.$api.setting.changePassword(data).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    if (status['status'] === "success") {
                        this.$message.success(status['message']);
                    } else {
                        this.$message.error(status['message']);
                    }
                    this.getData();
                })
            },

        }
    }
</script>

<style scoped>

</style>