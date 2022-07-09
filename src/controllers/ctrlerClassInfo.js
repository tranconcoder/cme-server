const { ObjectId } = require('mongodb');
const { v4: uuid } = require('uuid');
const Joi = require('joi');

const userDb = require('../resources/config/models/user');
const classInfoDb = require('../resources/config/models/classInfo');

const {
	classInfoSocket: {
		emitChangeClassInfo,
		emitCreateClassInfo,
		emitDeleteClassInfo,
	},
} = require('../socket');
const {
	requestClassInfoSchema,
	requestCheckOnlineFormPassword,
	requestChangeOnlineFormPassword,
	requestCheckUniqueInfo,
} = require('../joiSchema');

class ClassInfo {
	async renderAddStudentForm(req, res) {
		try {
			const { googleId, classInfoId } = req.params;

			if (classInfoId.length !== 24) {
				throw [401, 'classInfoId is invalid.'];
			}

			const classInfo = await classInfoDb.findOne({
				_id: new ObjectId(classInfoId),
				googleId,
			});

			if (!classInfo) {
				throw [404, 'Not found classInfo in DB.'];
			}

			const { onlineFormPassword } = classInfo;

			if (classInfo) {
				if (classInfo.acceptNewRequest) {
					const formAuthorInfo = await userDb.findOne({ googleId });
					const hasPassword = onlineFormPassword.length > 0;

					res.locals.hasPassword = hasPassword;
					res.locals.authorName = formAuthorInfo.name;
					res.locals.googleId = googleId;
					res.locals.classInfoId = classInfoId;
					res.locals.classInfoName = classInfo.classInfoName;
					res.locals.onlineFormUrl = classInfo.onlineFormUrl;
				}

				if (!classInfo.acceptNewRequest) {
					throw [
						401,
						'<h1>Chủ biểu mẫu đã bật từ chối yêu cầu mới, vui lòng liên hệ nếu muốn tiếp tục nhập.</h1>',
					];
				}

				return res.render('addStudent/addStudent');
			}

			res.status(404).send('This link is invalid!');
		} catch ([code, message]) {
			return res.status(code).send(message);
		}
	}

	renderAddStudentSuccess(req, res) {
		res.locals.onlineFormUrl = req.query.onlineFormUrl || '#';

		res.render('addStudent/addStudentSuccess');
	}

	async addStudent(req, res) {
		try {
			// Validate request data
			const {
				value: {
					googleId,
					classInfoIdToAdd,
					studentInfoToAdd,
					passwordToAdd,
				},
				error,
			} = requestClassInfoSchema.validate(req.body);

			if (error) throw [401, error];

			// Find classInfoToAdd
			const classInfoToAdd = await classInfoDb.findOne({
				_id: classInfoIdToAdd,
				googleId,
			});

			if (!classInfoToAdd) {
				throw [404, 'Not found classInfoToAdd in DB.'];
			}

			const { acceptNewRequest } = classInfoToAdd;

			// Check state accept new request
			if (!acceptNewRequest) {
				throw [417, 'This online form is disabled.'];
			}

			// Password check
			if (classInfoToAdd.onlineFormPassword !== passwordToAdd) {
				throw [401, 'Unauthorized.'];
			}

			const newStudentList = classInfoToAdd.studentList.filter(
				student => student.googleName !== studentInfoToAdd.googleName
			);

			const indexIsUsed = newStudentList.find(
				student => student.index === studentInfoToAdd.index
			);

			if (indexIsUsed) {
				let maxIndex = newStudentList[0].index;

				newStudentList.forEach(({ index }) => {
					if (index > maxIndex) maxIndex = index;
				});

				newStudentList.push({
					id: uuid(),
					index: maxIndex + 1,
					googleName: studentInfoToAdd.googleName,
					name: studentInfoToAdd.name,
					email: studentInfoToAdd.email,
				});
			} else {
				newStudentList.push({
					id: uuid(),
					index: studentInfoToAdd.index,
					googleName: studentInfoToAdd.googleName,
					name: studentInfoToAdd.name,
					email: studentInfoToAdd.email,
				});
			}

			classInfoDb
				.findOneAndUpdate(
					{ _id: classInfoIdToAdd, googleId },
					{ $set: { studentList: newStudentList } },
					{ new: true }
				)
				.then(updatedClassInfo => {
					emitChangeClassInfo(googleId, updatedClassInfo);

					res.status(201).json(updatedClassInfo);
				})
				.catch(errors => res.status(500).send(new Error(errors)));
		} catch ([code, message]) {
			return res.status(code).send(message);
		}
	}

	async checkFormPassword(req, res) {
		const {
			value: { googleId, classInfoId, classInfoPassword },
			error,
		} = requestCheckOnlineFormPassword.validate(req.body);

		if (error) return res.status(401).send(error);

		const classInfoHasThisPassword = await classInfoDb.findOne({
			_id: new ObjectId(classInfoId),
			googleId,
			onlineFormPassword: classInfoPassword,
		});

		if (classInfoHasThisPassword) return res.status(200).json(true);

		res.status(403).json(false);
	}

	changeOnlineFormPassword(req, res) {
		const { googleId } = req.jwtPayload;

		const {
			value: { oldPassword, newPassword },
			error,
		} = requestChangeOnlineFormPassword.validate(req.body);

		if (error) return res.status(401).send(error);

		classInfoDb
			.findOneAndUpdate(
				{ googleId, onlineFormPassword: oldPassword },
				{ onlineFormPassword: newPassword },
				{ new: true }
			)
			.then(updatedClassInfo => {
				if (!updatedClassInfo) throw 'Not found classInfo in DB.';

				emitChangeClassInfo(googleId, {
					...updatedClassInfo._doc,
					classInfoNameBeforeUpdate: updatedClassInfo.classInfoName,
				});

				res.status(200).json(updatedClassInfo);
			})
			.catch(errors => {
				res.status(500).send(errors);
			});
	}

	checkUniqueInfo(req, res) {
		const {
			value: { googleId, classInfoId, index, googleName, email },
			error,
		} = requestCheckUniqueInfo.validate(req.body);

		if (error) return res.status(401).send(error);

		classInfoDb
			.findOne({ _id: classInfoId, googleId })
			.then(classInfo => {
				if (!classInfo) {
					return res.status(404).send('Not found classInfo in Db.');
				}

				const { studentList } = classInfo;
				const infoFieldsNotUnique = [];

				studentList.forEach(student => {
					if (index && index === +student.index) {
						infoFieldsNotUnique.push('index');
					}

					if (googleName && googleName === student.googleName) {
						infoFieldsNotUnique.push('googleName');
					}

					if (email && email === student.email) {
						infoFieldsNotUnique.push('email');
					}
				});

				res.status(200).json([...new Set(infoFieldsNotUnique)]);
			})
			.catch(errors => res.status(500).send(new Error(errors)));
	}

	get(req, res) {
		const { classInfoName } = req.query;
		const { googleId } = req.jwtPayload;

		if (!classInfoName) {
			return res.status(401).send('Missing classInfoName');
		}

		classInfoDb
			.findOne({ googleId, classInfoName })
			.then(classInfo => {
				if (!classInfo) {
					return res.status(404).send('Not found classInfo in DB.');
				} else {
					res.status(200).json(classInfo);
				}
			})
			.catch(errors => res.status(500).send(new Error(errors)));
	}

	getAll(req, res) {
		const { googleId } = req.jwtPayload;

		classInfoDb.find({ googleId }).then(allClassInfo => {
			if (Array.isArray(allClassInfo)) {
				if (allClassInfo.length === 0) {
					// If not have classInfo -> created default classInfo
					classInfoDb
						.create({ googleId, classInfoName: 'default' })
						.then(createdClassInfo =>
							res.status(201).json([createdClassInfo])
						)
						.catch(errors =>
							res.status(500).send(new Error(errors))
						);
				} else res.status(200).json(allClassInfo);
			} else {
				res.status(404).send("Can't not found any classInfo in DB.");
			}
		});
	}

	async add(req, res) {
		const { googleId } = req.jwtPayload;
		const { classInfoToAdd } = req.body;

		if (
			!classInfoToAdd ||
			!classInfoToAdd.classInfoName ||
			!classInfoToAdd.studentList
		) {
			return res.status(401).send('Missing credentials.');
		}

		const classInfoNameWasExisted = !!(await classInfoDb.findOne({
			googleId,
			classInfoName: classInfoToAdd.classInfoName,
		}));

		if (classInfoNameWasExisted) {
			return res.status(409).send('This classInfoName was existed');
		}

		classInfoDb
			.create({ ...classInfoToAdd, googleId })
			.then(newClassInfo => {
				if (!newClassInfo) {
					return res.status(404).send('Not found created classInfo.');
				}

				emitCreateClassInfo(googleId, newClassInfo);

				res.status(201).json(newClassInfo);
			})
			.catch(errors => {
				res.status(500).send(new Error(errors));
			});
	}

	update(req, res) {
		const { googleId } = req.jwtPayload;
		const { classInfoNameToUpdate, newClassInfo } = req.body;

		if (!classInfoNameToUpdate || !newClassInfo) {
			return res.status(401).send('Missing credentials.');
		}

		classInfoDb
			.findOneAndUpdate(
				{ googleId, classInfoName: classInfoNameToUpdate },
				newClassInfo,
				{
					new: true,
				}
			)
			.then(updatedClassInfo => {
				if (!updatedClassInfo) {
					return res
						.status(404)
						.send('Not found updatedClassInfo in DB.');
				}

				// Change class info name to old class info name
				updatedClassInfo = {
					...updatedClassInfo._doc,
					classInfoNameBeforeUpdate: classInfoNameToUpdate,
				};

				emitChangeClassInfo(googleId, updatedClassInfo);

				res.status(201).json(updatedClassInfo);
			})
			.catch(errors => {
				res.status(500).send(new Error(errors));
			});
	}

	delete(req, res) {
		const { googleId } = req.jwtPayload;
		const { classInfoNameToDelete } = req.query;

		if (!classInfoNameToDelete) {
			return res
				.status(401)
				.send('Missing classInfoName in queryRequest.');
		}

		classInfoDb
			.deleteOne({ googleId, classInfoName: classInfoNameToDelete })
			.then(() => {
				emitDeleteClassInfo(googleId, classInfoNameToDelete);

				res.status(200).send('Deleted success.');
			})
			.catch(errors => {
				res.status(500).send(new Error(errors));
			});
	}
}

module.exports = new ClassInfo();
