<template>
    <v-app id="inspire">
        <v-content>
            <v-container fluid>
                <v-row justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <br><br><br><br>
                        <v-card class="elevation-12 mt-lg-12">
                            <v-toolbar color="teal" dark flat>
                                <v-toolbar-title>电科院漏洞测试平台</v-toolbar-title>
                                <v-spacer />
                            </v-toolbar>
                            <v-card-text @keydown.enter=login>
                                <v-form >
                                    <v-text-field
                                            label="用户名"
                                            name="login"
                                            color="teal"
                                            :rules="[v => !!v || '用户名必填']"
                                            prepend-icon="mdi-account"
                                            type="text"
                                            v-model="username"
                                    />
                                    <v-text-field
                                            label="密码"
                                            name="password"
                                            color="teal"
                                            prepend-icon="mdi-lock"
                                            :rules="[v => !!v || '密码必填']"
                                            type="password"
                                            v-model="password"
                                    />
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn
                                        color="teal"
                                        class="mr-2 mb-3"
                                        @click="login"
                                ><span class="white--text">登录</span></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: "Login",
        data:() => {
            return {
                username: "",
                password: "",
            }
        },
        methods: {
            login() {
                if (this.username.length === 0) {
                    this.$message.error("请输入用户名");
                    return
                }
                if (this.password.length === 0) {
                    this.$message.error("请输入密码");
                    return
                }
                this.$api.auth.getToken(this.username, this.password).then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if(status['status'] === "success") {
                        localStorage.setItem('role', this.username);
                        localStorage.setItem('access_token', result);
                        if (localStorage.getItem('access_token')) {
                            this.$api.TOKEN = result;
                            this.$router.push('/');
                        } else {
                            this.$message.error("设置TOKEN失败")
                        }
                    } else {
                        this.password = "";
                        this.$message.error(status['message']);
                    }
                });
            }
        }
    }
</script>
<style scoped>
.v-toolbar__title {
    margin-left: 30%;
}
</style>
