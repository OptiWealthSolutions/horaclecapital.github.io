const SUPABASE_URL = 'https://svodjiuypokuvubwfkom.supabase.co';
const TEST_PAYLOAD = {
  userEmail: 'test@horaclecapital.com',
  feedbackType: 'suggestion',
  message: 'Test automatique du système de feedback.',
  pageUrl: 'http://localhost:4321/test-feedback'
};

async function testFeedback() {
  console.log('Testing feedback endpoint...');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_PAYLOAD)
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('SUCCESS: Feedback sent successfully.', data);
    } else {
      console.error('FAILED: Server returned error.', data);
    }
  } catch (error) {
    console.error('ERROR: Network failure or fetch error.', error);
  }
}

testFeedback();
