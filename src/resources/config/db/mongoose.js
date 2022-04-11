const mongoose = require("mongoose");
("mongodb+srv://conkgyt:Anhnam9ce@user-info.40vjm.mongodb.net/DB_USER_INFO?retryWrites=true&w=majority");
async function connect() {
	try {
		await mongoose.connect(
			"mongodb+srv://conkgyt:Anhnam9ce@user-info.40vjm.mongodb.net/DB_USER_INFO?retryWrites=true&w=majority",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log("Successful Connection!");
	} catch (error) {
		console.log("Fail Connection!");
	}
}

module.exports = { connect };
