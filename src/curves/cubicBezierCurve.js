/**
 A **CubicBezierCurve** extends {{#crossLink "Curve"}}{{/crossLink}} to provide a cubic Bezier curve.

 ## Overview

 <img style="border:1px solid;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/B%C3%A9zier_3_big.gif/240px-B%C3%A9zier_3_big.gif"/>

 *[Cubic Bezier Curve from WikiPedia](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)*

 <ul>
    <li>To build a complex path, you can combine an unlimited combination of CubicBezierCurves,
 {{#crossLink "QuadraticBezierCurve"}}QuadraticBezierCurves{{/crossLink}} and {{#crossLink "SplineCurve"}}SplineCurves{{/crossLink}}
 within a {{#crossLink "Path"}}{{/crossLink}}.</li>
 </ul>

 ## Example

 ````javascript

 var curve = new XEO.CubicBezierCurve({
        v0: [-10, 0, 0],
        v1: [-5, 15, 0],
        v2: [20, 15, 0],
        v3: [10, 0, 0]
    });

 curve.scene.on("tick", function(e) {

        curve.t = (e.time - e.startTime) * 0.01;

        var point = curve.point;
        var tangent = curve.tangent;

        this.log("t=" + curve.t + ", point=" +
            JSON.stringify(point) + ", tangent=" +
                JSON.stringify(tangent));
    });
 ````

 @class CubicBezierCurve
 @module XEO
 @submodule curves
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}}.
 @param [cfg] {*} Configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Scene"}}Scene{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this CubicBezierCurve.
 @param [cfg.v0=[0,0,0]] The starting point.
 @param [cfg.v1=[0,0,0]] The first control point.
 @param [cfg.v2=[0,0,0]] The middle control point.
 @param [cfg.v3=[0,0,0]] The ending point.
 @param [cfg.t=0] Current position on this CubicBezierCurve, in range between 0..1.
 @extends Curve
 */
(function () {

    "use strict";

    XEO.CubicBezierCurve = XEO.Curve.extend({

        /**
         JavaScript class name for this Component.

         @property type
         @type String
         @final
         */
        type: "XEO.CubicBezierCurve",

        _init: function (cfg) {

            this._super(cfg);

            this.v0 = cfg.v0;
            this.v1 = cfg.v1;
            this.v2 = cfg.v2;
            this.v3 = cfg.v3;

            this.t = cfg.t;
        },

        _props: {

            /**
             Starting point on this CubicBezierCurve.

             Fires a {{#crossLink "CubicBezierCurve/v0:event"}}{{/crossLink}} event on change.

             @property v0
             @default [0.0, 0.0, 0.0]
             @type Array(Number)
             */
            v0: {

                set: function (value) {

                    /**
                     * Fired whenever this CubicBezierCurve's
                     * {{#crossLink "CubicBezierCurve/v0:property"}}{{/crossLink}} property changes.
                     * @event v0
                     * @param value The property's new value
                     */
                    this.fire("v0", this._v0 = value || [0, 0, 0]);
                },

                get: function () {
                    return this._v0;
                }
            },

            /**
             First control point on this CubicBezierCurve.

             Fires a {{#crossLink "CubicBezierCurve/v1:event"}}{{/crossLink}} event on change.

             @property v1
             @default [0.0, 0.0, 0.0]
             @type Array(Number)
             */
            v1: {

                set: function (value) {

                    /**
                     * Fired whenever this CubicBezierCurve's
                     * {{#crossLink "CubicBezierCurve/v1:property"}}{{/crossLink}} property changes.
                     * @event v1
                     * @param value The property's new value
                     */
                    this.fire("v1", this._v1 = value || [0, 0, 0]);
                },

                get: function () {
                    return this._v1;
                }
            },

            /**
             Second control point on this CubicBezierCurve.

             Fires a {{#crossLink "CubicBezierCurve/v2:event"}}{{/crossLink}} event on change.

             @property v2
             @default [0.0, 0.0, 0.0]
             @type Array(Number)
             */
            v2: {

                set: function (value) {

                    /**
                     * Fired whenever this CubicBezierCurve's
                     * {{#crossLink "CubicBezierCurve/v2:property"}}{{/crossLink}} property changes.
                     * @event v2
                     * @param value The property's new value
                     */
                    this.fire("v2", this._v2 = value || [0, 0, 0]);
                },

                get: function () {
                    return this._v2;
                }
            },

            /**
             End point on this CubicBezierCurve.

             Fires a {{#crossLink "CubicBezierCurve/v3:event"}}{{/crossLink}} event on change.

             @property v3
             @default [0.0, 0.0, 0.0]
             @type Array(Number)
             */
            v3: {

                set: function (value) {

                    /**
                     * Fired whenever this CubicBezierCurve's
                     * {{#crossLink "CubicBezierCurve/v3:property"}}{{/crossLink}} property changes.
                     * @event v3
                     * @param value The property's new value
                     */
                    this.fire("v3", this._v3 = value || [0, 0, 0]);
                },

                get: function () {
                    return this._v3;
                }
            },

            /**
             Current position of progress along this CubicBezierCurve.

             Automatically clamps to range [0..1].

             Fires a {{#crossLink "CubicBezierCurve/t:event"}}{{/crossLink}} event on change.

             @property t
             @default 0
             @type Number
             */
            t: {
                set: function (value) {

                    value = value || 0;

                    this._t = value < 0.0 ? 0.0 : (value > 1.0 ? 1.0 : value);

                    /**
                     * Fired whenever this CubicBezierCurve's
                     * {{#crossLink "CubicBezierCurve/t:property"}}{{/crossLink}} property changes.
                     * @event t
                     * @param value The property's new value
                     */
                    this.fire("t", this._t);
                },

                get: function () {
                    return this._t;
                }
            },

            /**
             Point on this CubicBezierCurve at position {{#crossLink "CubicBezierCurve/t:property"}}{{/crossLink}}.

             @property point
             @type {{Array of Number}}
             */
            point: {

                get: function () {
                    return this.getPoint(this._t);
                }
            }
        },

        /**
         * Returns point on this CubicBezierCurve at the given position.
         * @param {Number} t Position to get point at.
         * @returns {{Array of Number}}
         */
        getPoint: function (t) {

            var math = XEO.math;
            var vector = math.vec3();

            vector[0] = math.b3(t, this._v0[0], this._v1[0], this._v2[0], this._v3[0]);
            vector[1] = math.b3(t, this._v0[1], this._v1[1], this._v2[1], this._v3[1]);
            vector[2] = math.b3(t, this._v0[2], this._v1[2], this._v2[2], this._v3[2]);

            return vector;
        },

        _getJSON: function () {
            return {
                v0: this._v0,
                v1: this._v1,
                v2: this._v2,
                v3: this._v3,
                t: this._t
            };
        }
    });

})();
