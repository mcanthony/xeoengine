/**
 A **DirLight** is a directional light source that illuminates all attached {{#crossLink "GameObject"}}GameObjects{{/crossLink}} equally
 from a given direction.

 ## Overview

 <ul>
 <li>DirLights are grouped, along with other light source types, within {{#crossLink "Lights"}}Lights{{/crossLink}} components,
 which are attached to {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.</li>
 <li>DirLights have a direction, but no position.</li>
 <li>DirLights may be defined in either **World** or **View** coordinate space. When in World-space, their direction
 is relative to the World coordinate system, and will appear to move as the {{#crossLink "Camera"}}{{/crossLink}} moves.
 When in View-space, their direction is relative to the View coordinate system, and will behave as if fixed to the viewer's
 head as the {{#crossLink "Camera"}}{{/crossLink}} moves.</li>
 <li>See <a href="Shader.html#inputs">Shader Inputs</a> for the variables that DirLights create within xeoEngine's shaders.</li>
 </ul>

 <img src="../../../assets/images/DirLight.png"></img>

 ## Example

 In this example we have:

 <ul>
 <li>a {{#crossLink "PhongMaterial"}}{{/crossLink}},</li>
 <li>a DirLight that points along the negative diagonal of the View coordinate system,</li>
 <li>a {{#crossLink "Lights"}}{{/crossLink}} containing the DirLight,</li>
 <li>a {{#crossLink "Geometry"}}{{/crossLink}} that is the default box shape, and
 <li>a {{#crossLink "GameObject"}}{{/crossLink}} attached to all of the above.</li>
 </ul>

 <iframe style="width: 600px; height: 400px" src="../../examples/light_DirLight.html"></iframe>

 ```` javascript
 var scene = new XEO.Scene();

 // A shiny PhongMaterial with quantities of reflected
 // ambient, diffuse and specular color
 var material = new XEO.PhongMaterial(scene, {
    ambient:    [0.3, 0.3, 0.3],
    diffuse:    [0.7, 0.7, 0.7],
    specular:   [1. 1, 1],
    shininess:  30
});

 // DirLight with color and intensity, pointing along
 // the negative diagonal within the View coordinate system
 var dirLight = new XEO.DirLight(scene, {
    dir:         [-1, -1, -1],
    color:       [0.5, 0.7, 0.5],
    intensity:   1.0,
    space:      "view"  // Other option is "world", for World-space
});

 // Lights which contains our DirLight
 var lights = new XEO.Lights(scene, {
    lights: [
        dirLight
    ]
});

 var geometry = new XEO.Geometry(scene);  // Defaults to a 2x2x2 box

 // Object which renders our Geometry, colored with
 // the Material and illuminated with the DirLight
 var object = new XEO.GameObject(scene, {
    lights: lights,
    material: material,
    geometry: geometry
});
 ````

 As with all components, we can observe and change properties on a DirLights, like so:

 ````Javascript
 // Attach a change listener to a property
 var handle = dirLight.on("color",
 function(value) {
        // Property value has changed
    });

 // Set the property, which fires our change listener
 dirLight.color = [0.0, 0.3, 0.3];

 // Detach the change listener
 dirLight.off(handle);
 ````

 @class DirLight
 @module XEO
 @submodule lighting
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}}, creates this DirLight within the
 default {{#crossLink "Scene"}}Scene{{/crossLink}} when omitted
 @param [cfg] {*} The DirLight configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Scene"}}Scene{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this DirLight.
 @param [cfg.dir=[1.0, 1.0, 1.0]] {Array(Number)} A unit vector indicating the direction of illumination, given in either World or View space, depending on the value of the **space** parameter.
 @param [cfg.color=[0.7, 0.7, 0.8 ]] {Array(Number)} The color of this DirLight.
 @param [cfg.intensity=1.0 ] {Number} The intensity of this DirLight.
 @param [cfg.space="view"] {String} The coordinate system the DirLight is defined in - "view" or "space".

 @extends Component
 */
(function () {

    "use strict";

    XEO.DirLight = XEO.Component.extend({

        type: "XEO.DirLight",

        _init: function (cfg) {

            this._state = {
                type: "dir",
                dir: [0,0,-1],
                color: [0.7, 0.7, 0.8],
                intensity: 1.0,
                space: "view"
            };

            this.dir = cfg.dir;
            this.color = cfg.color;
            this.intensity = cfg.intensity;
            this.space = cfg.space;
        },

        _props: {

            /**
             The direction of this DirLight.

             Fires a {{#crossLink "DirLight/dir:event"}}{{/crossLink}} event on change.

             @property dir
             @default [1.0, 1.0, 1.0]
             @type Array(Number)
             */
            dir: {

                set: function (value) {

                    value = value || [ 1.0, 1.0, 1.0 ];

                    var dir = this._state.dir;

                    dir[0] = value[0];
                    dir[1] = value[1];
                    dir[2] = value[2];

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this DirLight's  {{#crossLink "DirLight/dir:property"}}{{/crossLink}} property changes.
                     * @event dir
                     * @param value The property's new value
                     */
                    this.fire("dir", dir);
                },

                get: function () {
                    return this._state.dir;
                }
            },

            /**
             The color of this DirLight.

             Fires a {{#crossLink "DirLight/color:event"}}{{/crossLink}} event on change.

             @property color
             @default [0.7, 0.7, 0.8]
             @type Array(Number)
             */
            color: {

                set: function (value) {

                    value = value || [0.7, 0.7, 0.8 ];

                    var color = this._state.color;

                    color[0] = value[0];
                    color[1] = value[1];
                    color[2] = value[2];

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this DirLight's  {{#crossLink "DirLight/color:property"}}{{/crossLink}} property changes.
                     * @event color
                     * @param value The property's new value
                     */
                    this.fire("color", color);
                },

                get: function () {
                    return this._state.color;
                }
            },

            /**
             The intensity of this DirLight.

             Fires a {{#crossLink "DirLight/intensity:event"}}{{/crossLink}} event on change.

             @property intensity
             @default 1.0
             @type Number
             */
            intensity: {

                set: function (value) {

                    value = value !== undefined ? value :  1.0;

                    this._state.intensity = value;

                    this._renderer.imageDirty = true;

                    /**
                     * Fired whenever this DirLight's  {{#crossLink "DirLight/intensity:property"}}{{/crossLink}} property changes.
                     * @event intensity
                     * @param value The property's new value
                     */
                    this.fire("intensity", this._state.intensity);
                },

                get: function () {
                    return this._state.intensity;
                }
            },

            /**
             Specifies which coordinate space this DirLight is in.

             Supported values are:

             <ul>
             <li>"view" - View space, aligned within the view volume as if fixed to the viewer's head</li>
             <li>"world" - World space, fixed within the world, moving within the view volume with respect to camera</li>
             </ul>

             Fires a {{#crossLink "DirLight/space:event"}}{{/crossLink}} event on change.

             @property space
             @default "view"
             @type String
             */
            space: {

                set: function (value) {

                    this._state.space = value || "view";

                    this.fire("dirty", true); // Need to rebuild shader

                    /**
                     * Fired whenever this DirLight's {{#crossLink "DirLight/space:property"}}{{/crossLink}} property changes.
                     * @event space
                     * @param value The property's new value
                     */
                    this.fire("space", this._state.space);
                },

                get: function () {
                    return this._state.space;
                }
            }
        },

        _getJSON: function () {
            return {
                type: this._state.type,
                dir: this._state.dir,
                color: this._state.color,
                intensity: this._state.intensity,
                space: this._state.space
            };
        }
    });

})();
