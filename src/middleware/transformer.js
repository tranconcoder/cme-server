const { v4: uuid } = require("uuid");

module.exports = {
	tokenPayloadTransformer: (payloadObj) => ({
		googleId: payloadObj.googleId || payloadObj.id,
		googleName: payloadObj.googleName || payloadObj.displayName,
		name:
			typeof payloadObj.name === "string"
				? payloadObj.name
				: `${payloadObj.name.givenName || ""}${
						payloadObj.name.familyName ? " " + payloadObj.name.familyName : ""
				  }`,
		email: payloadObj.email,
		avatar: payloadObj.avatar || payloadObj.picture,
	}),
	groupPayloadTransformer: (payloadObj) => ({
		eventId: payloadObj.eventId,
		googleId: payloadObj.googleId,
		name: payloadObj.name,
		classInfoName: payloadObj.classInfoName,
		membersInfo: payloadObj.membersInfo,
		startAt: payloadObj.startAt,
		endAt: payloadObj.endAt,
		duration: payloadObj.duration,
		googleMeetLink: payloadObj.googleMeetLink,
		subject: payloadObj.subject,
	}),
	attendanceHistoryPayloadTransformer: (payloadObj) => ({
		googleId: payloadObj.googleId,
		attendanceData: payloadObj.attendanceData || [],
		chats: payloadObj.chats || [],
		classInfoName: payloadObj.classInfoName || "",
		startAttendanceAt: payloadObj.startAttendanceAt || {
			years: "2004",
			months: "04",
			weekDays: "06",
			dates: "01",
			hours: "11",
			minutes: "00",
			seconds: "00",
		},
		endAttendanceAt: payloadObj.endAttendanceAt || {
			years: "2004",
			months: "04",
			weekDays: "06",
			dates: "01",
			hours: "12",
			minutes: "00",
			seconds: "00",
		},
		totalTimeLearning: payloadObj.totalTimeLearning || 0,
	}),
};
