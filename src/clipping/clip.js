

/**
 A **Clip** is an arbitrarily-aligned World-space clipping plane, which may be used to create
 cross-sectional views of attached {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.

 ## Overview

 <ul>

 <li>These are grouped within {{#crossLink "Clips"}}Clips{{/crossLink}} components, which are attached to
 {{#crossLink "GameObject"}}GameObjects{{/crossLink}}. See the {{#crossLink "Clips"}}Clips{{/crossLink}} documentation
 for more info.</li>

 <li>A Clip is specified in World-space, as being perpendicular to a vector {{#crossLink "Clip/dir:property"}}{{/crossLink}}
 that emanates from the origin, offset at a distance {{#crossLink "Clip/dist:property"}}{{/crossLink}} along that vector. </li>

 <li>You can move a Clip back and forth along its vector by varying {{#crossLink "Clip/dist:property"}}{{/crossLink}}.</li>

 <li>Likewise, you can rotate a Clip about the origin by rotating the {{#crossLink "Clip/dir:property"}}{{/crossLink}} vector.</li>

 <li>A Clip is has a {{#crossLink "Clip/mode:property"}}{{/crossLink}},  which indicates whether it is disabled
 ("disabled"), discarding fragments that fall on the origin-side of the plane ("inside"), or clipping fragments that
 fall on the other side of the plane from the origin ("outside").</li>

 <li>You can update the {{#crossLink "Clip/mode:property"}}{{/crossLink}} of a Clip to activate or deactivate it, or to
 switch which side it discards fragments from.</li>

 <li>Clipping may also be enabled or disabled for specific {{#crossLink "GameObject"}}GameObjects{{/crossLink}}
 via the {{#crossLink "Modes/clipping:property"}}{{/crossLink}} flag on {{#crossLink "Modes"}}Modes{{/crossLink}} components
 attached to those {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.</li>

 <li>See <a href="Shader.html#inputs">Shader Inputs</a> for the variables that Clips create within xeoEngine's shaders.</li>

 </ul>

 <img src="../../../assets/images/Clip.png"></img>

 ## Example

 <ul>

 <li>In this example we have a {{#crossLink "GameObject"}}{{/crossLink}} that's clipped by a {{#crossLink "Clips"}}{{/crossLink}}
 that contains two {{#crossLink "Clip"}}{{/crossLink}} planes.</li>

 <li>The first {{#crossLink "Clip"}}{{/crossLink}} plane is on the
 positive diagonal, while the second is on the negative diagonal.</li>

 <li>The {{#crossLink "GameObject"}}GameObject's{{/crossLink}}
 {{#crossLink "Geometry"}}{{/crossLink}} is the default 2x2x2 box, and the planes will clip off two of the box's corners.</li>

 </ul>

 ````javascript
 var scene = new XEO.Scene();

 // Clip plane on negative diagonal
 var clip1 = new XEO.Clip(scene, {
        dir: [-1.0, -1.0, -1.0], // Direction of Clip from World space origin
        dist: 2.0,               // Distance along direction vector
        mode: "outside"          // Clip fragments that fall beyond the plane
     });

 // Clip plane on positive diagonal
 var clip2 = new XEO.Clip(scene, {
        dir: [1.0, 1.0, 1.0],
        dist: 2.0,
        mode: "outside"
     });

 // Group the planes in a Clips
 var clips = new XEO.Clip(scene, {
        clips: [
            clip1,
            clip2
        ]
     });

 // Geometry defaults to a 2x2x2 box
 var geometry = new XEO.Geometry(scene);

 // Create an Object, which is a box sliced by our clip planes
 var object = new XEO.GameObject(scene, {
        clips: clips,
        geometry: geometry
     });
 ````

 ### Toggling clipping on and off

 Now we'll attach a {{#crossLink "Modes"}}{{/crossLink}} to the {{#crossLink "GameObject"}}{{/crossLink}}, so that we can
 enable or disable clipping of it:

 ```` javascript
 // Create the Modes
 var modes = new XEO.Modes(scene, {
    clipping: true
 });

 // Attach our Object to the Modes
 object.modes = modes;

 // Disable clipping for the Object
 modes.clipping = false;
 ````

 @class Clip
 @module XEO
 @submodule clipping
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}} - creates this Clip in the
 default {{#crossLink "Scene"}}Scene{{/crossLink}} when omitted.
 @param [cfg] {*} Clip configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Scene"}}Scene{{/crossLink}}, generated automatically when omitted.
 You only need to supply an ID if you need to be able to find the Clip by ID within the {{#crossLink "Scene"}}Scene{{/crossLink}}.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Clip.
 @param [cfg.mode="disabled"] {String} Clipping mode - "disabled" to clip nothing, "inside" to reject points inside the plane, "outside" to reject points outside the plane.
 @param [dir= [1, 0, 0]] {Array of Number} The direction of the clipping plane from the World-space origin.
 @param [dist=1.0] {Number} Distance to the clipping plane along the direction vector.

 @extends Component
 */
(function () {

    "use strict";

    XEO.Clip = XEO.Component.extend({

        type: "XEO.Clip",

        _init: function (cfg) {

            this._state = {
                mode: "disabled",
                dir: [1,0,0],
                dist: 1.0
            };

            this.mode = cfg.mode;
            this.dir = cfg.dir;
            this.dist = cfg.dist;
        },

        _props: {

            /**
             The current mode of this Clip.

             Possible states are:

             <ul>
             <li>"disabled" - inactive</li>
             <li>"inside" - clipping fragments that fall within the half-space on the origin-side of the Clip plane</li>
             <li>"outside" - clipping fragments that fall on the other side of the Clip plane from the origin</li>
             </ul>

             Fires a {{#crossLink "Clip/mode:event"}}{{/crossLink}} event on change.

             @property mode
             @default "disabled"
             @type String
             */
            mode: {

                set: function (value) {

                    this._state.mode =  value || "disabled";

                    this._renderer.imageDirty = true;

                    /**
                     Fired whenever this Clip's {{#crossLink "Clip/mode:property"}}{{/crossLink}} property changes.

                     @event mode
                     @param value {String} The property's new value
                     */
                    this.fire("mode", this._state.mode);
                },

                get: function () {
                    return this._state.mode;
                }
            },

            /**
             A vector emanating from the World-space origin that indicates the orientation of this Clip plane.

             The Clip plane will be oriented perpendicular to this vector.

             Fires a {{#crossLink "Clip/dir:event"}}{{/crossLink}} event on change.

             @property dir
             @default [1.0, 1.0, 1.0]
             @type Array(Number)
             */
            dir: {

                set: function (value) {

                    this._state.dir =  value || [1, 0, 0];

                    this._renderer.imageDirty = true;

                    /**
                     Fired whenever this Clip's {{#crossLink "Clip/dir:property"}}{{/crossLink}} property changes.

                     @event dir
                     @param  value  {Array(Number)} The property's new value
                     */
                    this.fire("dir", this._state.dir);
                },

                get: function () {
                    return this._state.dir;
                }
            },

            /**
             The position of this Clip along the vector indicated by {{#crossLink "Clip/dir:property"}}{{/crossLink}}.

             This is the distance of the Clip plane from the World-space origin.

             Fires a {{#crossLink "Clip/dist:event"}}{{/crossLink}} event on change.

             @property dist
             @default 1.0
             @type Number
             */
            dist: {

                set: function (value) {

                    this._state.dist = value !== undefined ? value : 1.0;

                    this._renderer.imageDirty = true;

                    /**
                     Fired whenever this Clip's {{#crossLink "Clip/dist:property"}}{{/crossLink}} property changes.

                     @event dist
                     @param  value Number The property's new value
                     */
                    this.fire("dist", this._state.dist);
                },

                get: function () {
                    return this._state.dist;
                }
            }
        },

        _getJSON: function () {
            return {
                mode: this._state.mode,
                dir: this._state.dir,
                dist: this._state.dist
            };
        }
    });

})();
