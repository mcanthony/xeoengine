/**
 A **KeyboardAxisCamera** switches a {{#crossLink "Camera"}}{{/crossLink}} between preset left, right, anterior,
 posterior, superior and inferior views using the keyboard.

 ## Overview

 <ul>
 <li>A KeyboardAxisCamera updates the {{#crossLink "Lookat"}}{{/crossLink}} attached to the target {{#crossLink "Camera"}}{{/crossLink}}.
 </ul>

 By default the views are selected by the following keys:

 <ul>
 <li>'1' - left side, viewing center from along -X axis</li>
 <li>'2' - right side, viewing center from along +X axis</li>
 <li>'3' - anterior, viewing center from along -Z axis</li>
 <li>'4' - posterior, viewing center from along +Z axis</li>
 <li>'5' - superior, viewing center from along -Y axis</li>
 <li>'6' - inferior, viewing center from along +Y axis</li>
 </ul>

 ## Example

 ````Javascript
 var scene = new XEO.Scene();

 var camera = new XEO.Camera(scene);

 var control = new XEO.KeyboardAxisCamera(scene, {
        camera: camera
    });

 var object = new XEO.GameObject(scene);
 ````

 @class KeyboardAxisCamera
 @module XEO
 @submodule controls
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent scene, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardAxisCamera.
 @param [cfg.camera] {String|Camera} ID or instance of a {{#crossLink "Camera"}}Camera{{/crossLink}} to control.
 Must be within the same {{#crossLink "Scene"}}Scene{{/crossLink}} as this KeyboardAxisCamera. Defaults to the
 parent {{#crossLink "Scene"}}Scene{{/crossLink}}'s default instance, {{#crossLink "Scene/camera:property"}}camera{{/crossLink}}.
 @param [cfg.active=true] {Boolean} Whether or not this KeyboardAxisCamera is active.
 @extends Component
 */
(function () {

    "use strict";

    XEO.KeyboardAxisCamera = XEO.Component.extend({

        /**
         JavaScript class name for this Component.

         @property type
         @type String
         @final
         */
        type: "XEO.KeyboardAxisCamera",

        _init: function (cfg) {

            // Event handles

            this._onKeyDown = null;

            // Animations

            this._cameraFly = new XEO.CameraFlight(this.scene, {
                duration: 1.0
            });

            // Init properties

            this.camera = cfg.camera;
            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * The {{#crossLink "Camera"}}Camera{{/crossLink}} attached to this KeyboardAxisCamera.
             *
             * Must be within the same {{#crossLink "Scene"}}Scene{{/crossLink}} as this KeyboardAxisCamera. Defaults to the parent
             * {{#crossLink "Scene"}}Scene{{/crossLink}}'s default {{#crossLink "Scene/camera:property"}}camera{{/crossLink}} when set to
             * a null or undefined value.
             *
             * Fires a {{#crossLink "KeyboardAxisCamera/camera:event"}}{{/crossLink}} event on change.
             *
             * @property camera
             * @type Camera
             */
            camera: {

                set: function (value) {

                    /**
                     * Fired whenever this KeyboardAxisCamera's {{#crossLink "KeyboardAxisCamera/camera:property"}}{{/crossLink}} property changes.
                     *
                     * @event camera
                     * @param value The property's new value
                     */
                    this._setChild("camera", value);

                    // Update animation

                    this._cameraFly.camera = this._children.camera;
                },

                get: function () {
                    return this._children.camera;
                }
            },

            /**
             * Flag which indicates whether this KeyboardAxisCamera is active or not.
             *
             * Fires an {{#crossLink "KeyboardAxisCamera/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    value = !!value;

                    if (this._active === value) {
                        return;
                    }

                    this._cameraFly.active = value;

                    var self = this;

                    var input = this.scene.input;

                    if (value) {

                        this._onKeyDown = input.on("keydown",
                            function (keyCode) {

                                if (!self._children.camera) {
                                    return;
                                }

                                var boundary = self.scene.worldBoundary;
                                var aabb = boundary.aabb;
                                var center = boundary.center;
                                var diag = XEO.math.getAABBDiag(aabb);

                                this._stopFOV = 55;
                                var dist = Math.abs((diag) / Math.tan(this._stopFOV / 2));

                                switch (keyCode) {

                                    case input.KEY_NUM_1:

                                        // Right view

                                        self._cameraFly.flyTo({
                                            look: center,
                                            eye: [center[0] - dist, center[1], center[2]],
                                            up: [0, 1, 0]
                                        });

                                        break;

                                    case input.KEY_NUM_2:

                                        // Back view

                                        self._cameraFly.flyTo({
                                            look: center,
                                            eye: [center[0], center[1], center[2] + dist],
                                            up: [0, 1, 0]
                                        });

                                        break;

                                    case input.KEY_NUM_3:

                                        // Left view

                                        self._cameraFly.flyTo({
                                            look: center,
                                            eye: [center[0] + dist, center[1], center[2]],
                                            up: [0, 1, 0]
                                        });


                                        break;

                                    case input.KEY_NUM_4:

                                        // Front view

                                        self._cameraFly.flyTo({
                                            look: center,
                                            eye: [center[0], center[1], center[2] - dist],
                                            up: [0, 1, 0]
                                        });

                                        break;

                                    case input.KEY_NUM_5:

                                        // Top view

                                        self._cameraFly.flyTo({
                                            look: center,
                                            eye: [center[0], center[1] - dist, center[2]],
                                            up: [0, 0, -1]
                                        });

                                        break;

                                    case input.KEY_NUM_6:

                                        // Bottom view

                                        self._cameraFly.flyTo({
                                            look: center,
                                            eye: [center[0], center[1] + dist, center[2]],
                                            up: [0, 0, 1]
                                        });

                                        break;
                                }
                            });

                    } else {

                        this.scene.off(this._onKeyDown);
                    }

                    /**
                     * Fired whenever this KeyboardAxisCamera's {{#crossLink "KeyboardAxisCamera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            }
        },

        _getJSON: function () {

            var json = {
                active: this._active
            };

            if (this._children.camera) {
                json.camera = this._children.camera.id;
            }

            return json;
        },

        _destroy: function () {

            this.active = false;

            this._cameraFly.destroy();
        }
    });

})();
