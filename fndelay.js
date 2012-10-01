/**
 * @license fnDelay Plugin for MelonJS
 * Copyright (C) 2012, Greg Houston
 * http://greghoustondesign.com
 *
 * The SetGameTimout Plugin is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

/**  
 * fnDelay allows you to delay a function in MelonJS using the game logic timer.
 * If the game is paused, the timer is paused.
 * If the game timer is sped up or slowed down fnDelay will remain in sync with the game speed.
 * 
 * To register this plugin:
 * me.plugin.register(FnDelay, "fnDelay");
 *  
 * @syntax:
 * me.plugin.fnDelay.add(fn, delay); 
 *    
 * Or:    
 * me.plugin.fnDelay.add(fn, delay, settings); 
 *
 * @example
 * me.plugin.fnDelay.add(jsApp.addEnemy, 500, {
 *     args: [type, spawnPoint, exitPoint],
 *     // count is the number of times to repeat the function; defaults to 1
 *     count: 3,
 *     // Setting firstNow to true will run the function the first time without a delay; defaults to false 
 *     firstNow: true, 
 *     // onComplete is fired after function has been repeated the number of times in count
 *     onComplete: function(){ jsApp.nextWaveGroup(); } 
 * }); 
 *
 */

var FnDelay = me.plugin.Base.extend({ 
    init: function() {
        this.version = 1.0;
        
        this.step = 1000 / me.sys.fps;
        this.start = me.timer.getTime();
        this.timers = [];
        
        me.plugin.patch(me.ScreenObject, "reset", function () {
            me.plugin.fnDelay.timers = [];
            this.parent();   
        });
        
        // probably isn't necessary to reset this again here
        me.plugin.patch(me.ScreenObject, "destroy", function () {
            me.plugin.fnDelay.timers = [];
            this.parent();   
        });    
                
        me.plugin.patch(me.game, "update", function () {
            
            var plugin = me.plugin.fnDelay;
            plugin.start += plugin.step;        
            
            while (plugin.timers.length && (plugin.start >= plugin.timers[0].timerEnd)) {
                var timer = plugin.timers.shift();                  
            
                // run function with passed arguments 
                timer.fn.apply(null, timer.args);
            
                // see if we need to set another timer
                if (--timer.count) {                       
                    plugin.add(timer.fn, timer.delay, {
                        args: timer.args,
                        count: timer.count,
                        onComplete: timer.onComplete                            
                    });
                }
                else {
                    timer.onComplete();
                }  
            }
            
            this.parent();
        });        
            
    },
    
    add: function(fn, delay, settings) {
        if (!settings) settings = {};
        
        settings.count = settings.count ? settings.count : 1
        
        if (settings.firstNow) {      
            fn.apply(null, settings.args);
            settings.count -= 1;
            if (settings.count < 1) {
                return false;
            }      
        }
            
        var newTimer = {
             fn: fn,
             delay: delay,
             args: settings.args ? settings.args : null,
             count: settings.count,             
             onComplete: settings.onComplete ? settings.onComplete : function() {},
             timerEnd: this.start + delay        
        };
            
        this.timers.push(newTimer);
        this.timers.sort(function (a, b) { return a.timerEnd - b.timerEnd });
    },
    
    clear: function() {
        this.timers = [];    
    }    
            
});