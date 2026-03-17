# API Endpoints

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

## Public
- `GET /api/public/home`
- `GET /api/public/courses`
- `GET /api/public/courses/:courseId`
- `GET /api/public/categories`
- `GET /api/public/instructors/:instructorId`

## Student
- `GET /api/student/dashboard`
- `GET /api/student/my-courses`
- `GET /api/student/orders`
- `GET /api/student/progress/:courseId`
- `POST /api/student/reviews`

## Instructor
- `POST /api/instructor/apply`
- `GET /api/instructor/dashboard`
- `POST /api/instructor/courses`
- `PUT /api/instructor/courses/:courseId`
- `POST /api/instructor/courses/:courseId/sections`
- `POST /api/instructor/sections/:sectionId/lessons`
- `POST /api/instructor/courses/:courseId/submit`
- `GET /api/instructor/earnings`

## Checkout and payment
- `POST /api/cart/items`
- `POST /api/orders`
- `POST /api/payments/checkout`
- `POST /api/payments/webhook`
- `POST /api/payments/:paymentId/refund`

## Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/instructors/pending`
- `POST /api/admin/instructors/:instructorId/approve`
- `POST /api/admin/instructors/:instructorId/reject`
- `GET /api/admin/courses/pending`
- `POST /api/admin/courses/:courseId/approve`
- `POST /api/admin/courses/:courseId/reject`
- `GET /api/admin/orders`
- `GET /api/admin/payments`
- `GET /api/admin/reports`
