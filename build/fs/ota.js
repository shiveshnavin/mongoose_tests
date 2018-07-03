load('api_file.js');
load('api_rpc.js');
load('api_sys.js');
load('api_timer.js');
let UPD={

    rollback:function(s){
        print('ugh rolling back');
        File.remove('worker.js');
        File.rename('worker.js.bak', 'worker.js');
        s.status="COMMITED_OK";
        write_data('updater_data.json',s);
        Sys.reboot(5);
    },
    commit:function()
    {
        let s={
          files:[],
          status:"COMMIED_OK"
        };
        write_data("updater_data.json",s);

    },
    check:function()
    {
              
        let s = read_data('updater_data.json');
          if(s===null)
          {
            s={
        
              files:[],
              status:"COMMITED_OK"
        
            };
            write_data('updater_data.json',s);
          }
        if(s.status==="COMMITED_OK")
        {
          load('worker.js');
        }
        else if(s.status==="TO_COMMIT")
        {
          print('Seems like changes to be commited');
          File.rename('worker.js', 'worker.js.bak');
          File.rename('worker.js.new', 'worker.js');
          Timer.set(10000  , 0, function() {
             
              s = read_data('updater_data.json');
              if(s.status==="COMMIED_OK"){
        
                print('Seems all went ok');
              }
              else{
               UPD.rollback(s);
              }
              
            
          }, null);
          load('worker.js');
        }
        
        
      return s;

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
