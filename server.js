import express from 'express';
import morgan from 'morgan';

//import api end points
import { getList, getCount, getStats, searchBattles } from './routes/battles';


//Set up app and use morgan logger
const app = express();
app.use(morgan('dev'));


// API routes
app.route('/list').get(getList);
app.route('/count').get(getCount);
app.route('/stats').get(getStats);
app.route('/search').get(searchBattles);


// ...For all the other requests just send error message
app.route("*").get((req, res) => {
	var err = new Error('Not found');
	res.status(404);
	res.send(err);
});

app.listen(8080);

console.log('listening on port 8080');
