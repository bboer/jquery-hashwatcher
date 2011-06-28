# jquery.hashwatcher.js - [jQuery](http://jquery.com/) plugin #

jquery.hashwatcher.js allow bind custom handlers that will fired on 
changing key hashes in user browser address bar.

There are **watch** and **neglect** methods.

## watch ##
Watch some certain hash key. It is possible bind more 
than one handlers to the same hash key.

Handler allows invoke callbacks when hash key 
*appearing* in url, *disappearing* and when its value *changed*.

#### example 1: ####
    $(window).hashwatcher('watch', {
        hashKey: 'status',
        onAppear: function(hashValue) {
            console.log('hashKey' + ' hashKey has appeared.');
            console.log('It has value "' + hashValue + '"');
        },
        onDisappear: function(hashValue) {
            console.log('hashKey' + ' hashKey has disappeared.');
            console.log('Its value was "' + hashValue + '"');
        },
        onChange: function(newHashValue, oldHashValue) {
            console.log('hashKey' + ' hashKey has changed.');
            console.log('Its old value was "' + oldHashValue + '" and new one is "' + newHashValue + '"');
        }
    });

## neglect ##
Gets an hash key value. Will return something valuable only of value is set.
To check existence of hash key in url, despite of its value, try method exists.

#### example ####
    var hUid1 = $(window).hashwatcher('watch', {hashKey:'status', ...});
    var hUid2 = $(window).hashwatcher('watch', {hashKey:'status', ...});
    $(window).hashwatcher('neglect', 'status', hUid1);


#### example 2: ####
    $(window).hashwatcher('neglect', 'status');


## jQuery versions compatable ##
1.3.\*-1.6.\*

## Browsers compatable ##
MS Internet Explorer 6-9, Firefox 2-5, Chrome 5-12, Safari 3.2-5, Opera 9.6-11.50, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.

## License ##
Licensed under the MIT license.

## Questions? ##
* Email: avakarev@gmail.com
* Twitter: [@avakarev](http://twitter.com/#!/avakarev/)