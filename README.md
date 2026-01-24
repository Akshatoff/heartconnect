# HeartConnect

**Inclusive Dating Platform for People with Disabilities**

HeartConnect is a purpose-built dating and companionship platform designed for individuals with disabilities, including but not limited to visual impairment, hearing impairment, mobility challenges, and neurodivergent conditions. The platform prioritizes accessibility, dignity, safety, and meaningful human connection.

This document serves as a **complete functional and technical overview** of HeartConnect, covering product features, accessibility considerations, system architecture, and implementation details using **Next.js** and **Supabase**.

---

## 1. Vision & Core Principles

### 1.1 Vision

To create a safe, inclusive, and accessible digital space where people with disabilities can form genuine romantic and emotional connections without stigma or technical barriers.

### 1.2 Core Principles

* **Accessibility-first design** (not an afterthought)
* **Privacy and safety by default**
* **Low cognitive and sensory load**
* **Respectful matchmaking, not gamification**
* **Assistive-technology compatibility**

---

## 2. Target User Groups

* Visually impaired users (screen readers, voice navigation)
* Hearing impaired users (text-first, captions)
* Users with mobility impairments (keyboard-only navigation)
* Neurodivergent users (clear UI, minimal animations)
* Caregiver-assisted users

---

## 3. Feature Overview

### 3.1 User Authentication & Accounts

* Email + password authentication
* Magic link / OTP login (accessibility-friendly)
* OAuth (Google) – optional
* Role-based accounts:

  * User
  * Moderator
  * Admin

**Supabase Auth** is used for secure authentication.

---

### 3.2 User Profile System

#### Profile Fields

* Name / Nickname
* Age
* Gender identity
* Sexual orientation
* Location (city-level, optional)
* Disability type(s) (optional & private by default)
* Bio (long-form, voice-supported)
* Interests & values
* Relationship goals

#### Accessibility Enhancements

* Voice-to-text bio creation
* Audio profile introduction (optional)
* Screen-reader-optimized form labels
* Simple language mode

---

### 3.3 Accessibility-First UI Features

#### Visual Impairment Support

* Full screen-reader compatibility (ARIA labels)
* Keyboard-only navigation
* High-contrast mode
* Large text mode
* Optional audio navigation prompts

#### Hearing Impairment Support

* Text-first communication
* Captions for audio/video
* No sound-only notifications

#### Cognitive & Neurodivergent Support

* Minimal animations
* Predictable layouts
* Clear error messages
* Optional "focus mode" UI

---

### 3.4 Match Discovery & Search

* Preference-based discovery (not swipe-heavy)
* Filters:

  * Age range
  * Location
  * Interests
  * Relationship intent
* Compatibility signals based on shared values

**No infinite swipe loops** to avoid addictive design.

---

### 3.5 Messaging System

* Real-time 1:1 chat
* Text messages
* Voice messages (with transcription)
* Optional read receipts
* Message moderation & reporting

**Supabase Realtime** is used for chat updates.

---

### 3.6 Safety & Trust Features

* Profile verification (email + optional ID)
* Report & block users
* AI-assisted moderation (future scope)
* Human moderation dashboard
* No public profile indexing

---

### 3.7 Privacy Controls

* Control profile visibility
* Hide disability information
* Anonymous browsing mode
* Data export & deletion (GDPR-style)

---

### 3.8 Notifications

* Email notifications
* In-app notifications
* Accessible notification preferences

---

## 4. Tech Stack

### 4.1 Frontend

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (accessible defaults)
* **State Management:** React Context / Server Components
* **Accessibility:**

  * ARIA roles
  * Semantic HTML
  * WCAG 2.1 compliance

---

### 4.2 Backend (Supabase)

* Authentication: Supabase Auth
* Database: PostgreSQL
* Realtime: Supabase Realtime
* Storage: Supabase Storage (profile images, audio)
* Edge Functions (future use)

---

## 5. Database Schema (High-Level)

### 5.1 Users Table

```sql
users
- id (uuid, primary key)
- email
- created_at
```

### 5.2 Profiles Table

```sql
profiles
- id (uuid, fk -> users.id)
- name
- age
- gender
- orientation
- location
- bio
- disability_info (jsonb)
- preferences (jsonb)
```

### 5.3 Matches Table

```sql
matches
- id
- user_a
- user_b
- status
- created_at
```

### 5.4 Messages Table

```sql
messages
- id
- sender_id
- receiver_id
- content
- type (text/voice)
- created_at
```

---

## 6. System Architecture

```
Browser (Accessible UI)
   ↓
Next.js Server Components
   ↓
Supabase Auth & Database
   ↓
Supabase Realtime / Storage
```

---

## 7. Security Considerations

* Row Level Security (RLS) enabled
* User-specific data access policies
* Rate limiting on messages
* Encrypted storage for sensitive data

---

## 8. Future Roadmap

* AI-powered compatibility insights
* Audio-first navigation mode
* Community discussion spaces
* Video calling with accessibility features
* Mobile app (React Native)

---

## 9. Compliance & Standards

* WCAG 2.1 AA compliance target
* GDPR-style data rights
* Inclusive language standards

---

## 10. Summary

HeartConnect is not just another dating platform—it is an **accessibility-driven relationship ecosystem** designed with empathy, ethics, and inclusivity at its core. Using Next.js and Supabase enables a scalable, secure, and real-time experience while maintaining strong accessibility guarantees.

---

**Project Name:** HeartConnect
**Tech Stack:** Next.js + Supabase
**Focus:** Inclusive, accessible dating for people with disabilities
