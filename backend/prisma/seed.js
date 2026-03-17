require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient, Role, VerificationStatus, CourseStatus, OrderStatus, PaymentStatus } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseSection.deleteMany();
  await prisma.course.deleteMany();
  await prisma.instructorProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 10);

  const [webCategory, designCategory, dataCategory] = await Promise.all([
    prisma.category.create({ data: { name: 'Web Development', slug: 'web-development' } }),
    prisma.category.create({ data: { name: 'Design', slug: 'design' } }),
    prisma.category.create({ data: { name: 'Data', slug: 'data' } })
  ]);

  const admin = await prisma.user.create({
    data: {
      fullName: 'Platform Admin',
      email: 'admin@shine.mn',
      passwordHash,
      role: Role.ADMIN
    }
  });

  const instructorOne = await prisma.user.create({
    data: {
      fullName: 'Nomin Erdene',
      email: 'nomin@shine.mn',
      passwordHash,
      role: Role.INSTRUCTOR,
      instructorProfile: {
        create: {
          bio: 'Frontend architect focused on React and UI systems.',
          expertise: 'React, Next.js, Design Systems',
          verificationStatus: VerificationStatus.APPROVED,
          approvedAt: new Date()
        }
      }
    },
    include: { instructorProfile: true }
  });

  const instructorTwo = await prisma.user.create({
    data: {
      fullName: 'Bilguun Purev',
      email: 'bilguun@shine.mn',
      passwordHash,
      role: Role.INSTRUCTOR,
      instructorProfile: {
        create: {
          bio: 'Backend engineer building scalable .NET systems.',
          expertise: 'ASP.NET Core, SQL Server, APIs',
          verificationStatus: VerificationStatus.PENDING
        }
      }
    },
    include: { instructorProfile: true }
  });

  const studentOne = await prisma.user.create({
    data: {
      fullName: 'Ariunaa Bat',
      email: 'ariunaa@shine.mn',
      passwordHash,
      role: Role.STUDENT
    }
  });

  const studentTwo = await prisma.user.create({
    data: {
      fullName: 'Temuulen Gan',
      email: 'temuulen@shine.mn',
      passwordHash,
      role: Role.STUDENT
    }
  });

  const courseOne = await prisma.course.create({
    data: {
      instructorId: instructorOne.id,
      categoryId: webCategory.id,
      title: 'React Frontend from Zero to Job Ready',
      slug: 'react-frontend-zero-to-job-ready',
      shortDescription: 'Learn practical React by building UI that feels production-ready.',
      description: 'Build practical React interfaces, routing, state management, and deployable projects.',
      price: 129,
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
      level: 'Beginner',
      language: 'Mongolian',
      status: CourseStatus.APPROVED,
      publishedAt: new Date(),
      sections: {
        create: [
          {
            title: 'Getting Started',
            sortOrder: 1,
            lessons: {
              create: [
                {
                  title: 'React project setup',
                  videoProvider: 'Mux',
                  videoUrl: 'https://stream.mux.com/example-react-setup.m3u8',
                  durationSeconds: 900,
                  isPreview: true,
                  sortOrder: 1
                },
                {
                  title: 'JSX and components',
                  videoProvider: 'Mux',
                  videoUrl: 'https://stream.mux.com/example-jsx-components.m3u8',
                  durationSeconds: 1100,
                  sortOrder: 2
                }
              ]
            }
          },
          {
            title: 'State and Effects',
            sortOrder: 2,
            lessons: {
              create: [
                {
                  title: 'State and effects',
                  videoProvider: 'Mux',
                  videoUrl: 'https://stream.mux.com/example-state-effects.m3u8',
                  durationSeconds: 1320,
                  sortOrder: 1
                }
              ]
            }
          }
        ]
      }
    },
    include: {
      sections: {
        include: {
          lessons: true
        }
      }
    }
  });

  const courseTwo = await prisma.course.create({
    data: {
      instructorId: instructorTwo.id,
      categoryId: webCategory.id,
      title: 'ASP.NET Core API Architecture Masterclass',
      slug: 'aspnet-core-api-architecture-masterclass',
      shortDescription: 'Design layered APIs with auth, SQL, and production structure.',
      description: 'Build modular APIs with clean boundaries, auth, SQL persistence, and admin workflows.',
      price: 149,
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      level: 'Intermediate',
      language: 'Mongolian',
      status: CourseStatus.PENDING_REVIEW,
      sections: {
        create: [
          {
            title: 'System Architecture',
            sortOrder: 1,
            lessons: {
              create: [
                {
                  title: 'Layered backend design',
                  videoProvider: 'Cloudinary',
                  videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
                  durationSeconds: 1500,
                  isPreview: true,
                  sortOrder: 1
                }
              ]
            }
          }
        ]
      }
    }
  });

  const courseThree = await prisma.course.create({
    data: {
      instructorId: instructorOne.id,
      categoryId: designCategory.id,
      title: 'Design Better Course Thumbnails and Landing Pages',
      slug: 'design-better-course-thumbnails-and-landing-pages',
      shortDescription: 'Improve conversion with stronger course visuals and positioning.',
      description: 'Use composition, color, and messaging to design thumbnails and landing pages that convert.',
      price: 79,
      thumbnailUrl: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80',
      level: 'Beginner',
      language: 'English',
      status: CourseStatus.APPROVED,
      publishedAt: new Date()
    }
  });

  const orderOne = await prisma.order.create({
    data: {
      userId: studentOne.id,
      totalAmount: 129,
      status: OrderStatus.PAID,
      items: {
        create: [{ courseId: courseOne.id, price: 129 }]
      }
    }
  });

  const paymentOne = await prisma.payment.create({
    data: {
      orderId: orderOne.id,
      provider: 'QPay',
      paymentMethod: 'wallet',
      providerTransactionId: 'txn-demo-001',
      amount: 129,
      status: PaymentStatus.PAID,
      paidAt: new Date(),
      rawResponseJson: JSON.stringify({ demo: true })
    }
  });

  await prisma.enrollment.create({
    data: {
      userId: studentOne.id,
      courseId: courseOne.id,
      orderId: orderOne.id,
      paymentId: paymentOne.id
    }
  });

  const firstLesson = courseOne.sections[0].lessons[0];
  await prisma.lessonProgress.create({
    data: {
      userId: studentOne.id,
      lessonId: firstLesson.id,
      isCompleted: true,
      lastWatchedSecond: 900
    }
  });

  await prisma.review.create({
    data: {
      userId: studentOne.id,
      courseId: courseOne.id,
      rating: 5,
      comment: 'Very practical and clean teaching style.'
    }
  });

  console.log('Seed complete');
  console.log({
    admin: admin.email,
    instructor: instructorOne.email,
    student: studentOne.email,
    password: '123456',
    approvedCourse: courseOne.title,
    pendingCourse: courseTwo.title,
    extraCourse: courseThree.title,
    dataCategory: dataCategory.slug
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
