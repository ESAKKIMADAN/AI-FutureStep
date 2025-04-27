document.addEventListener('DOMContentLoaded', function() {
    const resumeForm = document.getElementById('resume-form');
    const resumeUpload = document.getElementById('resume-upload');
    const clearFileBtn = document.getElementById('clear-file-btn');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const analysisProgress = document.getElementById('analysis-progress');
    const analysisProgressBar = document.getElementById('analysis-progress-bar');
    const analysisStatus = document.getElementById('analysis-status');
    const resumeAnalysis = document.getElementById('resume-analysis');
    const enhanceResumeBtn = document.getElementById('enhance-resume-btn');
    const previewSection = document.getElementById('preview-section');
    const resumePreviewContent = document.getElementById('resume-preview-content');
    
    // AI enhancement options
    const enhanceContent = document.getElementById('enhance-content');
    const improveFormatting = document.getElementById('improve-formatting');
    const keywordOptimization = document.getElementById('keyword-optimization');
    const atsCompatibility = document.getElementById('ats-compatibility');
    
    let resumeText = '';
    
    // Debug: Check if elements are found
    console.log('Form element:', resumeForm);
    console.log('Upload element:', resumeUpload);
    console.log('Progress element:', analysisProgress);
    console.log('Progress bar element:', analysisProgressBar);
    console.log('Status element:', analysisStatus);
    console.log('Analysis element:', resumeAnalysis);
    console.log('Enhance button element:', enhanceResumeBtn);
    
    // Handle file selection
    resumeUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            filePreview.classList.remove('d-none');
            
            // Check file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
            if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt')) {
                showAlert('Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.', 'danger');
                clearFile();
                return;
            }
            
            // Read the file
            const reader = new FileReader();
            reader.onload = function(e) {
                resumeText = e.target.result;
                if (file.type === 'application/pdf') {
                    showAlert('PDF parsing is not supported in this demo. Please use a text-based format.', 'warning');
                    clearFile();
                }
            };
            reader.onerror = function(error) {
                console.error('Error reading file:', error);
                showAlert('Error reading file. Please try again.', 'danger');
                clearFile();
            };
            
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                reader.readAsText(file);
            }
        }
    });
    
    // Handle clear file button
    clearFileBtn.addEventListener('click', clearFile);
    
    function clearFile() {
        resumeUpload.value = '';
        filePreview.classList.add('d-none');
        resumeText = '';
    }
    
    // Handle form submission
    resumeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!resumeUpload.files.length) {
            showAlert('Please select a resume file to upload.', 'danger');
            return;
        }
        
        // Show progress indicator
        analysisProgress.classList.remove('d-none');
        resumeAnalysis.innerHTML = '';
        enhanceResumeBtn.disabled = true;
        
        // Simulate AI analysis process
        simulateAnalysis();
    });
    
    // Handle enhance resume button click
    enhanceResumeBtn.addEventListener('click', function() {
        enhanceResume();
    });
    
    // Simulate the AI analysis process
    function simulateAnalysis() {
        let progress = 0;
        const interval = setInterval(function() {
            progress += 5;
            analysisProgressBar.style.width = progress + '%';
            
            // Update status messages based on progress
            if (progress < 20) {
                analysisStatus.textContent = 'Extracting text from resume...';
            } else if (progress < 40) {
                analysisStatus.textContent = 'Analyzing content structure...';
            } else if (progress < 60) {
                analysisStatus.textContent = 'Identifying skills and experience...';
            } else if (progress < 80) {
                analysisStatus.textContent = 'Evaluating formatting and readability...';
            } else if (progress < 100) {
                analysisStatus.textContent = 'Generating recommendations...';
            } else {
                clearInterval(interval);
                analysisStatus.textContent = 'Analysis complete!';
                
                // Show analysis results
                showAnalysisResults();
                
                // Enable enhance button
                enhanceResumeBtn.disabled = false;
            }
        }, 300);
    }
    
    // Show analysis results
    function showAnalysisResults() {
        const results = `
            <div class="card analysis-card">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0"><i class="fas fa-chart-bar me-2"></i>Resume Analysis Results</h4>
                </div>
                <div class="card-body">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <h5>Overall Score</h5>
                            <div class="progress mb-2">
                                <div class="progress-bar bg-success" role="progressbar" style="width: 75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>
                            </div>
                            <p class="text-muted">Your resume is well-structured but has room for improvement.</p>
                        </div>
                        <div class="col-md-6">
                            <h5>Key Metrics</h5>
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Content Quality</span>
                                    <span class="badge bg-primary rounded-pill">8/10</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Formatting</span>
                                    <span class="badge bg-primary rounded-pill">7/10</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>ATS Compatibility</span>
                                    <span class="badge bg-primary rounded-pill">9/10</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Keyword Optimization</span>
                                    <span class="badge bg-primary rounded-pill">6/10</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <h5>Strengths</h5>
                    <ul class="list-group mb-4">
                        <li class="list-group-item"><i class="fas fa-check-circle text-success me-2"></i>Clear work history with consistent formatting</li>
                        <li class="list-group-item"><i class="fas fa-check-circle text-success me-2"></i>Good use of action verbs in experience descriptions</li>
                        <li class="list-group-item"><i class="fas fa-check-circle text-success me-2"></i>Well-organized sections with appropriate headings</li>
                        <li class="list-group-item"><i class="fas fa-check-circle text-success me-2"></i>ATS-friendly format with proper spacing</li>
                    </ul>
                    
                    <h5>Areas for Improvement</h5>
                    <ul class="list-group mb-4">
                        <li class="list-group-item"><i class="fas fa-exclamation-circle text-warning me-2"></i>Add more quantifiable achievements to demonstrate impact</li>
                        <li class="list-group-item"><i class="fas fa-exclamation-circle text-warning me-2"></i>Include more industry-specific keywords</li>
                        <li class="list-group-item"><i class="fas fa-exclamation-circle text-warning me-2"></i>Consider adding a professional summary section</li>
                        <li class="list-group-item"><i class="fas fa-exclamation-circle text-warning me-2"></i>Reduce use of passive voice in some descriptions</li>
                    </ul>
                    
                    <div class="alert alert-info">
                        <i class="fas fa-lightbulb me-2"></i>Click the "Enhance My Resume" button below to generate an improved version of your resume based on these recommendations.
                    </div>
                </div>
            </div>
        `;
        
        resumeAnalysis.innerHTML = results;
    }
    
    // Enhance resume function
    function enhanceResume() {
        // Show loading state
        enhanceResumeBtn.disabled = true;
        enhanceResumeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Enhancing...';
        
        // Prepare enhancement options
        const enhancements = {
            content_quality: enhanceContent.checked,
            formatting: improveFormatting.checked,
            keywords: keywordOptimization.checked,
            ats_compatibility: atsCompatibility.checked
        };
        
        // Get CSRF token
        const csrfToken = getCookie('csrftoken');
        
        // Create a sample resume text if none is provided
        if (!resumeText || resumeText.trim() === '') {
            resumeText = `JOHN DOE
123 Main Street, Anytown, USA
john.doe@email.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software developer with a strong background in web development and database management.

WORK EXPERIENCE
Software Developer | Tech Solutions Inc. | 2018-Present
- Managed development of client-facing web applications
- Helped implement new features and functionality
- Made improvements to existing codebase
- Did code reviews and mentored junior developers

Junior Developer | WebTech LLC | 2015-2018
- Developed front-end components using React
- Made bug fixes and implemented small features
- Helped with testing and documentation

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2011-2015

SKILLS
JavaScript, Python, React, Node.js, SQL, Git`;
        }
        
        // Send request to enhance resume
        fetch('/enhance-resume/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                resume_text: resumeText,
                enhancements: enhancements
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Server error: ${response.status} - ${text}`);
                });
            }
            return response.blob();
        })
        .then(blob => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'enhanced_resume.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            
            // Show success message
            showAlert('Your enhanced resume has been generated and downloaded!', 'success');
            
            // Show enhanced resume preview
            showEnhancedResumePreview();
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert(`Error generating enhanced resume: ${error.message}`, 'danger');
        })
        .finally(() => {
            // Reset enhance button
            enhanceResumeBtn.disabled = false;
            enhanceResumeBtn.innerHTML = '<i class="fas fa-magic me-1"></i>Enhance My Resume';
        });
    }
    
    // Show enhanced resume preview
    function showEnhancedResumePreview() {
        const previewHtml = `
            <div class="card mt-4">
                <div class="card-header bg-success text-white">
                    <h4 class="mb-0"><i class="fas fa-file-alt me-2"></i>Enhanced Resume Preview</h4>
                </div>
                <div class="card-body">
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>Your resume has been enhanced based on our AI analysis!
                    </div>
                    
                    <div class="mb-4">
                        <h5>Key Improvements Made:</h5>
                        <ul class="list-group">
                            <li class="list-group-item"><i class="fas fa-plus-circle text-success me-2"></i>Added a professional summary highlighting key qualifications</li>
                            <li class="list-group-item"><i class="fas fa-plus-circle text-success me-2"></i>Enhanced job descriptions with quantifiable achievements</li>
                            <li class="list-group-item"><i class="fas fa-plus-circle text-success me-2"></i>Improved formatting for better readability</li>
                            <li class="list-group-item"><i class="fas fa-plus-circle text-success me-2"></i>Added industry-specific keywords</li>
                            <li class="list-group-item"><i class="fas fa-plus-circle text-success me-2"></i>Optimized for ATS systems</li>
                        </ul>
                    </div>
                    
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button class="btn btn-outline-primary me-md-2" id="preview-resume-btn">
                            <i class="fas fa-eye me-1"></i>Preview
                        </button>
                        <button class="btn btn-primary" id="download-resume-btn">
                            <i class="fas fa-download me-1"></i>Download Enhanced Resume
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        resumeAnalysis.insertAdjacentHTML('beforeend', previewHtml);
        
        // Add event listeners to the new buttons
        document.getElementById('preview-resume-btn').addEventListener('click', function() {
            previewSection.classList.remove('d-none');
            resumePreviewContent.textContent = resumeText;
        });
        
        document.getElementById('download-resume-btn').addEventListener('click', function() {
            // Trigger the enhance resume function again to download the PDF
            enhanceResume();
        });
    }
    
    // Helper function to show alerts
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        resumeForm.insertAdjacentElement('beforebegin', alertDiv);
        
        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            alertDiv.classList.remove('show');
            setTimeout(function() {
                alertDiv.remove();
            }, 150);
        }, 5000);
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