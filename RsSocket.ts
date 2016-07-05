import Socket = require('socket.io');
import {RsKnexConnection} from './RsKnexConnection';
import {RsResult, RsRequest} from 'rscommon';
import {RsLocalization} from './RsLocalization';

interface RsSocketClient {
    socket: SocketIO.Socket;
    socketId: string;
    locale: string;
    connectedSince: Date;
   
}

export class RsSocket {
    private io: SocketIO.Server;
    public dbCon: RsKnexConnection;
    public i18n: RsLocalization;
    private clients: RsSocketClient[] = [];
    
    constructor(http, dbCon: RsKnexConnection) {
        this.i18n = new RsLocalization();
        this.dbCon = dbCon;
        this.io = Socket(http);
        var self = this;
        this.io.on('connection', socket => {
            var client: RsSocketClient;
            if (!self.isConnected(socket)) {
                
                var locale = socket.client.request.headers.host.match(/\.(de|at|ch)/);
                locale = locale ? locale[1] : 'de';
                client = { socket: socket, socketId: socket.id, locale: locale, connectedSince:new Date() };
                self.clients.push(client);

            
                console.log('Socket ' + socket.id + ' connected');

            } else {
                client = self.getClientBySocketId(socket.id);
            }
            socket.emit('register', { socketId: socket.id, locale: self.i18n.i18n(locale) });
            socket.on('query', function (data: RsRequest) {

                if (data.request)
                    data = data.request;

                var controller = require('./controller/' + data.controller);
                controller.execSocket(socket, { baseDir: __dirname, i18n: self.i18n.i18n(client.locale) }, self.dbCon.getConnection(), data);

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