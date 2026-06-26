// Mock Data for KIPM Demo
const MOCK = {
  currentUser: { name: '张管理', role: '系统管理员', roleId: 'admin', avatar: '👤' },

  parties: [
    { id: 'BJCD', name: '北京建筑大学', type: '高校', color: '#1565c0', short: '北建大', logo: '🏫' },
    { id: 'BTJT', name: '北投集团', type: '投资方', color: '#2e7d32', short: '北投', logo: '🏢' },
    { id: 'BJCJ', name: '北京城建', type: '施工方', color: '#ef6c00', short: '城建', logo: '🏗️' },
    { id: 'BJJY', name: '北建院', type: '设计方', color: '#c2185b', short: '北建院', logo: '📐' }
  ],

  projects: [
    {
      id: 'KIPM-2025-001', name: '智慧医疗建筑能耗优化关键技术研究',
      direction: '智慧医疗建筑', phase: '工程应用期', status: '进行中',
      startDate: '2024-01-15', endDate: '2026-12-31',
      parties: ['BJCD', 'BTJT', 'BJCJ', 'BJJY'],
      ipCount: { patent: 3, copyright: 2, dataIP: 1, trademark: 0 },
      budget: 8500000, spent: 4200000,
      trl: 6, description: '基于BIM+IoT的智慧医院能耗实时监测与AI预测优化系统'
    },
    {
      id: 'KIPM-2025-002', name: '绿色低碳医疗建筑围护结构热工性能研究',
      direction: '绿色低碳医疗建筑', phase: '实验室开发期', status: '进行中',
      startDate: '2024-06-01', endDate: '2027-05-31',
      parties: ['BJCD', 'BTJT', 'BJJY'],
      ipCount: { patent: 2, copyright: 1, dataIP: 2, trademark: 0 },
      budget: 5200000, spent: 1800000,
      trl: 4, description: '新型相变储能材料在医院围护结构中的应用与热工性能优化'
    },
    {
      id: 'KIPM-2025-003', name: 'BIM数字孪生驱动的医院运维管理平台',
      direction: 'BIM数字孪生', phase: '研究立项期', status: '进行中',
      startDate: '2025-03-01', endDate: '2027-02-28',
      parties: ['BJCD', 'BTJT', 'BJCJ', 'BJJY'],
      ipCount: { patent: 1, copyright: 3, dataIP: 3, trademark: 1 },
      budget: 12000000, spent: 800000,
      trl: 3, description: '构建医院全生命周期BIM数字孪生模型，实现运维数据驱动的智能决策'
    },
    {
      id: 'KIPM-2024-004', name: '医疗建筑室内空气质量CFD仿真与优化设计',
      direction: '智慧医疗建筑', phase: '运营维护期', status: '结题',
      startDate: '2023-02-01', endDate: '2025-01-31',
      parties: ['BJCD', 'BJJY'],
      ipCount: { patent: 4, copyright: 2, dataIP: 1, trademark: 0 },
      budget: 3800000, spent: 3750000,
      trl: 8, description: '基于CFD的手术室、ICU等高洁净区域气流组织优化设计方法'
    }
  ],

  intellectualProperties: [
    { id: 'PAT-2025-001', type: '发明专利', name: '一种智慧医院能耗预测与优化控制方法', project: 'KIPM-2025-001', status: '实审中', applicant: '北京建筑大学', filingDate: '2025-03-20', partyShare: { BJCD: 45, BTJT: 25, BJCJ: 20, BJJY: 10 }, trl: 6 },
    { id: 'PAT-2025-002', type: '发明专利', name: '基于数字孪生的医院设备故障预警系统', project: 'KIPM-2025-003', status: '已受理', applicant: '北建大-北投联合', filingDate: '2025-05-15', partyShare: { BJCD: 40, BTJT: 30, BJCJ: 20, BJJY: 10 }, trl: 3 },
    { id: 'PAT-2024-003', type: '发明专利', name: '医疗建筑相变储能围护结构及其热工设计方法', project: 'KIPM-2025-002', status: '已授权', applicant: '北京建筑大学', filingDate: '2024-08-10', grantDate: '2025-04-22', partyShare: { BJCD: 50, BTJT: 20, BJJY: 30 }, trl: 4 },
    { id: 'PAT-2024-004', type: '实用新型', name: '一种手术室气流组织优化送风装置', project: 'KIPM-2024-004', status: '已授权', applicant: '北京建筑大学', filingDate: '2023-06-12', grantDate: '2024-01-18', partyShare: { BJCD: 60, BJJY: 40 }, trl: 8 },
    { id: 'PAT-2024-005', type: '发明专利', name: 'ICU病房压差梯度智能控制方法', project: 'KIPM-2024-004', status: '已授权', applicant: '北京建筑大学', filingDate: '2023-09-05', grantDate: '2024-06-30', partyShare: { BJCD: 55, BJJY: 45 }, trl: 8 },
    { id: 'CPR-2025-001', type: '软件著作权', name: '智慧医院能耗监测平台V1.0', project: 'KIPM-2025-001', status: '已登记', regDate: '2025-02-28', partyShare: { BJCD: 40, BTJT: 30, BJCJ: 20, BJJY: 10 } },
    { id: 'CPR-2025-002', type: '软件著作权', name: 'BIM医院运维数字孪生系统V1.0', project: 'KIPM-2025-003', status: '已登记', regDate: '2025-06-10', partyShare: { BJCD: 35, BTJT: 35, BJCJ: 20, BJJY: 10 } },
    { id: 'CPR-2024-003', type: '软件著作权', name: '医疗建筑CFD仿真分析平台V2.0', project: 'KIPM-2024-004', status: '已登记', regDate: '2024-05-20', partyShare: { BJCD: 50, BJJY: 50 } },
    { id: 'DIP-2025-001', type: '数据知识产权', name: '智慧医院能耗基准数据集', project: 'KIPM-2025-001', status: '已登记', regDate: '2025-04-15', dataSize: '850GB', qualityLevel: 'A', partyShare: { BJCD: 40, BTJT: 30, BJCJ: 20, BJJY: 10 } },
    { id: 'DIP-2025-002', type: '数据知识产权', name: 'BIM构件库-医疗建筑标准模块', project: 'KIPM-2025-003', status: '已登记', regDate: '2025-05-20', dataSize: '320GB', qualityLevel: 'A', partyShare: { BJCD: 30, BTJT: 25, BJCJ: 25, BJJY: 20 } },
    { id: 'DIP-2025-003', type: '数据知识产权', name: '医疗建筑室内环境CFD仿真数据集', project: 'KIPM-2024-004', status: '已登记', regDate: '2024-08-30', dataSize: '120GB', qualityLevel: 'B', partyShare: { BJCD: 50, BJJY: 50 } }
  ],

  contributionData: {
    'KIPM-2025-001': {
      dimensions: ['D1资金', 'D2人力', 'D3技术', 'D4数据', 'D5设施', 'D6管理'],
      partyData: {
        BJCD: [2.8, 3.5, 3.2, 2.1, 1.8, 1.0],
        BTJT: [3.5, 1.2, 1.0, 2.8, 2.5, 1.0],
        BJCJ: [2.2, 2.8, 1.5, 1.2, 3.0, 1.0],
        BJJY: [1.5, 2.5, 2.8, 1.5, 1.2, 1.0]
      },
      weights: { D1: 0.25, D2: 0.25, D3: 0.20, D4: 0.15, D5: 0.10, D6: 1.0 },
      ahpResult: { BJCD: 35.2, BTJT: 28.5, BJCJ: 22.1, BJJY: 14.2 },
      shapleyResult: { BJCD: 33.8, BTJT: 29.2, BJCJ: 22.8, BJJY: 14.2 },
      fusedResult: { BJCD: 34.6, BTJT: 28.8, BJCJ: 22.4, BJJY: 14.2 },
      bootstrap: {
        BJCD: { ciLower: 31.1, ciUpper: 39.3, stdError: 2.1, rating: '稳健' },
        BTJT: { ciLower: 25.0, ciUpper: 32.0, stdError: 1.8, rating: '稳健' },
        BJCJ: { ciLower: 17.6, ciUpper: 26.6, stdError: 2.3, rating: '需关注' },
        BJJY: { ciLower: 11.3, ciUpper: 17.1, stdError: 1.5, rating: '稳健' }
      },
      riskCoefficients: { BJCD: 1.05, BTJT: 1.00, BJCJ: 0.95, BJJY: 1.00 },
      adjustedResult: { BJCD: 36.4, BTJT: 28.8, BJCJ: 21.3, BJJY: 14.2 }
    },
    'KIPM-2025-002': {
      dimensions: ['D1资金', 'D2人力', 'D3技术', 'D4数据', 'D5设施', 'D6管理'],
      partyData: {
        BJCD: [3.0, 3.8, 3.5, 2.5, 2.0, 1.0],
        BTJT: [3.0, 1.0, 1.2, 2.0, 2.0, 1.0],
        BJJY: [1.0, 2.2, 2.8, 1.5, 1.0, 1.0]
      },
      weights: { D1: 0.25, D2: 0.25, D3: 0.20, D4: 0.15, D5: 0.10, D6: 1.0 },
      ahpResult: { BJCD: 52.0, BTJT: 28.0, BJJY: 20.0 },
      shapleyResult: { BJCD: 50.5, BTJT: 29.5, BJJY: 20.0 },
      fusedResult: { BJCD: 51.4, BTJT: 28.6, BJJY: 20.0 },
      bootstrap: {
        BJCD: { ciLower: 46.2, ciUpper: 56.8, stdError: 2.8, rating: '稳健' },
        BTJT: { ciLower: 24.5, ciUpper: 32.5, stdError: 2.0, rating: '稳健' },
        BJJY: { ciLower: 16.5, ciUpper: 23.5, stdError: 1.8, rating: '稳健' }
      },
      riskCoefficients: { BJCD: 1.00, BTJT: 1.00, BJJY: 1.00 },
      adjustedResult: { BJCD: 51.4, BTJT: 28.6, BJJY: 20.0 }
    }
  },

  blockchainEvidence: [
    { id: 'EVD-2025-0089', chainId: 'TPL-2025-0045123', type: '文件存证', title: 'KIPM-2025-001合作协议', timestamp: '2025-01-15 09:23:18', hash: 'a3f7c2e8d9b1...', txHash: '0x7a2f...e4d9', status: '已确认', size: '2.4MB', party: '四方联合', certUrl: '#' },
    { id: 'EVD-2025-0091', chainId: 'TPL-2025-0045145', type: '数据哈希值存证', title: '智慧医院能耗基准数据集-哈希存证', timestamp: '2025-04-15 14:56:33', hash: 'b8e1d4a7c3f2...', txHash: '0x9c3b...f1a2', status: '已确认', size: '850GB(哈希)', party: '四方联合', certUrl: '#' },
    { id: 'EVD-2025-0102', chainId: 'TPL-2025-0045234', type: '文件存证', title: 'PAT-2025-001专利交底书', timestamp: '2025-03-18 11:07:45', hash: 'd2c5f8a1e6b3...', txHash: '0x4e8a...b7c1', status: '已确认', size: '8.6MB', party: '北京建筑大学', certUrl: '#' },
    { id: 'EVD-2025-0115', chainId: 'TPL-2025-0045345', type: '文件存证', title: 'KIPM-2025-001贡献度确认书', timestamp: '2025-04-22 16:30:00', hash: 'e5a9b2d7c4f1...', txHash: '0x2f5d...a8e3', status: '已确认', size: '1.2MB', party: '四方联合', certUrl: '#' },
    { id: 'EVD-2025-0133', chainId: 'TPL-2025-0045456', type: '数据哈希值存证', title: 'BIM构件库-医疗建筑标准模块-哈希存证', timestamp: '2025-05-20 10:15:22', hash: 'c7f3e8a2d1b5...', txHash: '0x6a1c...d4f7', status: '已确认', size: '320GB(哈希)', party: '四方联合', certUrl: '#' },
    { id: 'EVD-2025-0148', chainId: 'TPL-2025-0045567', type: '文件存证', title: '收益分配方案-2025Q1', timestamp: '2025-04-30 09:00:00', hash: 'f1d6a9b3e8c2...', txHash: '0x8b3e...c5a1', status: '已确认', size: '0.8MB', party: '四方联合', certUrl: '#' },
    { id: 'EVD-2025-0152', chainId: 'TPL-2025-0045601', type: '网页取证', title: '疑似侵权网页-某平台能耗优化算法', timestamp: '2025-05-28 15:42:11', hash: 'g4h8j2k5l1m3...', txHash: '0x1d7f...e9b4', status: '已确认', size: '45MB', party: '法务专员', certUrl: '#' }
  ],

  revenueAllocations: [
    { id: 'REV-2025-001', period: '2025-Q1', project: 'KIPM-2024-004', totalAmount: 450000, type: '专利许可', status: '已执行', details: { BJCD: 247500, BJJY: 202500 }, distributionDate: '2025-04-15', smartContract: '0x3a7b...c2e5', txHash: '0x8b3e...c5a1' },
    { id: 'REV-2025-002', period: '2025-Q1', project: 'KIPM-2025-001', totalAmount: 120000, type: '数据IP许可', status: '已执行', details: { BJCD: 48000, BTJT: 36000, BJCJ: 24000, BJJY: 12000 }, distributionDate: '2025-04-30', smartContract: '0x9c2d...a4f8', txHash: '0x8b3e...c5a1' },
    { id: 'REV-2025-003', period: '2025-Q2', project: 'KIPM-2025-001', totalAmount: 80000, type: '技术咨询', status: '审批中', details: { BJCD: 32000, BTJT: 24000, BJCJ: 16000, BJJY: 8000 }, distributionDate: null, smartContract: null, txHash: null }
  ],

  todos: [
    { id: 1, title: 'PAT-2025-001审查意见答复期限临近', dueDate: '2025-07-15', priority: '高', type: '专利', status: '待处理' },
    { id: 2, title: 'KIPM-2025-003阶段贡献度核算（Phase 1→Phase 2）', dueDate: '2025-07-10', priority: '高', type: '贡献度', status: '待处理' },
    { id: 3, title: 'DIP-2025-004数据质量评估（IPDC-4L）', dueDate: '2025-07-20', priority: '中', type: '数据IP', status: '待处理' },
    { id: 4, title: 'KIPM-2025-002背景IP清单年度复核', dueDate: '2025-07-30', priority: '中', type: '管理', status: '待处理' },
    { id: 5, title: 'REV-2025-003收益分配方案管委会审批', dueDate: '2025-07-08', priority: '高', type: '收益分配', status: '待审批' }
  ],

  notifications: [
    { id: 1, title: 'PAT-2025-001收到审查意见通知书', time: '2小时前', read: false },
    { id: 2, title: 'KIPM-2025-001贡献度计算完成（Bootstrap检验通过）', time: '5小时前', read: false },
    { id: 3, title: 'EVD-2025-0152侵权取证存证完成', time: '1天前', read: false }
  ]
};
