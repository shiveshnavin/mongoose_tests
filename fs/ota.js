load('api_file.js');
load('api_rpc.js');
let read_data=function(file)
{
    return JSON.parse(File.read(file));
};

let write_data=function(file,data)
{
    File.write(file,JSON.stringify(data));
};



let callback=null;
let download=function(url,name,_callback){


    callback=_callback;
    let args={"url": url, "file": "worker.js.new"};


    RPC.call(RPC.LOCAL,'Fetch',args,function(res){

        print('Download Res',JSON.stringify(res));
        callback(res);
        return true;

    });



};
