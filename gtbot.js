require('dotenv').config();
const TelegramBot      = require('node-telegram-bot-api');
const nodemailer       = require('nodemailer');
const fs               = require('fs');
const path             = require('path');

// Load environment variables
const TELEGRAM_TOKEN       = process.env.TELEGRAM_TOKEN;
const EMAIL_ADDRESS        = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD       = process.env.EMAIL_PASSWORD;
const GRAB_TALENT_EMAIL    = 'ryanbr96@icloud.com';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot( TELEGRAM_TOKEN, { polling: true } );

// Set up nodemailer
const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
    },

});

let userSteps = {};

bot.onText( /\/start/, ( msg ) => {

    const chatId = msg.chat.id;
    bot.sendMessage( chatId, 'Hello! 👋\n\nWelcome to Grab Talent! We are excited to help you create your account.\n\nTo get started, could you please provide your email address?' );
    userSteps[ chatId ] = 'awaiting_email';

});

bot.on( 'message', ( msg ) => {

    const chatId = msg.chat.id;

    if ( userSteps[ chatId ] === 'awaiting_email' && msg.text ) {

        const email = msg.text;
        userSteps[ chatId ] = { step: 'awaiting_resume', email: email };
        bot.sendMessage( chatId, `Thanks! We've got your email as ${email}.\n\nNow, please upload your resume (PDF, DOCX, etc.) so we can complete your account setup.` );

    } else if ( userSteps[ chatId ] && userSteps[ chatId ].step === 'awaiting_resume' && msg.document ) {

        const userEmail  = userSteps[ chatId ].email;
        const fileId     = msg.document.file_id;
        const fileName   = msg.document.file_name;
        const dest       = path.join( __dirname, fileName );

        console.log( 'Received document:', fileName );

        bot.getFileLink( fileId ).then( ( filePath ) => {

            console.log( 'File path:', filePath );

            // Download the file
            bot.downloadFile( fileId, __dirname ).then( ( downloadPath ) => {

                console.log( 'Downloaded file path:', downloadPath );

                // Send the file to Grab Talent email
                sendEmail(
                    GRAB_TALENT_EMAIL,
                    'New Resume Received',
                    `We have received a new resume from ${userEmail}. Please find the attached file.`,
                    [
                        {
                            filename: fileName,
                            path: downloadPath,
                        },
                    ],
                    () => {

                        fs.unlink( downloadPath, ( err ) => {

                            if ( err ) {

                                console.error( 'Error deleting file:', err );
                                bot.sendMessage( chatId, 'Oops! There was an error processing your file. Please try again.' );

                            } else {

                                // Send confirmation email to the user
                                sendConfirmationEmail( userEmail, () => {
                                    bot.sendMessage( chatId, 'Your resume has been successfully received and forwarded to our team at Grab Talent! 🎉\n\nYou should receive a confirmation email shortly. Thank you for using our service!' );
                                    delete userSteps[ chatId ];  // Reset step for the user
                                });

                            }

                        });

                    }
                );

            }).catch( ( err ) => {

                console.error( 'Error downloading file:', err );
                bot.sendMessage( chatId, 'Sorry, there was an error downloading your file. Please try uploading it again.' );

            });

        }).catch( ( err ) => {

            console.error( 'Error getting file link:', err );
            bot.sendMessage( chatId, 'Sorry, there was an error processing your file. Please try again.' );

        });

    } else if ( !msg.document && userSteps[ chatId ] && userSteps[ chatId ].step === 'awaiting_resume' ) {

        bot.sendMessage( chatId, 'Please upload your resume (PDF, DOCX, etc.) so we can complete your account setup.' );

    }

});

function sendEmail( to, subject, text, attachments, callback ) {

    const mailOptions = {
        from: EMAIL_ADDRESS,
        to: to,
        subject: subject,
        text: text,
        attachments: attachments,
    };

    transporter.sendMail( mailOptions, ( error, info ) => {

        if ( error ) {

            console.error( 'Error sending email:', error );

        } else {

            console.log( 'Email sent:', info.response );

        }
        if ( callback ) callback();

    });

}

function sendConfirmationEmail( to, callback ) {

    const mailOptions = {
        from: EMAIL_ADDRESS,
        to: to,
        subject: 'Account Created on Grab Talent',
        text: 'Thank you for creating your account on Grab Talent. Your resume has been received and processed successfully. We will be in touch soon!',
    };

    transporter.sendMail( mailOptions, ( error, info ) => {

        if ( error ) {

            console.error( 'Error sending confirmation email:', error );

        } else {

            console.log( 'Confirmation email sent:', info.response );

        }
        if ( callback ) callback();

    });

}
