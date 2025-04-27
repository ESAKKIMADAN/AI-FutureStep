document.addEventListener('DOMContentLoaded', function() {
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
}); 