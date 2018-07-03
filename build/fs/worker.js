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

  print('Worker JS vanilla');

