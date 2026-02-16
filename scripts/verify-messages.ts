
import { getDb } from '../lib/db';
import dotenv from 'dotenv';

// Load environment variables if running locally
dotenv.config();

async function checkMessages() {
  console.log('🔍 Connecting to MongoDB...');
  console.log(`URI: ${process.env.MONGODB_URI ? 'Defined' : 'Missing'}`);
  
  try {
    const db = await getDb();
    if (!db) {
      console.error('❌ Failed to connect to database.');
      return;
    }
    
    console.log('✅ Connected. Fetching last 5 messages...');
    const messages = await db.collection('messages')
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    if (messages.length === 0) {
      console.log('📝 No messages found in the "messages" collection.');
    } else {
      console.log('📨 --- Recent Messages --- 📨');
      console.table(messages.map(m => ({
        Name: m.name,
        Email: m.email,
        Message: m.message.substring(0, 30) + '...',
        Date: m.createdAt.toLocaleString()
      })));
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  // We need to exit explicitly
  process.exit(0);
}

checkMessages();
