load('api_file.js'); 
load('api_timer.js'); 
load('api_rpc.js'); 
load('api_sys.js'); 
load('ota.js'); 

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



let size; let fname;
RPC.addHandler('update',function(args){
   

  size=args.size;
  fname=args.name;
 
  download(args.url,fname,function(res){
 
    if(res!==null)
    {
      let s={

        files:[{
  
        file_o:fname,
        file_n:fname+".new"
  
      }],
      status:"TO_COMMIT"

      };   
      write_data("updater_data.json",s);
      print('File Updated...Rebooting now');
      Sys.reboot(5);
    }
    else{
      print('Failed');
    }
    
  });
  return {"result":"Update started !"};

});


RPC.addHandler('downloadFile',function(args){
   

  let url=args.url;
  let name=args.name; 
  download(url,name,function(args){
    print('dwd done...rebooting');
    Sys.reboot(5);
  });
  return {"result":"File Download Start!"};

});

