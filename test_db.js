const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    // Test patient query
    const patients = await prisma.patient.findMany({
      take: 1,
      include: {
        medicalHistory: true,
        appointments: true,
      }
    });
    
    console.log(`✅ Found ${patients.length} patients`);
    
    // Test user query
    const users = await prisma.user.findMany({
      take: 1
    });
    
    console.log(`✅ Found ${users.length} users`);
    
    // Test appointments
    const appointments = await prisma.appointment.findMany({
      take: 1,
      include: {
        patient: true
      }
    });
    
    console.log(`✅ Found ${appointments.length} appointments`);
    
    console.log('✅ All database operations successful');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
