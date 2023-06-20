const sequelize = require('./database/connection');
const User = require('./models/UserModel');
const faker = require('faker');
const Bank = require('./models/BankModel');
const Banker = require('./models/BankerModel');
const LoanApplication = require('./models/LoanApplicationModel');
const Message = require('./models/MessageModel');
const Offer = require('./models/OfferModel');
const Document = require('./models/DocumentModel');
const DocumentType = require('./models/DocumentTypeModel');
const Token = require('./models/TokenModel');

docs = [
	{ nametype: "ID" },
	{ nametype: "Proof of address" },
	{ nametype: "Proof of income" },
	{ nametype: "Proof of employment" },
	{ nametype: "Proof of bank account" },
	{ nametype: "Proof of loan" },
	{ nametype: "Proof of loan payment" },
];

// Synchronize the models with the database
sequelize
	.sync({ force: true }) // Set force: true to drop existing tables (careful in production)
	.then(async () => {
		console.log('\nDatabase synchronized\n');
		// Create the default document types
		for (const doc of docs) {
			try {
				await DocumentType.create({ nametype: doc.nametype });
			} catch (error) {
				console.log(error);
			}
		}

		// create admin
		User.create({
			firstname: 'admin',
			lastname: 'admin',
			email: 'admin@gmail.com',
			password: 'admin',
			dob: '1999-01-01',
			is_verified: true,
		});

		// Create 10 random users
		for (let i = 0; i < 10; i++) {
			User.create({
				firstname: faker.name.firstName(),
				lastname: faker.name.lastName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
				dob: faker.date.past(),
				is_verified: true,
			});
		}

		// Create 10 random banks
		for (let i = 0; i < 10; i++) {
			let n_required = Math.floor(Math.random() * 7) + 1;
			let documents_required = {};
			for (let j = 1; j < n_required; j++) {
				documents_required[j] = true;
			}
			Bank.create({
				name: faker.company.companyName(),
				documents_required: documents_required
			});
		}
	})

	.catch((error) => {
		console.error('Error synchronizing database:', error);
	});
