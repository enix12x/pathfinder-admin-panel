import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { loadConfig } from './config';
import routes from './routes';

const app = express();
const config = loadConfig();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/theme.js', express.static(path.join(__dirname, '../public/theme.js')));

app.use('/', routes);

app.listen(config.server.port, () => {
  console.log(`Admin panel running on port ${config.server.port}`);
});

