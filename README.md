# NestFind - Real Estate Listing Platform

NestFind is a React-based real estate application that allows users to browse, list, and manage property listings. It features a robust authentication system, profile management, and image uploads via Cloudinary.

## 🚀 Features

-   **User Authentication**: Secure Sign Up and Login powered by Supabase Auth.
-   **Role-Based Access**: Support for both 'User' and 'Host' roles.
-   **Profile Management**: Users can update their profiles, including profile pictures and contact information.
-   **Image Uploads**: Integrated with Cloudinary for efficient image hosting and management.
-   **Account Deletion**: Secure account deletion via Supabase Edge Functions.
-   **Responsive Design**: Built with Tailwind CSS for a seamless experience across mobile and desktop.

## 🛠️ Tech Stack

-   **Frontend**: React, React Router, Tailwind CSS
-   **Backend/Database**: Supabase (PostgreSQL, Auth, Edge Functions)
-   **Media Storage**: Cloudinary
-   **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following:

-   Node.js installed
-   A Supabase project created
-   A Cloudinary account for image uploads

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
