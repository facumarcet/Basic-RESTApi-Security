import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './src/routes/crmRoutes';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:Facu020571@ds227352.mlab.com:27352/node_security', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("db connected");
});
// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JWT setup
app.use((req, res, next) => {
    const { headers } = req;
    if (headers && headers.authorization && headers.authorization.split(' ')[0] === 'JWT' ) {
        jwt.verify(headers.authorization.split(' ')[1], 'secretword', (err, decode) => {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});

routes(app);

// serving static files
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`your server is running on port ${PORT}`)
);