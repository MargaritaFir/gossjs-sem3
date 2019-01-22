const express = require('express');
const { get } = require ('axios');
const bodyParser = require('body-parser');
const session = require('express-session');

let items;
const PORT = 4321;
const URL = 'https://kodaktor.ru/j/users';
const app = express();

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers',
};

const checkAuth = (r, res, next) => {
    if (r.session.auth === 'ok') {
        next();
    } else {
        res.redirect('/login');
    }
};

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(session({ secret: 'mysecret', resave: true, saveUninitialized: true}))
    .get('/', r => r.res.render('author'))
    .get(/author/, r => r.res.set(CORS).end('Фирсова Маргарита'))
    .get(/hello/, r => r.res.end('Hello World'))
    .get(/login/, r => r.res.render('login'))
    .post('/login/check/', r => {
        const { body: { login: l }} = r;
        const user = items.find(({ login }) => login === l);
        if (user) {
            if (user.password === r.body.pass) {
                r.session.auth = 'ok';
                r.res.redirect('/users');
            } else {
                r.res.send('Wrong pass');
            }
        } else {
            r.res.send('No such user');
        }
    })
    .get(/logout/, r => {
        if (r.session.auth === 'ok') {
            r.session.auth = '';
            r.res.redirect('/login');
        } else {
            r.res.redirect('/login');
        }
    })
    .get(/users/, checkAuth, async r => r.res.render('list', { title: 'Login list', items }))
    .use(r => r.res.status(404).end('Not here, sorry'))
    .use((e, r, res, n) => res.status(500).end(`Error: ${e}`))
    .set('view engine', 'pug')
    .listen(process.env.PORT || PORT, async () => {
    console.log(`Start process ${process.pid}`);
    ({ data: { users: items }} = await get(URL));
});