import path from "path";

import nodemailer from "nodemailer"
import hbs from "nodemailer-express-handlebars";

import mailConfig from "../config/mail.json" assert {type: "json"}

const { host, port, user, pass } = mailConfig

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass},
});

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

export default transport;