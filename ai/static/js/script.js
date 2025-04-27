document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Resume form handling
    const resumeForm = document.getElementById('resume-form');
    if (resumeForm) {
        resumeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('resume-upload');
            if (fileInput.files.length > 0) {
                // TODO: Implement resume analysis functionality
                document.getElementById('resume-analysis').innerHTML = 'Resume analysis in progress...';
            }
        });
    }

    // Initialize Bootstrap tabs
    const triggerTabList = document.querySelectorAll('#interviewTabs a');
    triggerTabList.forEach(triggerEl => {
        const tabTrigger = new bootstrap.Tab(triggerEl);
        triggerEl.addEventListener('click', event => {
            event.preventDefault();
            tabTrigger.show();
        });
    });

    // AI Interview Questions Integration
    const aiQuestionsBtn = document.getElementById('get-ai-questions');
    const aiQuestionsList = document.getElementById('ai-questions-list');
    if (aiQuestionsBtn && aiQuestionsList) {
        aiQuestionsBtn.addEventListener('click', function() {
            aiQuestionsBtn.disabled = true;
            aiQuestionsBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Loading...';
            fetch('/ai/get_interview_questions/', {method: 'POST', headers: {'X-CSRFToken': getCookie('csrftoken')}})
                .then(res => res.json())
                .then(data => {
                    aiQuestionsList.innerHTML = data.questions.map(q => `<div class="card mb-2"><div class="card-body">${q}</div></div>`).join('');
                })
                .catch(() => {
                    aiQuestionsList.innerHTML = '<div class="alert alert-danger">Failed to load AI questions.</div>';
                })
                .finally(() => {
                    aiQuestionsBtn.disabled = false;
                    aiQuestionsBtn.innerHTML = '<i class="fas fa-robot me-1"></i> Get AI Interview Questions';
                });
        });
    }

    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}); 