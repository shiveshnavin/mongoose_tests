load('api_file.js'); 
load('api_timer.js'); 
load('api_rpc.js'); 
load('ota.js'); 

let s = read_data('update.json');
  if(s===null)
  {
    s={

      files:[],
      status:"COMMITED_OK"

    };
    write_data('update.json',s);
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
     
      s = read_data('update.json');
      if(s.status==="COMMIED_OK"){

        print('Seems all went ok');
      }
      else{
        print('ugh rolling back');
        File.remove('worker.js');
        File.rename('worker.js.bak', 'worker.js');
        s.status="COMMITED_OK";
        write_data('update.json',s);
        Sys.reboot(5);
      }
      
    
  }, null);
  load('worker.js');
}



let size;
RPC.addHandler('update',function(args){
   

  let url=args.url;
  let name=args.name;
  size=args.size;
  s = read_data('update.json');
  if(s!==null)
  {
    s.files[0]={

      file_o:args.name,
      file_n:args.name+".new"

    };
    write_data('update.json',s);
  }
  download(url,name,function(res){

    if(res!==null)
    {
      
      s = read_data('update.json');
      s.status="TO_COMMIT";
      write_data("update.json",s);
      print('File Updated...Rebooting now');
      Sys.reboot(5);
    }
    else{
      print('Failed');
    }
    
  });
  return {"result":"Update started !"};

});

