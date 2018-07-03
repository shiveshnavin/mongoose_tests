load('api_events.js');
load('api_gpio.js');
load('api_net.js');
load('api_sys.js');
load('api_config.js');
load('api_pwm.js');
load('ota.js');


  Cfg.set( {wifi: {sta: {ssid: "JioFi2_00C3E7"}}} );
  Cfg.set( {wifi: {sta: {pass: "ytf47mnfjn"}}} );
  Cfg.set({wifi: {sta: {enable: true}}});
  print("WIFI CONFIGURED");

  print('Worker JS vanilla');

  let red = 4;
  let green = 16;
  let blue = 5;
  let white = 19;
  GPIO.set_mode(red,GPIO.MODE_OUTPUT);
  GPIO.set_mode(green,GPIO.MODE_OUTPUT);
  GPIO.set_mode(blue,GPIO.MODE_OUTPUT);
  GPIO.set_mode(white,GPIO.MODE_OUTPUT);
   
   
   PWM.set(blue,200,0.8);
   PWM.set(white,200,0.2);
    
   

