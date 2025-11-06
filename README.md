# 🏆 Zwickly — University Engagement Platform

> 🥇 **Winner in the Engagement Category (2025)**  
> A full-stack university engagement platform built to unify student life at a German university — from timetable and Mensa menus to events, trams, and AI-powered features.

---

## 🚀 Overview

**Zwickly** is a full-stack platform designed to bring together everything a student needs in one place — **student portal**, **admin dashboard**, and an **AI-enabled chatbot**.

Our goal was to make the **German university experience digital, interactive, and fun** — similar to how social platforms connect people, Zwickly connects students with their campus.

---

## 🧩 Core Features

### 🎓 Student Portal
- 📅 **Real-Time Timetable** — Extracted via scraping APIs from the university website.  
- 🍽️ **Mensa Menu Integration** — Live daily menus from the university dining API.  
- 🚋 **Transport Updates (VMS API)** — Real-time tram schedules to the city center.  
- 📢 **Campus Events** — View, register, and explore trending events by category (Career, Music, Sports, etc.).  
- 📚 **German Word of the Day** — Learn new German words with meanings for cultural integration.  
- 🧾 **Upcoming Exams & Campus News** — Pulled dynamically from university APIs.  
- 🧍‍♂️ **MySpace (Student Requests)** — Students can send event proposals to the admin for approval.

---

### ⚙️ Admin Portal
- 📊 **Comprehensive Analytics Dashboard**  
  - Total users, events, likes, prosts (posts), and engagement metrics.  
  - Data connected to **PostgreSQL backend** via **Supabase**.  
- 🗂️ **Event Management System**  
  - Approve student-requested events.  
  - Create or edit events directly.  
  - Manage campus data and analytics with ease.

---

### 🤖 Chatbot Portal
- 💬 **AI-Driven Chatbot** connected to the entire university dataset.  
- ⚙️ Powered by **GROQ API** and **Supabase Edge Functions**.  
- 🧠 Handles queries about timetables, Mensa, events, trams, and more — providing a smooth conversational experience for students.

---

### 🧠 AI Integration — RCNN Prost Detector
- 🥤 Users can upload an image of themselves with a beverage (bottle/mug).  
- 🔍 Our **RCNN model (via OpenCV)** detects the beverage.  
- 👍 If detected, it automatically increments the “prost” (cheers) count.  
- 🎯 Purpose: To encourage social engagement and sustainable habits through gamification.

---

## 🏗️ Tech Stack

### 💻 Frontend
- **Lovable (React-based)**  
- **JavaScript / TypeScript**
- **HTML / TailwindCSS**
- **Supabase Edge Functions (for chatbot & event integrations)**  

### 🗄️ Backend
- **Supabase** (for Authentication, APIs, and PostgreSQL Database)
- **PostgreSQL** (Database schema and analytics storage)
- **OpenCV + RCNN** (Prost detection system)
- **Python (OpenCV / RCNN Model Integration)**
- **GROQ API** (for chatbot intelligence)
- **VMS Transport API** (Real-time tram data)
- **Custom scraping APIs** (for timetable, Mensa, and event data)

---

## 🧑‍💻 My Contributions (Dhruvkumar Bhavinbhai Patel)

- 🧩 Designed and implemented **database schema** in **PostgreSQL**.  
- 🔌 Integrated the **backend with Supabase** for authentication and data handling.  
- 🧠 Implemented **R-CNN model integration** with **OpenCV** for prost detection.  
- 💬 Developed **chatbot functions** and integrated **GROQ API** using **Supabase edge functions**.  
- 🖥️ Contributed to **frontend development** (Lovable framework).  
- 📊 Created the **complete analytics dashboard** and connected it with the backend.  

---

## 📱 Mobile App

One of our teammates also developed a **Zwickly mobile app** that syncs with the web version, bringing the same engagement features to smartphones.

---

## 🧩 Architecture Overview

