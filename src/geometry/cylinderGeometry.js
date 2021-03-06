/**
 A **Cylinder** defines cylindrical geometry for attached {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.

 ## Example

 ````javascript

 ````

 @class Cylinder
 @module XEO
 @submodule geometry
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}} - creates this Cylinder in the default
 {{#crossLink "Scene"}}Scene{{/crossLink}} when omitted.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Scene"}}Scene{{/crossLink}},
 generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Cylinder.
 @param [cfg.primitive="triangles"] {String} The primitive type. Accepted values are 'points', 'lines', 'line-loop', 'line-strip', 'triangles', 'triangle-strip' and 'triangle-fan'.
 @param [cfg.radiusTop=1] {Number} Radius of top.
 @param [cfg.radiusBottom=1] {Number} Radius of bottom.
 @param [cfg.height=1] {Number} Height.
 @param [cfg.radialSegments=60] {Number} Number of segments around the Cylinder.
 @param [cfg.heightSegments=1] {Number} Number of vertical segments.
 @param [cfg.openEnded=false] {Boolean} Whether or not the Cylinder has solid caps on the ends.
 @param [cfg.lod=1] {Number} Level-of-detail, in range [0..1].
 @extends Geometry
 */
(function () {

    "use strict";

    XEO.CylinderGeometry = XEO.Geometry.extend({

        type: "XEO.CylinderGeometry",

        _init: function (cfg) {

            this._super(cfg);

            this.lod = cfg.lod;
            this.radiusTop = cfg.radiusTop;
            this.radiusBottom = cfg.radiusBottom;
            this.height = cfg.height;
            this.radialSegments = cfg.radialSegments;
            this.heightSegments = cfg.heightSegments;
            this.openEnded = cfg.openEnded;
        },

        _cylinderDirty: function () {
            if (!this.__dirty) {
                this.__dirty = true;
                var self = this;
                this.scene.once("tick4",
                    function () {
                        self._buildCylinder();
                        self.__dirty = false;
                    });
            }
        },

        _buildCylinder: function () {

            var radiusTop = this._radiusTop;
            var radiusBottom = this._radiusBottom;
            var height = this._height;
            var radialSegments = Math.floor(this._radialSegments * this._lod);
            var heightSegments = Math.floor(this._heightSegments * this._lod);

            if (radialSegments < 3) {
                radialSegments = 3;
            }

            if (heightSegments < 1) {
                heightSegments = 1;
            }

            var openEnded = this._openEnded;

            var heightHalf = height / 2;
            var heightLength = height / heightSegments;
            var radialAngle = (2.0 * Math.PI / radialSegments);
            var radialLength = 1.0 / radialSegments;
            var nextRadius = this._radiusBottom;
            var radiusChange = (radiusTop - radiusBottom) / heightSegments;

            var positions = [];
            var normals = [];
            var uvs = [];
            var indices = [];

            var h;
            var i;

            var x;
            var z;

            var currentRadius;
            var currentHeight;

            var center;
            var first;
            var second;

            var startIndex;
            var tu;
            var tv;

            // create vertices
            var normalY = (90.0 - (Math.atan(height / (radiusBottom - radiusTop))) * 180 / Math.PI) / 90.0;

            for (h = 0; h <= heightSegments; h++) {
                currentRadius = radiusTop - h * radiusChange;
                currentHeight = heightHalf - h * heightLength;

                for (i = 0; i <= radialSegments; i++) {
                    x = Math.sin(i * radialAngle);
                    z = Math.cos(i * radialAngle);

                    normals.push(currentRadius * x);
                    normals.push(normalY); //todo
                    normals.push(currentRadius * z);
                    uvs.push( (i * radialLength));
                    uvs.push(1-  h * 1 / heightSegments);
                    positions.push(currentRadius * x);
                    positions.push(currentHeight);
                    positions.push(currentRadius * z);
                }
            }

            // create faces
            for (h = 0; h < heightSegments; h++) {
                for (i = 0; i <= radialSegments; i++) {
                    first = h * (radialSegments + 1) + i;
                    second = first + radialSegments;
                    indices.push(first);
                    indices.push(second);
                    indices.push(second + 1);

                    indices.push(first);
                    indices.push(second + 1);
                    indices.push(first + 1);
                }
            }

            // create top cap
            if (!openEnded && radiusTop > 0) {
                startIndex = (positions.length / 3);

                // top center
                normals.push(0.0);
                normals.push(1.0);
                normals.push(0.0);
                uvs.push(0.5);
                uvs.push(0.5);
                positions.push(0);
                positions.push(heightHalf);
                positions.push(0);

                // top triangle fan
                for (i = 0; i <= radialSegments; i++) {
                    x = Math.sin(i * radialAngle);
                    z = Math.cos(i * radialAngle);
                    tu = (0.5 * Math.sin(i * radialAngle)) + 0.5;
                    tv = (0.5 * Math.cos(i * radialAngle)) + 0.5;

                    normals.push(radiusTop * x);
                    normals.push(1.0);
                    normals.push(radiusTop * z);
                    uvs.push(tu);
                    uvs.push(tv);
                    positions.push(radiusTop * x);
                    positions.push(heightHalf);
                    positions.push(radiusTop * z);
                }

                for (i = 0; i < radialSegments; i++) {
                    center = startIndex;
                    first = startIndex + 1 + i;
                    indices.push(first);
                    indices.push(first + 1);
                    indices.push(center);
                }
            }

            // create bottom cap
            if (!openEnded && radiusBottom > 0) {
                startIndex = (positions.length / 3);

                // top center
                normals.push(0.0);
                normals.push(-1.0);
                normals.push(0.0);
                uvs.push(0.5);
                uvs.push(0.5);
                positions.push(0);
                positions.push(0 - heightHalf);
                positions.push(0);

                // top triangle fan
                for (i = 0; i <= radialSegments; i++) {
                    x = Math.sin(i * radialAngle);
                    z = Math.cos(i * radialAngle);
                    tu = (0.5 * Math.sin(i * radialAngle)) + 0.5;
                    tv = (0.5 * Math.cos(i * radialAngle)) + 0.5;

                    normals.push(radiusBottom * x);
                    normals.push(-1.0);
                    normals.push(radiusBottom * z);
                    uvs.push(tu);
                    uvs.push(tv);
                    positions.push(radiusBottom * x);
                    positions.push(0 - heightHalf);
                    positions.push(radiusBottom * z);
                }

                for (i = 0; i < radialSegments; i++) {
                    center = startIndex;
                    first = startIndex + 1 + i;
                    indices.push(center);
                    indices.push(first + 1);
                    indices.push(first);
                }
            }

            this.positions = positions;
            this.normals = normals;
            this.uv = uvs;
            this.indices = indices;
        },

        _props: {

            /**
             * The Cylinder's level-of-detail factor.
             *
             * Fires a {{#crossLink "Cylinder/lod:event"}}{{/crossLink}} event on change.
             *
             * @property lod
             * @default 1
             * @type Number
             */
            lod: {

                set: function (value) {

                    value = value !== undefined ? value : 1;

                    if (this._lod === value) {
                        return;
                    }

                    if (value < 0 || value > 1) {
                        this.warn("clamping lod to [0..1]");
                        value = value < 0 ? 0 : 1;
                    }

                    this._lod = value;

                    /**
                     * Fired whenever this Cylinder's {{#crossLink "Cylinder/lod:property"}}{{/crossLink}} property changes.
                     * @event lod
                     * @type Number
                     * @param value The property's new value
                     */
                    this.fire("lod", this._lod);

                    this._cylinderDirty();
                },

                get: function () {
                    return this._lod;
                }
            },

            /**
             * The Cylinder's top radius.
             *
             * Fires a {{#crossLink "Cylinder/radiusTop:event"}}{{/crossLink}} event on change.
             *
             * @property radiusTop
             * @default 1
             * @type Number
             */
            radiusTop: {

                set: function (value) {

                    value = value !== undefined ? value : 1;

                    if (this._radiusTop === value) {
                        return;
                    }

                    if (value < 0) {
                        this.warn("negative radiusTop not allowed - will invert");
                        value = value * -1;
                    }

                    this._radiusTop = value;

                    /**
                     * Fired whenever this Cylinder's {{#crossLink "Cylinder/radiusTop:property"}}{{/crossLink}} property changes.
                     * @event radiusTop
                     * @type Number
                     * @param value The property's new value
                     */
                    this.fire("radiusTop", this._radiusTop);

                    this._cylinderDirty();
                },

                get: function () {
                    return this._radiusTop;
                }
            },

            /**
             * The Cylinder's bottom radius.
             *
             * Fires a {{#crossLink "Cylinder/radiusBottom:event"}}{{/crossLink}} event on change.
             *
             * @property radiusBottom
             * @default 1
             * @type Number
             */
            radiusBottom: {

                set: function (value) {

                    value = value !== undefined ? value : 1;

                    if (this._radiusBottom === value) {
                        return;
                    }

                    if (value < 0) {
                        this.warn("negative radiusBottom not allowed - will invert");
                        value = value * -1;
                    }

                    this._radiusBottom = value;

                    /**
                     * Fired whenever this Cylinder's {{#crossLink "Cylinder/radiusBottom:property"}}{{/crossLink}} property changes.
                     * @event radiusBottom
                     * @type Number
                     * @param value The property's new value
                     */
                    this.fire("radiusBottom", this._radiusBottom);

                    this._cylinderDirty();
                },

                get: function () {
                    return this._radiusBottom;
                }
            },

            /**
             * The Cylinder's height.
             *
             * Fires a {{#crossLink "Cylinder/height:event"}}{{/crossLink}} event on change.
             *
             * @property height
             * @default 1
             * @type Number
             */
            height: {

                set: function (value) {

                    value = value || 1;

                    if (this._height === value) {
                        return;
                    }

                    if (value < 0) {
                        this.warn("negative height not allowed - will invert");
                        value = value * -1;
                    }

                    this._height = value;

                    /**
                     * Fired whenever this Cylinder's {{#crossLink "Cylinder/height:property"}}{{/crossLink}} property changes.
                     * @event height
                     * @type Number
                     * @param value The property's new value
                     */
                    this.fire("height", this._height);

                    this._cylinderDirty();
                },

                get: function () {
                    return this._height;
                }
            },

            /**
             * The Cylinder's radial segments.
             *
             * Fires a {{#crossLink "Cylinder/radialSegments:event"}}{{/crossLink}} event on change.
             *
             * @property radialSegments
             * @default 60
             * @type Number
             */
            radialSegments: {

                set: function (value) {

                    value = value || 60;

                    if (this._radialSegments === value) {
                        return;
                    }

                    if (value < 0) {
                        this.warn("negative radialSegments not allowed - will invert");
                        value = value * -1;
                    }

                    this._radialSegments = value;

                    /**
                     * Fired whenever this Cylinder's {{#crossLink "Cylinder/radialSegments:property"}}{{/crossLink}} property changes.
                     * @event radialSegments
                     * @type Number
                     * @param value The property's new value
                     */
                    this.fire("radialSegments", this._radialSegments);

                    this._cylinderDirty();
                },

                get: function () {
                    return this._radialSegments;
                }
            },

            /**
             * The Cylinder's height segments.
             *
             * Fires a {{#crossLink "Cylinder/heightSegments:event"}}{{/crossLink}} event on change.
             *
             * @property heightSegments
             * @default 1
             * @type Number
             */
            heightSegments: {

                set: function (value) {

                    value = value || 1;

                    if (this._heightSegments === value) {
                        return;
                    }

                    if (value < 0) {
                        this.warn("negative heightSegments not allowed - will invert");
                        value = value * -1;
                    }

                    this._heightSegments = value;

                    /**
                     * Fired whenever this Cylinder's {{#crossLink "Cylinder/heightSegments:property"}}{{/crossLink}} property changes.
                     * @event heightSegments
                     * @type Number
                     * @param value The property's new value
                     */
                    this.fire("heightSegments", this._heightSegments);

                    this._cylinderDirty();
                },

                get: function () {
                    return this._heightSegments;
                }
            },

            /**
             * Indicates whether this Cylinder's is open-ended.
             *
             * Fires a {{#crossLink "Cylinder/openEnded:event"}}{{/crossLink}} event on change.
             *
             * @property openEnded
             * @default false
             * @type Boolean
             */
            openEnded: {

                set: function (value) {

                    value = value === undefined ? false : value;

                    if (this._openEnded === value) {
                        return;
                    }

                    this._openEnded = value;

                    /**
                     * Fired whenever this Cylinder's {{#crossLink "Cylinder/openEnded:property"}}{{/crossLink}} property changes.
                     * @event openEnded
                     * @type Boolean
                     * @param value The property's new value
                     */
                    this.fire("openEnded", this._openEnded);

                    this._cylinderDirty();
                },

                get: function () {
                    return this._openEnded;
                }
            }
        },


        _getJSON: function () {
            return {
                // Don't save lod
                radiusTop: this._radiusTop,
                radiusBottom: this._radiusBottom,
                height: this._height,
                radialSegments: this._radialSegments,
                heightSegments: this._heightSegments,
                openEnded: this._openEnded
            };
        }
    });

})();
