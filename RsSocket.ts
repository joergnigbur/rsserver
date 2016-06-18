import Socket = require('socket.io');
import {RsKnexConnection} from './RsKnexConnection';


export class RsSocket {
    private io: SocketIO.Server;
    dbCon: RsKnexConnection;

    constructor(http, dbCon: RsKnexConnection) {

        this.dbCon = dbCon;
        this.io = Socket(http);
        var self = this;
        this.io.on('connection', socket => {

            console.log('Socket ' + socket.id + ' connected');
            socket.on('query', function (data: RsRequest) {

                var controller = require('./controller/' + data.controller);
                controller.execSocket(socket, { baseDir: __dirname }, self.dbCon.getConnection(), data);

            })


        })

    }

}