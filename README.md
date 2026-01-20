# PDI Platform - Advanced QR Code & Profile Management System

A comprehensive Next.js application for managing dynamic QR codes, user profiles, and analytics.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local installation or Atlas URI)
*   [Git](https://git-scm.com/)

### 🛠 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/artinidev/QR-CODE-PROJECT.git
    cd QR-CODE-PROJECT
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

### ⚙️ Environment Configuration

1.  Copy the example environment file:
    ```bash
    cp .env.example .env.local
    ```

2.  Open `.env.local` and configure your settings:

    *   **MONGODB_URI**: Connection string for your MongoDB database.
    *   **JWT_SECRET**: Random string used to sign session tokens.
    *   **SMTP Settings**: needed for sending email invitations.
        *   For **Development**: The app is pre-configured to log emails to the console or use Ethereal (dummy email service).
        *   For **Production**: Add your Gmail/SendGrid credentials.

### 🏃‍♂️ Running the Application

1.  **Start the development server**
    ```bash
    npm run dev
    ```

2.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Setup (Important)

To access the dashboard, you need a Super Admin account.

1.  **Run the Admin Creation Script**:
    ```bash
    npx tsx src/scripts/create-admin.ts
    ```
    This will create a default admin user:
    *   **Email**: `admin@pdi.com`
    *   **Password**: `admin123`

2.  Log in at `/auth/login` with these credentials.
3.  **Security Tip**: Change this password immediately after logging in via the Settings page.

---

## ✨ Key Features

### 1. User Management
*   **Invite Users**: Send email invitations with secure magic links or pre-set credentials.
*   **Role Based Access**: Admins can manage user limits (QR codes, profiles).
*   **Real-time status**: Track user activation status (Active/Pending/Suspended).

### 2. QR Studio
*   **Dynamic QR Codes**: Create QR codes that can suffer content updates without changing the printed code.
*   **Customization**: Change colors, patterns, and add logos.
*   **Download Formats**: SVG, PNG, PDF.

### 3. Analytics & Contacts
*   **Scan Tracking**: Monitor where and when QR codes are scanned.
*   **Contact Management**: Collect and manage leads from public profiles.

---

## 🤝 Collaborators

*   **Project Lead**: Ayoub Designs
*   **Developer**: [Access Granted via GitHub]

For access issues, please contact the repository owner.
