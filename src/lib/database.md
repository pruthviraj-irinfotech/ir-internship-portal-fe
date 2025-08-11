# Database Design: IR Intern Portal

This document outlines the database schema for the IR Intern Portal application. The schema is designed to be normalized and scalable, supporting all current and planned features.

## Tables

1.  [**`users`**](#1-users-table)
2.  [**`internships`**](#2-internships-table)
3.  [**`applications`**](#3-applications-table)
4.  [**`documents`**](#4-documents-table)
5.  [**`certificates`**](#5-certificates-table)

---

### 1. `users` Table

Stores information about all registered users, including regular users (interns/applicants) and administrators.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `first_name` | `VARCHAR(255)` | Not Null |
| `last_name` | `VARCHAR(255)` | Nullable |
| `email` | `VARCHAR(255)` | Not Null, **Unique** |
| `password_hash` | `VARCHAR(255)` | Not Null, stores the hashed password |
| `phone` | `VARCHAR(20)` | Not Null |
| `country_code` | `VARCHAR(5)` | Not Null |
| `avatar_url` | `VARCHAR(255)` | URL to the user's profile picture |
| `qualification` | `VARCHAR(255)` | Not Null, highest qualification |
| `current_status`| `ENUM('student', 'graduate', 'professional')` | Not Null |
| `org_name` | `VARCHAR(255)` | Not Null, name of organization or institute |
| `org_city` | `VARCHAR(255)` | Not Null |
| `org_state` | `VARCHAR(255)` | Not Null |
| `org_country` | `VARCHAR(255)` | Not Null |
| `role` | `ENUM('user', 'admin')` | Not Null, Default: `'user'` |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` on update |

---

### 2. `internships` Table

Stores all the internship listings posted by administrators.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `title` | `VARCHAR(255)` | Not Null |
| `company` | `VARCHAR(255)` | Not Null |
| `location` | `VARCHAR(255)` | Not Null, e.g., 'Remote', 'New York' |
| `duration` | `VARCHAR(100)` | Not Null, e.g., '3 Months' |
| `category` | `ENUM('Paid', 'Free', 'Stipend')` | Not Null |
| `amount` | `DECIMAL(10, 2)` | Nullable, used if category is 'Paid' or 'Stipend'|
| `is_monthly` | `BOOLEAN` | Default: `false` |
| `posted_date` | `DATE` | Not Null |
| `is_active` | `BOOLEAN` | Default: `true`. Toggled by admin to show/hide listing. |
| `description` | `TEXT` | HTML content for the short description |
| `detailed_description` | `TEXT` | HTML content for the detailed role description |
| `selection_process` | `TEXT` | HTML content |
| `perks_and_benefits` | `TEXT` | HTML content |
| `who_can_apply` | `TEXT` | HTML content |
| `announcements` | `TEXT` | Nullable, HTML content for important updates |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` on update |

---

### 3. `applications` Table

This is the central table linking users to internships they've applied for. It tracks the entire lifecycle of an application.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `application_number`| `VARCHAR(255)` | Not Null, **Unique**, e.g., 'IRAPPL0001' |
| `internship_id` | `INT` | **Foreign Key** -> `internships(id)` |
| `user_id` | `INT` | **Foreign Key** -> `users(id)` |
| `application_date`| `DATE` | Not Null |
| `status` | `ENUM('In Review', 'Rejected', 'Shortlisted', 'Interview Scheduled', 'Completed', 'Withdrawn', 'Ongoing', 'Terminated')` | Not Null |
| `resume_url` | `VARCHAR(255)` | Not Null, URL to the stored PDF resume |
| `why_apply` | `TEXT` | Not Null, applicant's cover letter/statement |
| `alt_email` | `VARCHAR(255)` | Nullable |
| `alt_phone` | `VARCHAR(20)` | Nullable |
| `interview_date` | `DATE` | Nullable |
| `interview_time` | `VARCHAR(20)` | Nullable |
| `interview_instructions`| `TEXT` | Nullable, HTML content |
| `comments` | `TEXT` | Nullable, admin comments (e.g., reason for termination) |
| `company_intern_id`| `VARCHAR(255)` | Nullable, a company-specific ID assigned to the intern |
| `end_date` | `DATE` | Nullable, actual end date of the internship |
| `reporting_to` | `VARCHAR(255)` | Nullable, name of the intern's manager |
| `work_email` | `VARCHAR(255)` | Nullable, company-provided email for the intern |
| `drive_link` | `VARCHAR(255)` | Nullable, link to archived documents for completed interns |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` on update |

---

### 4. `documents` Table

Stores documents uploaded by admins or users related to a specific ongoing internship application.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `application_id` | `INT` | **Foreign Key** -> `applications(id)` |
| `uploaded_by_id` | `INT` | **Foreign Key** -> `users(id)`. Tracks who uploaded the file. |
| `name` | `VARCHAR(255)` | Not Null, original file name |
| `url` | `VARCHAR(255)` | Not Null, URL to the stored file |
| `uploaded_at` | `DATETIME` | Not Null, Default: `CURRENT_TIMESTAMP` |
| `size_bytes` | `INT` | File size in bytes |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` on update |

---

### 5. `certificates` Table

Stores details of all internship certificates that have been issued by an admin.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `certificate_number`| `VARCHAR(255)` | Not Null, **Unique**, e.g., 'INT24-001' |
| `application_id` | `INT` | **Foreign Key** -> `applications(id)` |
| `start_date` | `DATE` | Not Null, internship start date |
| `issue_date` | `DATE` | Not Null, date certificate was issued |
| `description` | `TEXT` | HTML content for the certificate body |
| `image_url` | `VARCHAR(255)` | Not Null, URL to the PNG image of the certificate |
| `pdf_url` | `VARCHAR(255)` | Not Null, URL to the PDF version |
| `uploaded_by_id`| `INT` | **Foreign Key** -> `users(id)` where `role`='admin' |
| `status` | `ENUM('Active', 'On Hold', 'Terminated')` | Not Null, Default: `'Active'` |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` on update |
