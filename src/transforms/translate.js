/**

 A **Translate** translates associated {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.

 ## Overview

 <ul>

 <li>Translate is a sub-class of {{#crossLink "Transform"}}{{/crossLink}}</li>
 <li>Instances of Transform and its sub-classes may be connected into hierarchies.</li>
 <li>A {{#crossLink "GameObject"}}{{/crossLink}} would be connected to a leaf Transform
 within a hierarchy, and would be transformed by each Transform on the path up to the root, in that order.</li>
 <li>See <a href="./Shader.html#inputs">Shader Inputs</a> for the variables that Transform create within xeoEngine's shaders.</li>
 </ul>

 </ul>

 <img src="../../../assets/images/Translate.png"></img>

 ## Example

 This example has two {{#crossLink "GameObject"}}GameObjects{{/crossLink}} that are transformed by a hierarchy that contains
 {{#crossLink "Rotate"}}{{/crossLink}}, Translate and {{#crossLink "Scale"}}{{/crossLink}} transforms.
 The GameObjects share the same {{#crossLink "Geometry"}}{{/crossLink}}, which is the default 2x2x2 cube.<br>

 ````javascript
 var scene = new XEO.Scene();

 var rotate = new XEO.Rotate(scene, {
    xyz: [0, 1, 0], // Rotate 30 degrees about Y axis
    angle: 30
});

 var translate1 = new XEO.Translate(scene, {
    parent: rotate,
    xyz: [-5, 0, 0] // Translate along -X axis
});

 var translate2 = new XEO.Translate(scene, {
    parent: rotate,
    xyz: [5, 0, 0] // Translate along +X axis
});

 var scale = new XEO.Scale(scene, {
    parent: translate2,
    xyz: [1, 2, 1] // Scale x2 on Y axis
});

 var geometry = new XEO.Geometry(scene); // Defaults to a 2x2x2 box

 var gameObject1 = new XEO.GameObject(scene, {
    transform: translate1,
    geometry: geometry
});

 var gameObject2 = new XEO.GameObject(scene, {
    transform: scale,
    geometry: geometry
});
 ````

 Since everything in xeoEngine is dynamically editable, we can restructure the transform hierarchy at any time.

 Let's insert a {{#crossLink "Scale"}}{{/crossLink}} between the first Translate and the first {{#crossLink "GameObject"}}{{/crossLink}}:

 ````javascript
 var scale2 = new XEO.Scale(scene, {
    parent: translate1,
    xyz: [1, 1, 2] // Scale x2 on Z axis
});

 gameObject2.transform = scale2;
 ````

 And just for fun, we'll start updating the second {{#crossLink "Translate"}}{{/crossLink}}:

 ````javascript
 // Rotate 0.2 degrees on each frame
 scene.on("tick", function(e) {
    var xyz = translate2.xyz;
    xyz[0] += 0.2;
    translate2.xyz = xyz;
});
 ````

 @class Translate
 @module XEO
 @submodule transforms
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}} - creates this Translate in the default
 {{#crossLink "Scene"}}Scene{{/crossLink}} when omitted.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent scene, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Translate.
 @param [cfg.xyzw=[0,0,0]] {Array(Number)} The translation vector
 @extends Transform
 */
(function () {

    "use strict";

    XEO.Translate = XEO.Transform.extend({

        type: "XEO.Translate",

        _init: function (cfg) {

            this._super(cfg);

            this.xyz = cfg.xyz;
        },

        _props: {

            /**
             * Vector indicating a translation amount for each axis.
             * Fires an {{#crossLink "Translate/xyz:event"}}{{/crossLink}} event on change.
             * @property xyz
             * @default [0,0,0]
             * @type {Array of Number}
             */
            xyz: {

                set: function (value) {

                    value = value || [0, 0, 0];

                    if (this._xyz) {
                        if (this._xyz[0] === value[0] && this._xyz[1] === value[1] && this._xyz[2] === value[2]) {
                            return;
                        } else {
                            this._xyz[0] = value[0];
                            this._xyz[1] = value[1];
                            this._xyz[2] = value[2];
                        }
                    } else {
                        this._xyz = value;
                    }

                    this.matrix = XEO.math.translationMat4v(this._xyz, this._matrix || (this._matrix = XEO.math.identityMat4()));

                    /**
                     Fired whenever this Translate's {{#crossLink "Translate/xyz:property"}}{{/crossLink}} property changes.
                     @event xyz
                     @param value {Array of Number} The property's new value
                     */
                    this.fire("xyz", this._xyz);
                },

                get: function () {
                    return this._xyz;
                }
            }
        },

        _getJSON: function () {
            return {
                xyz: this.xyz
            };
        }
    });

})();
