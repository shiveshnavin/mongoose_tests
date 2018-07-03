load('api_file.js');
load('api_rpc.js');

let callback=null;
let download=function(_callback){


    callback=_callback;
    let args={"url": "http://hoptech.in/tmp/pic.bin", "file": "pic1.bin"};


    RPC.call(RPC.LOCAL,'Fetch',args,function(res){

        print('Download Res',JSON.stringify(res));
        callback();
        return true;

    });



};
