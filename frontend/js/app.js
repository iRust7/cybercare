// ==================== CONFIGURATION ====================

const API_URL = 'http://localhost:8080/api';
let currentUser = null;
let currentMaterialId = null;
let currentQuizId = null;
let quizTimer = null;

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in using session
    try {
        const response = await fetch(`${API_URL}/check_session`, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        
        if (result.success && result.data && result.data.isLoggedIn) {
            currentUser = result.data.user;
            initializeApp();
        } else {
            // Not logged in, but allow guest access
            console.log('Guest access enabled');
            currentUser = {
                id: 0,
                name: "Pengunjung Tamu",
                email: "tamu@cybercare.com",
                businessName: "Bisnis Tamu",
                role: "user",
                xp: 0,
                level: 1,
                dailyStreak: 0,
                badges: [],
                completedMaterials: [],
                quizScores: []
            };
            initializeApp();
        }
    } catch (error) {
        console.error('Session check error:', error);
        // Allow guest access on error too
        currentUser = {
            id: 0,
            name: "Pengunjung Tamu",
            email: "tamu@cybercare.com",
            businessName: "Bisnis Tamu",
            role: "user",
            xp: 0,
            level: 1,
            dailyStreak: 0,
            badges: [],
            completedMaterials: [],
            quizScores: []
        };
        initializeApp();
    }
});

function initializeApp() {
    updateUserName();
    loadDashboard();
    setupNavigation();
    setupMobileMenu();
}

// ==================== AUTHENTICATION ====================

async function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        window.location.href = 'login.html';
    }
}

// ==================== NAVIGATION ====================

function navigateTo(page) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    const section = document.getElementById(page);
    if (section) {
        section.classList.remove('hidden');
    }
    
    // Load data based on page
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'materials':
            loadMaterials();
            break;
        case 'tips':
            loadTips();
            break;
        case 'simulasi':
            loadSimulasi();
            break;
        case 'progress':
            loadProgress();
            break;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('onclick')?.includes('logout')) {
                return;
            }
            e.preventDefault();
        });
    });
}

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when a link is clicked
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
}

function updateUserName() {
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = currentUser.name || 'User';
    }
}

// ==================== DASHBOARD ====================

async function loadDashboard() {
    try {
        // Load progress
        const progressResponse = await fetch(`${API_URL}/progress`, {
            credentials: 'include'
        });
        const progressData = await progressResponse.json();
        
        if (progressResponse.ok) {
            document.getElementById('overallProgress').style.width = progressData.overall_progress + '%';
            document.getElementById('progressText').textContent = progressData.overall_progress + '% Selesai';
            document.getElementById('completedMaterials').textContent = progressData.completed_materials;
            document.getElementById('totalMaterials').textContent = progressData.total_materials;
        }
        
        // Load notifications count
        const notifResponse = await fetch(`${API_URL}/notifications`, {
            credentials: 'include'
        });
        const notifications = await notifResponse.json();
        const unreadCount = notifications.filter(n => !n.is_read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// ==================== MATERIALS ====================

async function loadMaterials() {
    const container = document.getElementById('materialsContainer');
    container.innerHTML = '<p>Memuat materi...</p>';
    
    try {
        const response = await fetch(`${API_URL}/materials`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            container.innerHTML = '<p>Gagal memuat materi</p>';
            return;
        }
        
        const materials = await response.json();
        
        if (materials.length === 0) {
            container.innerHTML = '<p>Tidak ada materi tersedia</p>';
            return;
        }
        
        container.innerHTML = materials.map(material => `
            <div class="material-card" onclick="viewMaterial(${material.id})">
                <h3>${escapeHtml(material.title)}</h3>
                <span class="category">${escapeHtml(material.category || 'Umum')}</span>
                <p class="summary">${escapeHtml(material.summary || '')}</p>
                <div class="material-meta">
                    <div class="material-time">
                        <span>⏱️ ${material.estimated_time || 0} menit</span>
                    </div>
                    <a href="#">Lihat Detail →</a>
                </div>
            </div>
        `).join('');
        
        // Add search functionality
        const searchInput = document.getElementById('searchMaterial');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                document.querySelectorAll('.material-card').forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const summary = card.querySelector('.summary').textContent.toLowerCase();
                    if (title.includes(query) || summary.includes(query)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    } catch (error) {
        container.innerHTML = '<p>Terjadi kesalahan saat memuat materi</p>';
        console.error(error);
    }
}

async function viewMaterial(materialId) {
    currentMaterialId = materialId;
    
    try {
        const response = await fetch(`${API_URL}/materials/${materialId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            alert('Gagal memuat materi');
            return;
        }
        
        const material = await response.json();
        
        // Update material content
        document.getElementById('materialTitle').textContent = material.title;
        document.getElementById('materialBody').innerHTML = material.content;
        
        // Load quizzes for this material
        const quizzesResponse = await fetch(`${API_URL}/materials/${materialId}/quizzes`, {
            credentials: 'include'
        });
        const quizzes = await quizzesResponse.json();
        
        const quizBtn = document.getElementById('startQuizBtn');
        if (quizzes.length > 0) {
            currentQuizId = quizzes[0].id;
            quizBtn.style.display = 'block';
            quizBtn.textContent = `Mulai Kuis (${quizzes[0].question_count} soal)`;
        } else {
            quizBtn.style.display = 'none';
        }
        
        // Navigate to material detail
        navigateTo('material-detail');
        
    } catch (error) {
        alert('Terjadi kesalahan');
        console.error(error);
    }
}

// ==================== QUIZZES ====================

async function startQuiz() {
    if (!currentQuizId) {
        alert('Quiz tidak ditemukan');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/quizzes/${currentQuizId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            alert('Gagal memuat quiz');
            return;
        }
        
        const quiz = await response.json();
        
        // Display quiz title and questions
        document.getElementById('quizTitle').textContent = quiz.title;
        
        let questionsHtml = '';
        quiz.questions.forEach((question, index) => {
            questionsHtml += `
                <div class="question-block">
                    <div class="question-text">
                        <span>Soal ${index + 1}/${quiz.questions.length}</span>
                        ${escapeHtml(question.question_text)}
                    </div>
                    <div class="options">
                        ${question.options.map(option => `
                            <label class="option">
                                <input type="radio" name="question_${question.id}" 
                                       value="${option.id}" onchange="updateSelection()">
                                <span>${escapeHtml(option.text)}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        document.getElementById('quizContent').innerHTML = questionsHtml;
        
        // Start timer if specified
        if (quiz.time_limit) {
            startQuizTimer(quiz.time_limit);
        }
        
        navigateTo('quiz');
        
    } catch (error) {
        alert('Terjadi kesalahan saat memuat quiz');
        console.error(error);
    }
}

function startQuizTimer(seconds) {
    if (quizTimer) clearInterval(quizTimer);
    
    const timerElement = document.getElementById('quizTimer');
    let timeLeft = seconds;
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(quizTimer);
            submitQuiz();
        }
        
        if (timeLeft <= 60) {
            timerElement.style.color = '#ef4444';
        }
        
        timeLeft--;
    }
    
    updateTimer();
    quizTimer = setInterval(updateTimer, 1000);
}

function updateSelection() {
    // Visual feedback
    document.querySelectorAll('.question-block').forEach(block => {
        const selected = block.querySelector('input[type="radio"]:checked');
        if (selected) {
            block.classList.add('selected');
        }
    });
}

async function submitQuiz() {
    if (quizTimer) clearInterval(quizTimer);
    
    try {
        // Collect answers
        const answers = {};
        document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
            const name = input.name;
            const questionId = name.replace('question_', '');
            answers[questionId] = input.value;
        });
        
        const response = await fetch(`${API_URL}/quiz-attempts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                quiz_id: currentQuizId,
                answers: answers
            })
        });
        
        if (!response.ok) {
            alert('Gagal menyimpan jawaban');
            return;
        }
        
        const result = await response.json();
        
        // Display results
        const resultScore = document.getElementById('resultScore');
        resultScore.innerHTML = `
            <div style="font-size: 1.2em; color: ${result.score >= 70 ? '#10b981' : '#ef4444'};">
                ${result.passed ? '✅ LULUS' : '❌ BELUM LULUS'}
            </div>
            <div style="font-size: 3em; font-weight: 700;">${result.score}%</div>
            <p style="margin-top: 10px;">Nilai ${result.passed ? 'melampaui' : 'di bawah'} standar kelulusan</p>
        `;
        
        navigateTo('quiz-results');
        
    } catch (error) {
        alert('Terjadi kesalahan saat menyimpan jawaban');
        console.error(error);
    }
}

// ==================== TIPS ====================

async function loadTips() {
    const container = document.getElementById('tipsContainer');
    container.innerHTML = '<p>Memuat tips...</p>';
    
    try {
        const response = await fetch(`${API_URL}/tips`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            container.innerHTML = '<p>Gagal memuat tips</p>';
            return;
        }
        
        const tips = await response.json();
        
        if (tips.length === 0) {
            container.innerHTML = '<p>Tidak ada tips tersedia</p>';
            return;
        }
        
        container.innerHTML = tips.map(tip => `
            <div class="tip-card">
                <h3>${escapeHtml(tip.title)}</h3>
                <span class="category">${escapeHtml(tip.category || 'Tips')}</span>
                <p>${escapeHtml(tip.content)}</p>
                <div style="margin-top: 15px; font-size: 12px; color: #6b7280;">
                    ${new Date(tip.created_at).toLocaleDateString('id-ID')}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = '<p>Terjadi kesalahan</p>';
        console.error(error);
    }
}

function filterTips() {
    const category = document.getElementById('tipsCategory').value;
    const cards = document.querySelectorAll('.tip-card');
    
    cards.forEach(card => {
        if (!category || card.querySelector('.category').textContent === category) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==================== SIMULASI ====================

async function loadSimulasi() {
    const container = document.getElementById('simulasiContainer');
    container.innerHTML = '<p>Memuat simulasi...</p>';
    
    try {
        const response = await fetch(`${API_URL}/simulasi-ancaman`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            container.innerHTML = '<p>Gagal memuat simulasi</p>';
            return;
        }
        
        const simulasi = await response.json();
        
        if (simulasi.length === 0) {
            container.innerHTML = '<p>Tidak ada simulasi tersedia</p>';
            return;
        }
        
        container.innerHTML = simulasi.map(sim => `
            <div class="simulasi-card">
                <h3>${escapeHtml(sim.jenis_ancaman)}</h3>
                <p><strong>Deskripsi:</strong> ${escapeHtml(sim.deskripsi)}</p>
                <p><strong>Contoh Kasus:</strong> ${escapeHtml(sim.contoh_kasus || 'N/A')}</p>
                <p><strong>Cara Menghindari:</strong> ${escapeHtml(sim.cara_menghindari || 'N/A')}</p>
                <div style="margin-top: 15px; font-size: 12px; color: #6b7280;">
                    ${new Date(sim.created_at).toLocaleDateString('id-ID')}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = '<p>Terjadi kesalahan</p>';
        console.error(error);
    }
}

// ==================== PROGRESS ====================

async function loadProgress() {
    const container = document.getElementById('progressDetailed');
    container.innerHTML = '<p>Memuat progres...</p>';
    
    try {
        const response = await fetch(`${API_URL}/progress`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            container.innerHTML = '<p>Gagal memuat progres</p>';
            return;
        }
        
        const data = await response.json();
        
        // Get material names
        const materialsResponse = await fetch(`${API_URL}/materials`, {
            credentials: 'include'
        });
        const materials = await materialsResponse.json();
        
        const materialMap = {};
        materials.forEach(m => {
            materialMap[m.id] = m.title;
        });
        
        let html = `
            <div class="card" style="grid-column: 1/-1;">
                <h3>Ringkasan Progress</h3>
                <div class="progress-stats">
                    <div class="stat">
                        <span class="stat-label">Progress Keseluruhan</span>
                        <span class="stat-value">${data.overall_progress}%</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Materi Selesai</span>
                        <span class="stat-value">${data.completed_materials}/${data.total_materials}</span>
                    </div>
                </div>
            </div>
        `;
        
        data.progress_details.forEach(progress => {
            const materialTitle = materialMap[progress.material_id] || `Materi ${progress.material_id}`;
            html += `
                <div class="progress-item">
                    <div class="progress-info">
                        <h3>${escapeHtml(materialTitle)}</h3>
                        <p>${progress.is_completed ? '✅ Selesai' : '⏳ Sedang Belajar'}</p>
                    </div>
                    <div class="progress-bar-small">
                        <div class="progress-fill" style="width: ${progress.progress_percentage}%"></div>
                    </div>
                    <div class="progress-percentage">${progress.progress_percentage}%</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        container.innerHTML = '<p>Terjadi kesalahan</p>';
        console.error(error);
    }
}

// ==================== UTILITY FUNCTIONS ====================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==================== ERROR HANDLING ====================

window.addEventListener('error', function(event) {
    console.error('Error:', event.error);
});

