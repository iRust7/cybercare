// Admin Dashboard JavaScript
// Comprehensive admin functionality for CyberCare platform

// Global state
let currentEditId = null;
let currentEditType = null;
let allUsers = [];
let allMaterials = [];
let allQuizzes = [];
let allTips = [];
let allSimulations = [];

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    updateStats();
    loadUsersTable();
});

// Load all data from JSON files and localStorage
async function loadAllData() {
    try {
        // Load materials
        const materialsResponse = await fetch('data/materials.json');
        allMaterials = await materialsResponse.json();
        
        // Load quizzes
        const quizzesResponse = await fetch('data/quizzes.json');
        allQuizzes = await quizzesResponse.json();
        
        // Load tips
        const tipsResponse = await fetch('data/tips.json');
        allTips = await tipsResponse.json();
        
        // Load threats/simulations
        const threatsResponse = await fetch('data/threats.json');
        allSimulations = await threatsResponse.json();
        
        // Load users from localStorage or create default
        const storedUsers = localStorage.getItem('adminUsers');
        if (storedUsers) {
            allUsers = JSON.parse(storedUsers);
        } else {
            allUsers = getDefaultUsers();
            localStorage.setItem('adminUsers', JSON.stringify(allUsers));
        }
        
        updateStats();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Get default users
function getDefaultUsers() {
    return [
        {
            id: 1,
            name: "Budi Santoso",
            email: "budi@tokobudi.com",
            businessName: "Toko Budi Elektronik",
            role: "user",
            status: "active",
            completedMaterials: [1, 2, 3],
            inProgressMaterials: [4],
            quizScores: [
                { quizId: 1, score: 85, passed: true },
                { quizId: 2, score: 90, passed: true }
            ],
            totalLearningHours: 12.5,
            registeredDate: "2024-01-15",
            lastActive: "2024-12-20"
        },
        {
            id: 2,
            name: "Siti Aminah",
            email: "siti@warungsiti.com",
            businessName: "Warung Siti Jaya",
            role: "user",
            status: "active",
            completedMaterials: [1, 2],
            inProgressMaterials: [3],
            quizScores: [
                { quizId: 1, score: 75, passed: true }
            ],
            totalLearningHours: 8.3,
            registeredDate: "2024-02-10",
            lastActive: "2024-12-22"
        },
        {
            id: 3,
            name: "Ahmad Wijaya",
            email: "ahmad@fashionahmad.com",
            businessName: "Ahmad Fashion Store",
            role: "user",
            status: "banned",
            completedMaterials: [1],
            inProgressMaterials: [],
            quizScores: [],
            totalLearningHours: 3.2,
            registeredDate: "2024-03-05",
            lastActive: "2024-11-15"
        }
    ];
}

// Update statistics
function updateStats() {
    document.getElementById('totalUsers').textContent = allUsers.length;
    document.getElementById('totalMaterials').textContent = allMaterials.length;
    document.getElementById('totalQuizzes').textContent = allQuizzes.length;
    document.getElementById('totalTips').textContent = allTips.length;
    document.getElementById('totalSimulations').textContent = allSimulations.length;
    document.getElementById('bannedUsers').textContent = allUsers.filter(u => u.status === 'banned').length;
    
    // Update reports
    updateReports();
}

// Update reports statistics
function updateReports() {
    const activeUsers = allUsers.filter(u => u.status === 'active');
    const today = new Date().toISOString().split('T')[0];
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const activeTodayCount = activeUsers.filter(u => u.lastActive === today).length;
    const activeWeekCount = activeUsers.filter(u => u.lastActive >= oneWeekAgo).length;
    
    const totalHours = allUsers.reduce((sum, u) => sum + (u.totalLearningHours || 0), 0);
    const avgHours = allUsers.length > 0 ? (totalHours / allUsers.length).toFixed(1) : 0;
    
    const allQuizAttempts = allUsers.flatMap(u => u.quizScores || []);
    const totalAttempts = allQuizAttempts.length;
    const avgScore = totalAttempts > 0 ? 
        (allQuizAttempts.reduce((sum, q) => sum + q.score, 0) / totalAttempts).toFixed(1) : 0;
    const passedCount = allQuizAttempts.filter(q => q.passed).length;
    const passRate = totalAttempts > 0 ? ((passedCount / totalAttempts) * 100).toFixed(1) : 0;
    
    const materialViews = {};
    allUsers.forEach(u => {
        [...(u.completedMaterials || []), ...(u.inProgressMaterials || [])].forEach(mid => {
            materialViews[mid] = (materialViews[mid] || 0) + 1;
        });
    });
    
    const topMaterialId = Object.keys(materialViews).reduce((a, b) => 
        materialViews[a] > materialViews[b] ? a : b, null);
    const topMaterial = topMaterialId ? 
        allMaterials.find(m => m.id == topMaterialId)?.title || '-' : '-';
    
    const totalCompleted = allUsers.reduce((sum, u) => sum + (u.completedMaterials?.length || 0), 0);
    const totalPossible = allUsers.length * allMaterials.length;
    const completionRate = totalPossible > 0 ? ((totalCompleted / totalPossible) * 100).toFixed(1) : 0;
    
    document.getElementById('activeTodayCount').textContent = activeTodayCount;
    document.getElementById('activeWeekCount').textContent = activeWeekCount;
    document.getElementById('avgLearningHours').textContent = avgHours + 'h';
    document.getElementById('totalQuizAttempts').textContent = totalAttempts;
    document.getElementById('avgQuizScore').textContent = avgScore + '%';
    document.getElementById('quizPassRate').textContent = passRate + '%';
    document.getElementById('topMaterial').textContent = topMaterial;
    document.getElementById('completionRate').textContent = completionRate + '%';
    document.getElementById('totalSystemHours').textContent = totalHours.toFixed(1) + 'h';
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    // Load content for the tab
    switch(tabName) {
        case 'users':
            loadUsersTable();
            break;
        case 'materials':
            loadMaterialsTable();
            break;
        case 'quizzes':
            loadQuizzesTable();
            break;
        case 'tips':
            loadTipsGrid();
            break;
        case 'simulations':
            loadSimulationsGrid();
            break;
        case 'reports':
            updateReports();
            break;
    }
}

// ==================== USERS MANAGEMENT ====================

function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    let filteredUsers = [...allUsers];
    
    // Apply filters
    const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('userStatusFilter')?.value || 'all';
    
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(u => 
            u.name.toLowerCase().includes(searchTerm) ||
            u.email.toLowerCase().includes(searchTerm) ||
            u.businessName.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.status === statusFilter);
    }
    
    filteredUsers.forEach(user => {
        const progress = calculateUserProgress(user);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.businessName}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">${progress}%</span>
            </td>
            <td>
                <span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-banned'}">
                    ${user.status === 'active' ? '✓ Active' : '🚫 Banned'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editUser(${user.id})" title="Edit">✏️</button>
                    ${user.status === 'active' ? 
                        `<button class="btn-icon btn-ban" onclick="banUser(${user.id})" title="Ban User">🚫</button>` :
                        `<button class="btn-icon btn-unban" onclick="unbanUser(${user.id})" title="Unban User">✓</button>`
                    }
                    <button class="btn-icon btn-delete" onclick="deleteUser(${user.id})" title="Delete">🗑️</button>
                    <button class="btn-icon btn-view" onclick="viewUserDetails(${user.id})" title="View Details">👁️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function calculateUserProgress(user) {
    const totalMaterials = allMaterials.length;
    const completed = user.completedMaterials?.length || 0;
    return totalMaterials > 0 ? Math.round((completed / totalMaterials) * 100) : 0;
}

function filterUsers() {
    loadUsersTable();
}

function openAddUserModal() {
    currentEditId = null;
    currentEditType = 'add';
    document.getElementById('userModalTitle').textContent = 'Add New User';
    document.getElementById('userForm').reset();
    document.getElementById('userModal').style.display = 'block';
}

function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    currentEditId = userId;
    currentEditType = 'edit';
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userBusiness').value = user.businessName;
    document.getElementById('userRole').value = user.role || 'user';
    document.getElementById('userModal').style.display = 'block';
}

function saveUser(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        businessName: document.getElementById('userBusiness').value,
        role: document.getElementById('userRole').value,
    };
    
    if (currentEditType === 'add') {
        const newUser = {
            id: Math.max(...allUsers.map(u => u.id), 0) + 1,
            ...userData,
            status: 'active',
            completedMaterials: [],
            inProgressMaterials: [],
            quizScores: [],
            totalLearningHours: 0,
            registeredDate: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString().split('T')[0]
        };
        allUsers.push(newUser);
    } else {
        const user = allUsers.find(u => u.id === currentEditId);
        Object.assign(user, userData);
    }
    
    localStorage.setItem('adminUsers', JSON.stringify(allUsers));
    loadUsersTable();
    updateStats();
    closeUserModal();
    showNotification('User saved successfully!', 'success');
}

function banUser(userId) {
    if (!confirm('Are you sure you want to ban this user?')) return;
    
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        user.status = 'banned';
        localStorage.setItem('adminUsers', JSON.stringify(allUsers));
        loadUsersTable();
        updateStats();
        showNotification('User has been banned', 'warning');
    }
}

function unbanUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        user.status = 'active';
        localStorage.setItem('adminUsers', JSON.stringify(allUsers));
        loadUsersTable();
        updateStats();
        showNotification('User has been unbanned', 'success');
    }
}

function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    allUsers = allUsers.filter(u => u.id !== userId);
    localStorage.setItem('adminUsers', JSON.stringify(allUsers));
    loadUsersTable();
    updateStats();
    showNotification('User deleted successfully', 'success');
}

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    const completedMats = user.completedMaterials?.map(id => 
        allMaterials.find(m => m.id === id)?.title || `Material ${id}`
    ).join(', ') || 'None';
    
    const quizResults = user.quizScores?.map(q => {
        const quiz = allQuizzes.find(qz => qz.id === q.quizId);
        return `${quiz?.title || 'Quiz'}: ${q.score}% (${q.passed ? 'Passed' : 'Failed'})`;
    }).join('\n') || 'No quiz attempts';
    
    alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nBusiness: ${user.businessName}\nRole: ${user.role}\nStatus: ${user.status}\n\nCompleted Materials: ${completedMats}\n\nQuiz Results:\n${quizResults}\n\nTotal Learning Hours: ${user.totalLearningHours}h\nRegistered: ${user.registeredDate}\nLast Active: ${user.lastActive}`);
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

// ==================== MATERIALS MANAGEMENT ====================

function loadMaterialsTable() {
    const tbody = document.getElementById('materialsTableBody');
    tbody.innerHTML = '';
    
    allMaterials.forEach(material => {
        const views = calculateMaterialViews(material.id);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${material.id}</td>
            <td><span style="font-size: 1.5rem">${material.icon}</span></td>
            <td>${material.title}</td>
            <td>${material.category}</td>
            <td><span class="level-badge">${material.level}</span></td>
            <td>${material.duration}</td>
            <td>${views}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editMaterial(${material.id})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteMaterial(${material.id})" title="Delete">🗑️</button>
                    <button class="btn-icon btn-view" onclick="viewMaterial(${material.id})" title="Preview">👁️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function calculateMaterialViews(materialId) {
    return allUsers.reduce((count, user) => {
        const isCompleted = user.completedMaterials?.includes(materialId);
        const isInProgress = user.inProgressMaterials?.includes(materialId);
        return count + (isCompleted || isInProgress ? 1 : 0);
    }, 0);
}

function openAddMaterialModal() {
    currentEditId = null;
    currentEditType = 'add';
    document.getElementById('materialModalTitle').textContent = 'Add New Material';
    document.getElementById('materialForm').reset();
    document.getElementById('materialModal').style.display = 'block';
}

function editMaterial(materialId) {
    const material = allMaterials.find(m => m.id === materialId);
    if (!material) return;
    
    currentEditId = materialId;
    currentEditType = 'edit';
    document.getElementById('materialModalTitle').textContent = 'Edit Material';
    document.getElementById('materialTitle').value = material.title;
    document.getElementById('materialIcon').value = material.icon;
    document.getElementById('materialCategory').value = material.category;
    document.getElementById('materialDuration').value = material.duration;
    document.getElementById('materialLevel').value = material.level;
    document.getElementById('materialSummary').value = material.summary;
    document.getElementById('materialIntroduction').value = material.content?.introduction || '';
    document.getElementById('materialContent').value = JSON.stringify({
        sections: material.content?.sections || [],
        keyTakeaways: material.content?.keyTakeaways || []
    }, null, 2);
    document.getElementById('materialModal').style.display = 'block';
}

function saveMaterial(event) {
    event.preventDefault();
    
    let contentData;
    try {
        const contentStr = document.getElementById('materialContent').value;
        contentData = contentStr ? JSON.parse(contentStr) : { sections: [], keyTakeaways: [] };
    } catch (e) {
        alert('Invalid JSON format in Content field');
        return;
    }
    
    const materialData = {
        title: document.getElementById('materialTitle').value,
        icon: document.getElementById('materialIcon').value,
        category: document.getElementById('materialCategory').value,
        duration: document.getElementById('materialDuration').value,
        level: document.getElementById('materialLevel').value,
        summary: document.getElementById('materialSummary').value,
        content: {
            introduction: document.getElementById('materialIntroduction').value,
            ...contentData
        }
    };
    
    if (currentEditType === 'add') {
        const newMaterial = {
            id: Math.max(...allMaterials.map(m => m.id), 0) + 1,
            ...materialData
        };
        allMaterials.push(newMaterial);
    } else {
        const material = allMaterials.find(m => m.id === currentEditId);
        Object.assign(material, materialData);
    }
    
    // Note: In a real app, this would save to a database
    // For demo, we just update the in-memory array
    loadMaterialsTable();
    updateStats();
    closeMaterialModal();
    showNotification('Material saved successfully!', 'success');
}

function deleteMaterial(materialId) {
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    allMaterials = allMaterials.filter(m => m.id !== materialId);
    loadMaterialsTable();
    updateStats();
    showNotification('Material deleted successfully', 'success');
}

function viewMaterial(materialId) {
    window.open(`material-detail.html?id=${materialId}`, '_blank');
}

function closeMaterialModal() {
    document.getElementById('materialModal').style.display = 'none';
}

// ==================== QUIZZES MANAGEMENT ====================

function loadQuizzesTable() {
    const tbody = document.getElementById('quizzesTableBody');
    tbody.innerHTML = '';
    
    allQuizzes.forEach(quiz => {
        const material = allMaterials.find(m => m.id === quiz.materialId);
        const attempts = calculateQuizAttempts(quiz.id);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${quiz.id}</td>
            <td>${quiz.title}</td>
            <td>${material?.title || 'N/A'}</td>
            <td>${quiz.questions?.length || 0}</td>
            <td>${quiz.passingScore}%</td>
            <td>${attempts}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editQuiz(${quiz.id})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteQuiz(${quiz.id})" title="Delete">🗑️</button>
                    <button class="btn-icon btn-view" onclick="viewQuiz(${quiz.id})" title="Preview">👁️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function calculateQuizAttempts(quizId) {
    return allUsers.reduce((count, user) => {
        return count + (user.quizScores?.filter(q => q.quizId === quizId).length || 0);
    }, 0);
}

function openAddQuizModal() {
    currentEditId = null;
    currentEditType = 'add';
    document.getElementById('quizModalTitle').textContent = 'Add New Quiz';
    document.getElementById('quizForm').reset();
    document.getElementById('quizModal').style.display = 'block';
}

function editQuiz(quizId) {
    const quiz = allQuizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    currentEditId = quizId;
    currentEditType = 'edit';
    document.getElementById('quizModalTitle').textContent = 'Edit Quiz';
    document.getElementById('quizTitle').value = quiz.title;
    document.getElementById('quizMaterialId').value = quiz.materialId;
    document.getElementById('quizPassingScore').value = quiz.passingScore;
    document.getElementById('quizQuestions').value = JSON.stringify(quiz.questions || [], null, 2);
    document.getElementById('quizModal').style.display = 'block';
}

function saveQuiz(event) {
    event.preventDefault();
    
    let questions;
    try {
        questions = JSON.parse(document.getElementById('quizQuestions').value);
    } catch (e) {
        alert('Invalid JSON format in Questions field');
        return;
    }
    
    const quizData = {
        title: document.getElementById('quizTitle').value,
        materialId: parseInt(document.getElementById('quizMaterialId').value),
        passingScore: parseInt(document.getElementById('quizPassingScore').value),
        questions: questions
    };
    
    if (currentEditType === 'add') {
        const newQuiz = {
            id: Math.max(...allQuizzes.map(q => q.id), 0) + 1,
            ...quizData
        };
        allQuizzes.push(newQuiz);
    } else {
        const quiz = allQuizzes.find(q => q.id === currentEditId);
        Object.assign(quiz, quizData);
    }
    
    loadQuizzesTable();
    updateStats();
    closeQuizModal();
    showNotification('Quiz saved successfully!', 'success');
}

function deleteQuiz(quizId) {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    
    allQuizzes = allQuizzes.filter(q => q.id !== quizId);
    loadQuizzesTable();
    updateStats();
    showNotification('Quiz deleted successfully', 'success');
}

function viewQuiz(quizId) {
    window.open(`quiz.html?id=${quizId}`, '_blank');
}

function closeQuizModal() {
    document.getElementById('quizModal').style.display = 'none';
}

// ==================== TIPS MANAGEMENT ====================

function loadTipsGrid() {
    const grid = document.getElementById('tipsGrid');
    grid.innerHTML = '';
    
    let filteredTips = [...allTips];
    const categoryFilter = document.getElementById('tipCategoryFilter')?.value || 'all';
    
    if (categoryFilter !== 'all') {
        filteredTips = filteredTips.filter(t => t.category === categoryFilter);
    }
    
    filteredTips.forEach(tip => {
        const card = document.createElement('div');
        card.className = 'admin-tip-card';
        card.innerHTML = `
            <div class="tip-card-header">
                <span class="tip-icon">${tip.icon}</span>
                <span class="tip-category-badge">${tip.category}</span>
            </div>
            <h3>${tip.title}</h3>
            <p>${tip.description}</p>
            <div class="action-buttons">
                <button class="btn-icon btn-edit" onclick="editTip(${tip.id})" title="Edit">✏️</button>
                <button class="btn-icon btn-delete" onclick="deleteTip(${tip.id})" title="Delete">🗑️</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterTips() {
    loadTipsGrid();
}

function openAddTipModal() {
    currentEditId = null;
    currentEditType = 'add';
    document.getElementById('tipModalTitle').textContent = 'Add New Tip';
    document.getElementById('tipForm').reset();
    document.getElementById('tipModal').style.display = 'block';
}

function editTip(tipId) {
    const tip = allTips.find(t => t.id === tipId);
    if (!tip) return;
    
    currentEditId = tipId;
    currentEditType = 'edit';
    document.getElementById('tipModalTitle').textContent = 'Edit Tip';
    document.getElementById('tipIcon').value = tip.icon;
    document.getElementById('tipCategory').value = tip.category;
    document.getElementById('tipTitle').value = tip.title;
    document.getElementById('tipDescription').value = tip.description;
    document.getElementById('tipModal').style.display = 'block';
}

function saveTip(event) {
    event.preventDefault();
    
    const tipData = {
        icon: document.getElementById('tipIcon').value,
        category: document.getElementById('tipCategory').value,
        title: document.getElementById('tipTitle').value,
        description: document.getElementById('tipDescription').value,
    };
    
    if (currentEditType === 'add') {
        const newTip = {
            id: Math.max(...allTips.map(t => t.id), 0) + 1,
            ...tipData
        };
        allTips.push(newTip);
    } else {
        const tip = allTips.find(t => t.id === currentEditId);
        Object.assign(tip, tipData);
    }
    
    loadTipsGrid();
    updateStats();
    closeTipModal();
    showNotification('Tip saved successfully!', 'success');
}

function deleteTip(tipId) {
    if (!confirm('Are you sure you want to delete this tip?')) return;
    
    allTips = allTips.filter(t => t.id !== tipId);
    loadTipsGrid();
    updateStats();
    showNotification('Tip deleted successfully', 'success');
}

function closeTipModal() {
    document.getElementById('tipModal').style.display = 'none';
}

// ==================== SIMULATIONS MANAGEMENT ====================

function loadSimulationsGrid() {
    const grid = document.getElementById('simulationsGrid');
    grid.innerHTML = '';
    
    let filteredSims = [...allSimulations];
    const typeFilter = document.getElementById('simulationTypeFilter')?.value || 'all';
    
    if (typeFilter !== 'all') {
        filteredSims = filteredSims.filter(s => s.type === typeFilter);
    }
    
    filteredSims.forEach(sim => {
        const card = document.createElement('div');
        card.className = 'admin-simulation-card';
        card.innerHTML = `
            <div class="sim-card-header">
                <span class="sim-type-badge">${sim.type.replace('_', ' ')}</span>
                <span class="sim-safety-badge ${sim.isSafe ? 'safe' : 'threat'}">
                    ${sim.isSafe ? '✓ Safe' : '⚠️ Threat'}
                </span>
            </div>
            <h3>${sim.title}</h3>
            <p>${sim.description}</p>
            <div class="action-buttons">
                <button class="btn-icon btn-edit" onclick="editSimulation(${sim.id})" title="Edit">✏️</button>
                <button class="btn-icon btn-delete" onclick="deleteSimulation(${sim.id})" title="Delete">🗑️</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterSimulations() {
    loadSimulationsGrid();
}

function openAddSimulationModal() {
    currentEditId = null;
    currentEditType = 'add';
    document.getElementById('simulationModalTitle').textContent = 'Add New Simulation';
    document.getElementById('simulationForm').reset();
    document.getElementById('simulationModal').style.display = 'block';
}

function editSimulation(simId) {
    const sim = allSimulations.find(s => s.id === simId);
    if (!sim) return;
    
    currentEditId = simId;
    currentEditType = 'edit';
    document.getElementById('simulationModalTitle').textContent = 'Edit Simulation';
    document.getElementById('simulationType').value = sim.type;
    document.getElementById('simulationTitle').value = sim.title;
    document.getElementById('simulationDescription').value = sim.description;
    document.getElementById('simulationContent').value = sim.content;
    document.getElementById('simulationIsSafe').value = sim.isSafe.toString();
    document.getElementById('simulationRedFlags').value = JSON.stringify(sim.redFlags || [], null, 2);
    document.getElementById('simulationExplanation').value = sim.explanation;
    document.getElementById('simulationModal').style.display = 'block';
}

function saveSimulation(event) {
    event.preventDefault();
    
    let redFlags;
    try {
        redFlags = JSON.parse(document.getElementById('simulationRedFlags').value);
    } catch (e) {
        alert('Invalid JSON format in Red Flags field');
        return;
    }
    
    const simData = {
        type: document.getElementById('simulationType').value,
        title: document.getElementById('simulationTitle').value,
        description: document.getElementById('simulationDescription').value,
        content: document.getElementById('simulationContent').value,
        isSafe: document.getElementById('simulationIsSafe').value === 'true',
        redFlags: redFlags,
        explanation: document.getElementById('simulationExplanation').value,
    };
    
    if (currentEditType === 'add') {
        const newSim = {
            id: Math.max(...allSimulations.map(s => s.id), 0) + 1,
            ...simData
        };
        allSimulations.push(newSim);
    } else {
        const sim = allSimulations.find(s => s.id === currentEditId);
        Object.assign(sim, simData);
    }
    
    loadSimulationsGrid();
    updateStats();
    closeSimulationModal();
    showNotification('Simulation saved successfully!', 'success');
}

function deleteSimulation(simId) {
    if (!confirm('Are you sure you want to delete this simulation?')) return;
    
    allSimulations = allSimulations.filter(s => s.id !== simId);
    loadSimulationsGrid();
    updateStats();
    showNotification('Simulation deleted successfully', 'success');
}

function closeSimulationModal() {
    document.getElementById('simulationModal').style.display = 'none';
}

// ==================== EXPORT FUNCTIONS ====================

function exportUsers() {
    downloadJSON(allUsers, 'users_export.json');
    showNotification('Users exported successfully!', 'success');
}

function exportMaterials() {
    downloadJSON(allMaterials, 'materials_export.json');
    showNotification('Materials exported successfully!', 'success');
}

function exportQuizResults() {
    const quizResults = allUsers.flatMap(user => 
        (user.quizScores || []).map(score => ({
            userId: user.id,
            userName: user.name,
            quizId: score.quizId,
            score: score.score,
            passed: score.passed
        }))
    );
    downloadJSON(quizResults, 'quiz_results_export.json');
    showNotification('Quiz results exported successfully!', 'success');
}

function exportFullReport() {
    const report = {
        exportDate: new Date().toISOString(),
        users: allUsers,
        materials: allMaterials,
        quizzes: allQuizzes,
        tips: allTips,
        simulations: allSimulations,
        statistics: {
            totalUsers: allUsers.length,
            activeUsers: allUsers.filter(u => u.status === 'active').length,
            bannedUsers: allUsers.filter(u => u.status === 'banned').length,
            totalMaterials: allMaterials.length,
            totalQuizzes: allQuizzes.length,
            totalTips: allTips.length,
            totalSimulations: allSimulations.length
        }
    };
    downloadJSON(report, 'full_report.json');
    showNotification('Full report exported successfully!', 'success');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ==================== UTILITY FUNCTIONS ====================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};
