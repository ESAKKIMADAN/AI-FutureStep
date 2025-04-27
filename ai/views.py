from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO
import tempfile
import re
import random

# Create your views here.

def index(request):
    if request.user.is_authenticated:
        return redirect('home')
    return render(request, 'index.html')

@login_required(login_url='login')
def home(request):
    return render(request, 'home.html')

@login_required
def about(request):
    return render(request, 'about.html')

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Registration successful! Please log in.')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('index')

@login_required
def resume_analysis(request):
    return render(request, 'resume_analysis.html')

@login_required
def interview_prep(request):
    return render(request, 'interview_prep.html')

@login_required
@csrf_exempt
def enhance_resume(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from request body
            data = json.loads(request.body)
            resume_text = data.get('resume_text', '')
            enhancements = data.get('enhancements', {})
            
            print(f"Received resume text: {len(resume_text)} characters")
            print(f"Enhancement options: {enhancements}")
            
            # Validate input
            if not resume_text:
                return JsonResponse({'error': 'No resume text provided'}, status=400)
            
            # Here you would typically call your AI service to enhance the resume
            # For now, we'll simulate the enhancement
            enhanced_text = simulate_ai_enhancement(resume_text, enhancements)
            
            # Generate PDF
            try:
                pdf_buffer = generate_enhanced_pdf(enhanced_text)
            except Exception as e:
                print(f"Error generating PDF: {e}")
                return JsonResponse({'error': f'Error generating PDF: {str(e)}'}, status=500)
            
            # Create response
            response = FileResponse(pdf_buffer, as_attachment=True, filename='enhanced_resume.pdf')
            response['Content-Type'] = 'application/pdf'
            return response
            
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            print(f"Error in enhance_resume: {e}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def parse_resume(text):
    """
    Parse the resume text into structured fields: name, contact, skills, experience, education, etc.
    This is a simple heuristic parser for demonstration.
    """
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    data = {
        'name': '',
        'job_title': '',
        'contact': [],
        'skills': [],
        'languages': [],
        'objective': '',
        'experience': [],
        'education': [],
    }
    section = None
    buffer = []
    for i, line in enumerate(lines):
        # Name and job title (first two lines)
        if i == 0:
            data['name'] = line
            continue
        if i == 1:
            data['job_title'] = line
            continue
        # Contact info (next lines until a section header)
        if section is None and not re.match(r'^[A-Z ]{4,}$', line):
            data['contact'].append(line)
            continue
        # Section headers
        if re.match(r'^[A-Z ]{4,}$', line):
            if section and buffer:
                if section == 'SKILLS':
                    data['skills'] = ', '.join(buffer).replace('•', '').split(',')
                elif section == 'LANGUAGES':
                    data['languages'] = ', '.join(buffer).replace('•', '').split(',')
                elif section == 'OBJECTIVE':
                    data['objective'] = ' '.join(buffer)
                elif section in ['EXPERIENCE', 'WORK EXPERIENCE']:
                    data['experience'].extend(buffer)
                elif section == 'EDUCATION':
                    data['education'].extend(buffer)
            section = line.strip()
            buffer = []
        else:
            buffer.append(line)
    # Add last section
    if section and buffer:
        if section == 'SKILLS':
            data['skills'] = ', '.join(buffer).replace('•', '').split(',')
        elif section == 'LANGUAGES':
            data['languages'] = ', '.join(buffer).replace('•', '').split(',')
        elif section == 'OBJECTIVE':
            data['objective'] = ' '.join(buffer)
        elif section in ['EXPERIENCE', 'WORK EXPERIENCE']:
            data['experience'].extend(buffer)
        elif section == 'EDUCATION':
            data['education'].extend(buffer)
    return data

def enhance_section(text, enhancements):
    """Apply AI enhancement logic to a section of text."""
    if enhancements.get('content_quality'):
        text = text.replace('managed', 'orchestrated')
        text = text.replace('helped', 'facilitated')
        text = text.replace('made', 'developed')
        text = text.replace('did', 'executed')
    if enhancements.get('keywords') and 'Key Skills:' not in text:
        text += "\nKey Skills: Leadership, Project Management, Strategic Planning, Team Collaboration, Data Analysis, Problem Solving"
    return text

def simulate_ai_enhancement(text, enhancements):
    print("Simulating AI enhancement (structured)")
    data = parse_resume(text)
    # Enhance each section
    data['name'] = enhance_section(data['name'], enhancements)
    data['job_title'] = enhance_section(data['job_title'], enhancements)
    data['contact'] = [enhance_section(c, enhancements) for c in data['contact']]
    data['skills'] = [enhance_section(s, enhancements) for s in data['skills']]
    data['languages'] = [enhance_section(l, enhancements) for l in data['languages']]
    data['objective'] = enhance_section(data['objective'], enhancements)
    data['experience'] = [enhance_section(e, enhancements) for e in data['experience']]
    data['education'] = [enhance_section(e, enhancements) for e in data['education']]
    # Rebuild the resume in the modern format
    sections = []
    if data['name']:
        sections.append(data['name'])
    if data['job_title']:
        sections.append(data['job_title'])
    if data['contact']:
        sections.extend(data['contact'])
    if data['skills']:
        sections.append('SKILLS')
        sections.append(', '.join(data['skills']))
    if data['languages']:
        sections.append('LANGUAGES')
        sections.append(', '.join(data['languages']))
    if data['objective']:
        sections.append('OBJECTIVE')
        sections.append(data['objective'])
    if data['experience']:
        sections.append('EXPERIENCE')
        sections.extend(data['experience'])
    if data['education']:
        sections.append('EDUCATION')
        sections.extend(data['education'])
    return '\n\n'.join(sections)

def generate_enhanced_pdf(text):
    print("Generating PDF")
    try:
        from reportlab.platypus import Table, TableStyle, HRFlowable, Spacer, Paragraph, Image, KeepTogether
        from reportlab.lib.units import inch
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
        styles = getSampleStyleSheet()

        # Helper to add style only if not present
        def safe_add_style(stylesheet, style):
            if style.name not in stylesheet.byName:
                stylesheet.add(style)

        # Modern styles
        safe_add_style(styles, ParagraphStyle(
            name='NameTitle', fontSize=28, leading=32, spaceAfter=2, textColor=colors.HexColor('#222'), alignment=0, fontName='Helvetica-Bold'))
        safe_add_style(styles, ParagraphStyle(
            name='JobTitle', fontSize=13, leading=16, spaceAfter=10, textColor=colors.HexColor('#444'), alignment=0, fontName='Helvetica'))
        safe_add_style(styles, ParagraphStyle(
            name='SectionHeader', fontSize=11, leading=14, spaceBefore=12, spaceAfter=4, textColor=colors.HexColor('#1a237e'), alignment=0, fontName='Helvetica-Bold', tracking=1.5, caseChange='uppercase'))
        safe_add_style(styles, ParagraphStyle(
            name='SubHeader', fontSize=10, leading=13, textColor=colors.HexColor('#333'), fontName='Helvetica-Bold', spaceAfter=2))
        safe_add_style(styles, ParagraphStyle(
            name='Normal', parent=styles['Normal'], fontSize=10, leading=13, spaceAfter=4, textColor=colors.HexColor('#222'), fontName='Helvetica'))
        safe_add_style(styles, ParagraphStyle(
            name='Bullet', parent=styles['Normal'], fontSize=10, leftIndent=12, bulletIndent=2, spaceBefore=0, spaceAfter=0, bulletFontName='Helvetica-Bold', bulletFontSize=10, textColor=colors.HexColor('#222')))
        safe_add_style(styles, ParagraphStyle(
            name='Contact', fontSize=9, leading=12, textColor=colors.HexColor('#555'), fontName='Helvetica', leftIndent=0, spaceAfter=2))
        safe_add_style(styles, ParagraphStyle(
            name='Small', fontSize=8, leading=10, textColor=colors.HexColor('#888'), fontName='Helvetica', leftIndent=0, spaceAfter=1))

        # Parse the text into logical sections
        sections = text.split('\n\n')
        name = ''
        job_title = ''
        contact_lines = []
        left_blocks = []
        right_blocks = []
        current_section = None
        section_map = {}

        # Try to extract name, job title, and contact info from the first lines
        if len(sections) > 0:
            lines = sections[0].split('\n')
            if len(lines) > 0:
                name = lines[0].strip()
            if len(lines) > 1:
                job_title = lines[1].strip()
            # Contact info (next 3-6 lines)
            for l in lines[2:8]:
                if l.strip():
                    contact_lines.append(l.strip())
            # Remove these from the first section
            sections[0] = '\n'.join(lines[8:]) if len(lines) > 8 else ''

        # Organize sections
        for section in sections:
            if not section.strip():
                continue
            # Section headers: all uppercase and not too long
            if section.isupper() and len(section) < 40:
                current_section = section.strip()
                section_map[current_section] = []
            elif current_section:
                section_map[current_section].append(section.strip())

        # Left column: Contact, Skills, Languages, etc.
        left_col_order = ['CONTACT', 'SKILLS', 'LANGUAGES']
        for sec in left_col_order:
            if sec == 'CONTACT' and contact_lines:
                left_blocks.append(Paragraph('CONTACT', styles['SectionHeader']))
                for line in contact_lines:
                    left_blocks.append(Paragraph(line, styles['Contact']))
                left_blocks.append(Spacer(1, 8))
            elif sec in section_map:
                left_blocks.append(Paragraph(sec, styles['SectionHeader']))
                for para in section_map[sec]:
                    # Bullet for skills/languages
                    for item in para.split(','):
                        left_blocks.append(Paragraph(f'• {item.strip()}', styles['Bullet']))
                left_blocks.append(Spacer(1, 8))

        # Right column: Objective, Experience, Education, etc.
        right_col_order = ['OBJECTIVE', 'EXPERIENCE', 'WORK EXPERIENCE', 'EDUCATION']
        for sec in right_col_order:
            if sec in section_map:
                right_blocks.append(Paragraph(sec, styles['SectionHeader']))
                for para in section_map[sec]:
                    # Subheaders for job/degree titles
                    if para.isupper() and len(para) < 40:
                        right_blocks.append(Paragraph(para, styles['SubHeader']))
                    # Bullets for experience
                    elif para.startswith('-') or para.startswith('•'):
                        for line in para.split('\n'):
                            if line.strip().startswith('-') or line.strip().startswith('•'):
                                right_blocks.append(Paragraph(f'• {line.strip().lstrip("-• ")}', styles['Bullet']))
                            else:
                                right_blocks.append(Paragraph(line.strip(), styles['Normal']))
                    else:
                        right_blocks.append(Paragraph(para, styles['Normal']))
                right_blocks.append(Spacer(1, 8))

        # Build the story
        story = []
        # Name and job title
        if job_title:
            story.append(Paragraph(job_title, styles['JobTitle']))
        if name:
            story.append(Paragraph(name, styles['NameTitle']))
        story.append(Spacer(1, 8))
        # Optionally, add a placeholder for a profile photo (circle)
        # img = Image('path/to/photo.jpg', width=0.9*inch, height=0.9*inch)
        # img.hAlign = 'RIGHT'
        # story.append(img)
        # Two-column layout
        table = Table([[left_blocks, right_blocks]], colWidths=[2.2*inch, 4.6*inch])
        table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(table)
        doc.build(story)
        buffer.seek(0)
        print(f"PDF generated: {buffer.getbuffer().nbytes} bytes")
        return buffer
    except Exception as e:
        print(f"Error in generate_enhanced_pdf: {e}")
        raise

def improve_content_quality(text):
    # Simulate content quality improvements
    # In a real implementation, this would use AI to enhance the content
    return text + "\n\nContent Quality Improvements:\n- Enhanced clarity and impact of descriptions\n- Improved action verbs\n- Added quantifiable achievements"

def improve_formatting(text):
    # Simulate formatting improvements
    # In a real implementation, this would use AI to improve formatting
    return text + "\n\nFormatting Improvements:\n- Consistent spacing and alignment\n- Improved section organization\n- Enhanced readability"

def optimize_keywords(text):
    # Simulate keyword optimization
    # In a real implementation, this would use AI to optimize keywords
    return text + "\n\nKeyword Optimization:\n- Added industry-specific keywords\n- Improved keyword placement\n- Enhanced keyword relevance"

def ensure_ats_compatibility(text):
    # Simulate ATS compatibility improvements
    # In a real implementation, this would use AI to ensure ATS compatibility
    return text + "\n\nATS Compatibility Improvements:\n- Removed complex formatting\n- Ensured proper section headings\n- Improved keyword matching"

@csrf_exempt
@login_required
def get_interview_questions(request):
    user_profile = getattr(request.user, 'userprofile', None)
    stream = user_profile.stream if user_profile and user_profile.stream else 'General'
    # Example static questions per stream
    questions_by_stream = {
        'Computer Science': [
            'What is a binary search tree and how is it used?',
            'Explain the concept of Big O notation.',
            'Describe a challenging software project you worked on.',
            'How do you ensure code quality in a team?',
            'What is the difference between a process and a thread?'
        ],
        'Data Science': [
            'What is overfitting and how can you prevent it?',
            'Explain the difference between supervised and unsupervised learning.',
            'Describe a machine learning project you have worked on.',
            'How do you handle missing data in a dataset?',
            'What is feature engineering?'
        ],
        'General': [
            'Tell me about yourself.',
            'What are your strengths and weaknesses?',
            'Why do you want this job?',
            'Describe a time you solved a difficult problem.',
            'Where do you see yourself in five years?'
        ]
    }
    questions = questions_by_stream.get(stream, questions_by_stream['General'])
    random.shuffle(questions)
    return JsonResponse({'questions': questions[:5]})

@login_required
def job_finder(request):
    return render(request, 'job_finder.html')
