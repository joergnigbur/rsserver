import Socket = require('socket.io');
import {RsKnexConnection} from './RsKnexConnection';
import {RsResult, RsRequest} from 'RsCommon';
import {RsLocalization} from './RsLocalization';

interface RsSocketClient {
    socket: SocketIO.Socket;
    socketId: string;
    locale: string;
}

export class RsSocket {
    private io: SocketIO.Server;
    private dbCon: RsKnexConnection;
    private localize: RsLocalization;
    private clients: RsSocketClient[] = [];
    constructor(http, dbCon: RsKnexConnection) {
        this.localize = new RsLocalization();
        this.dbCon = dbCon;
        this.io = Socket(http);
        var self = this;
        this.io.on('connection', socket => {
            var client: RsSocketClient;
            if (!self.isConnected(socket)) {
                
                var locale = socket.client.request.headers.host.match(/\.(de|at|ch)/);
                locale = locale ? locale[0] : 'de';
                client = { socket: socket, socketId: socket.id, locale: 'de' };
                self.clients.push(client);
                console.log('Socket ' + socket.id + ' connected');

            } else {
                client = self.getClientBySocketId(socket.id);
            }

            socket.on('query', function (data: RsRequest) {

                var controller = require('./controller/' + data.controller);
                controller.execSocket(socket, { baseDir: __dirname, i18n: self.localize.i18n(client.locale) }, self.dbCon.getConnection(), data);

            })


        })

    }
    private isConnected(socket: SocketIO.Socket) : boolean {
        return this.clients.filter(openSocket => {
            return socket.id == openSocket.socketId;
        }).length > 0;
    }
    private getClientBySocketId(id:string) {
        var sockets = this.clients.filter(openSocket => {
            return id == openSocket.socketId;
        });
        return sockets.length > 0 ? null : sockets[0];
    }
}