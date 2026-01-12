# 🎵 Music Streaming Web Application

## Project Overview
This project is developed as part of the **IIT Madras BS Degree Program** under the course  
**Modern Application Development – II (MAD2)**.

The **Music Streaming Web Application** is a multi-user web platform that enables users to stream music, read lyrics, create playlists, and interact with music content. The system supports role-based access control with distinct capabilities for general users, content creators, and administrators.

The project demonstrates the practical application of full-stack web development concepts, database modeling, authentication, authorization, and asynchronous task processing.


## User Roles

### General User
- Stream songs
- Read song lyrics
- Create and manage personal playlists
- Rate songs and albums
- Flag inappropriate content
- Search songs and albums

### Creator
- All General User capabilities
- Create, update, and delete songs
- Create, update, and delete albums
- View ratings and engagement on uploaded content

### Admin
- Monitor songs, albums, and users
- Manage user accounts
- Moderate flagged content
- View platform statistics


## Key Features

### Song & Album Management
- Creators can perform full CRUD operations on songs and albums
- Songs include metadata such as title, artist, lyrics, and duration

### Playlist Management
- Users can create, update, and delete playlists
- Songs can be added or removed from playlists

### Rating & Flagging System
- Songs and albums can be rated by users
- Inappropriate content can be flagged for admin review

### Search Functionality
- Search songs and albums by name or genre
- Available to all user roles

### Content Moderation (Admin)
- Admins can review and remove flagged content

### Platform Statistics (Admin)
- Total number of users, songs, and albums
- Top 5 songs and albums based on ratings


## Scheduled & Asynchronous Tasks

### Daily Reminder Emails
- A scheduled job runs daily
- Users who have not logged in within the last 24 hours receive reminder emails

### Monthly Creator Activity Report
- Monthly email report sent to creators
- Includes:
  - Number of songs and albums added
  - Ratings received on their content during the previous month


## Technology Stack

### Backend
- **Python**
- **Flask** – Web framework
- **Flask-SQLAlchemy** – ORM for database interaction
- **Flask-Security** – Authentication and authorization
- **Celery** – Asynchronous task processing
- **Redis** – Message broker for Celery

### Frontend
- **HTML**
- **CSS**
- **JavaScript**
- **Vue.js** – Reactive UI components
- **Bootstrap** – Basic styling

### Database
- **SQLite3** – Relational database for development

### Email Testing
- **MailHog** – Used during development to test email notifications safely


## Data Models Overview

### User
- Attributes: Name, Email, Password, Active Status, Last Login
- Stores user profile information and authentication credentials

### Role
- Attributes: Role Name, Description
- Manages role-based access control

### Song
- Attributes: Title, Singer, Lyrics, Duration, Creation Date, Creator ID
- Represents individual music tracks

### Album
- Attributes: Name, Genre, Artist, Creation Date
- Groups songs under a common theme or artist

### Playlist
- Attributes: Title, User ID
- Allows users to curate personalized song collections

These models are connected through well-defined relationships to ensure data integrity, efficient querying, and scalability.

---

