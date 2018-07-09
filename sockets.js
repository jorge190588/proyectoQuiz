exports.handle = function(server, session)
{
    var io = require('socket.io')(server);
    // Json para controlar que no existan nombres repetidos
    var usuariosConectados = [];
    var contadorConexiones = 0;

    io.use((socket,next)=>{
        session(socket.request, socket.request.res, next);
    });

    io.sockets.on('connection',function(socket){
        if(socket.request.session.nombre)
        {
            if(usuariosConectados.indexOf(socket.request.session.nombre) != -1){
                updateNicknames();
            }else{
                socket.nickname = socket.request.session.nombre;
                usuariosConectados.push(socket.nickname);
                updateNicknames();
            }

            console.log("ARRAY CONECTADOS: "+usuariosConectados);
        }
        
        contadorConexiones = usuariosConectados.length;
        socket.emit('conectados',contadorConexiones);
        socket.broadcast.emit('conectados',contadorConexiones)

        function updateNicknames(){
            io.sockets.emit('listaUsuarios',usuariosConectados);    
        }
        
        //Se dispara cuando alguien se desconecta
        socket.on('disconnect',function(){
            if(!socket.nickname) return;
            usuariosConectados.splice(usuariosConectados.indexOf(socket.nickname), 1);
            updateNicknames();
            //console.log("Cantidad de conexiones al Desconectar "+contadorConexiones);
        });

        //Evento para cuando el administrador inicia el juego
        socket.on('empezar juego',function(empezar){
            //console.log('EMPEZAR EL JUEGO -> '+empezar);
            io.sockets.emit('empezar',empezar);            
        });

        // Crear el timer en el servidor a partir de un evento recibido desde el cliente
        socket.on('timer',function(time,terminado){
            //console.log("Timer recibido del cliente",);
            var timerInterval;
            var segundosSetInterval = 1000;            
            var terminado = true;
            function timePlus()
            {
                time++;
                console.log(time);
                io.sockets.emit('timer',time,terminado);                            

                socket.on('terminar time',function(terminar){                                                                                        
                    //setInterval(timeClear,segundosSetInterval);                        
                    //console.log("Debe terminar -> VALOR DE TIME: "+time);
                    //clearInterval(timerInterval);
                    //clearInterval(timerInterval);
                    //var terminarTime = 0;
                    //io.sockets.emit('terminar client',terminarTime);                    
                    stopTimer();
                    terminado = false;
                    io.sockets.emit('timer terminado final',terminado);                    
                });
            
            }                        

            timerInterval = setInterval(timePlus,segundosSetInterval,'Node JS');                        

            function stopTimer()
            {
                clearInterval(timerInterval);
            }
        });
    });
}