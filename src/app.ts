import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as mongo from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as expressValidator from 'express-validator';
import * as bluebird from 'bluebird';
import * as expressJwt from 'express-jwt';
import * as swaggerUI from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';
import AuthController from './controllers/auth.ctrl';
import UserController from './controllers/user.ctrl';

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({path: '.env.example'});

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, {useMongoClient: true}).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  },
).catch(err => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
  // process.exit();
});

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(expressJwt({
    secret: process.env.JWT_SECRET,
    requestProperty: 'auth',
    getToken: function fromHeader(req: express.Request) {
      const tokenHeader = req.headers.Authorization || req.headers.authorization;
      if (tokenHeader && (tokenHeader as string).split(' ')[0] === 'Bearer') {
        return (tokenHeader as string).split(' ')[1];
      }
    }
  })
    .unless({path: [ /\/api-docs\//g, {url: '/', method: 'OPTIONS'}, /\/auth\//g ]})
);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      msg: 'Invalid or no token supplied',
      code: 401
    });
  }
});

const router: express.Router = express.Router();
new AuthController(router);
new UserController(router);

/**
 * Add swagger endpoints
 */
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1', router);

app.use(router);
app.use((req: express.Request, resp: express.Response) => {
  resp.status(404).send({
    msg: 'Not Found!'
  });
});

module.exports = app;