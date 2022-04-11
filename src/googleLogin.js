const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

require("dotenv").config();

const tokenMethods = require("./middleware/tokenMethods");
const { v4: uuid } = require("uuid");
const { tokenPayloadTransformer } = require("./middleware/transformer");

const HOST = JSON.parse(process.env.HOST_LIST)[process.env.HOST_INDEX];
const AUTH_LIST = JSON.parse(process.env.AUTH_LIST);
const AUTH_INDEX = process.env.AUTH_INDEX;
const googleAccountData = AUTH_LIST[AUTH_INDEX];

const userDb = require("./resources/config/models/user");
const tokenDb = require("./resources/config/models/token");

passport.serializeUser((userSession, done) => {
	done(null, userSession);
});

passport.deserializeUser((userSession, done) => {
	done(null, userSession);
});

passport.use(
	new GoogleStrategy(
		{
			clientID: googleAccountData.clientId,
			clientSecret: googleAccountData.clientSecret,
			callbackURL: `${HOST}/auth/google/callback`,
			passReqToCallback: true,
		},
		function (request, accessToken, refreshToken, profile, done) {
			userDb.findOne({ googleId: profile.id }, (errors, user) => {
				if (errors) return console.error(errors);

				const tokenUuid = uuid();
				const userSessionInfo = {
					uuid: tokenUuid,
					googleId: profile.id,
				};

				if (!user) {
					const newUser = tokenPayloadTransformer(profile);
					const newRefreshToken = tokenMethods.createRefreshToken(newUser);

					// Create new profile in UserDb
					userDb.create(newUser, (errors) => {
						if (errors) done(errors, false);
						else {
							// Save new refresh token to TokenDb
							tokenDb.create(
								{
									uuid: tokenUuid,
									ownerGoogleId: newUser.googleId,
									refreshToken: newRefreshToken,
								},
								(errors) => {
									if (errors) console.log(errors);
									else {
										done(null, userSessionInfo);
									}
								}
							);
						}
					});

					return;
				}

				const userInfo = tokenPayloadTransformer(user);
				const newRefreshToken = tokenMethods.createRefreshToken(userInfo);

				// Save new refresh token to TokenDb
				tokenDb.create(
					{
						uuid: tokenUuid,
						ownerGoogleId: userInfo.googleId,
						refreshToken: newRefreshToken,
					},
					(errors) => {
						if (errors) {
							console.log(errors);
						} else {
							done(null, userSessionInfo);
						}
					}
				);
			});
		}
	)
);
