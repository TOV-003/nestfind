# NestFind - Real Estate Listing Platform

NestFind is a React-based real estate application that allows users to browse, list, and manage property listings. It features a robust authentication system, profile management, and image uploads via Cloudinary.

## 🚀 Features

* **User Authentication**: Secure Sign Up and Login powered by Supabase Auth.
* **Role-Based Access**: Support for both 'User' and 'Host' roles.
* **Profile Management**: Users can update their profiles, including profile pictures and contact information.
* **Image Uploads**: Integrated with Cloudinary for efficient image hosting and management.
* **Account Deletion**: Secure account deletion via Supabase Edge Functions.
* **Responsive Design**: Built with Tailwind CSS for a seamless experience across mobile and desktop.

## 🛠️ Tech Stack

* **Frontend**: React, React Router, Tailwind CSS
* **Backend/Database**: Supabase (PostgreSQL, Auth)
* **Media Storage**: Cloudinary
* **Notifications**: React Hot Toast

## 📋 Database Schema

The following tables are required in your Supabase PostgreSQL database to support the application's functionality.

### 1. `profiles`

Stores user-specific data associated with the `auth.users` table.

| Column | Type | Description |
| --- | --- | --- |
| `id` | uuid | Primary Key (references `auth.users.id`) |
| `full_name` | text | User's full name |
| `avatar_url` | text | URL to Cloudinary profile image |
| `role` | text | Role of the user ('User' or 'Host') |
| `phone` | text | Contact phone number |
| `updated_at` | timestamp | Last update time |

### 2. `listings`

Contains information about properties listed on the platform.

| Column | Type | Description |
| --- | --- | --- |
| `id` | uuid | Primary Key |
| `host_id` | uuid | Foreign key (references `profiles.id`) |
| `title` | text | Title of the property |
| `description` | text | Description of the property |
| `price` | numeric | Price per unit |
| `images` | text[] | Array of Cloudinary image URLs |
| `location` | text | Location of the property |
| `beds` | int | Number of bedrooms |
| `baths` | int | Number of bathrooms |
| `sqft` | int | Square footage |
| `is_active` | boolean | Toggle for listing visibility |
| `created_at` | timestamp | Time of creation |
| `deleted_at` | timestamp | Nullable field for soft-delete tracking |

### 3. `enquiries`

Tracks contact requests made by users regarding specific listings.

| Column | Type | Description |
| --- | --- | --- |
| `id` | uuid | Primary Key |
| `listing_id` | uuid | Foreign key (references `listings.id`) |
| `user_id` | uuid | Foreign key (references `profiles.id`) |
| `message` | text | The content of the enquiry |
| `created_at` | timestamp | Time the enquiry was sent |

## 📋 Prerequisites

Before you begin, ensure you have the following:

* Node.js installed
* A Supabase project created
* A Cloudinary account for image uploads

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

```