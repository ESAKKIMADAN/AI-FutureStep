from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('resume-analysis/', views.resume_analysis, name='resume_analysis'),
    path('enhance-resume/', views.enhance_resume, name='enhance_resume'),
    path('interview-prep/', views.interview_prep, name='interview_prep'),
    path('ai/get_interview_questions/', views.get_interview_questions, name='get_interview_questions'),
    path('job-finder/', views.job_finder, name='job_finder'),
] 