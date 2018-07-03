load('api_events.js');
load('api_gpio.js');
load('api_net.js');
load('api_sys.js');
load('api_config.js');
load('ota.js');


  Cfg.set( {wifi: {sta: {ssid: "JioFi2_00C3E7"}}} );
  Cfg.set( {wifi: {sta: {pass: "ytf47mnfjn"}}} );
  Cfg.set({wifi: {sta: {enable: true}}});
  print("WIFI CONFIGURED");


Event.addGroupHandler(Net.EVENT_GRP, function(ev, evdata, arg) {
  let evs = '???';
  if (ev === Net.STATUS_DISCONNECTED) {
    evs = 'DISCONNECTED';
  } else if (ev === Net.STATUS_CONNECTING) {
    evs = 'CONNECTING';
  } else if (ev === Net.STATUS_CONNECTED) {
    evs = 'CONNECTED';
    
    download(function(){
      print('DWD Done');
    });
    
    
  } else if (ev === Net.STATUS_GOT_IP) {
    evs = 'GOT_IP';
  }
  print('== Net event:', ev, evs);
}, null);
