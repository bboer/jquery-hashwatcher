(function($, window, undefined) {

    var handlersKeeper = (function() {

        // Since it is possible assign (watch) more the one handler for some hash keyword,
        // this counter will help generate unique id for each new handler.
        // It make possible unwatch certain handler for that hash keyword (not only all of them).
        var handlerUidCounter = 1;

        // Hold two states: current and previous
        // Helps understand what was changed, appeared or disappeared
        var hashStorage = {
            previous: {
                raw: '', // part of url hashes as it is
                pairs: {} // parsed into the pairs key => value
            },
            current: {
                raw: '',
                pairs: {}
            }
        };

        // Storage for all the registered handlers due to any changes in hash area.
        // It has a such structure:
        //     {
        //       hashkey1: [
        //         {
        //             hashKey: sring,
        //             id: string,
        //             onAppear: function,
        //             onDisappear: function,
        //             onChange: function
        //         },
        //         {}
        //       ],
        //       hashkey2: [
        //         {},
        //         {},
        //         {}
        //       ]
        //     }
        // onAppear, onDisappear and onChange are optional
        var handlerStorage = {};

        // Updates hashStorage object.
        // Current state become previous one and parsed actual hashes
        // into current raw and pairs.
        var syncHashes = function() {
            //var rawHash = window.location.hash.replace( /^#/, '' ) || '';
            var rawHash = window.location.hash.replace(/^(#(!|))/, '') || '';

            // parse hash string into object
            var hashParts = rawHash.split('&');
            hashStorage.previous = hashStorage.current; // remember previous
            hashStorage.current = { raw: rawHash, pairs: {} };

            for (var i = 0, partsLen = hashParts.length; i < partsLen; i ++) {
                var pair = hashParts[i].split('=');
                hashStorage.current.pairs[pair[0]] = pair[1];
            }
        };

        // Find out the difference between current/previous hashes states
        // and invoke appropriate handlers according to.
        var trigger = function(hashKeyHandler) {
            var hashKey = hashKeyHandler['hashKey'],
                wasKeyAppearBefore = hashStorage.previous.pairs.hasOwnProperty(hashKey),
                isKeyAppearedNow = hashStorage.current.pairs.hasOwnProperty(hashKey);

            var currVal = hashStorage.current.pairs[hashKey],
                prevVal = hashStorage.previous.pairs[hashKey];

            if (isKeyAppearedNow && !wasKeyAppearBefore &&
                hashKeyHandler.hasOwnProperty('onAppear')) {

                // invoke onAppear(currVal)
                hashKeyHandler['onAppear'](currVal);
            }

            if (!isKeyAppearedNow && wasKeyAppearBefore &&
                hashKeyHandler.hasOwnProperty('onDisappear')) {

                // invoke onDisappear(prevVal)
                hashKeyHandler['onDisappear'](prevVal);
            }

            if (isKeyAppearedNow && wasKeyAppearBefore && currVal !== prevVal) {

                // invoke onChange(currVal, prevVal)
                hashKeyHandler['onChange'](currVal, prevVal);
            }
        };
        
        return {

            // Push new handler into the handlerStorage
            add: function(handler) {
                var hKey = handler['hashKey'],
                    uid = '_' + handlerUidCounter++;
                
                if (!handlerStorage[hKey]) {
                    // create empty array for hashKey if it wasn't there before
                    handlerStorage[hKey] = [];
                }

                handler['uid'] = uid;
                handlerStorage[hKey].push(handler);

                return uid;
            },

            // Remove handler with certain uid from handlerStorage.
            // hUid parameter is optional. If not passed, all handlers for
            // passed hash key will be removed.
            remove: function(hKey, hUid) {
                if (hUid) {
                    // loop to remove handler only with certain uid
                    for (var i = 0, hLen = handlerStorage[hKey].length; i < hLen; i++) {
                            if (hUid === handlerStorage[hKey][i]['uid']) {
                            handlerStorage[hKey].splice(i, 1);
                        }
                    }
                } else {
                    // remove all handlers for passed hashKey
                    delete handlerStorage[hKey];
                }
            },

            trigger: function(hash) {
                trigger(hash);
            },

            // Invoked on each "hashchange" event
            // Updates hashStorage object and check if it needed to fire
            // appropriate handler(s)
            triggerAll: function() {
                syncHashes();
                // invoke all matched handlers according to hash pairs
                var hashKey;
                for (hashKey in handlerStorage) {
                    var hashKeyHandlers = handlerStorage[hashKey];
                    for (var i = 0, hLen = hashKeyHandlers.length; i < hLen; i++) {
                        trigger(hashKeyHandlers[i]);
                    }
                }
            }
        };
    }());

    var methods = {

        // Add new handler into the watching list.
        //
        //     options: {
        //       hashKey: string,
        //       onAppear: function(hashValue){},
        //       onDisappear: function(){},
        //       onChange: function(hashValue) {},
        //     }
        watch: function(options) {
            
            if (options['hashKey']) {
                var uid = handlersKeeper.add(options);
                handlersKeeper.trigger(options);

                return uid;
            } else {
                $.error("Hash key is not defined, nothing to watch.");
            }
        },
        
        // Remove handler with certain uid from watching list.
        // uid is optional. If not passed, all handlers for
        // passed hash key will be removed.
        unwatch: function(hashKey, uid) {
            if (hashKey) {
                handlersKeeper.remove(hashKey, uid);
            } else {
                $.error("Hash key is not defined, nothing to unwatch.");
            }
        }
    };

    $.fn.hashwatcher = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.hashwatcher');
        }
    };

    $(window).hashchange(function(e) {
        handlersKeeper.triggerAll();
    });

    $(window).hashchange();
    
})(jQuery, this);