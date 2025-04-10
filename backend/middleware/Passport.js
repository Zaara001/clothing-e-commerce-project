const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/userModel");
const Seller = require("../model/sellerSchema");

// Debugging: Log environment variables
console.log("Google Client ID (User):", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client ID (Seller):", process.env.GOOGLE_CLIENT_ID_SELLER);

// Google OAuth for Users
passport.use(
  "google-user",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Ensure profile.emails exists before accessing its value
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email,
            googleId: profile.id,
            authProvider: "google",
            role: "customer",
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);


// Google OAuth for Sellers
passport.use(
  "google-seller",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_SELLER, // Ensure this is correct
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_SELLER, // Ensure this is correct
      callbackURL: process.env.GOOGLE_CALLBACK_URL_SELLER, // Ensure this is correct
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let seller = await Seller.findOne({ email: profile.emails[0].value });

        if (!seller) {
          seller = new Seller({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            authProvider: "google",
            role: "seller",
          });
          await seller.save();
        }

        return done(null, seller);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id) || await Seller.findById(id);
  done(null, user);
});