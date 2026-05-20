Lawyers Multivendor SaaS Platform
A comprehensive SaaS platform designed for law firms and independent lawyers to manage their cases, employees, and billing. The platform supports a multi-tenant architecture where a Super Admin oversees the entire system, while individual law firms (tenants) manage their own operations.

Key Features
Super Admin (Central Platform)
Manage and monitor all law firms (tenants) on the platform.

Manage subscription plans and billing cycles.

Oversee system-wide activity and reports.

Law Firm / Lawyer (Tenant)
Case Management: Manage legal cases and documents efficiently.

Employee Management: Manage staff roles and attendance.

Attendance & Reports: Track daily work and generate professional reports.

Dashboard: Personalized workspace for each law firm.

Technical Stack
Frontend: Next.js (React)

Styling: Tailwind CSS

API Communication: Axios

State Management: Zustand

Getting Started
Clone the repository:
git clone https://github.com/dina-abaza/lawyers-multivendor.git
cd lawyers-multivendor

Install dependencies:
npm install

Environment Variables:
Create a .env.local file in the root directory and add your backend API URL:
NEXT_PUBLIC_API_URL=your_backend_api_url_here

Run the development server:
npm run dev

Contribution
Fork the repository.

Create a new branch for your feature.

Submit a Pull Request for review.
