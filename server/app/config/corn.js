const cron = require('node-cron');
const Designer = require('../model/Designermodel');

require('dotenv').config();
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.my_email,
    pass: process.env.my_password
  }
})
const startTrialExpiryCron = () => {
  // Runs every 10 seconds (for testing). Use '0 0 * * *' in production.
  cron.schedule('*/10 * * * * *', async () => {
    const now = new Date();

    // Designers whose trial started more than 1 day ago
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

    const expiredDesigners = await Designer.find({
      subscriptionType: 'Trial',
      subscriptionStart: { $lte: oneDayAgo },
      isActive: true,
    });

    for (const designer of expiredDesigners) {
      try {
        // 1. Send email
        await transporter.sendMail({
          form:'sahashreelekha84@gmail.com',
          to: designer.email,
          subject: '⏰ Your Trial Has Expired',
          text: `Hello ${designer.designername},\n\nYour trial has ended. Please upgrade to continue using Interio.`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
              <h2>Hello ${designer.designername},</h2>
              <h4>your Id is ${designer._id},</h4>
              <p>Your <strong>Interio</strong> trial has expired.</p>
              <p>Please upgrade your subscription to regain access.</p>
              <a href="http://localhost:5173/designer/upgrade_subscription"style="display:inline-block; padding:10px 20px; background:#1976d2; color:white; border-radius:5px; text-decoration:none;">
                 Upgrade Now
              </a>
              <p style="margin-top:20px;">Thanks,<br>The Interio Team</p>
            </div>
          `
        });

        // 2. Deactivate user
        designer.isActive = false;
        await designer.save();

        console.log(` Notified and deactivated: ${designer.email}`);
      } catch (e) {
        console.error(` Failed for ${designer.email}: ${e.message}`);
      }
    }

    // console.log(`📊 Total processed: ${expiredDesigners.length}`);
  });
};

module.exports = startTrialExpiryCron;
