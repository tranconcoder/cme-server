const path = require("path");

class Download {
	excelForm(req, res) {
		const filePath = path.join(__dirname, "../files/CME-File mẫu.xlsx");

		res.download(filePath);
	}
}

module.exports = new Download();
