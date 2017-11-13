var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

//requiring routes
var campgroundsRoute = require("./routes/campgrounds"),
    commentsRoute    = require("./routes/comments"),
    indexRoute       = require("./routes/index")

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });

// console.log(process.env.DATABASEURL);
// if(!process.env.DATABASEURL)
// {   
//     process.env.DATABASEURL = "mongodb://localhost/yelp_camp_v4";
// }

//mongoose.connect("mongodb://localhost/yelp_camp_v4");
// mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://test1:sherlock@ds259085.mlab.com:59085/yelpcamp_app");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB()//;

//Passport Configuration
app.use(require("express-session")({
    secret: "What is favourite color?",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoute);
app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/comments", commentsRoute);

app.listen(3030, function(){
   console.log("The YelpCamp Server Has Started!");
})