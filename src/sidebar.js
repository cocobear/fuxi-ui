export default function () {
    return [
        { header: true, text: "信息收集" },
        { group: true, text: "端口", icon: 'mdi-map-marker-path', items: [
                { text: "新建扫描", path: "/discovery/port/new" },{ text: "任务管理", path: "/discovery/port/tasks" },
            ]
        },
        { dc: true, icon: 'mdi-fingerprint', text: '指纹', path: '/discovery/whatweb' },
        { group: true, text: "域名", icon: 'mdi-web-box', items: [
                { text: "新建扫描", path: "/discovery/subdomain/new" },
                { text: "任务管理", path: "/discovery/subdomain/tasks" }
            ]
        },
        
        { divider: true },
        { header: true, text: "漏洞扫描" },
        { group: true, text: "PoC扫描", icon: 'mdi-credit-card-scan-outline', items: [
                { text: "新建扫描", path: "/scanner/poc/new" },{ text: "任务管理", path: "/scanner/poc/tasks" },
                { text: "插件管理", path: "/scanner/poc/plugin" },{ text: "漏洞管理", path: "/scanner/poc/vul" },
            ]
        },
        { dc: true, icon: 'mdi-needle', text: '注入', path: '/scanner/sqlmap/tasks' },
        { divider: true },
        { header: true, text: "漏洞利用" },
        { dc: true, icon: 'mdi-nodejs', text: 'JSONP劫持 ', path: '/exploit/jsonp/tasks' },
        { dc: true, icon: 'mdi-anchor', text: 'XSS猎手', path: '/exploit/xss/tasks' },
        { dc: true, icon: 'mdi-spider-web', text: 'HTTP日志', path: '/exploit/http/result' },
    ]
}