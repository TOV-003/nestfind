# NestFind - Real Estate Listing Platform

NestFind is a centralized real estate application designed to bridge the gap between property hosts and prospective tenants. By leveraging a modern, decoupled architecture, the platform facilitates efficient property discovery, secure user interactions, and robust media management. The application focuses on a seamless user experience through real-time state management and a secure, role-based backend infrastructure.

## 🧠 Architecture and Core Concepts

The system operates on a client-server paradigm where the frontend acts as the primary interface, while Supabase provides the persistent database layer and authentication services.

### Authentication and Authorization

NestFind utilizes Supabase Auth to manage identity. The system distinguishes between 'User' and 'Host' personas. Role-based access ensures that only authenticated hosts can manage listings, while standard users have access to property browsing and enquiry tools.

### Data Persistence and Management

The application employs a relational database structure designed to maintain integrity across users, properties, and interactions.

#### Database Schema Overview

* **`profiles`**: Acts as an extension of the Supabase `auth.users` system, holding localized user data such as contact information, roles, and references to profile media stored in Cloudinary.
* **`listings`**: The central entity of the platform. It maintains comprehensive property attributes and employs a soft-delete mechanism (`deleted_at`) to ensure data recovery and facilitate asynchronous cleanup of associated media assets.
* **`enquiries`**: Establishes a link between users and listings, creating an audit trail for communication requests initiated by tenants.

### Media Orchestration

To maintain frontend performance, NestFind delegates media handling to Cloudinary. This integration offloads the heavy lifting of image transformation and delivery to a Content Delivery Network (CDN). The frontend handles initial uploads, while the backend database stores only the resulting image URLs, keeping the database footprint lightweight.

## 🛠️ Technical Design Decisions

* **Frontend**: Built with React, utilizing React Router for navigation and Tailwind CSS for utility-first styling. The UI state is governed by a custom `AuthContext` provider, which orchestrates global user state and protected routing.
* **Database/Backend**: Supabase provides the PostgreSQL backbone. The use of Edge Functions allows for server-side operations (such as secure user deletion) that require higher privilege than standard client-side requests.
* **Scalability**: By utilizing CDNs for images and offloading authentication to a managed provider, the platform is designed to scale horizontally without the need for managing complex server infrastructure.
* **Asynchronous Processing**: The platform implements decoupled workflows—such as media cleanup tasks—to keep the user interface responsive. This ensures that potentially long-running operations do not block the user's primary interactions.