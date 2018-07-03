load('api_file.js');
load('api_rpc.js');

let callback=null;
let download=function(_callback){


    callback=_callback;
    let args={"url": "http://192.168.1.102/chunk/download.php", "file": "chunk"};


    RPC.call(RPC.LOCAL,'Fetch',args,function(res){

        print('Download Res',JSON.stringify(res));
        callback();
        return true;

    });



};
