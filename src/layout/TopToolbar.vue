<template>
    <v-app-bar dark="true" app clipped-left elevation="2" color="#002140" height="80">
        <v-list-item-avatar @click="goToPath('/')" tile size="70" class="ml-4 mr-4">
            <img src="@/assets/images/logo.png" height="40" alt="logo"/>
        </v-list-item-avatar>
        <span @click="goToPath('/')" class="ml-4 headline	grey--text font-weight-medium	">电科院漏洞测试平台</span>
        <v-spacer />
        <div>
            <div >
                <v-btn class="mr-4" icon @click="goToPath('/scanner/poc/new')">
                    <v-icon color="blue darken-2">mdi-credit-card-scan-outline</v-icon>
                </v-btn>
                <v-btn class="mr-4" icon @click="goToPath('/discovery/port/new')">
                    <v-icon color="blue darken-2">mdi-map-marker-path</v-icon>
                </v-btn>
                <v-btn class="mr-4" icon @click="goToPath('/scanner/sqlmap/tasks?task=new')">
                    <v-icon color="blue darken-2">mdi-needle</v-icon>
                </v-btn>
                <v-btn class="mr-4" icon @click="goToPath('/discovery/subdomain/new')">
                    <v-icon color="blue darken-2">mdi-web-box</v-icon>
                </v-btn>
                <v-btn class="mr-4" icon @click="goToPath('/discovery/whatweb')">
                    <v-icon color="blue darken-2">mdi-fingerprint</v-icon>
                </v-btn>
                <v-btn class="mr-4" icon @click="goToPath('/exploit/xss/tasks')">
                    <v-icon color="blue darken-2">mdi-anchor</v-icon>
                </v-btn>
                <v-btn class="mr-12" icon @click="goToPath('/exploit/http/result')">
                    <v-icon color="blue darken-2">mdi-spider-web</v-icon>
                </v-btn>

<!--                <v-tooltip bottom>-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                        <span @click="changeLanguage(language)" v-on="on" :class="'mr-4 ml-12 flag-icon flag-icon-' + language"/>-->
<!--                    </template>-->
<!--                    <span>Language(unfinished)</span>-->
<!--                </v-tooltip>-->

                <v-menu>
                    <template v-slot:activator="{ on }">
                        <v-btn icon class="mr-1" v-on="on">
                            <v-icon color="blue darken-2">mdi-cog-transfer-outline</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item>
                            <v-list-item-action>
                                <v-icon>mdi-account-box</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <span>{{username}}</span>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-divider class="mb-3"/>

                        <v-list-item @click="goToPath('/settings')">
                            <v-list-item-action>
                                <v-icon color="blue darken-2">mdi-cog-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <span>设置</span>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-divider class="mt-1"/>

                        <v-list-item class="mt-2" @click="logout">
                            <v-list-item-action>
                                <v-icon color="error">mdi-logout</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <span class="error--text">退出</span>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>

    </v-app-bar>
</template>

<script>
    export default {
        name: "TopToolbar",
        data: () => ({
            drawer: null,
            username: "Administrator",
            language: "us",
        }),
        mounted() {
            this.whoami()
        },
        methods: {
            goToPath(path){
                this.path = path;
                this.$router.push(path);
            },
            logout() {
                window.localStorage.removeItem('access_token');
                this.$message.success("Logout successfully");
                this.$router.push('/login');
            },
            whoami(){
                this.$api.setting.whoami().then(res => {
                    let response = res.data;
                    let status = response['status'];
                    let result = response['result'];
                    if (status['status'] === "success") {
                        if (result['nick'].length !== 0) {
                            this.username = result['nick']
                        } else {
                            this.username = "Administrator"
                        }
                    } else {
                        this.$message.error(status['message']);
                    }
                });
            },
            changeLanguage(language) {
                console.log(language);
                console.log(this.$vuetify.lang.current = "zhHans");
            }
        }
    }
</script>

<style scoped>
    a:link { text-decoration: none;}
</style>