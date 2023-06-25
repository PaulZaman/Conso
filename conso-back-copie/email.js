const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'conso.srvc@gmail.com',
		pass: 'hpkwdtsinkgqvwin'
	}
});

module.exports = transporter;