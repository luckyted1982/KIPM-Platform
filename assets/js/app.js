// KIPM Demo Application
let currentPage = 'dashboard';
let currentUser = null;
let chartInstances = {};

function doLogin() {
    const role = document.getElementById('login-role').value;
    const roleNames = {
        admin: '系统管理员', 'ip-director': '知产办主任', 'patent-engineer': '专利工程师',
        'data-ip': '数据IP专员', legal: '法务专员', liaison: '四方联络专员', researcher: '科研人员'
    };
    currentUser = { name: document.getElementById('login-username').value || '管理员', role: roleNames[role] || '管理员', roleId: role };
    document.getElementById('current-user-name').textContent = currentUser.name;
    document.getElementById('current-user-role').textContent = currentUser.role;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    navTo('dashboard');
}
function doLogout() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    currentUser = null;
}
function navTo(page) {
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (navEl) navEl.classList.add('active');
    const titles = {
        dashboard: '仪表板', 'ip-management': '知识产权管理', contribution: '贡献度计算引擎',
        blockchain: '区块链存证', 'data-ip': '数据知识产权', collaboration: '四方协同',
        revenue: '收益分配', analysis: '智能分析', settings: '系统管理'
    };
    document.getElementById('breadcrumb').textContent = titles[page] || page;
    renderPage(page);
}
function destroyCharts() {
    Object.values(chartInstances).forEach(c => { if (c && c.destroy) c.destroy(); });
    chartInstances = {};
    if (window.echarts) {
        document.querySelectorAll('.echarts-container').forEach(el => {
            const inst = echarts.getInstanceByDom(el);
            if (inst) inst.dispose();
        });
    }
}

function renderPage(page) {
    destroyCharts();
    const container = document.getElementById('page-container');
    container.innerHTML = '';
    container.className = 'page-container fade-in';
    switch(page) {
        case 'dashboard': renderDashboard(container); break;
        case 'ip-management': renderIPManagement(container); break;
        case 'contribution': renderContribution(container); break;
        case 'blockchain': renderBlockchain(container); break;
        case 'data-ip': renderDataIP(container); break;
        case 'collaboration': renderCollaboration(container); break;
        case 'revenue': renderRevenue(container); break;
        case 'analysis': renderAnalysis(container); break;
        case 'settings': renderSettings(container); break;
    }
}

// ===== DASHBOARD =====
function renderDashboard(container) {
    const totalPatents = MOCK.intellectualProperties.filter(p => p.type.includes('专利')).length;
    const totalCopyrights = MOCK.intellectualProperties.filter(p => p.type === '软件著作权').length;
    const totalDataIPs = MOCK.intellectualProperties.filter(p => p.type === '数据知识产权').length;
    const totalEvidence = MOCK.blockchainEvidence.length;
    const pendingTodos = MOCK.todos.filter(t => t.status === '待处理' || t.status === '待审批').length;

    container.innerHTML = `
        <div class="stats-row">
            <div class="stat-card">
                <div><div class="stat-label">有效专利</div><div class="stat-value">${totalPatents}</div><div class="stat-change up">↑ 较上月 +2</div></div>
                <div class="stat-icon" style="color:var(--primary)">📋</div>
            </div>
            <div class="stat-card">
                <div><div class="stat-label">软件著作权</div><div class="stat-value">${totalCopyrights}</div><div class="stat-change up">↑ 较上月 +1</div></div>
                <div class="stat-icon" style="color:var(--secondary)">©️</div>
            </div>
            <div class="stat-card">
                <div><div class="stat-label">数据知识产权</div><div class="stat-value">${totalDataIPs}</div><div class="stat-change up">↑ 较上月 +2</div></div>
                <div class="stat-icon" style="color:var(--accent)">🗄️</div>
            </div>
            <div class="stat-card">
                <div><div class="stat-label">区块链存证</div><div class="stat-value">${totalEvidence}</div><div class="stat-change up">↑ 较上月 +3</div></div>
                <div class="stat-icon" style="color:#7b1fa2">🔗</div>
            </div>
            <div class="stat-card">
                <div><div class="stat-label">待办事项</div><div class="stat-value">${pendingTodos}</div><div class="stat-change ${pendingTodos>0 ? 'down' : 'up'}">${pendingTodos>0 ? '↓ 需尽快处理' : '✓ 全部完成'}</div></div>
                <div class="stat-icon" style="color:var(--danger)">🔔</div>
            </div>
        </div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">六维投入要素雷达图</div><div class="card-subtitle">KIPM-2025-001 智慧医疗建筑能耗优化</div></div></div>
                <div class="chart-container" id="radar-chart"></div>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">四方贡献度占比</div><div class="card-subtitle">融合结果（AHP 60% + Shapley 40%）</div></div></div>
                <div class="chart-container" id="pie-chart"></div>
            </div>
        </div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">近期区块链存证</div><div class="card-subtitle">权证链 / 天平链一级节点</div></div><button class="btn btn-sm btn-secondary" onclick="navTo('blockchain')">查看全部</button></div>
                <div class="timeline">${MOCK.blockchainEvidence.slice(0,5).map(e => `
                    <div class="timeline-item ${e.status==='已确认'?'success':'pending'}">
                        <div class="timeline-time">${e.timestamp}</div>
                        <div class="timeline-title">[${e.type}] ${e.title}</div>
                        <div class="timeline-desc">存证编号: ${e.chainId} | 哈希: ${e.hash.substring(0,16)}... | <span style="color:var(--secondary);font-weight:600">${e.status}</span></div>
                    </div>
                `).join('')}</div>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">待处理事项</div><div class="card-subtitle">您有 ${pendingTodos} 项待办任务</div></div><button class="btn btn-sm btn-secondary" onclick="alert('功能开发中')">查看全部</button></div>
                <table class="data-table">
                    <thead><tr><th>任务</th><th>类型</th><th>截止日期</th><th>优先级</th><th>状态</th></tr></thead>
                    <tbody>${MOCK.todos.slice(0,5).map(t => `
                        <tr><td><strong>${t.title}</strong></td><td><span class="badge badge-blue">${t.type}</span></td><td>${t.dueDate}</td>
                        <td><span class="badge ${t.priority==='高'?'badge-red':'badge-orange'}">${t.priority}</span></td>
                        <td><span class="badge badge-gray">${t.status}</span></td></tr>
                    `).join('')}</tbody>
                </table>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><div><div class="card-title">在研项目进度</div><div class="card-subtitle">联合研究中心 4 个活跃项目</div></div></div>
            <div class="grid-2" style="gap:16px">
                ${MOCK.projects.map(p => {
                    const progress = Math.round((p.spent / p.budget) * 100);
                    const phaseColors = { '研究立项期': '#1565c0', '实验室开发期': '#7b1fa2', '工程应用期': '#ef6c00', '运营维护期': '#2e7d32' };
                    return `<div class="project-card">
                        <div class="project-header">
                            <div><div class="project-id">${p.id}</div><div class="project-title">${p.name}</div></div>
                            <span class="badge" style="background:${phaseColors[p.phase]}15;color:${phaseColors[p.phase]}">${p.phase}</span>
                        </div>
                        <div class="project-meta">研究方向: ${p.direction} | TRL: ${p.trl} | 预算: ¥${(p.budget/10000).toFixed(0)}万</div>
                        <div style="font-size:12px;color:#555;margin-top:6px">${p.description}</div>
                        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill" style="width:${progress}%;background:${phaseColors[p.phase]}"></div></div>
                        <div style="font-size:11px;color:#888;margin-top:4px">进度: ${progress}% (${(p.spent/10000).toFixed(0)}万 / ${(p.budget/10000).toFixed(0)}万)</div>
                        <div class="project-parties">${p.parties.map(pid => {
                            const party = MOCK.parties.find(x=>x.id===pid);
                            return `<span class="tag" style="background:${party.color}15;color:${party.color}">${party.logo} ${party.short}</span>`;
                        }).join('')}</div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;

    setTimeout(() => {
        initRadarChart();
        initPieChart();
    }, 100);
}

function initRadarChart() {
    const data = MOCK.contributionData['KIPM-2025-001'];
    const dom = document.getElementById('radar-chart');
    if (!dom || !window.echarts) return;
    const chart = echarts.init(dom);
    const option = {
        tooltip: {},
        legend: { data: ['北建大', '北投', '北京城建', '北建院'], bottom: 0, textStyle: { fontSize: 11 } },
        radar: {
            indicator: data.dimensions.map(d => ({ name: d, max: 5 })),
            radius: '65%', center: ['50%', '45%']
        },
        series: [{
            type: 'radar',
            data: [
                { value: data.partyData.BJCD, name: '北建大', itemStyle: { color: '#1565c0' }, areaStyle: { opacity: 0.15 } },
                { value: data.partyData.BTJT, name: '北投', itemStyle: { color: '#2e7d32' }, areaStyle: { opacity: 0.15 } },
                { value: data.partyData.BJCJ, name: '北京城建', itemStyle: { color: '#ef6c00' }, areaStyle: { opacity: 0.15 } },
                { value: data.partyData.BJJY, name: '北建院', itemStyle: { color: '#c2185b' }, areaStyle: { opacity: 0.15 } }
            ]
        }]
    };
    chart.setOption(option);
    chartInstances['radar'] = chart;
}

function initPieChart() {
    const data = MOCK.contributionData['KIPM-2025-001'].fusedResult;
    const dom = document.getElementById('pie-chart');
    if (!dom || !window.echarts) return;
    const chart = echarts.init(dom);
    const option = {
        tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
        legend: { orient: 'vertical', left: 'left', top: 'center', textStyle: { fontSize: 12 } },
        series: [{
            type: 'pie', radius: ['40%', '70%'], center: ['60%', '50%'], avoidLabelOverlap: true,
            label: { show: true, formatter: '{b}\n{c}%', fontSize: 12 },
            data: [
                { value: data.BJCD, name: '北建大', itemStyle: { color: '#1565c0' } },
                { value: data.BTJT, name: '北投', itemStyle: { color: '#2e7d32' } },
                { value: data.BJCJ, name: '北京城建', itemStyle: { color: '#ef6c00' } },
                { value: data.BJJY, name: '北建院', itemStyle: { color: '#c2185b' } }
            ]
        }]
    };
    chart.setOption(option);
    chartInstances['pie'] = chart;
}

// ===== IP MANAGEMENT =====
function renderIPManagement(container) {
    const tabs = ['全部', '发明专利', '实用新型', '软件著作权', '数据知识产权'];
    container.innerHTML = `
        <div class="page-title">知识产权管理</div>
        <div class="tabs" id="ip-tabs">
            ${tabs.map((t,i) => `<div class="tab ${i===0?'active':''}" onclick="switchTab('ip-tabs',this,'ip-tab-content',${i})">${t}</div>`).join('')}
        </div>
        <div class="filter-bar">
            <select><option>全部项目</option>${MOCK.projects.map(p=>`<option>${p.name}</option>`).join('')}</select>
            <select><option>全部状态</option><option>已受理</option><option>实审中</option><option>已授权</option><option>已登记</option></select>
            <input type="text" placeholder="搜索专利名称/编号...">
            <button class="btn btn-primary btn-sm">+ 新增知识产权</button>
        </div>
        <div class="tab-content active" id="ip-tab-0">
            <div class="card"><table class="data-table">
                <thead><tr><th>编号</th><th>类型</th><th>名称</th><th>所属项目</th><th>状态</th><th>申请/登记日</th><th>权属比例</th><th>操作</th></tr></thead>
                <tbody>${MOCK.intellectualProperties.map(ip => {
                    const shares = Object.entries(ip.partyShare).map(([pid, pct]) => {
                        const p = MOCK.parties.find(x=>x.id===pid);
                        return `<span style="color:${p.color};font-size:11px">${p.short}:${pct}%</span>`;
                    }).join(' ');
                    const statusBadge = ip.status==='已授权'||ip.status==='已登记' ? 'badge-green' : ip.status==='实审中' ? 'badge-blue' : 'badge-orange';
                    return `<tr><td><code style="font-size:12px">${ip.id}</code></td><td><span class="badge ${ip.type==='数据知识产权'?'badge-purple':ip.type==='软件著作权'?'badge-blue':'badge-green'}">${ip.type}</span></td>
                    <td><strong>${ip.name}</strong></td><td><span style="font-size:11px;color:#888">${ip.project}</span></td>
                    <td><span class="badge ${statusBadge}">${ip.status}</span></td><td>${ip.filingDate || ip.regDate}</td>
                    <td style="font-size:11px">${shares}</td>
                    <td><button class="btn btn-sm btn-secondary" onclick="showIPDetail('${ip.id}')">详情</button></td></tr>`;
                }).join('')}</tbody>
            </table></div>
        </div>
        ${tabs.slice(1).map((t,i) => `<div class="tab-content" id="ip-tab-${i+1}">
            <div class="card"><table class="data-table">
                <thead><tr><th>编号</th><th>名称</th><th>所属项目</th><th>状态</th><th>申请/登记日</th><th>权属比例</th><th>操作</th></tr></thead>
                <tbody>${MOCK.intellectualProperties.filter(ip => {
                    if (t==='发明专利') return ip.type==='发明专利';
                    if (t==='实用新型') return ip.type==='实用新型';
                    if (t==='软件著作权') return ip.type==='软件著作权';
                    if (t==='数据知识产权') return ip.type==='数据知识产权';
                    return true;
                }).map(ip => {
                    const shares = Object.entries(ip.partyShare).map(([pid,pct])=>{
                        const p=MOCK.parties.find(x=>x.id===pid);
                        return `<span style="color:${p.color};font-size:11px">${p.short}:${pct}%</span>`;
                    }).join(' ');
                    return `<tr><td><code style="font-size:12px">${ip.id}</code></td><td><strong>${ip.name}</strong></td><td><span style="font-size:11px;color:#888">${ip.project}</span></td>
                    <td><span class="badge ${ip.status==='已授权'||ip.status==='已登记'?'badge-green':'badge-blue'}">${ip.status}</span></td>
                    <td>${ip.filingDate||ip.regDate}</td><td style="font-size:11px">${shares}</td>
                    <td><button class="btn btn-sm btn-secondary" onclick="showIPDetail('${ip.id}')">详情</button></td></tr>`;
                }).join('')}</tbody>
            </table></div>
        </div>`).join('')}
    `;
}

function switchTab(tabGroup, tabEl, contentPrefix, idx) {
    document.querySelectorAll(`#${tabGroup} .tab`).forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
    document.querySelectorAll(`[id^="${contentPrefix.replace('-content','-tab')}"]`).forEach(c => c.classList.remove('active'));
    const contentId = contentPrefix.replace('-content', '-tab-' + idx);
    const el = document.getElementById(contentId);
    if (el) el.classList.add('active');
}

function showIPDetail(id) {
    const ip = MOCK.intellectualProperties.find(x => x.id === id);
    if (!ip) return;
    const shares = Object.entries(ip.partyShare).map(([pid,pct])=>{
        const p=MOCK.parties.find(x=>x.id===pid);
        return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="width:12px;height:12px;border-radius:50%;background:${p.color};display:inline-block"></span><span>${p.name} (${p.short})</span><span style="margin-left:auto;font-weight:700">${pct}%</span></div>`;
    }).join('');
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="width:520px">
            <div class="modal-header"><h3>知识产权详情</h3><button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button></div>
            <div class="modal-body">
                <div style="margin-bottom:12px"><span class="badge ${ip.type==='数据知识产权'?'badge-purple':ip.type==='软件著作权'?'badge-blue':'badge-green'}">${ip.type}</span></div>
                <div style="font-size:16px;font-weight:700;margin-bottom:12px">${ip.name}</div>
                <div class="cert-meta" style="margin-bottom:16px">
                    <div><strong>编号:</strong> ${ip.id}</div>
                    <div><strong>所属项目:</strong> ${ip.project}</div>
                    <div><strong>状态:</strong> ${ip.status}</div>
                    <div><strong>申请/登记日期:</strong> ${ip.filingDate || ip.regDate || '-'}</div>
                    ${ip.grantDate ? `<div><strong>授权日期:</strong> ${ip.grantDate}</div>` : ''}
                    ${ip.dataSize ? `<div><strong>数据规模:</strong> ${ip.dataSize}</div>` : ''}
                    ${ip.qualityLevel ? `<div><strong>数据质量等级:</strong> <span class="badge badge-green">${ip.qualityLevel}级</span></div>` : ''}
                </div>
                <div class="section-title">权属分配</div>
                <div style="background:#f8fafc;border-radius:8px;padding:12px;margin-bottom:16px">${shares}</div>
                <div class="section-title">区块链存证</div>
                <div class="cert-card" style="margin-bottom:0">
                    <div class="cert-header"><div class="cert-id">EVD-2025-0${Math.floor(Math.random()*200+100)}</div><span class="cert-status verified">已存证</span></div>
                    <div class="cert-meta">
                        <div><strong>天平链编号:</strong> TPL-2025-00${Math.floor(Math.random()*5000+4000)}</div>
                        <div><strong>存证时间:</strong> ${ip.filingDate || ip.regDate} 14:32:18</div>
                        <div><strong>哈希算法:</strong> SHA-256</div>
                        <div><strong>存证类型:</strong> 文件存证 / 数据哈希值存证</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer"><button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">关闭</button><button class="btn btn-primary">下载证书</button></div>
        </div>`;
    document.body.appendChild(modal);
}
