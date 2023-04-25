const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const fs = require('fs/promises');

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running')
});

const getConflictingBooking = (dates, searchDates) => {
    return dates.filter((dat) => {
        if (searchDates.from >= dat.to || searchDates.to < dat.from) {
            return false;
        }

        return true;
    });
}

router.render = (req, res) => {
    const [path] = req.originalUrl.split('?');

    if (path.slice(1) === 'search_rooms') {
        fs.readFile('./db.json',  { encoding: 'utf8' }).then((file) => {
            const roomsData = JSON.parse(file).rooms;
            const requestParams = req.query;

            const result = roomsData.filter((room) => {
                return getConflictingBooking(room.dates, {from: requestParams.from, to: requestParams.to}).length === 0;
            })

            res.status(200).jsonp(result);
        })
    } else {
        res.jsonp(res.locals.data);
    }
}