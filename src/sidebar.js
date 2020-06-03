export default function () {
    return [
        { header: true,text: '首页 ', path: '/dashboard' },

        { header: true, text: "信息收集" },
        { group: true, text: "端口扫描", icon: 'mdi-map-marker-path', items: [
                { text: "新建扫描", path: "/discovery/port/new" },{ text: "任务管理", path: "/discovery/port/tasks" },
            ]
        },
        { dc: true, icon: 'mdi-fingerprint', text: '指纹扫描', path: '/discovery/whatweb' },
        { group: true, text: "域名扫描", icon: 'mdi-web-box', items: [
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
        { dc: true, icon: 'mdi-needle', text: 'SQL注入', path: '/scanner/sqlmap/tasks' },
        { divider: true },
        { header: true, text: "漏洞利用" },
        { dc: true, icon: 'mdi-nodejs', text: 'JSONP劫持 ', path: '/exploit/jsonp/tasks' },
        { dc: true, icon: 'mdi-anchor', text: 'XSS利用', path: '/exploit/xss/tasks' },
        { dc: true, icon: 'mdi-spider-web', text: 'HTTP日志', path: '/exploit/http/result' },
    ]
}