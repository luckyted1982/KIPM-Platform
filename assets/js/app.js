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
                            <span class="badge" style="background:${phaseColors[p.phase]||'#666'}15;color:${phaseColors[p.phase]||'#666'}">${p.phase}</span>
                        </div>
                        <div class="project-meta">研究方向: ${p.direction} | TRL: ${p.trl} | 预算: ¥${(p.budget/10000).toFixed(0)}万</div>
                        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill blue" style="width:${progress}%"></div></div>
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

// ===== CONTRIBUTION ENGINE =====
function renderContribution(container) {
    container.innerHTML = `
        <div class="page-title">贡献度计算引擎 <span style="font-size:12px;color:#888;font-weight:400">| LLSM · Bootstrap · AHP · Shapley 四维方法论体系</span></div>
        <div class="filter-bar">
            <select id="contrib-project-select" onchange="updateContributionPage()">
                ${MOCK.projects.map(p => `<option value="${p.id}">${p.id} ${p.name}</option>`).join('')}
            </select>
            <button class="btn btn-primary btn-sm" onclick="runContributionCalculation()">🧮 运行贡献度计算</button>
            <button class="btn btn-secondary btn-sm" onclick="alert('生成计算报告PDF功能')">📄 导出计算报告</button>
        </div>
        <div id="contribution-content"></div>
    `;
    setTimeout(updateContributionPage, 50);
}

function updateContributionPage() {
    const projId = document.getElementById('contrib-project-select')?.value || 'KIPM-2025-001';
    const data = MOCK.contributionData[projId];
    const parties = Object.keys(data.partyData).map(pid => MOCK.parties.find(p => p.id === pid));
    const content = document.getElementById('contribution-content');
    if (!content || !data) return;

    content.innerHTML = `
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">六维投入要素雷达图</div><div class="card-subtitle">LLSM局部线性平滑处理后归一化值</div></div></div>
                <div class="chart-container" id="contrib-radar"></div>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">AHP-六维加权贡献度</div><div class="card-subtitle">AHP权重 + 管理系数调节</div></div></div>
                <div class="chart-container" id="contrib-bar"></div>
            </div>
        </div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">Shapley值法（合作博弈）</div><div class="card-subtitle">四方边际贡献计算 / 16个联盟组合</div></div></div>
                <div class="chart-container" id="contrib-shapley"></div>
                <div style="padding:0 20px 16px">
                    <div style="font-size:12px;color:#666;margin-bottom:8px"><strong>合作剩余验证:</strong> v(N) - Σv({i}) = <span style="color:var(--secondary);font-weight:700">> 0</span> ✅ 合作产生协同效应</div>
                    <div style="font-size:12px;color:#666"><strong>Nash协商解:</strong> 与Shapley值差异 < 4.5%（协商空间充足）</div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">Bootstrap稳健性检验</div><div class="card-subtitle">1000次重采样 / 95%置信区间</div></div></div>
                <div style="padding:0 20px">
                    <table class="data-table" style="font-size:12px">
                        <thead><tr><th>主体</th><th>点估计</th><th>标准误</th><th>95% CI下限</th><th>95% CI上限</th><th>CI宽度</th><th>稳健性</th></tr></thead>
                        <tbody>${Object.entries(data.bootstrap).map(([pid, b]) => {
                            const p = MOCK.parties.find(x=>x.id===pid);
                            const width = (b.ciUpper - b.ciLower).toFixed(1);
                            const ratingColor = b.rating==='稳健' ? 'var(--secondary)' : b.rating==='需关注' ? 'var(--accent)' : 'var(--danger)';
                            return `<tr><td><span style="color:${p.color};font-weight:600">${p.name}</span></td><td>${data.fusedResult[pid].toFixed(1)}%</td><td>${b.stdError.toFixed(1)}%</td><td>${b.ciLower.toFixed(1)}%</td><td>${b.ciUpper.toFixed(1)}%</td><td>${width}%</td><td><span style="color:${ratingColor};font-weight:700">${b.rating}</span></td></tr>`;
                        }).join('')}</tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><div><div class="card-title">双轨融合与风险调整结果</div><div class="card-subtitle">AHP 60% + Shapley 40% 融合 | 风险系数动态调整</div></div></div>
            <div class="grid-4" style="gap:20px;padding:0 20px 20px">
                ${parties.map(p => {
                    const ahp = data.ahpResult[p.id].toFixed(1);
                    const shap = data.shapleyResult[p.id].toFixed(1);
                    const fused = data.fusedResult[p.id].toFixed(1);
                    const risk = data.riskCoefficients[p.id].toFixed(2);
                    const adj = data.adjustedResult[p.id].toFixed(1);
                    const diff = Math.abs(data.ahpResult[p.id] - data.shapleyResult[p.id]).toFixed(1);
                    return `<div style="border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center">
                        <div style="font-size:13px;font-weight:700;color:${p.color};margin-bottom:8px">${p.logo} ${p.name}</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;text-align:left;margin-bottom:10px">
                            <div style="color:#888">AHP结果:</div><div style="font-weight:600">${ahp}%</div>
                            <div style="color:#888">Shapley值:</div><div style="font-weight:600">${shap}%</div>
                            <div style="color:#888">差异:</div><div style="font-weight:600;color:${diff<5?'var(--secondary)':'var(--accent)'}">${diff}%</div>
                            <div style="color:#888">融合结果:</div><div style="font-weight:700">${fused}%</div>
                            <div style="color:#888">风险系数:</div><div style="font-weight:600">${risk}</div>
                            <div style="color:#888">调整后:</div><div style="font-weight:700;color:${p.color}">${adj}%</div>
                        </div>
                        <div class="progress-bar"><div class="progress-fill" style="width:${adj}%;background:${p.color}"></div></div>
                    </div>`;
                }).join('')}
            </div>
        </div>
        <div class="card">
            <div class="card-header"><div><div class="card-title">六维投入要素原始数据</div><div class="card-subtitle">LLSM局部线性平滑前原始归一化值</div></div></div>
            <div style="padding:0 20px 20px">
                <table class="data-table" style="font-size:12px">
                    <thead><tr><th>维度</th><th>AHP权重</th>${parties.map(p=>`<th style="color:${p.color}">${p.name}</th>`).join('')}</tr></thead>
                    <tbody>${data.dimensions.map((dim, idx) => {
                        const weights = { 'D1资金': 0.25, 'D2人力': 0.25, 'D3技术': 0.20, 'D4数据': 0.15, 'D5设施': 0.10, 'D6管理': 1.0 };
                        return `<tr><td><strong>${dim}</strong></td><td>${weights[dim] || '-'}</td>${parties.map(p=>`<td>${data.partyData[p.id][idx]}</td>`).join('')}</tr>`;
                    }).join('')}</tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(() => {
        initContribRadar(data, parties);
        initContribBar(data, parties);
        initContribShapley(data, parties);
    }, 100);
}

function initContribRadar(data, parties) {
    const dom = document.getElementById('contrib-radar');
    if (!dom || !window.echarts) return;
    const chart = echarts.init(dom);
    chart.setOption({
        tooltip: {}, legend: { data: parties.map(p=>p.name), bottom: 0, textStyle: { fontSize: 11 } },
        radar: { indicator: data.dimensions.map(d=>({name:d, max:5})), radius: '60%', center: ['50%', '45%'] },
        series: [{ type: 'radar', data: parties.map(p => ({ value: data.partyData[p.id], name: p.name, itemStyle: { color: p.color }, areaStyle: { opacity: 0.12 } })) }]
    });
    chartInstances['contribRadar'] = chart;
}

function initContribBar(data, parties) {
    const dom = document.getElementById('contrib-bar');
    if (!dom || !window.echarts) return;
    const chart = echarts.init(dom);
    chart.setOption({
        tooltip: { trigger: 'axis' }, legend: { data: ['AHP结果', 'Shapley值', '融合结果', '风险调整后'], bottom: 0, textStyle: { fontSize: 11 } },
        xAxis: { type: 'category', data: parties.map(p=>p.name), axisLabel: { fontSize: 11 } },
        yAxis: { type: 'value', name: '贡献度(%)', max: 60 },
        series: [
            { type: 'bar', name: 'AHP结果', data: parties.map(p=>data.ahpResult[p.id]), itemStyle: { color: '#90caf9' }, barGap: 0 },
            { type: 'bar', name: 'Shapley值', data: parties.map(p=>data.shapleyResult[p.id]), itemStyle: { color: '#a5d6a7' } },
            { type: 'bar', name: '融合结果', data: parties.map(p=>data.fusedResult[p.id]), itemStyle: { color: '#ffcc80' } },
            { type: 'bar', name: '风险调整后', data: parties.map(p=>data.adjustedResult[p.id]), itemStyle: { color: (params) => parties[params.dataIndex]?.color || '#666' } }
        ]
    });
    chartInstances['contribBar'] = chart;
}

function initContribShapley(data, parties) {
    const dom = document.getElementById('contrib-shapley');
    if (!dom || !window.echarts) return;
    const chart = echarts.init(dom);
    chart.setOption({
        tooltip: { trigger: 'axis', formatter: (params) => {
            const rows = params.map(p => `<span style="color:${p.color}">●</span> ${p.seriesName}: ${p.value.toFixed(1)}%`).join('<br>');
            return `<strong>${params[0].axisValue}</strong><br>${rows}`;
        }},
        xAxis: { type: 'category', data: parties.map(p=>p.name), axisLabel: { fontSize: 11 } },
        yAxis: { type: 'value', name: 'Shapley值(%)', max: 55 },
        series: [{ type: 'line', name: 'Shapley值', data: parties.map(p=>data.shapleyResult[p.id]), smooth: true, itemStyle: { color: '#7b1fa2' }, lineStyle: { width: 3 }, areaStyle: { color: { type: 'linear', x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:'rgba(123,31,162,0.2)'},{offset:1,color:'rgba(123,31,162,0)'}] } }, markPoint: { data: [{ type: 'max', name: 'Max' }, { type: 'min', name: 'Min' }] } }]
    });
    chartInstances['contribShapley'] = chart;
}

function runContributionCalculation() {
    alert('贡献度计算引擎运行中...\n\n1. 读取六维投入要素原始数据\n2. LLSM局部线性平滑处理\n3. AHP-六维加权计算\n4. Bootstrap 1000次重采样\n5. Shapley值法（16个联盟组合）\n6. 双轨融合（α=0.6）\n7. 风险系数动态调整\n8. 生成计算报告并上链存证\n\n[Demo] 计算完成，结果已在页面展示。实际系统将通过后端Python引擎执行。');
}

// ===== BLOCKCHAIN =====
function renderBlockchain(container) {
    container.innerHTML = `
        <div class="page-title">区块链存证 <span style="font-size:12px;color:#888;font-weight:400">| 北京权证链 / 天平链一级节点</span></div>
        <div class="stats-row" style="grid-template-columns:repeat(4,1fr)">
            <div class="stat-card"><div><div class="stat-label">累计存证数量</div><div class="stat-value">${MOCK.blockchainEvidence.length}</div></div><div class="stat-icon" style="color:var(--primary)">🔗</div></div>
            <div class="stat-card"><div><div class="stat-label">本月新增存证</div><div class="stat-value">3</div><div class="stat-change up">↑ 较上月 +3</div></div><div class="stat-icon" style="color:var(--secondary)">📈</div></div>
            <div class="stat-card"><div><div class="stat-label">司法验证通过率</div><div class="stat-value">100%</div></div><div class="stat-icon" style="color:var(--accent)">✅</div></div>
            <div class="stat-card"><div><div class="stat-label">存证费用(本月)</div><div class="stat-value">¥3</div><div class="stat-change up">↓ 1元/证书</div></div><div class="stat-icon" style="color:#7b1fa2">💰</div></div>
        </div>
        <div class="grid-2">
            <div class="card" style="grid-column:span 2">
                <div class="card-header"><div><div class="card-title">存证记录列表</div><div class="card-subtitle">权证链 / 北京互联网法院天平链</div></div><div class="card-actions"><button class="btn btn-primary btn-sm">+ 发起存证</button><button class="btn btn-secondary btn-sm">批量验证</button></div></div>
                <table class="data-table">
                    <thead><tr><th>存证编号</th><th>天平链编号</th><th>类型</th><th>标题</th><th>时间</th><th>哈希值</th><th>状态</th><th>操作</th></tr></thead>
                    <tbody>${MOCK.blockchainEvidence.map(e => `
                        <tr><td><code style="font-size:11px">${e.id}</code></td><td><code style="font-size:11px;color:var(--primary)">${e.chainId}</code></td>
                        <td><span class="badge ${e.type==='数据哈希值存证'?'badge-purple':e.type==='网页取证'?'badge-orange':'badge-blue'}">${e.type}</span></td>
                        <td><strong style="font-size:12px">${e.title}</strong></td><td style="font-size:11px">${e.timestamp}</td>
                        <td><code style="font-size:10px">${e.hash}</code></td>
                        <td><span class="badge badge-green">${e.status}</span></td>
                        <td><button class="btn btn-sm btn-secondary" onclick="showEvidenceDetail('${e.id}')">查看证书</button></td></tr>
                    `).join('')}</tbody>
                </table>
            </div>
        </div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">权证链存证架构</div></div></div>
                <div style="padding:0 20px 20px;font-size:12px;line-height:2;color:#555">
                    <div><strong>存证层：</strong>IPMS平台 → 自动哈希计算（SHA-256/SM3）→ 不上传源文件</div>
                    <div><strong>接入层：</strong>北京权证链 API → 实名认证 + 数据哈希值提交</div>
                    <div><strong>共识层：</strong>北京互联网法院天平链（PBFT/Raft）→ 秒级确认</div>
                    <div><strong>司法层：</strong>法官一键验证 → 验证时间从30天缩至3分钟</div>
                    <div><strong>鉴定层：</strong>中海义信司法鉴定（母公司持《司法鉴定许可证》）</div>
                    <div style="margin-top:8px;padding:8px;background:#f0f7ff;border-radius:6px">
                        <strong style="color:var(--primary)">当前接入方式：</strong>API接口接入（1-2周实施周期）<br>
                        <strong style="color:var(--primary)">收费标准：</strong>1元/证书 + API年费（约11-15万/年）<br>
                        <strong style="color:var(--primary)">国密支持：</strong>SM2/SM3/SM4
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">司法验证通道</div></div></div>
                <div style="padding:0 20px 20px">
                    <div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px;background:#f8fafc">
                        <div style="font-size:13px;font-weight:600;margin-bottom:6px">北京互联网法院 天平链在线验证</div>
                        <div style="font-size:12px;color:#666">输入天平链存证编号，法官可在诉讼平台一键验证电子数据真实性</div>
                        <div style="margin-top:8px;display:flex;gap:8px">
                            <input type="text" placeholder="输入TPL-编号..." style="flex:1;padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px">
                            <button class="btn btn-primary btn-sm">验证</button>
                        </div>
                    </div>
                    <div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:#f8fafc">
                        <div style="font-size:13px;font-weight:600;margin-bottom:6px">中海义信 司法鉴定</div>
                        <div style="font-size:12px;color:#666">母公司持有《司法鉴定许可证》，可提供"区块链存证+司法鉴定意见书"双重保障</div>
                        <div style="margin-top:8px"><button class="btn btn-secondary btn-sm">申请司法鉴定</button></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showEvidenceDetail(id) {
    const e = MOCK.blockchainEvidence.find(x => x.id === id);
    if (!e) return;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="width:480px">
            <div class="modal-header"><h3>区块链存证证书</h3><button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button></div>
            <div class="modal-body">
                <div class="cert-card" style="margin-bottom:16px">
                    <div class="cert-header"><div class="cert-id">${e.id}</div><span class="cert-status verified">${e.status}</span></div>
                    <div class="cert-meta">
                        <div><strong>天平链存证编号:</strong> <span style="color:var(--primary);font-family:monospace">${e.chainId}</span></div>
                        <div><strong>交易哈希:</strong> <span style="font-family:monospace;font-size:11px">${e.txHash}</span></div>
                        <div><strong>存证时间:</strong> ${e.timestamp}</div>
                        <div><strong>哈希值 (SHA-256):</strong> <span style="font-family:monospace;font-size:11px">${e.hash}</span></div>
                        <div><strong>存证类型:</strong> ${e.type}</div>
                        <div><strong>存证主体:</strong> ${e.party}</div>
                        <div><strong>文件大小:</strong> ${e.size}</div>
                    </div>
                </div>
                <div style="background:linear-gradient(135deg,#f0f7ff,#fff);border-radius:8px;padding:12px;border:1px solid #dbeafe">
                    <div style="font-size:12px;font-weight:600;color:var(--primary);margin-bottom:6px">📋 验证信息</div>
                    <div style="font-size:11px;color:#666;line-height:1.8">
                        <div>• 存证平台资质：北京互联网法院"天平链"一级节点</div>
                        <div>• 技术规范：符合最高院《在线诉讼规则》第16条</div>
                        <div>• 时间戳：国家授时中心可信时间源（毫秒级）</div>
                        <div>• 共识算法：PBFT/Raft（拜占庭容错）</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer"><button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">关闭</button><button class="btn btn-primary">下载PDF证书</button></div>
        </div>`;
    document.body.appendChild(modal);
}

// ===== DATA IP =====
function renderDataIP(container) {
    container.innerHTML = `
        <div class="page-title">数据知识产权 <span style="font-size:12px;color:#888;font-weight:400">| IPDC-4L 数据质量评估 / 北京市数据知识产权登记平台</span></div>
        <div class="filter-bar">
            <select><option>全部项目</option>${MOCK.projects.map(p=>`<option>${p.name}</option>`).join('')}</select>
            <select><option>全部质量等级</option><option>A级</option><option>B级</option><option>C级</option><option>D级</option></select>
            <button class="btn btn-primary btn-sm">+ 新增数据资产登记</button>
        </div>
        <div class="grid-3">
            ${MOCK.intellectualProperties.filter(ip=>ip.type==='数据知识产权').map(ip => {
                const levelColors = { A: 'var(--secondary)', B: 'var(--accent)', C: '#fb8c00', D: 'var(--danger)' };
                const levelBg = { A: '#e8f5e9', B: '#fff3e0', C: '#fff8e1', D: '#ffebee' };
                const shares = Object.entries(ip.partyShare).map(([pid,pct])=>{
                    const p=MOCK.parties.find(x=>x.id===pid);
                    return `<span class="tag" style="background:${p.color}15;color:${p.color};font-size:10px">${p.short}:${pct}%</span>`;
                }).join('');
                return `<div class="card" style="margin-bottom:0">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
                        <div><div style="font-size:11px;color:#888;font-family:monospace">${ip.id}</div><div style="font-size:14px;font-weight:700;margin-top:4px">${ip.name}</div></div>
                        <span class="badge" style="background:${levelBg[ip.qualityLevel]};color:${levelColors[ip.qualityLevel]}">${ip.qualityLevel}级</span>
                    </div>
                    <div style="font-size:12px;color:#666;margin-bottom:8px">所属项目: ${ip.project}</div>
                    <div style="font-size:12px;color:#666;margin-bottom:8px">数据规模: <strong>${ip.dataSize}</strong> | 登记日期: ${ip.regDate}</div>
                    <div style="margin-bottom:10px">${shares}</div>
                    <div class="progress-bar" style="height:6px"><div class="progress-fill green" style="width:${ip.qualityLevel==='A'?95:ip.qualityLevel==='B'?80:ip.qualityLevel==='C'?60:40}%"></div></div>
                    <div style="font-size:11px;color:#888;margin-top:4px">IPDC-4L 质量评分: ${ip.qualityLevel==='A'?'92/100':ip.qualityLevel==='B'?'78/100':'65/100'} (${ip.qualityLevel}级)</div>
                    <div style="margin-top:10px;display:flex;gap:6px">
                        <button class="btn btn-sm btn-secondary" style="flex:1" onclick="showIPDetail('${ip.id}')">查看详情</button>
                        <button class="btn btn-sm btn-primary" style="flex:1">申请登记</button>
                    </div>
                </div>`;
            }).join('')}
        </div>
        <div class="card">
            <div class="card-header"><div><div class="card-title">IPDC-4L 数据质量评估模型</div><div class="card-subtitle">完整性25分 / 准确性25分 / 时效性25分 / 稀缺性25分</div></div></div>
            <div class="grid-4" style="gap:16px;padding:0 20px 20px">
                <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:8px">
                    <div style="font-size:28px;font-weight:700;color:var(--primary)">L1</div><div style="font-size:12px;color:#666;margin-top:4px">原始数据</div><div style="font-size:11px;color:#888;margin-top:4px">未清洗加工，仅来源记录</div>
                </div>
                <div style="text-align:center;padding:16px;background:#f0f7ff;border-radius:8px">
                    <div style="font-size:28px;font-weight:700;color:var(--primary)">L2</div><div style="font-size:12px;color:#666;margin-top:4px">清洗数据</div><div style="font-size:11px;color:#888;margin-top:4px">脱敏/去噪/标准化，可申请登记</div>
                </div>
                <div style="text-align:center;padding:16px;background:#e8f5e9;border-radius:8px">
                    <div style="font-size:28px;font-weight:700;color:var(--secondary)">L3</div><div style="font-size:12px;color:#666;margin-top:4px">结构化数据</div><div style="font-size:11px;color:#888;margin-top:4px">标注/关联/索引，优先登记</div>
                </div>
                <div style="text-align:center;padding:16px;background:#fff8e1;border-radius:8px">
                    <div style="font-size:28px;font-weight:700;color:var(--accent)">L4</div><div style="font-size:12px;color:#666;margin-top:4px">智能化数据产品</div><div style="font-size:11px;color:#888;margin-top:4px">集成算法/API，最高优先级</div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><div><div class="card-title">DSCF-3L 数据安全合规框架</div><div class="card-subtitle">数据二十条 / 北京市数据知识产权登记管理办法</div></div></div>
            <div style="padding:0 20px 20px;font-size:13px;line-height:2.2">
                <div style="display:flex;gap:20px;flex-wrap:wrap">
                    <div style="flex:1;min-width:200px;padding:12px;border:1px solid var(--border);border-radius:8px">
                        <div style="font-weight:700;color:#c62828;margin-bottom:4px">🔒 网络安全法</div>
                        <div style="font-size:12px;color:#666">访问控制 / 入侵检测 / 日志审计</div>
                    </div>
                    <div style="flex:1;min-width:200px;padding:12px;border:1px solid var(--border);border-radius:8px">
                        <div style="font-weight:700;color:#1565c0;margin-bottom:4px">📊 数据安全法</div>
                        <div style="font-size:12px;color:#666">分类分级 / 保护义务 / 跨境传输审查</div>
                    </div>
                    <div style="flex:1;min-width:200px;padding:12px;border:1px solid var(--border);border-radius:8px">
                        <div style="font-weight:700;color:#2e7d32;margin-bottom:4px">👤 个人信息保护法</div>
                        <div style="font-size:12px;color:#666">去标识化 / 匿名化处理 / 知情同意记录</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== COLLABORATION =====
function renderCollaboration(container) {
    container.innerHTML = `
        <div class="page-title">四方协同</div>
        <div class="card">
            <div class="card-header"><div><div class="card-title">联合研究中心项目</div><div class="card-subtitle">4个活跃项目 / 3个研究方向</div></div></div>
            <div style="padding:0 20px 20px">
                ${MOCK.projects.map(p => {
                    const progress = Math.round((p.spent / p.budget) * 100);
                    const phaseColors = { '研究立项期': '#1565c0', '实验室开发期': '#7b1fa2', '工程应用期': '#ef6c00', '运营维护期': '#2e7d32' };
                    return `<div class="project-card" style="margin-bottom:12px">
                        <div class="project-header">
                            <div><div class="project-id">${p.id}</div><div class="project-title">${p.name}</div></div>
                            <div style="display:flex;gap:8px;align-items:center">
                                <span class="badge" style="background:${phaseColors[p.phase]}15;color:${phaseColors[p.phase]}">${p.phase}</span>
                                <span class="badge badge-gray">${p.status}</span>
                            </div>
                        </div>
                        <div class="project-meta">研究方向: ${p.direction} | TRL等级: ${p.trl} | 周期: ${p.startDate} ~ ${p.endDate}</div>
                        <div style="font-size:12px;color:#555;margin-top:6px">${p.description}</div>
                        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill" style="width:${progress}%;background:${phaseColors[p.phase]}"></div></div>
                        <div style="display:flex;justify-content:space-between;font-size:11px;color:#888;margin-top:4px">
                            <span>预算: ¥${(p.budget/10000).toFixed(0)}万</span><span>已支出: ¥${(p.spent/10000).toFixed(0)}万 (${progress}%)</span>
                        </div>
                        <div class="project-parties">${p.parties.map(pid => {
                            const party = MOCK.parties.find(x=>x.id===pid);
                            return `<span class="tag" style="background:${party.color}15;color:${party.color}">${party.logo} ${party.name}</span>`;
                        }).join('')}</div>
                        <div style="margin-top:10px;display:flex;gap:6px">
                            <button class="btn btn-sm btn-secondary" onclick="navTo('contribution')">贡献度计算</button>
                            <button class="btn btn-sm btn-secondary" onclick="navTo('ip-management')">知识产权</button>
                            <button class="btn btn-sm btn-secondary" onclick="navTo('blockchain')">存证记录</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">四方参与方</div></div></div>
                <div style="padding:0 20px 20px">${MOCK.parties.map(p => `
                    <div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
                        <div style="width:40px;height:40px;border-radius:50%;background:${p.color}15;display:flex;align-items:center;justify-content:center;font-size:20px">${p.logo}</div>
                        <div style="flex:1">
                            <div style="font-weight:700;font-size:14px">${p.name}</div>
                            <div style="font-size:12px;color:#888">${p.type} | 参与项目: ${MOCK.projects.filter(proj=>proj.parties.includes(p.id)).length}个</div>
                        </div>
                        <div style="text-align:right">
                            <div style="font-size:16px;font-weight:700;color:${p.color}">${MOCK.intellectualProperties.filter(ip=>Object.keys(ip.partyShare).includes(p.id)).length}</div>
                            <div style="font-size:11px;color:#888">项知识产权</div>
                        </div>
                    </div>
                `).join('')}</div>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">近期协同动态</div></div></div>
                <div class="timeline" style="padding:0 20px 20px">
                    <div class="timeline-item success">
                        <div class="timeline-time">2025-06-15 09:30</div>
                        <div class="timeline-title">KIPM-2025-001 阶段性贡献度核算完成</div>
                        <div class="timeline-desc">北建大: 35.2% | 北投: 28.5% | 北京城建: 22.1% | 北建院: 14.2% | Bootstrap检验通过</div>
                    </div>
                    <div class="timeline-item success">
                        <div class="timeline-time">2025-06-10 14:22</div>
                        <div class="timeline-title">DIP-2025-002 数据知识产权登记完成</div>
                        <div class="timeline-desc">BIM构件库-医疗建筑标准模块 | 京知数登字第20250000XX号 | 权证链存证编号: TPL-2025-0045234</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-time">2025-06-05 11:15</div>
                        <div class="timeline-title">PAT-2025-001 审查意见通知书下发</div>
                        <div class="timeline-desc">发明专利"一种智慧医院能耗预测与优化控制方法" | 答复期限: 2025-07-15</div>
                    </div>
                    <div class="timeline-item success">
                        <div class="timeline-time">2025-05-28 16:45</div>
                        <div class="timeline-title">REV-2025-002 收益分配执行完成</div>
                        <div class="timeline-desc">数据IP许可收益 ¥120,000 | 智能合约执行 | 各方分配已到账</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-time">2025-05-20 10:15</div>
                        <div class="timeline-title">权证链哈希存证完成</div>
                        <div class="timeline-desc">BIM构件库-医疗建筑标准模块 | 数据规模: 320GB | 哈希算法: SHA-256</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== REVENUE =====
function renderRevenue(container) {
    container.innerHTML = `
        <div class="page-title">收益分配 <span style="font-size:12px;color:#888;font-weight:400">| 智能合约自动执行 / 权证链存证</span></div>
        <div class="stats-row" style="grid-template-columns:repeat(4,1fr)">
            <div class="stat-card"><div><div class="stat-label">累计分配金额</div><div class="stat-value">¥65.0万</div></div><div class="stat-icon" style="color:var(--secondary)">💰</div></div>
            <div class="stat-card"><div><div class="stat-label">待执行分配</div><div class="stat-value">¥8.0万</div><div class="stat-change down">审批中</div></div><div class="stat-icon" style="color:var(--accent)">⏳</div></div>
            <div class="stat-card"><div><div class="stat-label">智能合约执行</div><div class="stat-value">2</div><div class="stat-change up">已上链</div></div><div class="stat-icon" style="color:#7b1fa2">🔗</div></div>
            <div class="stat-card"><div><div class="stat-label">发明人奖励基金</div><div class="stat-value">¥13.0万</div><div class="stat-change up">提取比例 20%</div></div><div class="stat-icon" style="color:var(--primary)">🏆</div></div>
        </div>
        <div class="card">
            <div class="card-header"><div><div class="card-title">收益分配方案</div></div><button class="btn btn-primary btn-sm">+ 新建分配方案</button></div>
            <table class="data-table">
                <thead><tr><th>方案编号</th><th>周期</th><th>项目</th><th>类型</th><th>总金额</th><th>分配明细</th><th>状态</th><th>执行日期</th><th>链上记录</th></tr></thead>
                <tbody>${MOCK.revenueAllocations.map(r => {
                    const shares = Object.entries(r.details).map(([pid,amt])=>{
                        const p=MOCK.parties.find(x=>x.id===pid);
                        return `<span style="color:${p.color};font-size:11px">${p.short}:¥${(amt/10000).toFixed(1)}万</span>`;
                    }).join(' ');
                    return `<tr><td><code>${r.id}</code></td><td>${r.period}</td><td>${r.project}</td><td>${r.type}</td><td style="font-weight:700">¥${(r.totalAmount/10000).toFixed(1)}万</td>
                    <td style="font-size:11px">${shares}</td>
                    <td><span class="badge ${r.status==='已执行'?'badge-green':'badge-orange'}">${r.status}</span></td>
                    <td>${r.distributionDate || '-'}</td>
                    <td><code style="font-size:10px">${r.txHash || '-'}</code></td></tr>`;
                }).join('')}</tbody>
            </table>
        </div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">分配规则配置</div><div class="card-subtitle">按知识产权类型差异化分配</div></div></div>
                <div style="padding:0 20px 20px;font-size:12px;line-height:2">
                    <div style="padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:8px">
                        <div style="font-weight:700">发明专利 — 分期兑现制</div>
                        <div>• 授权后首年: 评估值10% × 权属比例</div>
                        <div>• 首次许可/转让后: 交易额30% × 权属比例</div>
                        <div>• 产业化上市后: 年销售额3%-5% × 权属比例 (持续5-10年)</div>
                    </div>
                    <div style="padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:8px">
                        <div style="font-weight:700">著作权 — 分级使用制</div>
                        <div>• 按使用范围（内部/授权第三方/转让）匹配定价</div>
                        <div>• 收益按权属比例分配</div>
                    </div>
                    <div style="padding:10px;background:#f8fafc;border-radius:6px">
                        <div style="font-weight:700">数据知识产权 — 质量加权制</div>
                        <div>• 数据质量等级（A/B/C/D）自动匹配权重系数</div>
                        <div>• 脱敏/安全/合规成本优先扣除后计算净分配额</div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">智能合约执行日志</div><div class="card-subtitle">权证链 / 天平链存证</div></div></div>
                <div class="timeline" style="padding:0 20px 20px">
                    <div class="timeline-item success">
                        <div class="timeline-time">2025-04-30 09:15:22</div>
                        <div class="timeline-title">REV-2025-002 智能合约执行成功</div>
                        <div class="timeline-desc">合约地址: 0x9c2d...a4f8 | 交易哈希: 0x8b3e...c5a1 | 各方收益已自动转账</div>
                    </div>
                    <div class="timeline-item success">
                        <div class="timeline-time">2025-04-15 10:30:45</div>
                        <div class="timeline-title">REV-2025-001 智能合约执行成功</div>
                        <div class="timeline-desc">合约地址: 0x3a7b...c2e5 | 交易哈希: 0x8b3e...c5a1 | 专利许可收益分配完成</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-time">2025-07-01 00:00:00 (预计)</div>
                        <div class="timeline-title">REV-2025-003 智能合约待执行</div>
                        <div class="timeline-desc">管委会审批通过后自动触发 | 合约地址: 0x... (待部署)</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== ANALYSIS =====
function renderAnalysis(container) {
    container.innerHTML = `
        <div class="page-title">智能分析 <span style="font-size:12px;color:#888;font-weight:400">| 专利导航 / 技术趋势预测 / 竞争对手监控</span></div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">技术趋势预测</div><div class="card-subtitle">智慧医疗建筑 / 绿色低碳 / BIM数字孪生</div></div></div>
                <div class="chart-container" id="trend-chart"></div>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">专利价值评估</div><div class="card-subtitle">基于TRL × Market × Barrier三维度</div></div></div>
                <div class="chart-container" id="value-chart"></div>
            </div>
        </div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">FTO自由实施分析</div><div class="card-subtitle">潜在侵权风险专利</div></div></div>
                <table class="data-table">
                    <thead><tr><th>专利号</th><th>名称</th><th>权利人</th><th>风险等级</th><th>建议措施</th></tr></thead>
                    <tbody>
                        <tr><td>CN201810XXXXXX</td><td>一种医院能耗监测方法</td><td>某科技公司</td><td><span class="badge badge-orange">中风险</span></td><td>设计规避 / 许可谈判</td></tr>
                        <tr><td>CN201920XXXXXX</td><td>BIM模型轻量化渲染系统</td><td>某软件公司</td><td><span class="badge badge-red">高风险</span></td><td>紧急许可谈判 / 技术路线调整</td></tr>
                        <tr><td>CN202010XXXXXX</td><td>相变储能材料封装结构</td><td>某高校</td><td><span class="badge badge-green">低风险</span></td><td>持续监控</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">竞争对手监控</div><div class="card-subtitle">医疗建筑 / BIM / 绿色建筑领域</div></div></div>
                <table class="data-table">
                    <thead><tr><th>竞争对手</th><th>专利数量</th><th>核心领域</th><th>最新动态</th></tr></thead>
                    <tbody>
                        <tr><td><strong>某建筑科技集团</strong></td><td>142</td><td>智慧医院/BIM</td><td>2025-05 新申请3项智慧医院专利</td></tr>
                        <tr><td><strong>某能源科技公司</strong></td><td>89</td><td>建筑节能/能耗优化</td><td>2025-04 发布新一代医院能耗AI平台</td></tr>
                        <tr><td><strong>某设计院</strong></td><td>67</td><td>医疗建筑/通风</td><td>2025-06 获得ICU压差控制专利授权</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    setTimeout(() => {
        initTrendChart();
        initValueChart();
    }, 100);
}

function initTrendChart() {
    const dom = document.getElementById('trend-chart');
    if (!dom || !window.echarts) return;
    const chart = echarts.init(dom);
    chart.setOption({
        tooltip: { trigger: 'axis' }, legend: { data: ['智慧医疗建筑', '绿色低碳', 'BIM数字孪生'], bottom: 0, textStyle: { fontSize: 11 } },
        xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024', '2025E'], axisLabel: { fontSize: 11 } },
        yAxis: { type: 'value', name: '专利申请量' },
        series: [
            { type: 'line', name: '智慧医疗建筑', data: [12, 18, 28, 42, 55, 72], smooth: true, itemStyle: { color: '#1565c0' }, areaStyle: { opacity: 0.1 } },
            { type: 'line', name: '绿色低碳', data: [8, 15, 22, 30, 38, 48], smooth: true, itemStyle: { color: '#2e7d32' }, areaStyle: { opacity: 0.1 } },
            { type: 'line', name: 'BIM数字孪生', data: [5, 10, 20, 35, 50, 68], smooth: true, itemStyle: { color: '#7b1fa2' }, areaStyle: { opacity: 0.1 } }
        ]
    });
    chartInstances['trend'] = chart;
}

function initValueChart() {
    const dom = document.getElementById('value-chart');
    if (!dom || !window.echarts) return;
    const chart = echarts.init(dom);
    chart.setOption({
        tooltip: { formatter: '{b}: {c}分' },
        xAxis: { type: 'category', data: ['PAT-2025-001', 'PAT-2025-002', 'PAT-2024-003', 'PAT-2024-004', 'PAT-2024-005', 'CPR-2025-001', 'CPR-2025-002'], axisLabel: { fontSize: 10, rotate: 15 } },
        yAxis: { type: 'value', name: '评估价值(万元)' },
        series: [{ type: 'bar', data: [120, 85, 95, 45, 60, 30, 55], itemStyle: { color: (p) => ['#1565c0','#1565c0','#2e7d32','#c2185b','#c2185b','#ef6c00','#7b1fa2'][p.dataIndex] }, barWidth: '50%' }]
    });
    chartInstances['value'] = chart;
}

// ===== SETTINGS =====
function renderSettings(container) {
    container.innerHTML = `
        <div class="page-title">系统管理</div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div><div class="card-title">AHP权重配置</div><div class="card-subtitle">六维投入要素 / 四阶段权重</div></div></div>
                <div style="padding:0 20px 20px">
                    <div class="section-title" style="margin-top:0">六维要素权重</div>
                    <div style="margin-bottom:12px">${[['D1 资金', 0.25], ['D2 人力', 0.25], ['D3 技术', 0.20], ['D4 数据', 0.15], ['D5 设施', 0.10], ['D6 管理', '乘数']].map(([name, val]) => `
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                            <span style="width:80px;font-size:12px">${name}</span>
                            <div class="progress-bar" style="flex:1;height:10px"><div class="progress-fill blue" style="width:${typeof val==='number'?(val*100):80}%"></div></div>
                            <span style="width:50px;font-size:12px;font-weight:600;text-align:right">${val}</span>
                        </div>
                    `).join('')}</div>
                    <div class="section-title">四阶段权重</div>
                    <div style="margin-bottom:12px">${[['研究立项期', 0.30], ['实验室开发期', 0.30], ['工程应用期', 0.20], ['运营维护期', 0.20]].map(([name, val]) => `
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                            <span style="width:100px;font-size:12px">${name}</span>
                            <div class="progress-bar" style="flex:1;height:10px"><div class="progress-fill green" style="width:${val*100}%"></div></div>
                            <span style="width:50px;font-size:12px;font-weight:600;text-align:right">${val}</span>
                        </div>
                    `).join('')}</div>
                    <div style="display:flex;gap:8px;margin-top:12px">
                        <button class="btn btn-secondary btn-sm">编辑权重</button>
                        <button class="btn btn-secondary btn-sm">历史版本</button>
                        <button class="btn btn-primary btn-sm">保存配置</button>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><div><div class="card-title">系统参数</div><div class="card-subtitle">算法引擎 / 区块链 / 存证规则</div></div></div>
                <div style="padding:0 20px 20px;font-size:12px;line-height:2.2">
                    <div style="padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:8px">
                        <div style="font-weight:700">贡献度计算引擎</div>
                        <div>• 当前版本: V1.2 (LLSM + AHP + Bootstrap + Shapley + 风险系数)</div>
                        <div>• 融合权重 α (AHP): 0.60</div>
                        <div>• Bootstrap 重采样次数: 1000</div>
                        <div>• 置信水平: 95%</div>
                    </div>
                    <div style="padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:8px">
                        <div style="font-weight:700">北京权证链</div>
                        <div>• 接入状态: 已接入 (API)</div>
                        <div>• 哈希算法: SHA-256 (默认) / SM3 (国密)</div>
                        <div>• 存证模式: 哈希值上链 + 源文件本地存储</div>
                        <div>• 天平链节点: 一级节点</div>
                    </div>
                    <div style="padding:10px;background:#f8fafc;border-radius:6px">
                        <div style="font-weight:700">存证规则引擎</div>
                        <div>• 已配置规则: 14条 (R-001 ~ R-014)</div>
                        <div>• 自动触发: 8条 | 手动触发: 6条</div>
                        <div>• 批量聚合间隔: 5分钟 (P1) / 1小时 (P2)</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><div><div class="card-title">用户与权限</div></div></div>
            <div style="padding:0 20px 20px">
                <table class="data-table">
                    <thead><tr><th>角色</th><th>人数</th><th>核心权限</th><th>数据范围</th></tr></thead>
                    <tbody>
                        <tr><td><strong>系统管理员</strong></td><td>2</td><td>系统配置、用户管理、流程设计</td><td>全局</td></tr>
                        <tr><td><strong>知产办主任</strong></td><td>1</td><td>全局数据查看、审批流配置、报告导出</td><td>全局</td></tr>
                        <tr><td><strong>专利工程师</strong></td><td>2</td><td>专利申请管理、审查意见管理、年费监控</td><td>专利/著作权</td></tr>
                        <tr><td><strong>数据IP专员</strong></td><td>1</td><td>数据资产登记、数据质量评估、许可管理</td><td>数据IP</td></tr>
                        <tr><td><strong>法务专员</strong></td><td>1</td><td>合同审核、争议记录、合规检查</td><td>合同/争议/存证</td></tr>
                        <tr><td><strong>四方联络专员</strong></td><td>4</td><td>本单位数据审核、权益主张、内部协调</td><td>本单位相关</td></tr>
                        <tr><td><strong>科研人员</strong></td><td>~200</td><td>成果申报、工时填报、数据上传、查询</td><td>本人/本项目</td></tr>
                        <tr><td><strong>外部专家</strong></td><td>7-9</td><td>争议仲裁视图、评估报告审阅</td><td>仲裁相关</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ===== RESIZE =====
window.addEventListener('resize', () => {
    Object.values(chartInstances).forEach(c => { if (c && c.resize) c.resize(); });
    if (window.echarts) {
        document.querySelectorAll('.echarts-container').forEach(el => {
            const inst = echarts.getInstanceByDom(el);
            if (inst) inst.resize();
        });
    }
});
