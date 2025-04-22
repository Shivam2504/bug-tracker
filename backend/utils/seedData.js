import User from '../models/User.js';
import Bug from '../models/Bug.js';

export const createInitialData = async () => {
  try {
    // Check if we already have users
    const userCount = await User.countDocuments();
    if (userCount > 5) {
      console.log('Database already has users, skipping seed');
      return;
    }
    
    // Create demo user
    const demoUser = new User({
      name: 'admin1',
      email: 'admin1@gmail.com',
      password: 'admin',
      role: 'admin'
    });
    
    await demoUser.save();
    console.log('Demo user created');
    
    // Create a developer user
    const devUser = new User({
      name: 'shivam1',
      email: 'shivam1@gmail.com',
      password: 'shivam',
      role: 'developer'
    });
    
    await devUser.save();
    console.log('Developer user created');
    
    // Create sample bugs
    const bugs = [
      {
        serialNo: 1,
        title: 'Login button not working on Safari',
        description: 'When using Safari browser, clicking the login button does nothing. No errors in console.',
        steps: '1. Open the application in Safari\n2. Enter valid credentials\n3. Click login button\n4. Observe that nothing happens',
        priority: 3,
        status: 'open',
        createdBy: demoUser._id
      },
      {
        serialNo: 2,
        title: 'Dashboard shows incorrect statistics',
        description: 'The total count on the dashboard is showing 250 but there are only 200 items in the database.',
        steps: '1. Login as admin\n2. Navigate to dashboard\n3. Check the total count vs actual items',
        priority: 2,
        status: 'in-progress',
        createdBy: demoUser._id,
        assignedTo: devUser._id
      },
      {
        serialNo: 3,
        title: 'Application crashes on file upload',
        description: 'When uploading files larger than 5MB, the entire application crashes and shows a white screen.',
        priority: 5,
        status: 'open',
        createdBy: devUser._id
      },
      {
        serialNo: 4,
        title: 'Text formatting issue in reports',
        description: 'When generating PDF reports, the text formatting is broken for non-latin characters.',
        priority: 2,
        status: 'resolved',
        createdBy: demoUser._id,
        assignedTo: devUser._id
      },
      {
        serialNo: 5,
        title: 'Mobile menu not closing',
        description: 'On mobile devices, after opening the hamburger menu, it cannot be closed again.',
        steps: '1. Open app on mobile device\n2. Click hamburger menu to open\n3. Try to close the menu\n4. Observe it remains open',
        priority: 3,
        status: 'in-progress',
        createdBy: demoUser._id,
        assignedTo: demoUser._id
      }
    ];
    
    await Bug.insertMany(bugs);
    console.log('Sample bugs created');
    
    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error creating seed data:', error);
  }
};