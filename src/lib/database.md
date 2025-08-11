# Database Design: IR Intern Portal (Advanced & Scalable)

This document outlines an advanced, normalized database schema for the IR Intern Portal application, designed for high scalability and maintainability to support a growing business. The schema breaks down entities into multiple, related tables to ensure data integrity and flexibility.

## Schema Diagram (Conceptual)

```
[users] 1--1 [user_profiles]
   |
   +--* [user_education]
   |
   | (FK: uploaded_by_id)
   +--* [documents]
   |
   | (FK: uploaded_by_id)
   +--* [certificates]

[internships] 1--* [applications]
   |
   +--* [internship_skills]

[applications] *--1 [users]
   |
   +--1 [application_status_history] (optional for full audit)
   |
   +--* [documents]

[skills] 1--* [internship_skills]
```

---

## Core Tables

### 1. User & Authentication

#### `users` Table
Stores the core authentication and identity information for every user.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `email` | `VARCHAR(255)` | Not Null, **Unique** |
| `password_hash` | `VARCHAR(255)` | Not Null, stores the hashed password |
| `role` | `ENUM('user', 'admin')` | Not Null, Default: `'user'`. For simple role management. |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` on update |

#### `user_profiles` Table
Stores personal details related to a user, separate from their login credentials.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `user_id` | `INT` | **Foreign Key** -> `users(id)`, **Unique** (1-to-1 relationship) |
| `first_name` | `VARCHAR(255)` | Not Null |
| `last_name` | `VARCHAR(255)` | Nullable |
| `phone` | `VARCHAR(20)` | Not Null |
| `country_code` | `VARCHAR(5)` | Not Null |
| `avatar_url` | `VARCHAR(255)` | URL to the user's profile picture |

#### `user_education_details` Table
Stores the educational and professional background of a user. A user can have multiple entries.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `user_id` | `INT` | **Foreign Key** -> `users(id)` |
| `qualification` | `VARCHAR(255)` | Not Null, e.g., 'B.Tech in Computer Science' |
| `current_status`| `ENUM('student', 'graduate', 'professional')` | Not Null |
| `org_name` | `VARCHAR(255)` | Not Null, name of organization or institute |
| `org_city` | `VARCHAR(255)` | Not Null |
| `org_state` | `VARCHAR(255)` | Not Null |
| `org_country` | `VARCHAR(255)` | Not Null |
| `is_current` | `BOOLEAN` | Default: `true`. Indicates if this is the user's primary/current status. |

---

### 2. Internships

#### `internships` Table
Stores all the internship listings.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `title` | `VARCHAR(255)` | Not Null |
| `company` | `VARCHAR(255)` | Not Null |
| `location` | `VARCHAR(255)` | Not Null |
| `duration` | `VARCHAR(100)` | Not Null |
| `category` | `ENUM('Paid', 'Free', 'Stipend')` | Not Null |
| `amount` | `DECIMAL(10, 2)` | Nullable |
| `is_monthly` | `BOOLEAN` | Default: `false` |
| `posted_date` | `DATE` | Not Null |
| `is_active` | `BOOLEAN` | Default: `true` |
| `description` | `TEXT` | Short description (HTML) |
| `detailed_description` | `TEXT` | Detailed description (HTML) |
| `selection_process` | `TEXT` | HTML content |
| `perks_and_benefits` | `TEXT` | HTML content |
| `who_can_apply` | `TEXT` | HTML content |
| `announcements` | `TEXT` | Nullable, HTML content |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` on update |

---

### 3. Applications & Documents

#### `applications` Table
The central table linking users to internships, tracking the application process.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `application_number`| `VARCHAR(255)` | Not Null, **Unique**, e.g., 'IRAPPL0001' |
| `internship_id` | `INT` | **Foreign Key** -> `internships(id)` |
| `user_id` | `INT` | **Foreign Key** -> `users(id)` |
| `application_date`| `DATE` | Not Null |
| `status` | `ENUM('In Review', 'Rejected', 'Shortlisted', 'Interview Scheduled', 'Completed', 'Withdrawn', 'Ongoing', 'Terminated')` | Not Null |
| `resume_url` | `VARCHAR(255)` | Not Null |
| `why_apply` | `TEXT` | Not Null |
| `alt_email` | `VARCHAR(255)` | Nullable |
| `alt_phone` | `VARCHAR(20)` | Nullable |
| `interview_date` | `DATETIME` | Nullable (stores both date and time) |
| `interview_instructions`| `TEXT` | Nullable, HTML content |
| `admin_comments` | `TEXT` | Nullable, admin notes (e.g., reason for termination) |
| `company_intern_id`| `VARCHAR(255)` | Nullable, company-specific ID for the intern |
| `internship_end_date` | `DATE` | Nullable, actual end date |
| `reporting_to` | `VARCHAR(255)` | Nullable |
| `work_email` | `VARCHAR(255)` | Nullable |
| `drive_link` | `VARCHAR(255)` | Nullable |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` on update |

#### `documents` Table
Stores documents uploaded for a specific ongoing internship application.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `application_id` | `INT` | **Foreign Key** -> `applications(id)` |
| `uploaded_by_id` | `INT` | **Foreign Key** -> `users(id)` |
| `name` | `VARCHAR(255)` | Not Null |
| `url` | `VARCHAR(255)` | Not Null |
| `uploaded_at` | `DATETIME` | Not Null, Default: `CURRENT_TIMESTAMP` |
| `size_bytes` | `INT` | File size in bytes |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |

---

### 4. Certificates

#### `certificates` Table
Stores details of all issued internship certificates.

| Column | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `INT` | **Primary Key**, Auto-increment |
| `certificate_number`| `VARCHAR(255)` | Not Null, **Unique**, e.g., 'INT24-001' |
| `application_id` | `INT` | **Foreign Key** -> `applications(id)` |
| `start_date` | `DATE` | Not Null |
| `issue_date` | `DATE` | Not Null |
| `description` | `TEXT` | HTML content |
| `image_url` | `VARCHAR(255)` | Not Null |
| `pdf_url` | `VARCHAR(255)` | Not Null |
| `uploaded_by_id`| `INT` | **Foreign Key** -> `users(id)` where `role`='admin' |
| `status` | `ENUM('Active', 'On Hold', 'Terminated')` | Not Null, Default: `'Active'` |
| `created_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default: `CURRENT_TIMESTAMP` on update |
