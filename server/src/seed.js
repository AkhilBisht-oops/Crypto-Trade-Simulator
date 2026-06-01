const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with test users and trades...');

  // Clear existing data
  await prisma.watchlist.deleteMany({});
  await prisma.holding.deleteMany({});
  await prisma.trade.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'alex@example.com',
      username: 'alex_trader',
      password: hashedPassword,
      balance: 8500.5,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'sara@example.com',
      username: 'sara_investor',
      password: hashedPassword,
      balance: 12400.0,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'david@example.com',
      username: 'david_hodl',
      password: hashedPassword,
      balance: 950.0,
    },
  });

  // Create Holdings
  await prisma.holding.createMany({
    data: [
      {
        userId: user1.id,
        symbol: 'BTCUSDT',
        quantity: 0.05,
        avgBuyPrice: 62000.0,
      },
      {
        userId: user1.id,
        symbol: 'ETHUSDT',
        quantity: 1.2,
        avgBuyPrice: 3100.0,
      },
      {
        userId: user2.id,
        symbol: 'SOLUSDT',
        quantity: 15.0,
        avgBuyPrice: 130.0,
      },
      {
        userId: user3.id,
        symbol: 'BTCUSDT',
        quantity: 0.15,
        avgBuyPrice: 60500.0,
      },
    ],
  });

  // Create some history trades
  await prisma.trade.createMany({
    data: [
      {
        userId: user1.id,
        symbol: 'BTCUSDT',
        type: 'BUY',
        quantity: 0.05,
        price: 62000.0,
        total: 3100.0,
      },
      {
        userId: user1.id,
        symbol: 'ETHUSDT',
        type: 'BUY',
        quantity: 1.2,
        price: 3100.0,
        total: 3720.0,
      },
      {
        userId: user2.id,
        symbol: 'SOLUSDT',
        type: 'BUY',
        quantity: 15.0,
        price: 130.0,
        total: 1950.0,
      },
    ],
  });

  // Create Watchlist items
  await prisma.watchlist.createMany({
    data: [
      { userId: user1.id, symbol: 'BTCUSDT' },
      { userId: user1.id, symbol: 'SOLUSDT' },
      { userId: user2.id, symbol: 'BTCUSDT' },
      { userId: user2.id, symbol: 'ETHUSDT' },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
