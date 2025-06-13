const path = require('path');
const fs = require('fs/promises');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const createEmailTransporter = async () => {
    try {
        if (typeof global.__rootdir === 'undefined') {
            throw new Error("Application root path (global.__rootdir) is not defined. Ensure app.js is the entry point.");
        }

        const configPath = path.join(global.__rootdir, 'config.json');
        const fileContent = await fs.readFile(configPath, 'utf-8');
        const api_key = JSON.parse(fileContent).sendgrid_ApiKey;

        if (!api_key) { throw new Error("SendGrid API Key not found in config.json"); }

        const transporter = nodemailer.createTransport(sendgridTransport({ auth: { api_key } }));
        return transporter;
    } catch (error) {
        console.error("Error creating email transporter:", error.message);
        throw error;
    }
};

module.exports = createEmailTransporter;