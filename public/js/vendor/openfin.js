/**
 * name:    OpenFin Desktop JavaScript Adapter
 * version: <?OPENFIN:DEPLOY_VERSION?>
 */


var fin = fin || {};

fin.desktop = fin.desktop || {};

(function() {
    'use strict';

    fin.desktop.Application = function(options, callback, errorCallback) {
        console.log("these are the components");
        console.log(components);
        var opt = components.deepObjCopy(options);

        this.name = opt.name;
        this.uuid = opt.uuid;
        this.mainWindowOptions = opt.mainWindowOptions;

        if (typeof this.mainWindowOptions == "object") {
            this.mainWindowOptions.defaultHeight = Math.floor(this.mainWindowOptions.defaultHeight);
            this.mainWindowOptions.defaultWidth = Math.floor(this.mainWindowOptions.defaultWidth);
            this.mainWindowOptions.defaultTop = Math.floor(this.mainWindowOptions.defaultTop);
            this.mainWindowOptions.defaultLeft = Math.floor(this.mainWindowOptions.defaultLeft);
        }

        if (!opt._noregister) {
            components.sendMessageToDesktop('create-application', opt, callback, errorCallback);
        }

        this.window = new fin.desktop.Window({
            _noregister: true,
            _nocontentwindow: true,
            uuid: this.uuid,
            name: this.uuid
        });

        this._private = {};

        if (opt) {
            var icon = opt.icon || opt.applicationIcon;
            var mainWindowOptions = opt.mainWindowOptions || {};
            if (!icon && mainWindowOptions) {
                icon = mainWindowOptions.icon || mainWindowOptions.taskbarIcon;
            }

            this._private.icon = icon || "";
        }
    };

    fin.desktop.Application.getCurrent = function() {
        if (!this._instance) {
            this._instance = fin.desktop.Application.wrap(components.applicationUuid);
        }
        return this._instance;
    };

    fin.desktop.Application.getCurrentApplication = function() {
        console.warn("Function is deprecated");
        if (!this._instance) {
            this._instance = fin.desktop.Application.wrap(components.applicationUuid);
        }
        return this._instance;
    };

    fin.desktop.Application.wrap = function(uuid) {
        return new fin.desktop.Application({
            uuid: uuid,
            _noregister: true
        });
    };

    fin.desktop.Application.invoke = function(uuid, callback, errorCallback) {
        var opt = {
            uuid: uuid
        };
        components.sendMessageToDesktop('invoke-application', opt, callback, errorCallback);
        return fin.desktop.Application.wrap(uuid);
    };

    fin.desktop.Application.prototype = {
        addEventListener: function(type, listener, callback, errorCallback) {

            var subscriptionObject = {
                topic: "application",
                uuid: this.uuid
            };

            // If type is an object unwrap to get configuration
            if (typeof type == "object" && type.data && type.type) {
                subscriptionObject.type = type;
                subscriptionObject.data = type.data;
                // Else use default behavior
            } else {
                subscriptionObject.type = type;
            }

            components.addDesktopEventCallback(subscriptionObject, listener, this, callback, errorCallback);
        },
        close: function(force, callback, errorCallback) {
            components.sendMessageToDesktop('close-application', {
                uuid: this.uuid,
                force: force
            }, callback, errorCallback);
        },
        getChildWindows: function(callback, errorCallback) {
            var uuid = this.uuid;
            components.sendMessageToDesktop('get-child-windows', {
                uuid: uuid
            }, function(evt) {
                var children = [];
                if (evt && typeof Array.isArray(evt)) {
                    for (var i = 0; i < evt.length; ++i) {
                        children.push(fin.desktop.Window.wrap(uuid, evt[i]));
                    }
                }

                if (typeof callback == 'function') callback(children);
            }, errorCallback);
        },
        getGroups: function(callback, errorCallback) {
            var me = this;
            components.sendMessageToDesktop('get-application-groups', {
                uuid: this.uuid
            }, function(groupInfo) {
                var allGroups = [];
                var currentGroup;
                var groupedWindows;
                if (groupInfo && typeof Array.isArray(groupInfo)) {
                    for (var mainIndex = 0; mainIndex < groupInfo.length; ++mainIndex) {
                        groupedWindows = groupInfo[mainIndex];
                        if (groupedWindows && typeof Array.isArray(groupedWindows)) {
                            currentGroup = [];
                            allGroups.push(currentGroup);

                            for (var subIndex = 0; subIndex < groupedWindows.length; ++subIndex) {
                                currentGroup.push(fin.desktop.Window.wrap(me.uuid, groupedWindows[subIndex]));
                            }
                        }
                    }
                }

                if (typeof callback == 'function') callback(allGroups);
            }, errorCallback);
        },
        getManifest: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-application-manifest', {
                uuid: this.uuid
            }, callback, errorCallback);
        },
        getWindow: function() {
            return this.window;
        },
        grantAccess: function(action, callback, errorCallback) {
            components.sendMessageToDesktop('grant-access', {
                grantee: this.uuid,
                grantAction: action
            }, callback, errorCallback);
        },
        grantWindowAccess: function(action, windowName, callback, errorCallback) {
            components.sendMessageToDesktop('grant-window-access', {
                grantee: this.uuid,
                grantAction: action,
                name: windowName // wild card supported
            }, callback, errorCallback);
        },
        isRunning: function(callback, errorCallback) {
            components.sendMessageToDesktop('is-application-running', {
                uuid: this.uuid
            }, callback, errorCallback);
        },
        pingChildWindow: function(name, callback, errorCallback) {
            components.sendMessageToDesktop("ping-child-window", {
                uuid: this.uuid,
                name: name
            }, callback, errorCallback);
        },
        remove: function(callback, errorCallback) {
            components.sendMessageToDesktop('remove-application', {
                uuid: this.uuid
            }, callback, errorCallback);
        },
        removeEventListener: function(type, listener, callback, errorCallback) {
            components.removeDesktopEventCallback({
                topic: "application",
                type: type,
                uuid: this.uuid
            }, listener, callback, errorCallback);
        },
        removeTrayIcon: function(callback, errorCallback) {
            var _private = this._private;
            // Remove a prior listener if present.
            if (_private["tray-icon-clicked"]) {
                this.removeEventListener("tray-icon-clicked", _private["tray-icon-clicked"]);
                delete _private["tray-icon-clicked"];
            }

            components.sendMessageToDesktop('remove-tray-icon', {
                uuid: this.uuid
            }, callback, errorCallback);
        },
        restart: function(callback, errorCallback) {
            components.sendMessageToDesktop('restart-application', {
                uuid: this.uuid
            }, callback, errorCallback);
        },
        revokeAccess: function(action, callback, errorCallback) {
            components.sendMessageToDesktop('revoke-access', {
                grantee: this.uuid,
                grantAction: action
            }, callback, errorCallback);
        },
        revokeWindowAccess: function(action, windowName, callback, errorCallback) {
            components.sendMessageToDesktop('revoke-window-access', {
                grantee: this.uuid,
                grantAction: action,
                name: windowName // wild card supported
            }, callback, errorCallback);
        },
        run: function(callback, errorCallback) {
            components.sendMessageToDesktop('run-application', {
                uuid: this.uuid
            }, callback, errorCallback);
        },
        send: function(topic, message) {
            fin.desktop.InterApplicationBus.send(this.uuid, topic, message);
        },
        setTrayIcon: function(iconUrl, listener, callback, errorCallback) {
            var _private = this._private;
            // Remove a prior listener if present.
            if (_private["tray-icon-clicked"]) {
                this.removeEventListener("tray-icon-clicked", _private["tray-icon-clicked"]);
            }
            // track this listner for future removal
            _private["tray-icon-clicked"] = listener;
            var icon = iconUrl || _private.icon;
            this.addEventListener("tray-icon-clicked", listener, callback, errorCallback);
            components.sendMessageToDesktop('set-tray-icon', {
                uuid: this.uuid,
                enabledIcon: icon,
                disabledIcon: icon,
                hoverIcon: icon
            });
        },
        terminate: function(callback, errorCallback) {
            components.sendMessageToDesktop('terminate-application', {
                uuid: this.uuid
            }, callback, errorCallback);
        },
        wait: function(callback, errorCallback) {
            components.sendMessageToDesktop('wait-for-hung-application', {
                uuid: this.uuid
            }, callback, errorCallback);
        }
    };

    var components = (function() {

        var staticComponents = {
            isConnected: false,
            failedToConnect: false,
            socket: null,
            websocketPort: null,
            applicationUuid: null,
            applicationToken: null,
            windowId: null,
            pingedBefore: false,
            messageId: 0,
            websocketProtocol: 'ws'
        };

        var mainCallbacks = [];
        var errorCallbacks = [];
        var subscribeCallbacks = [];
        var unsubscribeCallbacks = [];
        var notificationId = 0;
        var currentNotification;
        var notificationToken;
        var windowList = {};
        var notificationEventCallbackMap = {};
        var interAppBusCallbackMap = {};
        var messageCallbackMap = {}; // correlationId => {successCallback, errorCallback

        var noop = function() {};

        //this should be moved to the fin.desktop.main I think

        if ((typeof chrome !== 'undefined') && chrome.desktop && chrome.desktop.getDetails) {
            console.log("Retrieving desktop details");
            chrome.desktop.getDetails(function(token, name, app_uuid, port, ssl) {
                app_uuid = app_uuid || name;
                staticComponents.applicationUuid = app_uuid;
                window.name = name;
                staticComponents.windowId = name;
                staticComponents.applicationToken = token;
                staticComponents.websocketPort = port;
                if (ssl) {
                    console.log('using ssl protocol wss');
                    staticComponents.websocketProtocol = 'wss';
                }

                staticComponents.socket = new WebSocket(staticComponents.websocketProtocol + '://127.0.0.1:' + (staticComponents.websocketPort ? staticComponents.websocketPort : '9696'));
                setWsHandlers(staticComponents.socket);
            });
        } else {
            // Try fallback for 1.4
            staticComponents.websocketPort = staticComponents.websocketPort || (fin.desktop._websocket_port || '9696');
            staticComponents.applicationUuid = staticComponents.applicationUuid || fin.desktop._app_uuid;
            staticComponents.applicationToken = staticComponents.applicationToken || fin.desktop._application_token;
            staticComponents.socket = new WebSocket(staticComponents.websocketProtocol + '://127.0.0.1:' + (staticComponents.websocketPort ? staticComponents.websocketPort : '9696'));
            setWsHandlers(staticComponents.socket);
        }


        function setWsHandlers(socket, reconnectCallback) {

            socket.onopen = function() {

                console.log('WebSocket opened in App with auth token');
                var connectedMessage = JSON.stringify({
                    action: 'request-authorization',
                    payload: {
                        type: 'application-token',
                        authorizationToken: staticComponents.applicationToken
                    }
                });

                console.log("Attempting handshake with WebSocket server.");
                socket.send(connectedMessage);
            };

            socket.onmessage = function(event) {

                var message = JSON.parse(event.data);
                var action = message.action;
                var correlationId = message.correlationId;
                var payload = message.payload;

                console.log("message received: action: " + action + " correlationId: " + correlationId);

                if (action == "authorization-response") {
                    var success = payload.success;
                    var reason = payload.reason;
                    if (success) {
                        staticComponents.isConnected = true;
                        if (reconnectCallback) {
                            reconnectCallback();
                        } else {
                            mainCallbacks.forEach(function(callback) {
                                callback.call(window);
                            });
                        }
                    } else {
                        console.error("Error connecting to WebSocket server: " + reason);
                        staticComponents.failedToConnect = true;
                        errorCallbacks.forEach(function(callback) {
                            callback.call(window);
                        });
                    }
                } else if (action == "process-message") {
                    dispatchMessageToCallbacks(payload.sourceUuid, payload.topic, payload.message);
                } else if (action == "ack") {
                    fireMessageCallback(correlationId, payload);
                } else if (action == "ping") {
                    respondToPing(payload.pingId);
                } else if (action == "process-system-message") {
                    dispatchSystemMessage(message);
                } else if (action == "subscriber-added") {
                    dispatchToSubscribeListeners(payload.uuid, payload.topic);
                } else if (action == "subscriber-removed") {
                    dispatchToUnsubscribeListeners(payload.uuid, payload.topic);
                } else if (action == "process-notification-event") {
                    processNotificationEvent(payload);
                } else if (action == "process-action-from-notification") {
                    var handler = window.processActionFromNotification;
                    if (typeof handler == "function") handler.call(window, payload);
                } else if (action == "process-action-from-notifications-center") {
                    processActionFromNotificationsCenter(payload);
                } else if (action == "process-desktop-event") {
                    dispatchDesktopEvent(payload);
                } else if (action == "process-external-message") {
                    processExternalMessage(payload);
                }
            };

            socket.onerror = function() {
                console.error("Error establishing WebSocket connection");
                staticComponents.failedToConnect = true;
                fireErrorCallbacks("connection error");
            };

            socket.onclose = function() {
                console.error("WebSocket connection closed");
                fireErrorCallbacks("connection closed");
                retrySocketConnection();
            };

            function fireErrorCallbacks(reason) {
                errorCallbacks.forEach(function(callback) {
                    callback(reason);
                });
            }
        }

        function retrySocketConnection() {
            if (staticComponents.isConnected) {
                console.log("retrySocketConnection onclose");
                staticComponents.failedToConnect = false;
                staticComponents.isConnected = false;
                staticComponents.socket = new WebSocket(staticComponents.websocketProtocol + '://127.0.0.1:' + (staticComponents.websocketPort ? staticComponents.websocketPort : '9696'));
                setWsHandlers(staticComponents.socket, function() {
                    resubscribeToInterAppBusAfterLostConnection();
                    resubscribeToDesktopEventsAfterLostConnection();
                });
            }
        }
        //var messageId = 0;

        function fireMessageCallback(correlationId, response) {
            // Warn of deprecation
            if (response && response.deprecated) {
                var deprecatedInfo = response.deprecated;
                console.warn("Subscribed to " + deprecatedInfo.eventType + ": " + deprecatedInfo.reason);
            }

            // Notify user that an error occured
            if (!response.success) {
                console.error("An error occured: " + JSON.stringify(response));
            }

            if (correlationId !== undefined) {
                var msgInfo = messageCallbackMap[correlationId];
                if (msgInfo) {
                    if (!response.success) {
                        if (typeof msgInfo.errorCallback == "function") {
                            msgInfo.errorCallback.call(window, response.reason);
                        }

                        console.error("Error performing action: " + msgInfo.action + " : " + response.reason);
                    } else if (typeof msgInfo.successCallback == "function") {
                        msgInfo.successCallback.call(window, response.data);
                    }
                    delete messageCallbackMap[correlationId];
                }
            }
        }

        function sendMessageToDesktop(action, payload, callback, errorCallback) {
            if (staticComponents.isConnected) {
                var messageObject = {
                    action: action,
                    payload: payload
                };

                if (typeof callback == "function" || typeof errorCallback == "function") {
                    messageCallbackMap[staticComponents.messageId] = {};
                    var msgCallbackEntry = messageCallbackMap[staticComponents.messageId];
                    msgCallbackEntry.action = action;
                    if (typeof callback == "function") {
                        msgCallbackEntry.successCallback = callback;
                    }

                    if (typeof errorCallback == "function") {
                        msgCallbackEntry.errorCallback = errorCallback;
                    }

                    messageObject.messageId = staticComponents.messageId;
                    staticComponents.messageId++;
                }

                var message = JSON.stringify(messageObject);

                staticComponents.socket.send(message);
            }
        }
        //var pingedBefore = false;

        function respondToPing(pingId) {
            if (document.readyState == "interactive" || document.readyState == "complete") {
                console.log("Responding to ping");
                sendMessageToDesktop("pong", {
                    correlationId: pingId,
                    pingedBefore: staticComponents.pingedBefore
                });
                staticComponents.pingedBefore = true;
            }
        }
        var ExternalMessageResultHandlerFactory = function(request) {
            var request_ = request;
            var factory_ = this;
            var sentToDesktop_ = false;
            var nHandlers_ = 0;
            var nProcessed_ = 0;
            var handlers_ = {};
            var allDispatched_ = false;

            // Returns true when the result has been sent to the desktop
            function wasSent() {
                return sentToDesktop_;
            }

            function sendIfAllResultsDispatchedAndComplete() {
                // Dispatch to desktop if all handlers processed
                if (allDispatched_ && nProcessed_ == nHandlers_) {
                    var totalResult = true;
                    var totalMessage = "";

                    if (!nHandlers_) {
                        totalResult = false;
                        totalMessage = "No external message handler has been registered!";
                    }

                    for (var key in handlers_) {
                        if (handlers_.hasOwnProperty(key)) {
                            var registeredHandler = handlers_[key];
                            totalResult &= registeredHandler.result;
                            totalMessage += registeredHandler.message;
                        }
                    }

                    // Send totalResult and totalMessage
                    sendMessageToDesktop('external-message-result', {
                        uuid: staticComponents.applicationUuid,
                        connectionId: request_.connectionId,
                        result: totalResult,
                        message: totalMessage
                    });
                    sentToDesktop_ = true;
                }
            }

            this.allDispatched = function() {
                allDispatched_ = true;
                sendIfAllResultsDispatchedAndComplete();
            };
            // Factory method to create and track a result handler
            this.makeResultHandler = function() {
                var requestHandler = new ExternalMessageResultHandler(factory_, request_);
                handlers_[requestHandler.getId()] = {
                    processed: false,
                    result: true,
                    message: "",
                    handler: requestHandler
                };

                ++nHandlers_;

                return requestHandler;
            };

            this.handleResult = function(id, result, message) {
                var handler = handlers_[id];
                if (!wasSent() && handler) {
                    if (!handler.processed) {
                        handler.processed = true;
                        handler.result = result;
                        handler.message = message;
                        ++nProcessed_;

                        sendIfAllResultsDispatchedAndComplete();
                    } else {
                        console.error("Handler already sent result. Can not send success: " + result + " with message: " + message);
                    }
                }
            };
        };
        // Handles external request
        var ExternalMessageResultHandler = function(parent, request) {
            var me = this;
            var requestPayload = (request || {});
            var parent_ = parent;
            var id_ = fin.desktop.getUuid();
            var origin_ = requestPayload.origin;

            me.getId = function() {
                return id_;
            };
            me.send = function(result, message) {
                parent_.handleResult(me.getId(), result, message);
            };
        };
        var externalMessageHandlers = [];

        function processExternalMessage(payload) {
            var messageHandlerFactory = new ExternalMessageResultHandlerFactory(payload);

            externalMessageHandlers.forEach(function(handler) {
                handler(messageHandlerFactory.makeResultHandler(), payload);
            });

            messageHandlerFactory.allDispatched();
        }

        function dispatchSystemMessage(message) {
            if (typeof window.onSystemMessage == "function") {
                window.onSystemMessage(message.payload);
            }
        }
        var desktopEventCallbackMap = {
            window: {

            },
            application: {

            },
            system: {

            }
        };

        function addDesktopEventCallback(subscriptionObject, listener, owner, callback, errorCallback) {
            var map;

            var topic = subscriptionObject.topic;
            var type = getFullEventType(topic, subscriptionObject.type);

            var uuid, name;
            var callbacks;

            switch (topic) {
                case "window":
                    uuid = subscriptionObject.uuid;
                    name = subscriptionObject.name;
                    desktopEventCallbackMap[topic][type] = desktopEventCallbackMap[topic][type] || {};
                    map = desktopEventCallbackMap[topic][type];
                    map[uuid] = map[uuid] || {};
                    map = map[uuid];
                    map[name] = map[name] || [];
                    callbacks = map[name];

                    break;
                case "application":
                    uuid = subscriptionObject.uuid;
                    desktopEventCallbackMap[topic][type] = desktopEventCallbackMap[topic][type] || {};
                    map = desktopEventCallbackMap[topic][type];
                    map[uuid] = map[uuid] || [];
                    callbacks = map[uuid];

                    break;
                case "system":
                    desktopEventCallbackMap[topic][type] = desktopEventCallbackMap[topic][type] || [];
                    callbacks = desktopEventCallbackMap[topic][type];
                    break;

            }

            if (callbacks) {
                if (callbacks.length === 0) {
                    sendMessageToDesktop("subscribe-to-desktop-event", subscriptionObject, callback, errorCallback);
                }

                listener._owner = owner;
                callbacks.push(listener);
            } else {
                console.error("Could not subscribe to unknown event \'" + type + "\'.");
            }

        }

        function resubscribeToDesktopEventsAfterLostConnection() {
            var map;
            for (var topic in desktopEventCallbackMap) {
                map = desktopEventCallbackMap[topic];
                switch (topic) {
                    case "window":
                        // (function () {
                        for (var type in map) {
                            for (var uuid in map[type]) {
                                for (var name in map[type][uuid]) {
                                    if (map[type][uuid][name].length > 0) {
                                        sendMessageToDesktop("subscribe-to-desktop-event", {
                                            topic: topic,
                                            type: getPartialEventType(topic, type),
                                            uuid: uuid,
                                            name: name
                                        });
                                    }
                                }
                            }
                        }
                        //  })();
                        break;
                    case "application":
                        //  (function () {
                        for (var applicationType in map) {
                            for (var applicationUuid in map[applicationType]) {
                                if (map[applicationType][applicationUuid].length > 0) {
                                    sendMessageToDesktop("subscribe-to-desktop-event", {
                                        topic: topic,
                                        type: getPartialEventType(topic, applicationType),
                                        uuid: applicationUuid
                                    });
                                }
                            }
                        }
                        //  })();
                        break;
                    case "system":
                        // (function () {
                        for (var systemType in map) {
                            if (map[systemType].length > 0) {
                                sendMessageToDesktop("subscribe-to-desktop-event", {
                                    topic: topic,
                                    type: getPartialEventType(topic, systemType)
                                });
                            }
                        }
                        // })();
                        break;
                }
            }
        }

        function removeDesktopEventCallback(subscriptionObject, listener, callback, errorCallback) {
            var map = desktopEventCallbackMap;

            var topic = subscriptionObject.topic;
            var type = getFullEventType(topic, subscriptionObject.type);

            var uuid, name;
            var callbacks;

            switch (topic) {
                case "window":
                    uuid = subscriptionObject.uuid;
                    name = subscriptionObject.name;

                    if (map[topic][type] && map[topic][type][uuid] && map[topic][type][uuid][name])
                        callbacks = map[topic][type][uuid][name];

                    break;
                case "application":
                    uuid = subscriptionObject.uuid;

                    if (map[topic][type] && map[topic][type][uuid])
                        callbacks = map[topic][type][uuid];

                    break;
                case "system":
                    if (map[topic][type])
                        callbacks = map[topic][type];
                    break;
            }

            if (callbacks) {
                var index = callbacks.indexOf(listener);
                if (index != -1) {
                    callbacks.splice(index, 1);
                    if (callbacks.length === 0) {
                        sendMessageToDesktop("unsubscribe-to-desktop-event", subscriptionObject, callback, errorCallback);
                    }
                }
            }
        }

        function dispatchDesktopEvent(subscriptionObject) {

            var map = desktopEventCallbackMap;

            var topic = subscriptionObject.topic;
            var type = getFullEventType(topic, subscriptionObject.type);

            var uuid, name;
            var callbacks;

            switch (topic) {
                case "window":
                    uuid = subscriptionObject.uuid;
                    name = subscriptionObject.name;

                    if (map[topic][type] && map[topic][type][uuid] && map[topic][type][uuid][name])
                        callbacks = map[topic][type][uuid][name];

                    break;
                case "application":
                    uuid = subscriptionObject.uuid;

                    if (map[topic][type] && map[topic][type][uuid])
                        callbacks = map[topic][type][uuid];

                    break;
                case "system":
                    if (map[topic][type])
                        callbacks = map[topic][type];
                    break;
            }

            var eventObject = subscriptionObject;
            if (callbacks) {
                callbacks.forEach(function(callback) {
                    callback.call(callback._owner, eventObject);
                });
            }
        }

        function getFullEventType(category, type) {
            var fullType;
            switch (category) {
                case "system":
                    fullType = type;
                    break;
                case "window":
                    fullType = (type.indexOf("window-") == -1) ? ("window-" + type) : type;
                    break;
                case "application":
                    fullType = (type.indexOf("application-") == -1) ? ("application-" + type) : type;
                    break;
            }
            return fullType;
        }

        function getPartialEventType(category, type) {
            var len = category.length + 1;
            return type.slice(len);
        }

        function dispatchMessageToCallbacks(senderUuid, topic, message) {
            console.log("Dispatching message to callbacks from " + senderUuid + " on " + topic);

            /**
             * Dispatch the message to callback by application and then topic.
             */

            var appMap;
            var topicMap;

            if ("*" in interAppBusCallbackMap) {
                appMap = interAppBusCallbackMap["*"];
                topicMap = appMap[topic];
                if (topicMap) {
                    //var msgObj = JSON.parse(message);
                    topicMap.forEach(function(cb) {
                        cb.call(window, message, senderUuid);
                    });
                }
            }

            appMap = interAppBusCallbackMap[senderUuid];

            if (appMap) {
                topicMap = appMap[topic];
                if (topicMap) {
                    //var msgObj = JSON.parse(message);
                    topicMap.forEach(function(cb) {
                        cb.call(window, message, senderUuid);
                    });
                }
            }
        }

        function processNotificationEvent(message) {

            var type = message.type;
            var callback;

            var notificationId = message.payload.notificationId;

            if (typeof notificationId != "undefined") {
                var events = notificationEventCallbackMap[notificationId];

                if (events) {
                    if (type == "message") {
                        callback = events.onMessage;
                        if (typeof callback == "function") {
                            callback.call(window, message.payload.message);
                        }
                        return;
                    } else if (type == "show") {
                        callback = events.onShow;
                    } else if (type == "close") {
                        callback = events.onClose;
                        delete notificationEventCallbackMap[notificationId];
                    } else if (type == "error") {
                        callback = events.onError;

                        if (typeof callback == "function") {
                            callback.call(window, message.payload.reason);
                        }
                        return;
                    } else if (type == "click") {
                        callback = events.onClick;
                    } else if (type == "dismiss") {
                        callback = events.onDismiss;
                    }

                    if (typeof callback == "function") {
                        callback.call(window);
                    }

                }
            }

        }

        function processActionFromNotificationsCenter(payload) {
            console.log('message received from openfin');

            var type = payload.type;
            var callback;

            if (type == "message") {
                callback = window.onNotificationMessage;
                if (typeof callback == "function") {
                    callback.call(window, payload.payload.message);
                }
            } else if (type == "initialize-notification") {
                notificationToken = payload.payload.token;
                callback = window.onNotificationMessage;

                if (typeof callback == "function") {
                    callback.call(window, payload.payload.message);
                }

                window.addEventListener('click', function() {
                    if (currentNotification) {
                        sendActionToNotificationsCenter("click-notification", {
                            token: notificationToken
                        });
                    }
                });


                window.addEventListener('mouseover', function(evt) {
                    if (evt.fromElement === null) {
                        sendActionToNotificationsCenter("update-mouse-position", {
                            token: notificationToken,
                            isMouseOver: true
                        });
                    }
                });

                window.addEventListener('mouseout', function(evt) {
                    if (evt.toElement === null) {
                        sendActionToNotificationsCenter("update-mouse-position", {
                            token: notificationToken,
                            isMouseOver: false
                        });
                    }
                });

            } else if (type == "register-drag-handler") {
                registerDragHandler(window, {
                    onDragStart: function(x, y) {
                        sendDragEvent("dragstart", x, y, window.screenX, window.screenY);
                    },
                    onDrag: function(x, y) {
                        sendDragEvent("drag", x, y, window.screenX, window.screenY);
                    },
                    onDragEnd: function(x, y) {
                        sendDragEvent("dragend", x, y, window.screenX, window.screenY);
                    },
                    onClick: function(x, y) {
                        sendDragEvent("clicked", x, y, window.screenX, window.screenY);
                    }
                }, payload.payload.options);

                /* this got moved as per a json lint complaint */

                // function sendDragEvent(type, x, y, screenX, screenY) {
                //     sendActionToNotificationsCenter("fire-drag-event", {
                //         action: type,
                //         token: notificationToken,
                //         payload: {
                //             x: x,
                //             y: y,
                //             screenX: screenX,
                //             screenY: screenY
                //         }
                //     });
                // }
            }
        }

        function sendDragEvent(type, x, y, screenX, screenY) {
            sendActionToNotificationsCenter("fire-drag-event", {
                action: type,
                token: notificationToken,
                payload: {
                    x: x,
                    y: y,
                    screenX: screenX,
                    screenY: screenY
                }
            });
        }

        function sendActionToNotificationsCenter(action, payload, callback) {
            sendMessageToDesktop("send-action-to-notifications-center", {
                action: action,
                payload: payload
            }, callback);
        }

        function resubscribeToInterAppBusAfterLostConnection() {

            // Resubscribe to interappbus messages
            for (var senderUuid in interAppBusCallbackMap) {
                for (var topic in interAppBusCallbackMap[senderUuid]) {
                    if (interAppBusCallbackMap[senderUuid][topic] && interAppBusCallbackMap[senderUuid][topic].length > 0) {
                        sendMessageToDesktop("subscribe", {
                            sourceUuid: senderUuid,
                            topic: topic
                        });
                    }
                }
            }
        }

        function dispatchToSubscribeListeners(uuid, topic) {
            components.subscribeCallbacks.forEach(function(callback) {
                callback(uuid, topic);
            });
        }

        function dispatchToUnsubscribeListeners(uuid, topic) {
            unsubscribeCallbacks.forEach(function(callback) {
                callback(uuid, topic);
            });
        }

        function deepObjCopy(dupeObj) {
            var retObj;
            if (typeof(dupeObj) == 'object') {
                if (Array.isArray(dupeObj))
                    retObj = [];
                else
                    retObj = {};
                for (var objInd in dupeObj) {
                    if (typeof(dupeObj[objInd]) == 'object') {
                        retObj[objInd] = deepObjCopy(dupeObj[objInd]);
                    } else if (typeof(dupeObj[objInd]) == 'string') {
                        retObj[objInd] = dupeObj[objInd];
                    } else if (typeof(dupeObj[objInd]) == 'number') {
                        retObj[objInd] = dupeObj[objInd];
                    } else if (typeof(dupeObj[objInd]) == 'boolean') {
                        //(dupeObj[objInd]) ? retObj[objInd] = true : retObj[objInd] = false;
                        retObj[objInd] = dupeObj[objInd] ? true : false;
                    } else if (typeof(dupeObj[objInd]) == 'function') {
                        retObj[objInd] = dupeObj[objInd];
                    }
                }
            } else {
                retObj = dupeObj;
            }
            return retObj;
        }

        function registerDragHandler(wnd, handlers, options) {
            var mouseDown = false;
            var mouseMoved = false;

            var onDrag = handlers.onDrag,
                onDragEnd = handlers.onDragEnd,
                onDragStart = handlers.onDragStart,
                onClick = handlers.onClick;

            var x_offset, y_offset;
            var OPTIONS = options || {};
            var THRESH = OPTIONS.thresh || 3;
            var TARGET = OPTIONS.target;

            wnd.addEventListener('mousedown', function(e) {
                if (e.button === 0) {
                    mouseDown = true;
                    x_offset = e.x;
                    y_offset = e.y;
                }
            });


            wnd.addEventListener('mousemove', function(e) {
                if (mouseDown) {

                    if (!mouseMoved && Math.sqrt(Math.pow((e.x - x_offset), 2) + Math.pow((e.y - y_offset), 2)) >= THRESH) {
                        mouseMoved = true;
                        fin.desktop.System.getMousePosition(function(evt) {
                            var y = parseInt(evt.top);
                            var x = parseInt(evt.left);

                            if (onDragStart) onDragStart(x - x_offset, y - y_offset);
                        });
                    }

                    if (mouseMoved) {
                        fin.desktop.System.getMousePosition(function(evt) {
                            var y = parseInt(evt.top);
                            var x = parseInt(evt.left);

                            if (onDrag) onDrag(x - x_offset, y - y_offset);
                        });
                    }
                }
            });


            wnd.addEventListener('mouseup', function(e) {
                var initialMouseMoved = mouseMoved;

                if (e.button === 0) {
                    if (mouseMoved) {
                        fin.desktop.System.getMousePosition(function(evt) {
                            var y = parseInt(evt.top);
                            var x = parseInt(evt.left);

                            if (onDragEnd) onDragEnd(x - x_offset, y - y_offset);
                        });
                    }

                    mouseDown = false;
                    mouseMoved = false;
                }

                if (!initialMouseMoved) {
                    fin.desktop.System.getMousePosition(function(evt) {
                        var y = parseInt(evt.top);
                        var x = parseInt(evt.left);
                        if (onClick) onClick(x - x_offset, y - y_offset);
                    });
                }
            });
        }



        staticComponents.mainCallbacks = mainCallbacks;
        staticComponents.errorCallbacks = errorCallbacks;
        staticComponents.setWsHandlers = setWsHandlers;
        staticComponents.retrySocketConnection = retrySocketConnection;
        staticComponents.messageCallbackMap = messageCallbackMap;
        staticComponents.fireMessageCallback = fireMessageCallback;
        staticComponents.sendMessageToDesktop = sendMessageToDesktop;
        staticComponents.respondToPing = respondToPing;
        staticComponents.ExternalMessageResultHandlerFactory = ExternalMessageResultHandlerFactory;
        staticComponents.ExternalMessageResultHandler = ExternalMessageResultHandler;
        staticComponents.externalMessageHandlers = externalMessageHandlers;
        staticComponents.processExternalMessage = processExternalMessage;
        staticComponents.dispatchSystemMessage = dispatchSystemMessage;
        staticComponents.desktopEventCallbackMap = desktopEventCallbackMap;
        staticComponents.addDesktopEventCallback = addDesktopEventCallback;
        staticComponents.resubscribeToDesktopEventsAfterLostConnection = resubscribeToDesktopEventsAfterLostConnection;
        staticComponents.removeDesktopEventCallback = removeDesktopEventCallback;
        staticComponents.dispatchDesktopEvent = dispatchDesktopEvent;
        staticComponents.getFullEventType = getFullEventType;
        staticComponents.getPartialEventType = getPartialEventType;
        staticComponents.interAppBusCallbackMap = interAppBusCallbackMap;
        staticComponents.dispatchMessageToCallbacks = dispatchMessageToCallbacks;
        staticComponents.windowList = windowList;
        staticComponents.notificationEventCallbackMap = notificationEventCallbackMap;
        staticComponents.processNotificationEvent = processNotificationEvent;
        staticComponents.currentNotification = currentNotification;
        staticComponents.notificationToken = notificationToken;
        staticComponents.processActionFromNotificationsCenter = processActionFromNotificationsCenter;
        staticComponents.sendActionToNotificationsCenter = sendActionToNotificationsCenter;
        staticComponents.resubscribeToInterAppBusAfterLostConnection = resubscribeToInterAppBusAfterLostConnection;
        staticComponents.subscribeCallbacks = subscribeCallbacks;
        staticComponents.unsubscribeCallbacks = unsubscribeCallbacks;
        staticComponents.dispatchToSubscribeListeners = dispatchToSubscribeListeners;
        staticComponents.dispatchToUnsubscribeListeners = dispatchToUnsubscribeListeners;
        staticComponents.deepObjCopy = deepObjCopy;
        staticComponents.registerDragHandler = registerDragHandler;
        staticComponents.notificationId = notificationId;
        staticComponents.sendDragEvent = sendDragEvent;
        staticComponents.noop = noop;

        return staticComponents;


    })();

    fin.desktop.main = function(callback, errorCallback) {
        if (callback)
            components.mainCallbacks.push(callback);

        if (errorCallback)
            components.errorCallbacks.push(errorCallback);

        if (components.isConnected && callback) {
            callback.call(window);
        } else if (components.failedToConnect && errorCallback) {
            errorCallback.call(window);
        }
    };

    fin.desktop._dispatchNotificationEvent = function(destinationUuid, destinationName, type, payload) {
        components.sendMessageToDesktop("dispatch-notification-event", {
            destinationUuid: destinationUuid,
            destinationName: destinationName,
            payload: {
                type: type,
                payload: payload
            }
        });
    };

    fin.desktop._sendActionToNotification = function(destinationName, type, payload) {
        components.sendMessageToDesktop("send-action-to-notification", {
            destinationName: destinationName,
            payload: {
                type: type,
                payload: payload
            }
        });
    };

    fin.desktop.addExternalMessageHandler = function(callback) {
        if (typeof callback == 'function') {
            components.externalMessageHandlers.push(callback);
        }
    };

    //shared public function, should be in components
    function dispatchToSubscribeListeners(uuid, topic) {
        subscribeCallbacks.forEach(function(callback) {
            callback(uuid, topic);
        });
    }

    //shared public function, should be in components
    function dispatchToUnsubscribeListeners(uuid, topic) {
        unsubscribeCallbacks.forEach(function(callback) {
            callback(uuid, topic);
        });
    }

    //shared public function, should be in components
    function resubscribeToInterAppBusAfterLostConnection() {

        // Resubscribe to interappbus messages
        for (var senderUuid in components.interAppBusCallbackMap) {
            for (var topic in components.interAppBusCallbackMap[senderUuid]) {
                if (components.interAppBusCallbackMap[senderUuid][topic] && components.interAppBusCallbackMap[senderUuid][topic].length > 0) {
                    components.sendMessageToDesktop("subscribe", {
                        sourceUuid: senderUuid,
                        topic: topic
                    });
                }
            }
        }
    }

    //keep backwards compatibility by exposing a constructor
    fin.desktop.InterApplicationBus = function() {

    };

    //Publishes a message on the specified topic.
    // - topic - The topic on which the message is published.
    // - message - A JSON object message to be published.
    fin.desktop.InterApplicationBus.publish = function(topic, message) {
        components.sendMessageToDesktop('publish-message', {
            topic: topic,
            message: message
        });
    };

    //Sends a message to a specific application on a specific topic.
    // - destinationUuid The id of an application to which the message is sent.
    // - topic The topic on which the message is published.
    // - message A JSON object message to be published.
    fin.desktop.InterApplicationBus.send = function(destinationUuid, topic, message) {
        components.sendMessageToDesktop('send-message', {
            destinationUuid: destinationUuid,
            topic: topic,
            message: message
        });
    };

    //Subscribes a callback to messages originating from a specific application and topic.
    // - senderUuid The id of an application to which the client subscribes.
    // - topic The topic to which the client subscribes.
    // - callback A callback which is called whenever a message is generated from the application on the specified topic. Receives the applicationId, topic and message.
    fin.desktop.InterApplicationBus.subscribe = function(senderUuid, topic, callback) {
        var cbm = components.interAppBusCallbackMap;
        cbm[senderUuid] = cbm[senderUuid] || {};
        cbm[senderUuid][topic] = cbm[senderUuid][topic] || [];
        cbm[senderUuid][topic].push(callback);

        if (cbm[senderUuid][topic].length == 1) {
            components.sendMessageToDesktop('subscribe', {
                sourceUuid: senderUuid,
                topic: topic
            });
        }

    };

    // Unsubscribes a callback to messages originating from a specific application and topic.
    // - senderUuid The id of an application from which the client unsubscribes.
    // - topic The topic from which the client unsubscribes.
    // - callback The subscribed callback.
    fin.desktop.InterApplicationBus.unsubscribe = function(senderUuid, topic, callback) {
        var cbs = components.interAppBusCallbackMap[senderUuid][topic];
        if (cbs !== undefined) {
            cbs.splice(cbs.lastIndexOf(callback), 1);
            if (cbs.length === 0) {
                components.sendMessageToDesktop('unsubscribe', {
                    sourceUuid: senderUuid,
                    topic: topic
                });
            }
        }
    };

    //let me know when an app has subscribed
    fin.desktop.InterApplicationBus.addSubscribeListener = function(listener) {
        components.subscribeCallbacks.push(listener);
    };

    //I no longer want to know which apps have a listner on me
    fin.desktop.InterApplicationBus.removeSubscribeListener = function(listener) {
        var index = components.subscribeCallbacks.indexOf(listener);
        components.subscribeCallbacks.splice(index, 1);
    };

    //I want to know when an applicatoin unsubscribes to me
    fin.desktop.InterApplicationBus.addUnsubscribeListener = function(listener) {
        components.unsubscribeCallbacks.push(listener);
    };

    //no longer want to know when apps unsubscribe to me
    fin.desktop.InterApplicationBus.removeUnsubscribeListener = function(listener) {
        var index = components.unsubscribeCallbacks.indexOf(listener);
        components.unsubscribeCallbacks.splice(index, 1);
    };

    //keep backwards compatibility by exposing methods via prototype.
    fin.desktop.InterApplicationBus.prototype = {
        publish: fin.desktop.InterApplicationBus.publish,
        send: fin.desktop.InterApplicationBus.send,
        subscribe: fin.desktop.InterApplicationBus.subscribe,
        unsubscribe: fin.desktop.InterApplicationBus.unsubscribe,
        addSubscribeListener: fin.desktop.InterApplicationBus.addSubscribeListener,
        removeSubscribeListener: fin.desktop.InterApplicationBus.removeSubscribeListener,
        addUnsubscribeListener: fin.desktop.InterApplicationBus.addUnsubscribeListener,
        removeUnsubscribeListener: fin.desktop.InterApplicationBus.removeUnsubscribeListener
    };

    var notificationId = 0;
    fin.desktop.Notification = function(options, callback, errorCallback) {

        var me = this;
        if (!options._noregister) {

            components.sendActionToNotificationsCenter("create-notification", {
                url: qualifyURL(options.url),
                notificationId: notificationId,
                message: options.message,
                timeout: options.timeout
            }, callback, errorCallback);


            components.notificationEventCallbackMap[notificationId] = {
                onClose: options.onClose,
                onClick: options.onClick,
                onError: options.onError,
                onShow: options.onShow,
                onMessage: options.onMessage,
                onDismiss: options.onDismiss
            };

            me.notificationId = notificationId;
            notificationId++;

        } else {
            // return a blank object
        }

        function qualifyURL(url) {
            var a = document.createElement('a');
            a.href = url;
            return a.href;
        }

    };

    fin.desktop.Notification.prototype = {
        close: function(callback) {
            components.sendActionToNotificationsCenter("close-notification", {
                notificationId: this.notificationId,
                token: components.notificationToken
            }, callback);
        },
        sendMessage: function(message, callback) {
            components.sendActionToNotificationsCenter("send-notification-message", {
                notificationId: this.notificationId,
                message: message,
                token: components.notificationToken
            }, callback);
        },
        sendMessageToApplication: function(message, callback) {
            components.sendActionToNotificationsCenter("send-application-message", {
                notificationId: this.notificationId,
                message: message,
                token: components.notificationToken
            }, callback);
        }
    };

    fin.desktop.Notification.getCurrentNotification = function() {
        console.warn("Function is deprecated");
        return components.currentNotification;
    };

    fin.desktop.Notification.getCurrent = function() {
        return components.currentNotification;
    };

    components.currentNotification = new fin.desktop.Notification({
        _noregister: true
    });

    fin.desktop.System = {
        addEventListener: function(type, listener, callback, errorCallback) {
            var subscriptionObject = {
                topic: "system"
            };

            // If type is an object unwrap to get configuration
            if (typeof type == "object" && type.data && type.type) {
                subscriptionObject.type = type;
                subscriptionObject.data = type.data;
                // Else use default behavior
            } else {
                subscriptionObject.type = type;
            }

            components.addDesktopEventCallback(subscriptionObject, listener, this, callback, errorCallback);
        },
        clearCache: function(options, callback, errorCallback) {
            components.sendMessageToDesktop('clear-cache', {
                cache: options.cache,
                cookies: options.cookies,
                localStorage: options.localStorage,
                appcache: options.appcache,
                userData: options.userData
            }, callback, errorCallback);
        },
        deleteCacheOnRestart: function(callback, errorCallback) {
            components.sendMessageToDesktop('delete-cache-request', {}, callback, errorCallback);
        },
        exit: function(callback) {
            components.sendMessageToDesktop('exit-desktop', {}, callback);
        },
        getAllWindows: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-all-windows', {}, callback, errorCallback);
        },
        getAllApplications: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-all-applications', {}, callback, errorCallback);
        },
        getCommandLineArguments: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-command-line-arguments', {}, callback, errorCallback);
        },
        getConfig: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-config', {}, callback, errorCallback);
        },
        getDeviceId: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-device-id', {}, callback, errorCallback);
        },
        getLog: function(options, callback, errorCallback) {
            // backwards compatible, if options is just logName string
            if (typeof(options) === 'string') {
                components.sendMessageToDesktop('view-log', {
                    name: options
                }, callback, errorCallback);
            } else {
                components.sendMessageToDesktop('view-log', {
                    name: options.name,
                    endFile: options.endFile,
                    sizeLimit: options.sizeLimit
                }, callback, errorCallback);
            }
        },
        getLogList: function(callback, errorCallback) {
            if (callback) {
                components.sendMessageToDesktop('list-logs', {}, function(logArray) {
                    logArray.forEach(function(log) {
                        var dateString = log.date;
                        log.date = new Date(dateString);
                    });

                    callback.call(window, logArray);
                }, errorCallback);
            } else {
                components.sendMessageToDesktop('list-logs', {}, callback, errorCallback);
            }
        },
        getMonitorInfo: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-monitor-info', {}, callback, errorCallback);
        },
        getMousePosition: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-mouse-position', {}, callback, errorCallback);
        },
        getProcessList: function(callback, errorCallback) {
            components.sendMessageToDesktop('process-snapshot', {}, callback, errorCallback);
        },
        getProxySettings: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-proxy-settings', {}, callback, errorCallback);
        },
        getRemoteConfig: function(url, callback, errorCallback) {
            components.sendMessageToDesktop('get-remote-config', {
                url: url
            }, callback, errorCallback);
        },
        getVersion: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-version', {}, callback, errorCallback);
        },
        hideStartWindow: function(callback, errorCallback) {
            components.sendMessageToDesktop('hide-start-window', {}, callback, errorCallback);
        },
        installDeskbandIcon: function(options, callback, errorCallback) {
            components.sendMessageToDesktop('install-deskband-icon', {
                enabledIcon: options.enabledIcon,
                disabledIcon: options.disabledIcon,
                hoverIcon: options.hoverIcon
            }, callback, errorCallback);
        },
        installStartIcon: function(options, callback, errorCallback) {
            components.sendMessageToDesktop('install-start-icon', {
                enabledIcon: options.enabledIcon,
                disabledIcon: options.disabledIcon,
                hoverIcon: options.hoverIcon
            }, callback, errorCallback);
        },
        launchExternalProcess: function(path, commandLine, callback, errorCallback) {
            components.sendMessageToDesktop('launch-external-process', {
                path: path,
                commandLine: commandLine
            }, callback, errorCallback);
        },
        log: function(level, message, callback) {
            components.sendMessageToDesktop('write-to-log', {
                level: level,
                message: message
            }, callback);

            if (level == "info") {
                console.log(message);
            } else if (level == "warning") {
                console.warn(message);
            } else if (level == "error") {
                console.error(message);
            }
        },
        openUrlWithBrowser: function(url, callback, errorCallback) {
            components.sendMessageToDesktop('open-url-with-browser', {
                url: url
            }, callback, errorCallback);
        },
        releaseExternalProcess: function(processUuid, callback, errorCallback) {
            components.sendMessageToDesktop('release-external-process', {
                uuid: processUuid
            }, callback, errorCallback);
        },
        removeDeskbandIcon: function(callback, errorCallback) {
            components.sendMessageToDesktop('remove-deskband-icon', {}, callback, errorCallback);
        },
        removeEventListener: function(type, listener, callback, errorCallback) {
            components.removeDesktopEventCallback({
                topic: "system",
                type: type
            }, listener, callback, errorCallback);
        },
        removeStartIcon: function(callback, errorCallback) {
            components.sendMessageToDesktop('remove-start-icon', {}, callback, errorCallback);
        },
        setClipboard: function(text, callback, errorCallback) {
            components.sendMessageToDesktop('set-clipboard', {
                data: text
            }, callback, errorCallback);
        },
        showDeveloperTools: function(applicationUuid, windowName, callback, errorCallback) {
            components.sendMessageToDesktop('show-developer-tools', {
                uuid: applicationUuid,
                name: windowName
            }, callback, errorCallback);
        },
        showStartWindow: function(callback, errorCallback) {
            components.sendMessageToDesktop('show-start-window', {}, callback, errorCallback);
        },
        terminateExternalProcess: function(processUuid, timeout, killTree, callback, errorCallback) {
            components.sendMessageToDesktop('terminate-external-process', {
                uuid: processUuid,
                timeout: timeout,
                child: (killTree ? true : false)
            }, callback, errorCallback);
        },
        updateProxySettings: function(type, proxyAddress, proxyPort, callback, errorCallback) {
            components.sendMessageToDesktop('update-proxy', {
                type: type,
                proxyAddress: proxyAddress,
                proxyPort: proxyPort
            }, callback, errorCallback);
        }
    };

    fin.desktop.Test = {
        closeSocket: function() {
            console.error("Test force web socket close");
            components.socket.close();
        }
    };

    var windowList = {};
    fin.desktop.Window = function(options, callback, errorCallback) {

        var opt = components.deepObjCopy(options);


        opt.defaultHeight = Math.floor(opt.defaultHeight);
        opt.defaultWidth = Math.floor(opt.defaultWidth);
        opt.defaultTop = Math.floor((typeof opt.defaultTop == 'number' ? opt.defaultTop : 100));
        opt.defaultLeft = Math.floor((typeof opt.defaultLeft == 'number' ? opt.defaultLeft : 100));

        this.connected = opt.connected;
        this.name = opt.name;
        this.app_uuid = opt.uuid;
        var me = this;

        if (!opt._noregister) {

            opt.uuid = components.applicationUuid;
            this.app_uuid = opt.uuid;
            var url = opt.url;

            components.sendMessageToDesktop('register-child-window-settings', opt, function(evt) {

                // Hotfix for paltform implementation differences of window load callback in Mac and Windows.
                if (navigator.userAgent.indexOf("Windows") != -1) {
                    components.sendMessageToDesktop("register-child-window-load-callback", {
                        uuid: me.app_uuid,
                        name: me.name
                    }, function() {
                        if (callback) callback.call(me);
                    });

                    me.contentWindow = window.open(url, me.name);
                    windowList[me.name] = me.contentWindow;
                } else {
                    me.contentWindow = window.open(url, me.name);
                    windowList[me.name] = me.contentWindow;

                    if ("addEventListener" in me.contentWindow) {
                        me.contentWindow.addEventListener("load", function() {
                            if (callback) callback.call(me);
                        });
                    } else if (callback) callback.call(me);

                }

                //if (callback) callback.call(me);
            }, errorCallback);

        } else {
            if (!opt._nocontentwindow) this.contentWindow = window;
            if (this.name == window.name) {
                this.contentWindow = window;
            } else {
                this.contentWindow = windowList[this.name];
            }
            if (callback) callback.call(me);
        }
    };

    fin.desktop.Window.getCurrentWindow = function() {
        console.warn("Function is deprecated");
        if (!this._instance) {
            this._instance = fin.desktop.Window.wrap(components.applicationUuid, window.name);
        }
        return this._instance;
    };

    fin.desktop.Window.getCurrent = function() {
        if (!this._instance) {
            this._instance = fin.desktop.Window.wrap(components.applicationUuid, window.name);
        }
        return this._instance;
    };

    fin.desktop.Window.wrap = function(appUuid, windowName) {
        return new fin.desktop.Window({
            uuid: appUuid,
            name: windowName,
            _noregister: true
        });
    };

    fin.desktop.Window.prototype = {
        addEventListener: function(type, listener, callback, errorCallback) {
            components.addDesktopEventCallback({
                topic: "window",
                type: type,
                name: this.name,
                uuid: this.app_uuid
            }, listener, this, callback, errorCallback);
        },
        animate: function(transitions, options, callback, errorCallback) {
            components.sendMessageToDesktop('animate-window', {
                uuid: this.app_uuid,
                name: this.name,
                transitions: transitions,
                options: options
            }, callback, errorCallback);
        },
        blur: function(callback, errorCallback) {
            components.sendMessageToDesktop('blur-window', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        bringToFront: function(callback, errorCallback) {
            components.sendMessageToDesktop('bring-window-to-front', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        close: function(force, callback, errorCallback) {
            components.sendMessageToDesktop('close-window', {
                uuid: this.app_uuid,
                name: this.name,
                force: force || false
            }, callback, errorCallback);
        },
        disableFrame: function(callback, errorCallback) {
            components.sendMessageToDesktop('disable-window-frame', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        enableFrame: function(callback, errorCallback) {
            components.sendMessageToDesktop('enable-window-frame', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        flash: function(options, callback, errorCallback) {
            components.sendMessageToDesktop('flash-window', {
                uuid: this.app_uuid,
                name: this.name,
                options: options
            }, callback, errorCallback);
        },
        focus: function(callback, errorCallback) {
            components.sendMessageToDesktop('focus-window', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        getBounds: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-window-bounds', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        getGroup: function(callback, errorCallback) {
            var me = this;
            components.sendMessageToDesktop('get-window-group', {
                uuid: this.app_uuid,
                name: this.name
            }, function(groupInfo) {
                var currentGroup = [];
                if (groupInfo && typeof Array.isArray(groupInfo)) {
                    for (var i = 0; i < groupInfo.length; ++i) {
                        currentGroup.push(fin.desktop.Window.wrap(me.app_uuid, groupInfo[i]));
                    }
                }

                if (typeof callback == 'function') callback(currentGroup);
            }, errorCallback);
        },
        getNativeWindow: function() {
            return this.contentWindow;
        },
        getOptions: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-window-options', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        getParentApplication: function() {
            return fin.desktop.Application.wrap(this.app_uuid);
        },
        getParentWindow: function() {
            return this.getParentApplication().getWindow();
        },
        getSnapshot: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-window-snapshot', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        getState: function(callback, errorCallback) {
            components.sendMessageToDesktop('get-window-state', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        hide: function(callback, errorCallback) {
            components.sendMessageToDesktop('hide-window', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        isShowing: function(callback, errorCallback) {
            components.sendMessageToDesktop('is-window-showing', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        joinGroup: function(target, callback, errorCallback) {
            components.sendMessageToDesktop('join-window-group', {
                uuid: this.app_uuid,
                name: this.name,
                groupingWindowName: target.name
            }, callback, errorCallback);
        },
        leaveGroup: function(callback, errorCallback) {
            components.sendMessageToDesktop('leave-window-group', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        maximize: function(callback, errorCallback) {
            components.sendMessageToDesktop('maximize-window', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        mergeGroups: function(target, callback, errorCallback) {
            components.sendMessageToDesktop('merge-window-groups', {
                uuid: this.app_uuid,
                name: this.name,
                groupingWindowName: target.name
            }, callback, errorCallback);
        },
        minimize: function(callback, errorCallback) {
            components.sendMessageToDesktop('minimize-window', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        moveBy: function(deltaLeft, deltaTop, callback, errorCallback) {
            components.sendMessageToDesktop('move-window-by', {
                uuid: this.app_uuid,
                name: this.name,
                deltaTop: Math.floor(deltaTop),
                deltaLeft: Math.floor(deltaLeft)
            }, callback, errorCallback);
        },
        moveTo: function(left, top, callback, errorCallback) {
            components.sendMessageToDesktop('move-window', {
                uuid: this.app_uuid,
                name: this.name,
                top: Math.floor(top),
                left: Math.floor(left)
            }, callback, errorCallback);
        },
        redirect: function(url) {
            if (this.contentWindow !== undefined) {
                if (this.contentWindow != window)
                    this.contentWindow = window.open(url, this.name);
                else
                    window.location.href = url;
            } else {
                throw new Error("Cannot redirect url of application");
            }
        },
        removeEventListener: function(type, listener, callback, errorCallback) {
            components.removeDesktopEventCallback({
                topic: "window",
                type: type,
                name: this.name,
                uuid: this.app_uuid
            }, listener, callback, errorCallback);
        },
        resizeBy: function(deltaWidth, deltaHeight, anchor, callback, errorCallback) {
            components.sendMessageToDesktop('resize-window-by', {
                uuid: this.app_uuid,
                name: this.name,
                deltaWidth: Math.floor(deltaWidth),
                deltaHeight: Math.floor(deltaHeight),
                anchor: anchor
            }, callback, errorCallback);
        },
        resizeTo: function(width, height, anchor, callback, errorCallback) {
            components.sendMessageToDesktop('resize-window', {
                uuid: this.app_uuid,
                name: this.name,
                width: Math.floor(width),
                height: Math.floor(height),
                anchor: anchor
            }, callback, errorCallback);
        },
        restore: function(callback, errorCallback) {
            components.sendMessageToDesktop('restore-window', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        setAsForeground: function(callback, errorCallback) {
            components.sendMessageToDesktop('set-foreground-window', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        setBounds: function(left, top, width, height, callback, errorCallback) {
            components.sendMessageToDesktop('set-window-bounds', {
                uuid: this.app_uuid,
                name: this.name,
                left: left,
                top: top,
                width: width,
                height: height
            }, callback, errorCallback);
        },
        show: function(callback, errorCallback) {
            components.sendMessageToDesktop('show-window', {
                uuid: this.app_uuid,
                name: this.name
            }, callback, errorCallback);
        },
        showAt: function(left, top, toggle, callback, errorCallback) {
            components.sendMessageToDesktop('show-at-window', {
                uuid: this.app_uuid,
                name: this.name,
                top: Math.floor(top),
                left: Math.floor(left),
                toggle: toggle
            }, callback, errorCallback);
        },
        updateOptions: function(options, callback, errorCallback) {
            components.sendMessageToDesktop('update-window-options', {
                uuid: this.app_uuid,
                name: this.name,
                options: options
            }, callback, errorCallback);
        },
        //this will create a draggable area within the window.
        defineDraggableArea: function(draggableElement, onMoveStart, onMoveEnd, onErr) {
            var boundsChanging = false,
                inputElements,
                i;

            onMoveStart = onMoveStart || components.noop;
            onMoveEnd = onMoveEnd || components.noop;
            onErr = onErr || components.noop;

            try {
                //set the webkit drag property to the draggable element:
                draggableElement.style['-webkit-app-region'] = 'drag';

                //get the list of child elements that require interaction.
                inputElements = draggableElement.querySelectorAll('button, a, input, textarea');
                for (i = 0; i < inputElements.length; i++) {
                    //no-drag needs to be set to these elements to allow the user to interact with them.
                    inputElements[i].style['-webkit-app-region'] = 'no-drag';
                }

                //subscribe to the window move event.
                this.addEventListener('bounds-changing', function(data) {
                    if (!boundsChanging) {
                        onMoveStart(data);
                        boundsChanging = true;
                    }
                });

                //subscribe to the move end event.
                this.addEventListener('bounds-changed', function(data) {
                    onMoveEnd();
                    boundsChanging = false;
                });
            } catch (err) {
                onErr(err);
                throw err;
            }
        }
    };

}());
