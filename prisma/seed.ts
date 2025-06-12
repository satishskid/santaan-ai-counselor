import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create counselor user
  const counselor = await prisma.user.upsert({
    where: { email: 'dr.emma.wilson@santaan.in' },
    update: {},
    create: {
      email: 'dr.emma.wilson@santaan.in',
      fullName: 'Dr. Emma Wilson',
      role: 'COUNSELOR',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=counselor',
    },
  })

  // Create sample patients with complete data
  const patients = await Promise.all([
    prisma.patient.upsert({
      where: { email: 'priya.sharma@email.com' },
      update: {},
      create: {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91-9876543210',
        dateOfBirth: new Date('1990-03-15'),
        gender: 'Female',
        status: 'ACTIVE',
        diagnosis: 'PCOS',
        stage: 'Assessment',
        nextAppointment: new Date('2024-01-15T10:00:00Z'),
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        counselorId: counselor.id,
        medicalHistory: {
          create: {
            previousTreatments: 'Clomid treatment for 6 months',
            medicalConditions: 'PCOS, Insulin resistance',
            medications: 'Metformin 500mg twice daily',
            allergies: 'None known',
            familyHistory: 'Mother had fertility issues',
          },
        },
        fertilityJourney: {
          create: {
            tryingToConceiveSince: '2 years',
            previousIVFAttempts: '0',
            challenges: 'Irregular cycles, weight management',
            expectations: 'Hoping for successful pregnancy within next year',
          },
        },
        treatmentPathway: {
          create: {
            preferredTreatment: 'IVF with ICSI',
            timeframe: '6-12 months',
            additionalNotes: 'Prefer to try after weight loss and PCOS management',
          },
        },
      },
    }),
    prisma.patient.upsert({
      where: { email: 'arjun.patel@email.com' },
      update: {},
      create: {
        firstName: 'Arjun',
        lastName: 'Patel',
        email: 'arjun.patel@email.com',
        phone: '+91-9876543211',
        dateOfBirth: new Date('1988-07-22'),
        gender: 'Male',
        status: 'ACTIVE',
        diagnosis: 'Male Factor',
        stage: 'Treatment Plan',
        nextAppointment: new Date('2024-01-18T14:30:00Z'),
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
        counselorId: counselor.id,
        medicalHistory: {
          create: {
            previousTreatments: 'None',
            medicalConditions: 'Low sperm count',
            medications: 'Multivitamins',
            allergies: 'Penicillin allergy',
            familyHistory: 'No family history of fertility issues',
          },
        },
        fertilityJourney: {
          create: {
            tryingToConceiveSince: '3 years',
            previousIVFAttempts: '0',
            challenges: 'Low sperm count, lifestyle changes needed',
            expectations: 'Want to explore all options before IVF',
          },
        },
        treatmentPathway: {
          create: {
            preferredTreatment: 'IUI first, then IVF',
            timeframe: '3-6 months',
            additionalNotes: 'Want to try less invasive options first',
          },
        },
      },
    }),
    prisma.patient.upsert({
      where: { email: 'kavya.reddy@email.com' },
      update: {},
      create: {
        firstName: 'Kavya',
        lastName: 'Reddy',
        email: 'kavya.reddy@email.com',
        phone: '+91-9876543212',
        dateOfBirth: new Date('1992-11-08'),
        gender: 'Female',
        status: 'NEW',
        diagnosis: 'Unexplained',
        stage: 'Onboarding',
        nextAppointment: new Date('2024-01-20T11:15:00Z'),
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kavya',
        counselorId: counselor.id,
      },
    }),
    prisma.patient.upsert({
      where: { email: 'rohit.gupta@email.com' },
      update: {},
      create: {
        firstName: 'Rohit',
        lastName: 'Gupta',
        email: 'rohit.gupta@email.com',
        phone: '+91-9876543213',
        dateOfBirth: new Date('1986-05-12'),
        gender: 'Male',
        status: 'ACTIVE',
        diagnosis: 'Endometriosis',
        stage: 'Progress Tracking',
        nextAppointment: new Date('2024-01-22T09:00:00Z'),
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohit',
        counselorId: counselor.id,
      },
    }),
  ])

  // Create sample assessments
  await prisma.assessment.createMany({
    data: [
      {
        patientId: patients[0].id,
        counselorId: counselor.id,
        assessmentType: 'emotional',
        status: 'COMPLETED',
        questions: JSON.stringify([
          { id: 'eq1', text: 'How would you rate your current stress level?' },
          { id: 'eq2', text: 'How well are you coping with fertility challenges?' }
        ]),
        answers: JSON.stringify({ eq1: 'high', eq2: 'moderate' }),
        score: 75,
        notes: 'Patient shows good coping mechanisms but high stress levels',
        completedAt: new Date(),
      },
      {
        patientId: patients[1].id,
        counselorId: counselor.id,
        assessmentType: 'financial',
        status: 'IN_PROGRESS',
        questions: JSON.stringify([
          { id: 'fq1', text: 'What is your budget for fertility treatment?' },
          { id: 'fq2', text: 'Do you have insurance coverage?' }
        ]),
        answers: JSON.stringify({ fq1: 'moderate' }),
        notes: 'Assessment in progress',
      },
    ],
  })

  // Create sample treatment plans
  const treatmentPlan1 = await prisma.treatmentPlan.create({
    data: {
      patientId: patients[0].id,
      counselorId: counselor.id,
      title: 'PCOS Management & IVF Preparation',
      description: 'Comprehensive plan for PCOS management and IVF preparation',
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
    },
  })

  const treatmentPlan2 = await prisma.treatmentPlan.create({
    data: {
      patientId: patients[3].id,
      counselorId: counselor.id,
      title: 'Endometriosis Treatment & Second IVF Cycle',
      description: 'Treatment plan for endometriosis management and second IVF attempt',
      status: 'ACTIVE',
      startDate: new Date('2024-01-10'),
    },
  })

  // Create milestones
  await prisma.milestone.createMany({
    data: [
      {
        treatmentPlanId: treatmentPlan1.id,
        title: 'Initial Consultation',
        description: 'Comprehensive fertility assessment and treatment planning',
        targetDate: new Date('2024-01-15'),
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      {
        treatmentPlanId: treatmentPlan1.id,
        title: 'PCOS Management',
        description: 'Weight loss and insulin resistance management',
        targetDate: new Date('2024-02-15'),
        status: 'IN_PROGRESS',
      },
      {
        treatmentPlanId: treatmentPlan1.id,
        title: 'Pre-IVF Testing',
        description: 'Complete all required tests before IVF cycle',
        targetDate: new Date('2024-03-01'),
        status: 'PENDING',
      },
      {
        treatmentPlanId: treatmentPlan2.id,
        title: 'Endometriosis Treatment',
        description: 'Manage endometriosis symptoms before IVF',
        targetDate: new Date('2024-02-01'),
        status: 'IN_PROGRESS',
      },
    ],
  })

  // Create sample appointments
  await prisma.appointment.createMany({
    data: [
      {
        patientId: patients[0].id,
        counselorId: counselor.id,
        title: 'Emotional Assessment',
        appointmentDate: new Date('2024-01-15T10:00:00Z'),
        type: 'assessment',
        status: 'SCHEDULED',
      },
      {
        patientId: patients[1].id,
        counselorId: counselor.id,
        title: 'Treatment Plan Review',
        appointmentDate: new Date('2024-01-18T14:30:00Z'),
        type: 'follow_up',
        status: 'SCHEDULED',
      },
      {
        patientId: patients[2].id,
        counselorId: counselor.id,
        title: 'Initial Consultation',
        appointmentDate: new Date('2024-01-20T11:15:00Z'),
        type: 'consultation',
        status: 'SCHEDULED',
      },
    ],
  })

  // Create sample resources
  await prisma.resource.createMany({
    data: [
      {
        title: 'Understanding PCOS and Fertility',
        description: 'Comprehensive guide about PCOS and its impact on fertility',
        type: 'article',
        url: 'https://example.com/pcos-guide',
        tags: JSON.stringify(['pcos', 'fertility', 'education']),
        createdById: counselor.id,
      },
      {
        title: 'IVF Process Explained',
        description: 'Step-by-step explanation of the IVF process',
        type: 'video',
        url: 'https://example.com/ivf-video',
        tags: JSON.stringify(['ivf', 'education', 'process']),
        createdById: counselor.id,
      },
      {
        title: 'Stress Management Techniques',
        description: 'Techniques for managing stress during fertility treatment',
        type: 'document',
        url: 'https://example.com/stress-management.pdf',
        tags: JSON.stringify(['stress', 'mental-health', 'coping']),
        createdById: counselor.id,
      },
    ],
  })

  // Create sample notes
  await prisma.note.createMany({
    data: [
      {
        patientId: patients[0].id,
        counselorId: counselor.id,
        content: 'Patient is motivated to make lifestyle changes. Discussed weight management strategies and PCOS education.',
      },
      {
        patientId: patients[1].id,
        counselorId: counselor.id,
        content: 'Couple is well-informed about male factor infertility. Husband is taking supplements and making lifestyle changes.',
      },
      {
        patientId: patients[3].id,
        counselorId: counselor.id,
        content: 'Patient is dealing with anxiety from previous failed IVF. Recommended counseling support and stress management techniques.',
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👨‍⚕️ Created counselor: ${counselor.fullName}`)
  console.log(`👥 Created ${patients.length} patients`)
  console.log('📊 Created assessments, treatment plans, appointments, and resources')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
