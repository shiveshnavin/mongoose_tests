load('api_config.js'); 
load('api_gpio.js'); 
load('api_sys.js');
load('api_timer.js');
load('api_pwm.js');
load('api_rpc.js');
load('api_events.js');
load('api_net.js');


 	
 	
let red=4;
let green=15;
let blue=5;
let white=19;
let freq=1000;
let CUR_CH=0;
let THR=9;
let RGB_DUTY_RGBW=1;
let W_DUTY_RGBW=1;
 
let RGB_DUTY_CT=1;
let W_DUTY_CT=1;

let TRANSIT_STEP_TIME=400;
let TRANSIT_STEPS=40;
let rgbw={
  r:0,
  g:0,
  b:0,
  w:0 
};
let rgb_prev={
  r:0,
  g:0,
  b:0,
  w:0 
}; 
 

GPIO.set_mode(red, GPIO.MODE_OUTPUT);
GPIO.set_mode(green, GPIO.MODE_OUTPUT);
GPIO.set_mode(blue, GPIO.MODE_OUTPUT);
GPIO.set_mode(white, GPIO.MODE_OUTPUT);

/***************FUNCTIONS******************/

let log=function(str)
{
  print(JSON.stringify(str));
};
let write_bus=function(r_b,g_b,b_b,w_b,freq)
{
   
  //print('Write To Bus : ',r_b,g_b,b_b,w_b);
  PWM.set(red, freq, r_b);
  PWM.set(green, freq, g_b);
  PWM.set(blue, freq, b_b);
  PWM.set(white, freq, w_b);
  
};
let getduty=function(ch,led)
{

	 let duty={
	 	rgb:RGB_DUTY,
	 	w:W_DUTY
	 };
	 if(ch==="rgbw")
	 {
	 	duty.rgbw=RGB_DUTY_RGBW;
	 	duty.w=W_DUTY_RGBW;
	 }
	 else{
	 	duty.rgbw=RGB_DUTY_CT;
	 	duty.w=W_DUTY_CT;
	 }

  return duty;

};

let write_rgbwjs=function(rgbw)
{
  let duty_mult=RGB_DUTY_RGBW;
  let duty_mult_w=W_DUTY_RGBW;
  //log("RGBW");
   
  write_bus((rgbw.r/255)*duty_mult,(rgbw.g/255)*duty_mult,(rgbw.b/255)*duty_mult,(rgbw.w/255)*duty_mult_w,200);
};

let write_ctjs=function(rgbw)
{
  let duty_mult=RGB_DUTY_CT;
  let duty_mult_w=W_DUTY_CT;
  //log("CT");
   
  write_bus((rgbw.r/255)*duty_mult,(rgbw.g/255)*duty_mult,(rgbw.b/255)*duty_mult,(rgbw.w/255)*duty_mult_w,200);
};

let minimum=function(arr) {
  let min = arr[0], max = arr[0];

  for (let i = 1, len=arr.length; i < len; i++) {
    let v = arr[i];
    min = (v < min) ? v : min;
    max = (v > max) ? v : max;
  }

  return  min ;
};

let write_js=function(rgbw)
{
   
   if(rgbw.r>255)
     rgbw.r=255;
   if(rgbw.r<0)
    rgbw.r=0;
    
   if(rgbw.g>255)
     rgbw.g=255;
   if(rgbw.g<0)
    rgbw.g=0;
    
   if(rgbw.b>255)
     rgbw.b=255;
   if(rgbw.b<0)
    rgbw.b=0;
    
   if(rgbw.w>255)
     rgbw.w=255;
   if(rgbw.w<0)
    rgbw.w=0;

   if(rgbw.checked===null)
   {
    let min=minimum([rgbw.r, rgbw.g, rgbw.b]);
    rgbw.r=rgbw.r-min;
    rgbw.g=rgbw.g-min;
    rgbw.b=rgbw.b-min;
    rgbw.w=rgbw.w+min;
   } 
    
    
 
   if(CUR_CH<THR)
   {
     write_rgbwjs(rgbw);
   }
   else if(CUR_CH>THR){
     write_ctjs(rgbw);
   }
  
};

let turn_off=function()
{

		 let off_state={
		  r:0,
		  g:0,
		  b:0,
		  w:0 
		};
	write_rgbwjs(off_state);

};


let transit=function(rgb0,rgb1 ){
      
           let dr=rgb1.r-rgb0.r;
           let dg=rgb1.g-rgb0.g;
           let db=rgb1.b-rgb0.b;
           let dw=rgb1.w-rgb0.w; 
       
       
          if(dr!==0 || dg!==0 || db !==0 || dw!==0  )
          {
            let i=0;
            let rgbwf={
               r:0,
               g:0,
               b:0,
               w:0,
               checked:rgb1.checked 
            };
            let step=10;
            for(i=0;i<=step;i++)
            {
               rgbwf.r=rgb0.r + ((dr * i) / step);
               rgbwf.g=rgb0.g + ((dg * i) / step);
               rgbwf.b=rgb0.b + ((db * i) / step);
               rgbwf.w=rgb0.w + ((dw * i) / step);
               write_js(rgbwf);
               //print(JSON.stringify(rgbwf));
               Sys.usleep(2);
               
            };
      
          }


};


let PREV_CH=0;
RPC.addHandler('set_rgb',function(args){
    
      
      
      
      let rgbw={
          r: (args.r),
          g: (args.g),
          b: (args.b),
          w: (args.w) 
      };


      CUR_CH=args.ch;
      if(PREV_CH!==CUR_CH)
      {
         rgb_prev={
                    r:01,
                    g:01,
                    b:01,
                    w:01 
                  }; 
      }
      PREV_CH=CUR_CH;
      transit(rgb_prev,rgbw);
      rgb_prev=rgbw;
      print(JSON.stringify(args));
      let res={
          "result":"OK",
          "data":args
        };
    return res;
    
  });
let i=0;
let period_in_seconds=10;
let fade_timer=-1;
let rgbwf={
     r:0,
     g:0,
     b:0,
     w:0 
  };
let rgbw=rgbwf;
let fade=function(_rgbw,_period_in_seconds)
{
 
  
  period_in_seconds=_period_in_seconds;
  rgbw =_rgbw;
  rgbwf={
     r:0,
     g:0,
     b:0,
     w:0 
  };
  
  i=0;
  fade_timer=Timer.set(160, Timer.REPEAT, function() {
   
   if(i<period_in_seconds)
   {
    
    
    transit(rgbw,rgbwf);
    transit(rgbwf,rgbw);
    i=i+1;
    
   }
   else{
     turn_off();
     Timer.del(fade_timer);
     fade_timer=-1;
   }
   
   
  }, null);

 


};

let fade_array_timer=-1;
let color_array=[];
let fade_arr=function(_color_array,repeat){


                disable_effects();
                i=0;
   
                color_array=_color_array;
                     
               
                fade_array_timer=Timer.set(160, Timer.REPEAT, function() {
                
                
                    
          
                   let j=i;
                    i++;
                    if(i===color_array.length)
                     i=0;
                    //print(i,JSON.stringify(color_array[i]));
                     
                  
                    transit(color_array[j],color_array[i]);
                    
                    
                
                
                
                }, null);


   



};


let transit_array_timer=-1;
let transit_arr=function(_color_array,repeat){


                disable_effects();
                i=0;
                
                color_array=_color_array;
                     
               
                transit_array_timer=Timer.set(160, Timer.REPEAT, function() {
                
                
                  let off={
                    r:0,g:0,b:0,w:0
                  };
          
                   let j=i;
                    i++;
                    if(i===color_array.length)
                     i=0;
                    //print(i,JSON.stringify(color_array[i]));
                     
                  
                    transit(color_array[j],off);
                    transit(off,color_array[i]);
                    
                    
                
                
                
                }, null);


   



};



let disable_effects=function()
{
 
    if(transit_array_timer!==-1)
      Timer.del(transit_array_timer);
      
    if(fade_array_timer!==-1)
      Timer.del(fade_array_timer);
     
    if(fade_timer!==-1)
      Timer.del(fade_timer);
     

};
/*RPC.addHandler('set_brightness',function(args){
  
  let br=args.brightness;
  if(br>1)
  {
    br=1;
  }
  if(br<0)
  {
    br=0;
  }
  RGB_DUTY_RGBW=br;
  return{
    info:"Brightness is between 0.0 and 1.0 ",
    brightness:RGB_DUTY_RGBW
  };
  
  
});


RPC.addHandler('set_effect',function(args){
    
    disable_effects();

  if(args.effect==="fade"){
    
    if(fade_timer!==-1)
      Timer.del(fade_timer);
    let rgbw_fade=args.rgbw;
    fade(rgbw_fade,args.repeat);
    
    
  }
  else if(args.effect==="fade_array"){
    
    if(fade_array_timer!==-1)
      Timer.del(fade_array_timer);
    
    let rgbw_array=args.rgbw_array;
    fade_arr(rgbw_array,args.repeat);
    
  }else if(args.effect==="transit_array"){
    
    if(transit_array_timer!==-1)
      Timer.del(transit_array_timer);
    
    let rgbw_array=args.rgbw_array;
    transit_arr(rgbw_array,args.repeat);
    
  }
  else if(args.effect==="off")
  {
    turn_off();
  }
  
    return {
      fade_array:args.effect==="fade_array",
      fade:args.effect==="fade",
      off:args.effect==="off"
    };
      

});

RPC.addHandler('set_eff_combined',function(args){



  



});*/

//fade(rgbw_fade,10);