const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const methodOverride = require("method-override");
const history = require("connect-history-api-fallback");

const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccount.json");

const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

const { authenticate, classifyRequester } = require("./authMiddleware");

const productionMongoURI =
  "mongodb+srv://admin:admin1234@cluster0.0yuyemj.mongodb.net/?retryWrites=true&w=majority";
const mongoURI = process.env.MONGODB_URI || productionMongoURI; // before it was "mongodb://127.0.0.1:27017/serverTestDB", will delete later

const productionPort = 3000;
const port = process.env.PORT || productionPort;

const apiVersion = "v1";

// Connect to MongoDB
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB!");
}

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan("dev"));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options("*", cors());
app.use(cors());

// Initialize Firebase Admin SDK
const projectId = serviceAccount.project_id;
const databaseURL = `https://${projectId}.firebaseio.com`;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

// Enable HTTP method overriding (currently used for the /admins/ API endpoint)
//app.use(methodOverride('_method')); // for using with 'x-www-form-urlencoded' or 'form-data' request body formats. currently not in use.
app.use(methodOverride((req) => req.body._method)); // for using with 'json' request body format.

const welcomeMessage = function (req, res) {
  res.json({
    message: `Welcome to the API of JobSearch. Current recommended version is ${apiVersion}.`,
  });
};

app.get("/api", welcomeMessage);
app.get("/", welcomeMessage);

app.use(authenticate);

app.use(classifyRequester);

app.get(`/api/v1/getUserType`, async (req, res) => {
  console.log("got here")
  if(req.none){
    return res.json({ userType: "none" });
  }
});


//App routes
app.use(`/api/${apiVersion}/companies`, companyRoutes);
app.use(`/api/${apiVersion}/admins`, adminRoutes);
app.use(`/api/${apiVersion}/applications`, applicationRoutes);
app.use(`/api/${apiVersion}/jobs`, jobRoutes);
app.use(`/api/${apiVersion}/candidates`, candidateRoutes);


// Catch all non-error handler for api (i.e., 404 Not Found)
app.use("/api/*", function (req, res) {
  res.status(404).json({ message: "Not Found" });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + "/..");
var client = path.join(root, "client", "dist");
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get("env");
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack);
  var err_res = {
    message: err.message,
    error: {},
  };
  if (env === "development") {
    // Return sensitive stack trace only in dev mode
    err_res["error"] = err.stack;
  }
  res.status(err.status || 500);
  res.json(err_res);
});

app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Express server listening on port ${port}, in ${env} mode`);
  console.log(`Backend: http://localhost:${port}/api/`);
  console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
