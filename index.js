const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express();
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io")
const io = new Server(server,{
    cors: {
      origin: ["http://localhost"],
      allowedHeaders: ["Access-Control-Allow-Origin"],
      credentials: true
    }
});
const hana = require('@sap/hana-client')
const conexion = hana.createConnection()
const parametros = {
      serverNode : '10.1.4.219:30115',
      uid        : 'SYSTEM',
      pwd        : 'V3rt1c4l'
}


app.use(cors());
/*app.use(cors({
    origin: '*'
}));
*/

app.get('/', (req, res) => {
  res.send('<h1>HORIZONTAL SOCKET</h1>');
});
io.on('connection', (socket) =>{
    //console.log('a user connected')
    /*socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
    */
    /*  socket.on('typing', (msg) => {
        socket.broadcast.emit('typing', msg);
      }); 
      */
      socket.on('connectRoom', (room) => {
        console.log('a user connected: '+room)
        socket.join(room);
      });

      socket.on('chat message', (msg,room,usuario) => {
        console.log("escuchó el servidor")
        io.to(room).emit('chat message', 'EMITE SERVIDOR', "nuevo usuario");

        // conexion.connect(parametros, function(err) {
        //   if (err) throw err;
        //   conexion.exec('select count(config."WtmCode") as total from "VERTICAL_PRODUCTIVO"."OWTM" config inner join "VERTICAL_PRODUCTIVO"."WTM1" det_config on det_config."WtmCode" = config."WtmCode" inner join "VERTICAL_PRODUCTIVO"."OUSR" usuario on usuario."USERID" = det_config."UserID"'
        //   , function (err, result) {
        //     if (err) throw err;
        //     console.log(result);
        //     io.to(room).emit('chat message', result[0].TOTAL, usuario);
        //     conexion.disconnect();
        //   })
        // });
      });
      socket.on('typing', (msg,room) => {
        socket.broadcast.emit('typing', msg,room);
      }); 
      
});

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});