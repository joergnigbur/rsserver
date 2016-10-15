
var Syc = require("syc");


export class RsSycProvider{

    public connect(socket: SocketIO.Socket) : void{
        Syc.connect(socket);
    }

    public syncList(name: string, list:any[]) : void{

        Syc.sync(name, list);

    }
}
