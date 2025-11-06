Zwickly 🚀

Engagement Award Winner at LNDC 2025 (Zwickau)

Zwickly is a full-stack university engagement platform designed to enhance the student experience at German universities through real-time information, interactive features, and smart automation. It includes Student, Admin, and Chatbot portals, along with a mobile app built by a teammate. The platform gamifies student engagement and centralizes important campus information in one place.


---

🏆 Features

Student Portal

Timetable Overview – Real-time class schedules scraped from the university website.

Mensa Menu – Live canteen data scraped from the university website.

Transport Updates – Next tram and other public transport info using VMS database.

Campus Events – Trending events categorized by music, career, and other types. Students can register for events.

Campus News – Latest news from university websites.

Exams Overview – Display upcoming exams.

German Word of the Day – Learn German vocabulary with meanings.

MySpace Feature – Students can submit event requests to admins for approval.


Admin Portal

Analytics Dashboard – View total users, likes, “Prosts,” active events, and more.

Event Management – Approve student-submitted events or create new events manually.

User Management – Monitor and manage registered users.


Chatbot Portal

Connected to Database – Provides answers about events, timetables, menus, and more.

GROQ API Integration – Chatbot functions integrated via Supabase Edge Functions.


Engagement Feature – Prost Detector

RCNN + OpenCV Integration – Users can upload a photo with a beverage (bottle or mug).

Gamification – If the model detects a beverage, it increases the post count.

Community Focus – Encourages social engagement among students.



---

⚙️ Tech Stack

Frontend

Lovable – Low-code platform for frontend development

React.js – Component-based UI framework

Tailwind CSS – Responsive styling

JavaScript / HTML / CSS – Core frontend technologies

Axios / Fetch API – For real-time API communication


Backend

Supabase – Backend-as-a-service platform

PostgreSQL – Database for all application data

Supabase Auth – Authentication and role-based access (students/admins)

Supabase Edge Functions – Server-side logic and chatbot integration


SQL / Supabase Query Language – For database operations


APIs & Integrations

Web Scraping – Timetable, Mensa menu, events, and news

VMS Database API – Real-time public transport info

GROQ API – Chatbot integration

RCNN + OpenCV – Prost Detector for beverage detection



---
