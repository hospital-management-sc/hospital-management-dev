import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Main seed function
 * Add your database seed logic here
 * 
 * Examples:
 * - Create initial users/roles
 * - Create test data
 * - Initialize lookup tables
 */
async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // TODO: Add your seed data here
    // Example:
    // const doctor = await prisma.doctor.create({
    //   data: {
    //     cedula: 'V12345678',
    //     name: 'Dr. Test User',
    //     specialty: 'General Medicine',
    //     email: 'doctor@test.com',
    //   },
    // });
    // console.log('✅ Doctor created:', doctor);

    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
