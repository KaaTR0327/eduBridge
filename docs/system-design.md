# System Design

## Product summary
Shine is a multi-instructor online learning marketplace where instructors create video courses, students purchase and consume them, and administrators control platform quality through approval and moderation workflows.

## Roles
### Student
- Register and authenticate
- Browse and filter courses
- Purchase courses
- Watch video lessons
- Track lesson progress and completion
- Leave ratings and reviews
- Manage profile and order history

### Instructor
- Create instructor profile
- Request instructor approval
- Create and edit draft courses
- Add sections and lessons
- Attach hosted video assets
- Submit courses for admin review
- Track students, sales, and earnings

### Admin
- Review instructor applications
- Approve or reject courses
- Manage categories and users
- View orders and payments
- Review reports and top-performing content
- Hide or archive policy-violating content

## Core modules
- Auth and identity
- User and profile management
- Instructor verification
- Course catalog
- Section and lesson management
- Video asset management
- Cart, orders, and checkout
- Payment processing
- Enrollment and access control
- Progress tracking
- Ratings and reviews
- Admin moderation
- Reporting and dashboards

## Course states
- `draft`: being edited by instructor
- `pending_review`: submitted to admin
- `approved`: publicly visible and purchasable
- `rejected`: sent back with revision note
- `archived`: no longer actively marketed

## Recommended stack
### Production-oriented
- Frontend: `Next.js` or `React`
- Backend: `ASP.NET Core Web API` or `NestJS`
- Database: `SQL Server` or `PostgreSQL`
- Cache: `Redis`
- Storage/video: `Mux`, `Bunny Stream`, `Cloudinary`, `S3`
- Payments: `QPay`, `Stripe`, local bank gateway
- Auth: JWT + refresh tokens

### Fast MVP option
- Frontend: `React`
- Backend: `Express`
- Database: `PostgreSQL`
- Admin: dedicated React dashboard

## Permission model
- Only approved instructors can publish submission requests.
- Only admins can change instructor verification status.
- Only approved courses are returned in public catalog APIs.
- Enrollments are created only after a successful payment.
- Students can only access lessons from enrolled courses.

## MVP scope
### Phase 1
- Registration and login
- Role and permission model
- Instructor application flow
- Course/section/lesson CRUD
- Admin course approval
- Public course listing and details

### Phase 2
- Cart and checkout
- Payment integration
- Enrollment creation
- Learning player and progress tracking
- Student dashboard

### Phase 3
- Reviews and ratings
- Instructor earnings and analytics
- Coupons and discounts
- Certificates
- Notifications and reporting improvements

## Non-functional requirements
- Secure video delivery via signed/private playback when possible
- Audit-friendly payment logs
- Rate limiting on public auth endpoints
- File upload validation and malware checks for thumbnails/assets
- Pagination, filtering, and search on public catalog and admin pages
- Event logging for approval/rejection actions

## Deployment notes
- Keep video files off the app server.
- Store secrets in environment variables.
- Use background jobs/webhooks for payment confirmation and video processing.
- Add CDN in front of public assets.
