/**
 A **CameraFlight** flies a {{#crossLink "Camera"}}{{/crossLink}} to a given target.

 ## Overview

 <ul>
 <li>A CameraFlight animates the {{#crossLink "Lookat"}}{{/crossLink}} attached to the {{#crossLink "Camera"}}{{/crossLink}}.</li>
 <li>A CameraFlight can be attached to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 <li>While a CameraFlight is busy flying to a target, it can be stopped, or redirected to fly to a different target.</li>
 </ul>

 A target can be:

 <ul>
 <li>a World-space {{#crossLink "Boundary3D"}}{{/crossLink}},</li>
 <li>an instance or ID of any {{#crossLink "Component"}}{{/crossLink}} subtype that provides a World-space</li>
 {{#crossLink "Boundary3D"}}{{/crossLink}} in a "worldBoundary" property, or</li>
 <li>specific ````eye````, ````look```` and ````up```` positions.</li>
 </ul>

 ## Example #1

 Flying to a {{#crossLink "GameObject"}}{{/crossLink}} (which provides a World-space
 {{#crossLink "Boundary3D"}}{{/crossLink}} via its {{#crossLink "GameObject/worldBoundary:property"}}{{/crossLink}} property):

 ````Javascript
 var camera = new XEO.Camera();

 // Create a CameraFlight that takes exactly ten seconds to fly
 // the Camera to each specified target
 var cameraFlight = new XEO.CameraFlight({
    camera: camera,
    duration: 20
 });

 // Create a GameObject, which gets all the default components
 var object = new GameObject();

 // Fly to the GameObject's worldBoundary
 cameraFlight.flyTo(object);
 ````

 ## Example #2

 Flying the CameraFlight from the previous example to specified eye, look and up positions:

 ````Javascript
 cameraFlight.flyTo({
    eye: [-5,-5,-5],
    look: [0,0,0]
    up: [0,1,0]
 }, function() {
    // Arrived
 });
 ````

 ## Example #3

 Flying the CameraFlight from the previous two examples explicitly to the World-space
 {{#crossLink "Boundary3D"}}{{/crossLink}} of the {{#crossLink "GameObject"}}{{/crossLink}} property):

 ````Javascript
 var worldBoundary = object.worldBoundary;

 cameraFlight.flyTo(worldBoundary);
 ````

 ## Example #4

 Flying the CameraFlight from the previous two examples explicitly to the {{#crossLink "Boundary3D"}}Boundary3D's{{/crossLink}}
 axis-aligned bounding box:

 ````Javascript
 var worldBoundary = object.worldBoundary;

 var aabb = worldBoundary.aabb;

 cameraFlight.flyTo(aabb);
 ````

 @class CameraFlight
 @author xeolabs / http://xeolabs.org
 @module XEO
 @submodule animation
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}}.
 @param [cfg] {String|Component|Boundary3D|Array of Number|*} Target - see class documentation above.
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Scene"}}Scene{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this CameraFlight.
 @param [cfg.camera] {String|Camera} ID or instance of a {{#crossLink "Camera"}}Camera{{/crossLink}} to control.
 Must be within the same {{#crossLink "Scene"}}Scene{{/crossLink}} as this CameraFlight. Defaults to the
 parent {{#crossLink "Scene"}}Scene{{/crossLink}}'s default instance, {{#crossLink "Scene/camera:property"}}camera{{/crossLink}}.
 @extends Component
 */
(function () {

    "use strict";

    // Caches to avoid garbage collection

    var tempVec3 = XEO.math.vec3();
    var tempVec3b = XEO.math.vec3();
    var tempVec3c = XEO.math.vec3();

    XEO.CameraFlight = XEO.Component.extend({

        /**
         JavaScript class name for this Component.

         @property type
         @type String
         @final
         */
        type: "XEO.CameraFlight",

        _init: function (cfg) {

            this._look1 = XEO.math.vec3();
            this._eye1 = XEO.math.vec3();
            this._up1 = XEO.math.vec3();

            this._look2 = XEO.math.vec3();
            this._eye2 = XEO.math.vec3();
            this._up2 = XEO.math.vec3();

            this._flying = false;

            this._ok = null;

            this._onTick = null;

            this._stopFOV = 55;

            this._time1 = null;
            this._time2 = null;

            this.easing = cfg.easing !== false;

            this.duration = cfg.duration || 0.5;

            this.camera = cfg.camera;
        },

        /**
         * Begins flying this CameraFlight's {{#crossLink "Camera"}}{{/crossLink}} to the given target.
         *
         * <ul>
         *     <li>When the target is a boundary, the {{#crossLink "Camera"}}{{/crossLink}} will fly towards the target
         *     and stop when the target fills most of the canvas.</li>
         *     <li>When the target is an explicit {{#crossLink "Camera"}}{{/crossLink}} position, given as ````eye````, ````look```` and ````up````
         *      vectors, then this CameraFlight will interpolate the {{#crossLink "Camera"}}{{/crossLink}} to that target and stop there.</li>
         * @method flyTo
         * @param params  {*|Component} Either a parameters object or a {{#crossLink "Component"}}{{/crossLink}} subtype that has a {{#crossLink "WorldBoundary"}}{{/crossLink}}.
         * @param[params.arc=0]  {Number} Factor in range [0..1] indicating how much the
         * {{#crossLink "Camera/eye:property"}}Camera's eye{{/crossLink}} position will
         * swing away from its {{#crossLink "Camera/eye:property"}}look{{/crossLink}} position as it flies to the target.
         * @param [params.component] {String|Component} ID or instance of a component to fly to.
         * @param [params.aabb] {*}  World-space axis-aligned bounding box (AABB) target to fly to.
         * @param [params.eye] {Array of Number} Position to fly the eye position to.
         * @param [params.look] {Array of Number} Position to fly the look position to.
         * @param [params.up] {Array of Number} Position to fly the up vector to.
         * @param [ok] {Function} Callback fired on arrival
         */
        flyTo: function (params, ok) {

            if (this._flying) {
                this.stop();
            }

            var camera = this._children.camera;

            if (!camera) {
                if (ok) {
                    ok();
                }
                return;
            }

            this._flying = false

            this._ok = ok;

            var lookat = camera.view;

            this._eye1[0] = lookat.eye[0];
            this._eye1[1] = lookat.eye[1];
            this._eye1[2] = lookat.eye[2];

            this._look1[0] = lookat.look[0];
            this._look1[1] = lookat.look[1];
            this._look1[2] = lookat.look[2];

            this._up1[0] = lookat.up[0];
            this._up1[1] = lookat.up[1];
            this._up1[2] = lookat.up[2];

            var aabb;
            var eye;
            var look;
            var up;

            if (worldBoundary = params.worldBoundary) {

                // Argument is a Component subtype with a worldBoundary

                aabb = worldBoundary.aabb;

            } else if (aabb = params.aabb) {

                // Argument is a Boundary3D

            } else if (params.min != undefined && params.max != undefined) {

                // Argument is an AABB

                aabb = params;

            } else if (params.eye || params.look || params.up) {

                // Argument is eye, look and up positions

                eye = params.eye;
                look = params.look;
                up = params.up;

            } else {

                // Argument must be an instance or ID of a Component (subtype)

                var component = params;

                if (XEO._isNumeric(component) || XEO._isString(component)) {

                    var componentId = component;

                    component = this.scene.components[componentId];

                    if (!component) {
                        this.error("Component not found: " + XEO._inQuotes(componentId));
                        if (ok) {
                            ok();
                        }
                        return;
                    }
                }

                var worldBoundary = component.worldBoundary;

                if (!worldBoundary) {
                    this.error("Can't fly to component " + XEO._inQuotes(componentId) + " - does not have a worldBoundary");
                    if (ok) {
                        ok();
                    }
                    return;
                }

                aabb = worldBoundary.aabb;
            }

            var offset = params.offset;

            if (aabb) {

                if (aabb.max[0] <= aabb.min[0] || aabb.max[1] <= aabb.min[1] || aabb.max[2] <= aabb.min[2]) {

                    // Don't fly to an empty boundary
                    return;
                }

                this._look2 = XEO.math.getAABBCenter(aabb);

                if (offset) {
                    this._look2[0] += offset[0];
                    this._look2[1] += offset[1];
                    this._look2[2] += offset[2];
                }

                var vec = XEO.math.normalizeVec3(XEO.math.subVec3(this._eye1, this._look1, tempVec3));
                var diag = XEO.math.getAABBDiag(aabb);
                var sca = Math.abs((diag) / Math.tan(this._stopFOV / 2));

                this._eye2[0] = this._look2[0] + (vec[0] * sca);
                this._eye2[1] = this._look2[1] + (vec[1] * sca);
                this._eye2[2] = this._look2[2] + (vec[2] * sca);

                this._up2[0] = this._up1[0];
                this._up2[1] = this._up1[1];
                this._up2[2] = this._up1[2];

            } else if (eye || look || up) {

                look = look || this._look1;
                eye = eye || this._eye1;
                up = up || this._up1;

                this._look2[0] = look[0];
                this._look2[1] = look[1];
                this._look2[2] = look[2];

                this._eye2[0] = eye[0];
                this._eye2[1] = eye[1];
                this._eye2[2] = eye[2];

                this._up2[0] = up[0];
                this._up2[1] = up[1];
                this._up2[2] = up[2];
            }

            this.fire("started", params, true);

            var self = this;

            this._time1 = (new Date()).getTime();
            this._time2 = this._time1 + this._duration;

            this._flying = true; // False as soon as we stop

            this._tick = this.scene.on("tick",
                function (params) {
                    self._update(params);
                });
        },

        _update: function (params) {

            if (!this._flying) {
                return;
            }

            var time = params.time;

            var t = (time - this._time1) / (this._time2 - this._time1);

            var stopping = (t >= 1);

            if (t > 1) {
                t = 1;
            }

            t = this.easing ? this._ease(t, 0, 1, 1) : t;

            var view = this._children.camera.view;

            view.eye = XEO.math.lerpVec3(t, 0, 1, this._eye1, this._eye2, tempVec3);
            view.look = XEO.math.lerpVec3(t, 0, 1, this._look1, this._look2, tempVec3b);
            view.up = XEO.math.lerpVec3(t, 0, 1, this._up1, this._up2, tempVec3c);

            if (stopping) {
                this.stop();
            }
        },

        // Quadratic easing out - decelerating to zero velocity
        // http://gizma.com/easing

        _ease: function (t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        },

        stop: function () {

            if (!this._flying) {
                return;
            }

            this.scene.off(this._tick);

            this._flying = false;

            this._time1 = null;
            this._time2 = null;

            var ok = this._ok;

            if (ok) {
                this._ok = null;
                ok();
            }

            this.fire("stopped", true, true);
        },

        _props: {

            camera: {

                set: function (value) {

                    /**
                     * Fired whenever this CameraFlight's {{#crossLink "CameraFlight/camera:property"}}{{/crossLink}}
                     * property changes.
                     *
                     * @event camera
                     * @param value The property's new value
                     */
                    this._setChild("camera", value);

                    this.stop();
                },

                get: function () {
                    return this._children.camera;
                }
            },

            duration: {

                set: function (value) {

                    this._duration = value * 1000.0;

                    this.stop();
                },

                get: function () {
                    return this._duration / 1000.0;
                }
            }
        },

        _getJSON: function () {

            var json = {};

            if (this._children.camera) {
                json.camera = this._children.camera.id;
            }

            return json;
        },

        _destroy: function () {
            this.stop();
        }
    });

})();
