/**
 A **Lights** defines a group of light sources that illuminate attached {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.

 ## Overview

 A Lights may contain a virtually unlimited number of three types of light source:

 <ul>
 <li>{{#crossLink "AmbientLight"}}AmbientLight{{/crossLink}}s, which are fixed-intensity and fixed-color, and
 affect all the {{#crossLink "GameObject"}}GameObjects{{/crossLink}} equally,</li>
 <li>{{#crossLink "PointLight"}}PointLight{{/crossLink}}s, which emit light that
 originates from a single point and spreads outward in all directions, and </li>
 <li>{{#crossLink "DirLight"}}DirLight{{/crossLink}}s, which illuminate all the
 {{#crossLink "GameObject"}}GameObjects{{/crossLink}} equally from a given direction</li>
 </ul>

 <img src="../../../assets/images/Lights.png"></img>

 ## Example

 In this example we have a {{#crossLink "GameObject"}}{{/crossLink}} that has a {{#crossLink "Geometry"}}{{/crossLink}},
 a {{#crossLink "PhongMaterial"}}{{/crossLink}} and a {{#crossLink "Lights"}}{{/crossLink}}. The {{#crossLink "Lights"}}{{/crossLink}}
 contains an {{#crossLink "AmbientLight"}}{{/crossLink}}, a {{#crossLink "DirLight"}}{{/crossLink}} and a {{#crossLink "PointLight"}}{{/crossLink}}.


 ```` javascript
 var scene = new XEO.Scene();

 var material = new XEO.PhongMaterial(scene, {
    ambient:    [0.3, 0.3, 0.3],
    diffuse:    [0.7, 0.7, 0.7],
    specular:   [1. 1, 1],
    shininess:  30
});

 var ambientLight = new XEO.AmbientLight(scene, {
    color: [0.7, 0.7, 0.7],
    intensity:   1.0
});

 var dirLight = new XEO.DirLight(scene, {
    dir:        [-1, -1, -1],
    color:    [0.5, 0.7, 0.5],
    intensity:   1.0,
    space:      "view"
});

 var pointLight = new XEO.PointLight(scene, {
    pos: [0, 100, 100],
    color: [0.5, 0.7, 0.5],
    intensity: [1.0, 1.0, 1.0],
    constantAttenuation: 0,
    linearAttenuation: 0,
    quadraticAttenuation: 0,
    space: "view"
});

 var lights = new XEO.Lights(scene, {
    lights: [
        ambientLight,
        dirLight,
        pointLight
    ]
});

 var geometry = new XEO.Geometry(scene);  // Defaults to a 2x2x2 box

 var object = new XEO.GameObject(scene, {
    lights: lights,
    material: material,
    geometry: geometry
});
 ````


 @class Lights
 @constructor
 @module XEO
 @submodule lighting
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}} - creates this Lights in the default
 {{#crossLink "Scene"}}Scene{{/crossLink}} when omitted.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent scene, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Lights.
 @param [cfg.lights] {{Array of String|GameObject}} Array of light source IDs or instances.
 @extends Component
 */
(function () {

    "use strict";

    XEO.Lights = XEO.Component.extend({

        type: "XEO.Lights",

        _init: function (cfg) {

            // Renderer state contains the states of the child light source components
            this._state = new XEO.renderer.Lights({
                lights: [],
                hash: ""
            });

            this._dirty = true;

            // Array of child light source components
            this._lights = [];

            // Subscriptions to "dirty" events from child light source components
            this._dirtySubs = [];

            // Subscriptions to "destroyed" events from child light source components
            this._destroyedSubs = [];

            // Add initial light source components
            this.lights = cfg.lights;
        },

        _props: {

            /**
             The light sources in this Lights.

             Fires a {{#crossLink "Lights/lights:event"}}{{/crossLink}} event on change.

             @property lights
             @default []
             @type {{Array of AmbientLight, PointLight and DirLight}}
             */
            lights: {

                set: function (value) {

                    value = value || [];

                    var light;
                    var i;
                    var len;

                    // Unsubscribe from events on old lights

                    for (i = 0, len = this._lights.length; i < len; i++) {

                        light = this._lights[i];

                        light.off(this._dirtySubs[i]);
                        light.off(this._destroyedSubs[i]);
                    }

                    this._lights = [];

                    this._dirtySubs = [];
                    this._destroyedSubs = [];

                    var self = this;

                    function lightDirty() {
                        self.fire("dirty", true);
                    }

                    function lightDestroyed() {

                        var id = this.id; // Light ID

                        for (var i = 0, len = self._lights.length; i < len; i++) {

                            if (self._lights[i].id === id) {

                                self._lights = self._lights.slice(i, i + 1);
                                self._dirtySubs = self._dirtySubs.slice(i, i + 1);
                                self._destroyedSubs = self._destroyedSubs.slice(i, i + 1);

                                self._dirty = true;

                                self.fire("dirty", true);
                                self.fire("lights", self._lights);

                                return;
                            }
                        }
                    }

                    for (i = 0, len = value.length; i < len; i++) {

                        light = value[i];

                        if (XEO._isNumeric(light) || XEO._isString(light)) {

                            // ID given for light - find the light component

                            var id = light;

                            light = this.scene.components[id];

                            if (!light) {
                                this.error("Component not found: " + XEO._inQuotes(id));
                                continue;
                            }
                        }

                        var type = light.type;

                        if (type !== "XEO.AmbientLight" && type != "XEO.DirLight" && type != "XEO.PointLight") {
                            this.error("Component " + XEO._inQuotes(light.id) + " is not an XEO.AmbientLight, XEO.DirLight or XEO.PointLight ");
                            continue;
                        }

                        this._lights.push(light);

                        this._dirtySubs.push(light.on("dirty", lightDirty));

                        this._destroyedSubs.push(light.on("destroyed", lightDestroyed));
                    }

                    this._dirty = true;

                    this.fire("dirty", true);
                    this.fire("lights", this._lights);
                },

                get: function () {
                    return this._lights;
                }
            }
        },

        _compile: function () {

            var state = this._state;

            if (this._dirty) {

                state.lights = [];

                for (var i = 0, len = this._lights.length; i < len; i++) {
                    state.lights.push(this._lights[i]._state);
                }

                this._makeHash();

                this._dirty = false;
            }

            this._renderer.lights = state;
        },

        _makeHash: function () {

            var lights = this._state.lights;

            if (lights.length === 0) {
                return ";";
            }

            var hash = [];
            var light;

            for (var i = 0, len = lights.length; i < len; i++) {

                light = lights[i];

                hash.push(light.type);
                hash.push((light.space === "world") ? "w" : "v");
            }

            hash.push(";");

            this._state.hash = hash.join("");
        },

        _getJSON: function () {

            var lightIds = [];

            for (var i = 0, len = this._lights.length; i < len; i++) {
                lightIds.push(this._lights[i].id);
            }

            return {
                lights: lightIds
            };
        },

        _destroy: function () {

            var i;
            var len;
            var light;

            for (i = 0, len = this._lights.length; i < len; i++) {

                light = this._lights[i];

                light.off(this._dirtySubs[i]);
                light.off(this._destroyedSubs[i]);
            }

            this._state.destroy();
        }
    });
})();
