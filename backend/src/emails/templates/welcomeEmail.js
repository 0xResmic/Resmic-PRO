function welcomeEmailTemplate(name) {
    
    const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        /* background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner); */
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://res.cloudinary.com/dzberldw0/image/upload/v1740407822/Resmic_Black_transparent_oabphm.png"
                  height="60px"
                />
              </td>
              <td style="text-align: right;">
                
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 20px;
            padding: 50px 30px 35px;
            background: #ffffff;
            border-radius: 30px;
            /* text-align: center; */
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <!-- <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #49266d;
              "
            >
              Login OTP
            </h1> -->
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
              "
            >
              Hey ${name}  👋🏻,
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                letter-spacing: 0.56px;
              "
            >
            Thank you for signing up with <b>Resmic</b>! 🎉 You're now part of a payment revolution, where accepting crypto is easier than ever.

            <br><br>
                💡 Here’s how to get started:
                <br><br>
                <li>Set up your account → <a href="dashboard.resmic.com" style="text-decoration: none;">Resmic Settings</a> </li>
                <li>Generate new API Keys → <a href="dashboard.resmic.com/api-key" style="text-decoration: none;">Create API KEY</a> </li>
                <li>Start accepting crypto payments </li>
                <li>Monitor transactions in real-time </li>

                <br><br>
                📌 Access Your Dashboard → <a href="dashboard.resmic.com" style="text-decoration: none;">Resmic Dashboard</a>
                <br><br>
                Let’s build the future of payments together!          
            
                <br> <br><br>

                Happy transacting!
                <br>
                The Resmic Team
              
            </p>
            
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 20px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Reach us at
          <a
            href="mailto:archisketch@gmail.com"
            style="color: #499fb6; text-decoration: none;"
            >support@resmic.com</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
         <a href="https://resmic.com" style="text-decoration: none;">Resmic</a> 
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="https://www.linkedin.com/company/resmic/" target="_blank" style="display: inline-block;">
            <img
              width="30px"
              alt="LinkedIn"
              src="https://cdn3.iconfinder.com/data/icons/2018-social-media-black-and-white-logos/1000/2018_social_media_popular_app_logo_linkedin-512.png"
            />
          </a>

          <!-- <a
            href="https://github.com/0xResmic"
            target="_blank"
            style="display: inline-block; margin-left: 10px;"
          >
            <img
              width="30px"
              alt="GitHub"
              border-radius="20px"
              src="https://pbs.twimg.com/profile_images/1633247750010830848/8zfRrYjA_400x400.png"
            />
          </a> -->

          <a
            href="https://x.com/0xResmic"
            target="_blank"
            style="display: inline-block; margin-left: 10px;"
          >
            <img
              width="30px"
              alt="Twitter"
              src="https://freepnglogo.com/images/all_img/1691832581twitter-x-icon-png.png"
          /></a>
          
         
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2025 Resmic. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>
`
    return template;
}
module.exports = welcomeEmailTemplate;

/*
Subject: Welcome to Resmic! Let’s Get You Started 🚀

Hi [User's First Name],

Thank you for signing up with Resmic! 🎉 You’re now part of a decentralized payment revolution, where accepting crypto is easier than ever.

💡 Here’s how to get started:
✅ Set up your wallet → [Insert Setup Guide]
✅ Start accepting crypto payments
✅ Monitor transactions in real-time

📌 Access Your Dashboard → [Insert Dashboard Link]

If you have any questions, feel free to reach out to [Support Email].

Let’s build the future of payments together!
– The Resmic Team


*/