const sdk = require("node-appwrite");
const fetch = require("node-fetch");

module.exports = async function (req, res) {
  try {
    console.log('🚀 Cloud Function triggered!');
    
    // Get new post data
    const event = JSON.parse(req.payload);
    const post = event.$document;
    
    console.log('📝 New post data:', post);

    // For testing - add your actual Expo push token here
    const tokens = [
      // Replace with your actual token from console
      "ExponentPushToken[YOUR_ACTUAL_TOKEN_HERE]"
    ];

    console.log('📱 Sending to tokens:', tokens);

    // Send push notification to all tokens
    for (const token of tokens) {
      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: token,
            title: 'අලුත් Post එකක්!',
            body: post.Titel || post.title || 'අලුත් post එකක් එකතු වුණා!',
            data: { 
              postId: post.$id,
              type: 'new_post'
            },
            sound: 'default',
            badge: 1
          })
        });
        
        const result = await response.json();
        console.log('📤 Push result:', result);
        
        if (response.ok) {
          console.log('✅ Notification sent successfully to:', token);
        } else {
          console.error('❌ Failed to send notification:', result);
        }
      } catch (error) {
        console.error('❌ Error sending notification:', error);
      }
    }

    res.json({ success: true, message: 'Function completed' });
  } catch (error) {
    console.error('❌ Function error:', error);
    res.json({ error: error.message });
  }
};
