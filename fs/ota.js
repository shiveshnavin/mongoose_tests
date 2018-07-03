load('api_file.js');
load('api_rpc.js');
load('api_sys.js');
let UPD={

    rollback:function(s){
        print('ugh rolling back');
        File.remove('worker.js');
        File.rename('worker.js.bak', 'worker.js');
        s.status="COMMITED_OK";
        write_data('updater_data.json',s);
        Sys.reboot(5);
    },
    commit:function(s)
    {
        s.status="COMMIED_OK";
        write_data("updater_data.json",s);

    }



};
let read_data=function(file)
{
    let clon=File.read(file);
    if(clon===null)
    {
      return null;
    }
    return JSON.parse(clon);
};

let write_data=function(file,data)
{
    print('writing ',JSON.stringify(data));
    File.write(JSON.stringify(data),file);
};



let callback=null;
let download=function(url,name,_callback){


    callback=_callback;
    let args={"url": url, "file": name};

    File.remove(name);
    RPC.call(RPC.LOCAL,'Fetch',args,function(res){

        print('Download Res',JSON.stringify(res));
        callback(res);
        return true;

    });



};
