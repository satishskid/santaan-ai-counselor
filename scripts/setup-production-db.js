#!/usr/bin/env node

/**
 * Production Database Setup Script
 * Automatically sets up database schema and initial data on deployment
 */

const { PrismaClient } = require('@prisma/client');

async function setupProductionDatabase() {
  console.log('🗄️  Setting up production database...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if database is already initialized
    try {
      const userCount = await prisma.user.count();
      console.log(`📊 Found ${userCount} existing users`);
      
      if (userCount > 0) {
        console.log('✅ Database already initialized, skipping setup');
        return;
      }
    } catch (error) {
      console.log('🔧 Database not initialized, proceeding with setup...');
    }

    // Create initial admin user
    console.log('👤 Creating initial admin user...');
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@counselortempo.com',
        fullName: 'System Administrator',
        role: 'ADMIN',
        avatarUrl: null,
      },
    });
    console.log('✅ Admin user created:', adminUser.email);

    // Create sample counselor
    console.log('👨‍⚕️ Creating sample counselor...');
    const counselor = await prisma.user.create({
      data: {
        email: 'counselor@counselortempo.com',
        fullName: 'Dr. Sarah Johnson',
        role: 'COUNSELOR',
        avatarUrl: null,
      },
    });
    console.log('✅ Counselor created:', counselor.email);

    // Create sample patient
    console.log('👥 Creating sample patient data...');
    const patient = await prisma.patient.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0123',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'female',
        diagnosis: 'Unexplained infertility',
        stage: 'Initial consultation',
        status: 'ACTIVE',
        counselorId: counselor.id,
        medicalHistory: {
          create: {
            previousTreatments: 'None',
            medicalConditions: 'None reported',
            medications: 'Prenatal vitamins',
            allergies: 'None known',
            familyHistory: 'No family history of infertility',
          },
        },
        fertilityJourney: {
          create: {
            tryingToConceiveSince: '2 years',
            previousIVFAttempts: '0',
            challenges: 'Difficulty conceiving naturally',
            expectations: 'Successful pregnancy through IVF',
          },
        },
        treatmentPathway: {
          create: {
            preferredTreatment: 'IVF',
            timeframe: '6 months',
            additionalNotes: 'Patient is motivated and ready to begin treatment',
          },
        },
      },
    });
    console.log('✅ Sample patient created:', patient.email);

    // Create sample assessment
    console.log('📝 Creating sample assessment...');
    const assessment = await prisma.assessment.create({
      data: {
        patientId: patient.id,
        counselorId: counselor.id,
        assessmentType: 'Initial Psychological Screening',
        questions: JSON.stringify([
          'How are you feeling about starting IVF treatment?',
          'What are your main concerns about the process?',
          'How is your support system?'
        ]),
        answers: JSON.stringify([
          'Nervous but hopeful',
          'Worried about success rates and emotional impact',
          'Strong support from partner and family'
        ]),
        score: 75,
        status: 'COMPLETED',
        notes: 'Patient shows good emotional readiness for treatment',
        completedAt: new Date(),
      },
    });
    console.log('✅ Sample assessment created');

    // Create sample treatment plan
    console.log('📋 Creating sample treatment plan...');
    const treatmentPlan = await prisma.treatmentPlan.create({
      data: {
        patientId: patient.id,
        counselorId: counselor.id,
        title: 'Comprehensive IVF Support Plan',
        description: 'Complete emotional and psychological support throughout IVF journey',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months from now
        milestones: {
          create: [
            {
              title: 'Initial Assessment Complete',
              description: 'Baseline psychological evaluation completed',
              targetDate: new Date(),
              status: 'COMPLETED',
              notes: 'Patient shows good readiness for treatment',
            },
            {
              title: 'Pre-treatment Counseling',
              description: 'Prepare patient for IVF process',
              targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
              status: 'NOT_STARTED',
              notes: 'Schedule weekly sessions',
            },
          ],
        },
        interventions: {
          create: [
            {
              title: 'Weekly Counseling Sessions',
              description: 'Regular emotional support sessions',
              type: 'counseling',
              frequency: 'weekly',
              duration: '8 weeks',
              notes: 'Focus on coping strategies and emotional preparation',
            },
            {
              title: 'Stress Management Techniques',
              description: 'Teach relaxation and mindfulness techniques',
              type: 'therapy',
              frequency: 'as_needed',
              duration: 'ongoing',
              notes: 'Provide tools for managing treatment stress',
            },
          ],
        },
      },
    });
    console.log('✅ Sample treatment plan created');

    // Create sample appointment
    console.log('📅 Creating sample appointment...');
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        counselorId: counselor.id,
        title: 'Follow-up Consultation',
        description: 'Review progress and adjust treatment plan',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        durationMinutes: 60,
        status: 'SCHEDULED',
        type: 'follow_up',
        notes: 'Review assessment results and discuss next steps',
      },
    });
    console.log('✅ Sample appointment created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👤 Users created: 2 (1 admin, 1 counselor)`);
    console.log(`🏥 Patients created: 1`);
    console.log(`📝 Assessments created: 1`);
    console.log(`📋 Treatment plans created: 1`);
    console.log(`📅 Appointments created: 1`);
    
    console.log('\n🔐 Login Credentials:');
    console.log(`Admin: admin@counselortempo.com (password: admin123)`);
    console.log(`Counselor: counselor@counselortempo.com (password: counselor123)`);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupProductionDatabase()
    .then(() => {
      console.log('✅ Production database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Production database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupProductionDatabase };
