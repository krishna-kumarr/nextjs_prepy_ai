const Email = require('email-templates')
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

export default async function send_email({ template, to, data }) {
    const email = new Email({
        views: {
            root: './email_templates',
        },
        preview: false,
        message: {
            from: process.env.EMAIL_FROM,
        },
        send: true,
        transport: transporter,
    })

    let config = {
        template: template,
        message: {
            to: Boolean(to) ? to : process.env.ERROR_EMAIL,
        },
        locals: {
            ...data,
            app_name: process.env.NEXT_PUBLIC_APP_NAME,
            app_url: process.env.NEXT_PUBLIC_APP_URL,
        },
    }

    try {
        const info = await email.send(config)
        console.log('Message sent:', info)
    } catch (error) {
        console.error(error)
        if (!shouldIgnoreSMTPFailure()) {
            return false
        }
    }

    return true
}

function shouldIgnoreSMTPFailure() {
    return process.env.NODE_ENV !== 'production'
}