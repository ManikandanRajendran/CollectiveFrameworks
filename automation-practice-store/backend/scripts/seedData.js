const path = require('path');
const { writeSheet, DATA_DIR } = require('../services/excelService');

const users = [
  {
    id: 'user-001',
    username: 'demo',
    password: 'Demo@123',
    email: 'demo@automationstore.com',
    firstName: 'Alex',
    lastName: 'Tester',
    phone: '555-0100',
    address: '123 QA Boulevard',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'US',
    preferredContact: 'email',
    newsletter: 'true',
    membershipTier: 'gold',
  },
  {
    id: 'user-002',
    username: 'testuser',
    password: 'Test@123',
    email: 'test@automationstore.com',
    firstName: 'Jordan',
    lastName: 'Automator',
    phone: '555-0200',
    address: '456 Cypress Lane',
    city: 'Austin',
    state: 'TX',
    zipCode: '73301',
    country: 'US',
    preferredContact: 'phone',
    newsletter: 'false',
    membershipTier: 'silver',
  },
];

const products = [
  { id: 'prod-001', name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones', price: '79.99', category: 'electronics', stock: '50', image: '🎧' },
  { id: 'prod-002', name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard', price: '129.99', category: 'electronics', stock: '30', image: '⌨️' },
  { id: 'prod-003', name: 'Running Shoes', description: 'Lightweight performance running shoes', price: '89.99', category: 'sports', stock: '100', image: '👟' },
  { id: 'prod-004', name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat', price: '34.99', category: 'sports', stock: '75', image: '🧘' },
  { id: 'prod-005', name: 'Coffee Maker', description: 'Programmable drip coffee maker', price: '59.99', category: 'home', stock: '40', image: '☕' },
  { id: 'prod-006', name: 'Desk Lamp', description: 'Adjustable LED desk lamp', price: '39.99', category: 'home', stock: '60', image: '💡' },
  { id: 'prod-007', name: 'Backpack', description: 'Water-resistant travel backpack', price: '49.99', category: 'accessories', stock: '80', image: '🎒' },
  { id: 'prod-008', name: 'Smart Watch', description: 'Fitness tracking smart watch', price: '199.99', category: 'electronics', stock: '25', image: '⌚' },
  { id: 'prod-009', name: 'Water Bottle', description: 'Insulated stainless steel bottle', price: '24.99', category: 'accessories', stock: '120', image: '🥤' },
  { id: 'prod-010', name: 'Notebook Set', description: 'Premium ruled notebook 3-pack', price: '14.99', category: 'office', stock: '200', image: '📓' },
  { id: 'prod-011', name: 'Bluetooth Speaker', description: 'Portable waterproof speaker', price: '69.99', category: 'electronics', stock: '45', image: '🔊' },
  { id: 'prod-012', name: 'Plant Pot', description: 'Ceramic indoor plant pot', price: '19.99', category: 'home', stock: '90', image: '🪴' },
];

writeSheet('users', users);
writeSheet('products', products);
writeSheet('sessions', []);
writeSheet('cart_items', []);
writeSheet('orders', []);

console.log(`Excel data seeded in: ${DATA_DIR}`);
console.log('\nTest credentials:');
console.log('  Username: demo      Password: Demo@123');
console.log('  Username: testuser  Password: Test@123');
console.log('\nTest cards:');
console.log('  Visa:       4111 1111 1111 1111  CVV: 123');
console.log('  Mastercard: 5555 5555 5555 4444  CVV: 456');
console.log('  Amex:       3782 822463 10005    CVV: 7890');
