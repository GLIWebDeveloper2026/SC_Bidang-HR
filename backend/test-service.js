const authService = require('./src/services/auth.service');

async function run() {
  try {
    const result = await authService.register({
      email: 'imammantapmen@gmail.com',
      password: '123678',
      nama: 'mbud',
      level_id: '6d3819d9-f2ce-4e7e-bfe7-0e384290e96a'
    });
    console.log('SUCCESS:', result);
  } catch (error) {
    console.log('CATCH BLOCK EXECUTED');
    console.log('ERROR:', error);
    console.log('ERROR TYPE:', typeof error);
    console.log('ERROR IS INSTANCE OF ERROR:', error instanceof Error);
    console.log('ERROR MESSAGE:', error.message);
    console.log('TYPE OF MESSAGE:', typeof error.message);
    console.log('JSON STRINGIFY:', JSON.stringify({ success: false, message: error.message }));
  }
}
run();
