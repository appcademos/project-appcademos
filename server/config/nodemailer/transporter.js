require("dotenv").config();
const nodemailer=require("nodemailer");


const transporter = nodemailer.createTransport(
    {
        pool:true,
        host: process.env.MAILHOST,
        port: process.env.MAILPORT,
        secure: true,// use TLS
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASS
        },
        tls: {
            rejectUnauthorized: false
        }
    }
)


const welcomeMail={
    from: process.env.MAILUSER,
    to: "",
    subject: "¡Gracias por crear tu cuenta en Appcademos!",
    html:"HOLA CARACOLA"
}

const paymentMail={
    from: process.env.MAILUSER,
    to: "",
    subject: "¡Has reservado tu plaza correctamente!",
    html:"CACA PEDO CULO PIS"
}

const adminPayment={
    from: process.env.MAILUSER,
    to: process.env.MAILUSER,
    subject: "¡Este usuario ha pagao!",
    html:"BELTRAN JUNIOR SE HA CAGADO EN LA DUCHA"
}

const adminAcademy={
    from: process.env.MAILUSER,
    to: process.env.MAILUSER,
    subject: "¡Un cerdo se ha registrado!",
    html:"RAUL HA POTADO EN LA DUCHA"
}

const welcomeAcademy={
    from: process.env.MAILUSER,
    to: "",
    subject: "Hola Academia nueva",
    html:"ESTAMOS VERIFICANDO TU CACA DE ACADEMIA"
}

module.exports= {transporter, welcomeMail, paymentMail, adminPayment, adminAcademy, welcomeAcademy};