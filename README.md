fnDelay
=============================================================================

Copyright (C) 2012, Greg Houston

fnDelay is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)


About fnDelay
-------------------------------------------------------------------------------

fnDelay allows you to delay a function in [MelonJS](https://github.com/obiot/melonJS) using the game logic timer.

- If the game is paused, the timer is paused.
- If the game timer is sped up or slowed down fnDelay will remain in sync with the game speed.
- Functions can be set to repeat a specific number of times. By default they run once after the delay.
- For functions that are repeated you can make the first instance fire immediately.

Register fnDelay
-------------------------------------------------------------------------------

To register this plugin:
```javascript
me.plugin.register(FnDelay, "fnDelay");
```

Syntax
-------------------------------------------------------------------------------

```javascript
me.plugin.fnDelay.add(fn, delay); 
```
   
Or:    

```javascript
me.plugin.fnDelay.add(fn, delay, settings);
```

Example
-------------------------------------------------------------------------------

```javascript
me.plugin.fnDelay.add(jsApp.addEnemy, 500, {
    args: [type, spawnPoint, exitPoint],
    // count is the number of times to repeat the function; defaults to 1
    count: 3,
    // setting firstNow to true will run the function the first time without a delay; defaults to false 
    firstNow: true, 
    // onComplete is fired after the function has been repeated the number of times in count
    onComplete: function(){ jsApp.nextWaveGroup(); } 
});
```


