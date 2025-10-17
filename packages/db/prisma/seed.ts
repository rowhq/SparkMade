import { PrismaClient, Role, ProjectStatus, ThresholdType, ComplianceStatus, PledgeStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sparkmade.com' },
    update: {},
    create: {
      email: 'admin@sparkmade.com',
      name: 'Admin User',
      role: Role.ADMIN,
      kycStatus: 'VERIFIED',
    },
  });

  // Create sample creators
  const creator1 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Chen',
      role: Role.CREATOR,
      kycStatus: 'VERIFIED',
    },
  });

  const creator2 = await prisma.user.upsert({
    where: { email: 'mike@example.com' },
    update: {},
    create: {
      email: 'mike@example.com',
      name: 'Mike Rodriguez',
      role: Role.CREATOR,
      kycStatus: 'VERIFIED',
    },
  });

  const creator3 = await prisma.user.upsert({
    where: { email: 'emily@example.com' },
    update: {},
    create: {
      email: 'emily@example.com',
      name: 'Emily Park',
      role: Role.CREATOR,
      kycStatus: 'VERIFIED',
    },
  });

  // Create sample backers
  const backer1 = await prisma.user.upsert({
    where: { email: 'backer1@example.com' },
    update: {},
    create: {
      email: 'backer1@example.com',
      name: 'John Smith',
      role: Role.BACKER,
      kycStatus: 'VERIFIED',
    },
  });

  const backer2 = await prisma.user.upsert({
    where: { email: 'backer2@example.com' },
    update: {},
    create: {
      email: 'backer2@example.com',
      name: 'Lisa Johnson',
      role: Role.BACKER,
      kycStatus: 'VERIFIED',
    },
  });

  const backer3 = await prisma.user.upsert({
    where: { email: 'backer3@example.com' },
    update: {},
    create: {
      email: 'backer3@example.com',
      name: 'David Kim',
      role: Role.BACKER,
      kycStatus: 'VERIFIED',
    },
  });

  // Create sample projects
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30); // 30 days from now

  const project1 = await prisma.project.create({
    data: {
      title: 'Eco-Friendly Desk Organizer',
      tagline: 'Keep your workspace tidy with sustainable bamboo',
      description: 'A minimalist desk organizer made from sustainably sourced bamboo. Features compartments for pens, paper clips, and sticky notes. Perfect for anyone looking to bring a touch of nature to their workspace while staying organized.',
      category: 'Desk Accessories',
      tags: ['sustainable', 'bamboo', 'organizer', 'minimal'],
      heroImages: [],
      specImages: [],
      aiBriefJson: {
        name: 'Eco-Friendly Desk Organizer',
        tagline: 'Keep your workspace tidy with sustainable bamboo',
        problem: 'Cluttered desks reduce productivity and create stress',
        audience: 'Remote workers, students, and eco-conscious professionals',
        features: ['Bamboo construction', 'Multiple compartments', 'Non-slip cork base', 'Water-resistant finish'],
        materials: ['Sustainably sourced bamboo', 'Cork base', 'Natural oil finish'],
        dimensions: '20cm x 15cm x 8cm',
        estimated_cost: 25,
        manufacturing_risk: 'low',
        category: 'Desk Accessories',
        design_style: 'Minimalist, natural, Scandinavian',
      },
      priceTarget: 2500, // $25.00
      depositAmount: 500, // $5.00
      thresholdType: ThresholdType.UNITS,
      thresholdValue: 200,
      deadlineAt: deadline,
      complianceStatus: ComplianceStatus.PASS,
      riskFlags: [],
      status: ProjectStatus.LIVE,
      creatorId: creator1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Modular Cable Management System',
      tagline: 'Tame your cables with magnetic mounting',
      description: 'A set of magnetic cable clips that stick to any metal surface. Perfect for organizing charging cables on your desk. No more tangled cables or lost connections!',
      category: 'Tech Accessories',
      tags: ['cable', 'organization', 'magnetic', 'modular'],
      heroImages: [],
      specImages: [],
      aiBriefJson: {
        name: 'Modular Cable Management System',
        tagline: 'Tame your cables with magnetic mounting',
        problem: 'Cables fall off desks and tangle, creating visual clutter',
        audience: 'Tech enthusiasts, office workers, and gamers',
        features: ['Strong magnets', 'Silicone cable holder', 'Set of 5 clips', 'Multiple colors'],
        materials: ['Silicone', 'Neodymium magnets', 'ABS plastic'],
        dimensions: '3cm x 2cm per clip',
        estimated_cost: 15,
        manufacturing_risk: 'low',
        category: 'Tech Accessories',
        design_style: 'Minimal, functional, modern',
      },
      priceTarget: 1500, // $15.00
      depositAmount: 300, // $3.00
      thresholdType: ThresholdType.UNITS,
      thresholdValue: 300,
      deadlineAt: deadline,
      complianceStatus: ComplianceStatus.PASS,
      riskFlags: [],
      status: ProjectStatus.LIVE,
      creatorId: creator2.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Collapsible Water Bottle',
      tagline: 'Fits in your pocket when empty',
      description: 'A food-safe silicone water bottle that collapses flat when empty. Perfect for travelers and hikers who want to stay hydrated without the bulk.',
      category: 'Travel',
      tags: ['silicone', 'collapsible', 'travel', 'portable', 'eco-friendly'],
      heroImages: [],
      specImages: [],
      aiBriefJson: {
        name: 'Collapsible Water Bottle',
        tagline: 'Fits in your pocket when empty',
        problem: 'Bulky water bottles waste space when empty, especially during travel',
        audience: 'Travelers, hikers, commuters, and gym-goers',
        features: ['Food-grade silicone', 'Leak-proof cap', 'Holds 500ml', 'Carabiner clip included'],
        materials: ['Food-grade silicone', 'PP plastic cap', 'Stainless steel carabiner'],
        dimensions: '20cm tall, 7cm diameter when expanded; 3cm flat when collapsed',
        estimated_cost: 18,
        manufacturing_risk: 'medium',
        category: 'Travel',
        design_style: 'Functional, compact, sporty',
      },
      priceTarget: 1800, // $18.00
      depositAmount: 400, // $4.00
      thresholdType: ThresholdType.UNITS,
      thresholdValue: 250,
      deadlineAt: deadline,
      complianceStatus: ComplianceStatus.PASS,
      riskFlags: [],
      status: ProjectStatus.LIVE,
      creatorId: creator3.id,
    },
  });

  const project4 = await prisma.project.create({
    data: {
      title: 'Smart Plant Monitor',
      tagline: 'Never kill another plant with AI-powered care',
      description: 'A sleek device that monitors soil moisture, light levels, and temperature. Get notifications on your phone when your plants need attention. Includes AI recommendations for optimal plant care based on your specific plant species.',
      category: 'Home & Garden',
      tags: ['smart', 'IoT', 'plants', 'gardening', 'AI'],
      heroImages: [],
      specImages: [],
      aiBriefJson: {
        name: 'Smart Plant Monitor',
        tagline: 'Never kill another plant with AI-powered care',
        problem: 'People struggle to keep plants alive due to inconsistent watering and poor light conditions',
        audience: 'Plant enthusiasts, busy professionals, and beginner gardeners',
        features: ['Soil moisture sensor', 'Light sensor', 'Temperature sensor', 'Bluetooth connectivity', 'Mobile app with AI recommendations', 'Battery lasts 6 months'],
        materials: ['ABS plastic', 'Stainless steel probes', 'PCB with sensors'],
        dimensions: '8cm tall, 3cm diameter probe',
        estimated_cost: 35,
        manufacturing_risk: 'medium',
        category: 'Home & Garden',
        design_style: 'Modern, minimalist, tech-forward',
      },
      priceTarget: 3500, // $35.00
      depositAmount: 700, // $7.00
      thresholdType: ThresholdType.UNITS,
      thresholdValue: 500,
      deadlineAt: deadline,
      complianceStatus: ComplianceStatus.PASS,
      riskFlags: [],
      status: ProjectStatus.LIVE,
      creatorId: creator1.id,
    },
  });

  const project5 = await prisma.project.create({
    data: {
      title: 'Minimalist EDC Wallet',
      tagline: 'Carry less, live more',
      description: 'An ultra-slim wallet made from premium leather that holds up to 8 cards and folded bills. Features RFID blocking and a quick-access slot for your most-used card.',
      category: 'Accessories',
      tags: ['wallet', 'leather', 'minimalist', 'EDC', 'RFID'],
      heroImages: [],
      specImages: [],
      aiBriefJson: {
        name: 'Minimalist EDC Wallet',
        tagline: 'Carry less, live more',
        problem: 'Bulky wallets create discomfort and clutter',
        audience: 'Minimalists, professionals, and style-conscious individuals',
        features: ['Holds 8 cards', 'Premium full-grain leather', 'RFID blocking', 'Quick-access slot', 'Handstitched edges'],
        materials: ['Full-grain leather', 'RFID-blocking material', 'Waxed thread'],
        dimensions: '9cm x 6.5cm x 0.8cm',
        estimated_cost: 42,
        manufacturing_risk: 'low',
        category: 'Accessories',
        design_style: 'Minimalist, premium, timeless',
      },
      priceTarget: 4200, // $42.00
      depositAmount: 1000, // $10.00
      thresholdType: ThresholdType.UNITS,
      thresholdValue: 150,
      deadlineAt: deadline,
      complianceStatus: ComplianceStatus.PASS,
      riskFlags: [],
      status: ProjectStatus.LIVE,
      creatorId: creator2.id,
    },
  });

  // Create pledges for projects to show activity
  await prisma.pledge.create({
    data: {
      projectId: project1.id,
      backerId: backer1.id,
      amount: 500,
      status: PledgeStatus.HELD,
      paymentIntent: 'pi_mock_1',
      escrowId: 'esc_mock_1',
    },
  });

  await prisma.pledge.create({
    data: {
      projectId: project1.id,
      backerId: backer2.id,
      amount: 1000,
      status: PledgeStatus.HELD,
      paymentIntent: 'pi_mock_2',
      escrowId: 'esc_mock_2',
    },
  });

  await prisma.pledge.create({
    data: {
      projectId: project2.id,
      backerId: backer1.id,
      amount: 300,
      status: PledgeStatus.HELD,
      paymentIntent: 'pi_mock_3',
      escrowId: 'esc_mock_3',
    },
  });

  await prisma.pledge.create({
    data: {
      projectId: project2.id,
      backerId: backer3.id,
      amount: 600,
      status: PledgeStatus.HELD,
      paymentIntent: 'pi_mock_4',
      escrowId: 'esc_mock_4',
    },
  });

  await prisma.pledge.create({
    data: {
      projectId: project3.id,
      backerId: backer2.id,
      amount: 800,
      status: PledgeStatus.HELD,
      paymentIntent: 'pi_mock_5',
      escrowId: 'esc_mock_5',
    },
  });

  await prisma.pledge.create({
    data: {
      projectId: project4.id,
      backerId: backer1.id,
      amount: 700,
      status: PledgeStatus.HELD,
      paymentIntent: 'pi_mock_6',
      escrowId: 'esc_mock_6',
    },
  });

  await prisma.pledge.create({
    data: {
      projectId: project4.id,
      backerId: backer2.id,
      amount: 1400,
      status: PledgeStatus.HELD,
      paymentIntent: 'pi_mock_7',
      escrowId: 'esc_mock_7',
    },
  });

  await prisma.pledge.create({
    data: {
      projectId: project4.id,
      backerId: backer3.id,
      amount: 700,
      status: PledgeStatus.HELD,
      paymentIntent: 'pi_mock_8',
      escrowId: 'esc_mock_8',
    },
  });

  await prisma.pledge.create({
    data: {
      projectId: project5.id,
      backerId: backer3.id,
      amount: 2000,
      status: PledgeStatus.HELD,
      paymentIntent: 'pi_mock_9',
      escrowId: 'esc_mock_9',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Admin: ${admin.email}`);
  console.log(`Creators: ${creator1.email}, ${creator2.email}, ${creator3.email}`);
  console.log(`Backers: ${backer1.email}, ${backer2.email}, ${backer3.email}`);
  console.log(`Projects created: ${project1.title}, ${project2.title}, ${project3.title}, ${project4.title}, ${project5.title}`);
  console.log(`Pledges created: 9 total pledges across all projects`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
