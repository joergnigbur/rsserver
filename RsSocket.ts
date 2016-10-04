
import * as socketIO from 'socket.io';

import {RsKnexConnection} from './RsKnexConnection';
import {RsResult, RsRequest} from 'rscommon';
import {RsLocalization} from './RsLocalization';
import {RsSycProvider} from './RsSycProvider';

interface RsSocketClient {
    socket: SocketIO.Socket,
    socketId: string;
    locale: string;
    connectedSince: Date;

}

export class RsSocket {
    private io: SocketIO.Server;
    public dbCon: RsKnexConnection;
    public i18n: RsLocalization;
    private clients: RsSocketClient[] = [];
    private socketIds = [];
    
    constructor(sharedSession, session, server, dbCon: RsKnexConnection, config:any) {
        this.i18n = new RsLocalization();
        this.dbCon = dbCon;
        this.io = socketIO().attach(server);
        var self = this;
        var sycProvider = new RsSycProvider();

        this.io.use(sharedSession(session, {
            autoSave:true
        }));

        this.io.on('connection', socket => {


            var sessionIst = socket.handshake['session'];

            console.log(sessionIst);

            var client: RsSocketClient;
            if (!self.isConnected(socket)) {
                sycProvider.connect(socket);
                var locale = socket.client.request.headers.host.match(/\.(de|at|ch)/);
                locale = locale ? locale[1] : 'de';
                client = { socket: socket, socketId: socket.id, locale: locale, connectedSince:new Date()  };
                self.clients.push(client);
                self.socketIds.push(socket.id);

                console.log('Socket ' + socket.id + ' connected');

            } else {
                client = self.getClientBySocketId(socket.id);
            }
            socket.emit('register', { socketId: socket.id, locale: self.i18n.i18n(locale) });
            socket.on('query', function (data: RsRequest) {

                if (data.request)
                    data = data.request;

                var controller = require('./controller/' + data.controller);
                controller.execSocket(socket, { session: sessionIst, rsBaseDir: config.rsBaseDir, baseDir: __dirname, i18n: self.i18n.i18n(client.locale) }, self.dbCon.getConnection(), data);

            })
            socket.on('sycRequest', function (requestName: string) {


                var controller = require('./controller/syc.js');

                controller.execSocket(socket, { session: sessionIst, action: requestName, rsBaseDir: config.rsBaseDir, baseDir: __dirname, i18n: self.i18n.i18n(client.locale) }, self.dbCon.getConnection(), {});

            })
            socket.on("disconnect", socket => {

                self.socketIds.splice(self.socketIds.indexOf(socket.id), 1);

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