/**
 A **Geometry** defines the geometric shape of attached {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.

 ## Contents

 <ul>
 <li><a href="#overview">Overview</a></li>
 <li><a href="#defaultShape">Default box shape</a></li>
 <li><a href="#sceneDefault">Scene's default Geometry</a></li>
 <li><a href="#sharing">Sharing among GameObjects</a></li>
 <li><a href="#triangles">Defining a triangle mesh</a></li>
 <li><a href="#editing">Editing Geometry</a></li>
 <li><a href="#backfaces">Toggling backfaces on or off</li>
 <li><a href="#frontfaces">Setting frontface vertex winding</li>
 </ul>

 ## <a name="overview">Overview</a>

 <ul>
 <li>Like everything in xeoEngine, all properties on a Geometry are dynamically editable.</li>
 <li>A Geometry's {{#crossLink "Geometry/primitive:property"}}{{/crossLink}} type can be 'points', 'lines', 'line-loop', 'line-strip', 'triangles', 'triangle-strip' or 'triangle-fan'".</li>
 <li>Depending on the {{#crossLink "Geometry/primitive:property"}}{{/crossLink}} type, a Geometry can have {{#crossLink "Geometry/positions:property"}}vertex positions{{/crossLink}},
 {{#crossLink "Geometry/colors:property"}}vertex colors{{/crossLink}}, {{#crossLink "Geometry/uv:property"}}UV coordinates{{/crossLink}},
 {{#crossLink "Geometry/normals:property"}}normal vectors{{/crossLink}}, as well as {{#crossLink "Geometry/indices:property"}}{{/crossLink}},
 which specify how the vertices connect together to form the primitives.</li>
 <li>When no shape is specified (ie. no primitive type, vertex arrays and indices), a Geometry will default to a 2x2x2 box
 made of triangles, with UV coordinates, vertex colors and normals. This default is used for most of the examples in this documentation.</li>
 <li>A {{#crossLink "Scene"}}{{/crossLink}} provides such a box as its default {{#crossLink "Scene/geometry:property"}}{{/crossLink}},
 for {{#crossLink "GameObject"}}GameObjects{{/crossLink}} to fall back on, when they are not explicitly attached to a Geometry.</li>
 <li>See <a href="Shader.html#inputs">Shader Inputs</a> for the variables that Geometries create within xeoEngine's shaders.</li>
 </ul>

 <img src="../../../assets/images/Geometry.png"></img>

 ## <a name="defaultShape">Default box shape</a>

 If you create a Geometry with no specified shape, it will default to a 2x2x2 box defined as a triangle mesh.

 ```` javascript
 var geometry = new XEO.Geometry(scene); // 2x2x2 box

 var object1 = new XEO.GameObject(scene, {
    geometry: geometry
});
 ````

 ## <a name="sceneDefault">Scene's default Geometry</a>

 If you create a {{#crossLink "GameObject"}}GameObject{{/crossLink}} with no Geometry, it will inherit its {{#crossLink "Scene"}}Scene{{/crossLink}}'s
 default {{#crossLink "Scene/geometry:property"}}{{/crossLink}}, which is also a 2x2x2 box:

 ```` javascript
 var scene = new XEO.Scene();

 var object1 = new XEO.GameObject(scene);
 ````

 ## <a name="sharing">Sharing among GameObjects</a>

 xeoEngine components can be shared among multiple {{#crossLink "GameObject"}}GameObjects{{/crossLink}}. For components like
 Geometry and {{#crossLink "Texture"}}{{/crossLink}}, this can provide significant memory
 and performance savings. To render the example below, xeoEngine will issue two draw WebGL calls, one for
 each {{#crossLink "GameObject"}}{{/crossLink}}, but will only need to bind the Geometry's arrays once on WebGL.

 ```` javascript
 var scene = new XEO.Scene();

 var geometry = new XEO.Geometry(scene); // 2x2x2 box by default

 // Create two GameObjects which share our Geometry

 var object1 = new XEO.GameObject(scene, {
    geometry: geometry
});

 // Offset the second Object slightly on the World-space
 // X-axis using a Translate modelling transform

 var translate = new XEO.Translate(scene, {
    xyz: [5, 0, 0
});

 var object2 = new XEO.GameObject(scene, {
    geometry: geometry,
    transform: translate
});
 ````

 ## <a name="triangles">Defining a triangle mesh</a>

 Finally, we'll create a {{#crossLink "GameObject"}}GameObject{{/crossLink}} with a Geometry that we've **explicitly**
 configured as a 2x2x2 box:

 ```` javascript
 var scene = new XEO.Scene();

 // Create a 2x2x2 box centered at the World-space origin
 var geometry = new XEO.Geometry(scene, {

        // Supported primitives are 'points', 'lines', 'line-loop', 'line-strip', 'triangles',
        // 'triangle-strip' and 'triangle-fan'.primitive: "triangles",
        primitive: "triangles",

        // Vertex positions
        positions : [

            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
             1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ],

        // Vertex colors
        colors: [
            1.0,  1.0,  1.0,  1.0,    // Front face: white
            1.0,  0.0,  0.0,  1.0,    // Back face: red
            0.0,  1.0,  0.0,  1.0,    // Top face: green
            0.0,  0.0,  1.0,  1.0,    // Bottom face: blue
            1.0,  1.0,  0.0,  1.0,    // Right face: yellow
            1.0,  0.0,  1.0,  1.0     // Left face: purple
        ],

        // Vertex normals
        normals: [
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
        ],

        // UV coordinates
        uv: [
            1, 1, 0, 1, 0, 0, 1, 0,
            0, 1, 0, 0, 1, 0, 1, 1,
            1, 0, 1, 1, 0, 1, 0, 0,
            1, 1, 0, 1, 0, 0, 1, 0,
            0, 0, 1, 0, 1, 1, 0, 1,
            0, 0, 1, 0, 1, 1, 0, 1
        ],

        // Triangle indices
        indices: [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23    // left
        ]
});

 var object = new XEO.GameObject(scene, {
    geometry: geometry
});
 ````
 ## <a name="editing">Editing Geometry</a>

 Recall that everything in xeoEngine is dynamically editable, including Geometry. Let's remove the front and back faces
 from our triangle mesh Geometry by updating its **indices** array:

 ````javascript
 geometry2.indices = [
 8,  9,  10,     8,  10, 11,   // top
 12, 13, 14,     12, 14, 15,   // bottom
 16, 17, 18,     16, 18, 19,   // right
 20, 21, 22,     20, 22, 23    // left
 ];
 ````

 Now let's make it wireframe by changing its primitive type from **faces** to **lines**:

 ````javascript
 geometry2.primitive = "lines";
 ````

 ## <a name="backfaces">Toggling backfaces on or off</a>

 Now we'll attach a {{#crossLink "Modes"}}{{/crossLink}} to that last {{#crossLink "GameObject"}}{{/crossLink}}, so that
 we can show or hide its {{#crossLink "Geometry"}}Geometry's{{/crossLink}} backfaces:

 ```` javascript
 var modes = new XEO.Modes(scene);

 object.modes = modes;

 // Hide backfaces

 modes.backfaces = false;

 ````

 ## <a name="frontfaces">Setting frontface vertex winding</a>

 The <a href="https://www.opengl.org/wiki/Face_Culling" target="other">vertex winding order</a> of each face determines
 whether it's a frontface or a backface.

 By default, xeoEngine considers faces to be frontfaces if they have a counter-clockwise
 winding order, but we can change that by setting the {{#crossLink "Modes"}}{{/crossLink}}
 {{#crossLink "Modes/frontface:property"}}{{/crossLink}} property, like so:

 ```` javascript
 // Set the winding order for frontfaces to clockwise
 // Options are "ccw" for counter-clockwise or "cw" for clockwise

 object.frontface = "cw";
 ````


 @class Geometry
 @module XEO
 @submodule geometry
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}} - creates this Geometry in the default
 {{#crossLink "Scene"}}Scene{{/crossLink}} when omitted.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Scene"}}Scene{{/crossLink}},
 generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Geometry.
 @param [cfg.primitive="triangles"] {String} The primitive type. Accepted values are 'points', 'lines', 'line-loop', 'line-strip', 'triangles', 'triangle-strip' and 'triangle-fan'.
 @param [cfg.positions] {Array of Number} Positions array.
 @param [cfg.normals] {Array of Number} Normals array.
 @param [cfg.uv] {Array of Number} UVs array.
 @param [cfg.colors] {Array of Number} Vertex colors.
 @param [cfg.tangents] {Array of Number} Vertex tangents.
 @param [cfg.indices] {Array of Number} Indices array.
 @param [cfg.autoNormals] {Boolean} Set true to automatically generate normal vectors from positions and indices.
 @extends Component
 */
(function () {

    "use strict";

    XEO.Geometry = XEO.Component.extend({

        type: "XEO.Geometry",

        _init: function (cfg) {

            var self = this;

            this._state = new XEO.renderer.Geometry({

                primitive: null, // WebGL enum
                primitiveName: null, // String

                // VBOs 

                positions: null,
                colors: null,
                normals: null,
                uv: null,
                tangents: null,
                indices: null,

                // Getters for VBOs that are only created on-demand

                // Tangents for normal mapping

                getTangents: function () {
                    if (self._tangentsDirty) {
                        self._buildTangents();
                    }
                    return self._tangents;
                },

                // Arrays modified to support primitive-picking

                getPickPositions: function () {
                    if (self._pickVBOsDirty) {
                        self._buildPickVBOs();
                    }
                    return self._pickPositions;
                },

                getPickColors: function () {
                    if (self._pickVBOsDirty) {
                        self._buildPickVBOs();
                    }
                    return self._pickColors;
                },

                getPickIndices: function () {
                    if (self._pickVBOsDirty) {
                        self._buildPickVBOs();
                    }
                    return self._pickIndices;
                }
            });

            this._hashDirty = true;

            // Typed arrays

            this._positionsData = null;
            this._colorsData = null;
            this._normalsData = null;
            this._uvData = null;
            this._tangentsData = null;
            this._indicesData = null;

            // Lazy-generated VBOs

            this._tangents = null;
            this._pickPositions = null;
            this._pickColors = null;
            this._pickIndices = null;

            // Flags for work pending

            this._dirty = false;
            this._positionsDirty = true;
            this._colorsDirty = true;
            this._normalsDirty = true;
            this._uvDirty = true;
            this._tangentsDirty = true;
            this._indicesDirty = true;
            this._pickVBOsDirty = true;

            // Local-space Boundary3D

            this._boundary = null;
            this._boundaryDirty = true;


            var defaultGeometry = (!cfg.positions && !cfg.normals && !cfg.uv && !cfg.indices);

            if (defaultGeometry) {

                // Call property setters

                this.primitive = cfg.primitive;

                this.positions = [
                    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, // Front face
                    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, // Back face
                    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, // Top face
                    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // Bottom face
                    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, // Right face
                    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0 // Left face
                ];

                this.normals = [
                    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
                    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
                ];

                this.uv = [
                    1, 1, 0, 1, 0, 0, 1, 0,
                    0, 1, 0, 0, 1, 0, 1, 1,
                    1, 0, 1, 1, 0, 1, 0, 0,
                    1, 1, 0, 1, 0, 0, 1, 0,
                    0, 0, 1, 0, 1, 1, 0, 1,
                    0, 0, 1, 0, 1, 1, 0, 1
                ];

                // Tangents are lazy-computed from normals and UVs
                // for Normal mapping once we know we have texture

                this.tangents = null;

                this.indices = [
                    0, 1, 2, 0, 2, 3,    // front
                    4, 5, 6, 4, 6, 7,    // back
                    8, 9, 10, 8, 10, 11,   // top
                    12, 13, 14, 12, 14, 15,   // bottom
                    16, 17, 18, 16, 18, 19,   // right
                    20, 21, 22, 20, 22, 23    // left
                ];

            } else {

                var defaultLineStripGeometry = ((!cfg.primitive || cfg.primitive === "line-strip") && cfg.positions && !cfg.indices);

                if (defaultLineStripGeometry) {

                    // Line strip when only positions are given and no primitive

                    var indices = [];
                    for (var i = 0, len = cfg.positions.length / 3; i < len; i++) {
                        indices.push(i);
                    }

                    this.primitive = "line-strip";
                    this.positions = cfg.positions;
                    this.indices = indices;

                } else {

                    // Custom geometry

                    this.primitive = cfg.primitive;
                    this.positions = cfg.positions;
                    this.colors = cfg.colors;
                    this.normals = cfg.normals;
                    this.uv = cfg.uv;
                    this.tangents = cfg.tangents;
                    this.indices = cfg.indices;
                }
            }

            this.autoNormals = cfg.autoNormals;

            this.usage = cfg.usage;

            var self = this;

            this._webglContextRestored = this.scene.canvas.on(
                "webglContextRestored",
                function () {
                    self._scheduleBuild();
                });

            this.scene.stats.memory.meshes++;
        },

        _scheduleBuild: function () {

            if (!this._dirty) {

                this._dirty = true;
                var self = this;

                this.scene.once("tick",
                    function () {

                        // Build VBOs for renderer; no other components in the scene
                        // will be waiting them, so OK to schedule that for next tick.

                        self._build();
                    });
            }
        },

        _build: function () {

            var gl = this.scene.canvas.gl;

            switch (this._state.primitiveName) {

                case "points":
                    this._state.primitive = gl.POINTS;
                    break;

                case "lines":
                    this._state.primitive = gl.LINES;
                    break;

                case "line-loop":
                    this._state.primitive = gl.LINE_LOOP;
                    break;

                case "line-strip":
                    this._state.primitive = gl.LINE_STRIP;
                    break;

                case "triangles":
                    this._state.primitive = gl.TRIANGLES;
                    break;

                case "triangle-strip":
                    this._state.primitive = gl.TRIANGLE_STRIP;
                    break;

                case "triangle-fan":
                    this._state.primitive = gl.TRIANGLE_FAN;
                    break;

                default:
                    this._state.primitive = gl.TRIANGLES;
            }

            var usage = gl.STATIC_DRAW;

            var memoryStats = this.scene.stats.memory;

            if (this._positionsDirty) {
                if (this._state.positions) {
                    memoryStats.positions -= this._state.positions.numItems;
                    this._state.positions.destroy();
                }
                this._state.positions = this._positionsData ? new XEO.renderer.webgl.ArrayBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this._positionsData), this._positionsData.length, 3, usage) : null;
                memoryStats.positions += this._state.positions.numItems;
                this._positionsDirty = false;

                // Need to rebuild pick mesh now
                this._pickVBOsDirty = true;
            }

            if (this._colorsDirty) {

                if (this._state.colors) {
                    memoryStats.colors -= this._state.colors.numItems;
                    this._state.colors.destroy();
                }
                this._state.colors = this._colorsData ? new XEO.renderer.webgl.ArrayBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this._colorsData), this._colorsData.length, 4, usage) : null;
                if (this._state.colors) {
                    memoryStats.colors += this._state.colors.numItems;
                }
                this._colorsDirty = false;
            }

            if (this._normalsDirty) {
                if (this._state.normals) {
                    memoryStats.normals -= this._state.normals.numItems;
                    this._state.normals.destroy();
                }

                // Automatic normal generation

                if (this._autoNormals && this._positionsData && this._indicesData) {
                    this._normalsData = XEO.math.buildNormals(this._positionsData, this._indicesData);
                }

                this._state.normals = this._normalsData ? new XEO.renderer.webgl.ArrayBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this._normalsData), this._normalsData.length, 3, usage) : null;
                if (this._state.normals) {
                    memoryStats.normals += this._state.normals.numItems;
                }
                this._normalsDirty = false;

                // Need to rebuild tangents
                // next time the renderer gets them from the state

                this._tangentsDirty = true;
            }

            if (this._uvDirty) {
                if (this._state.uv) {
                    memoryStats.uvs -= this._state.uv.numItems;
                    this._state.uv.destroy();
                }
                this._state.uv = this._uvData ? new XEO.renderer.webgl.ArrayBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this._uvData), this._uvData.length, 2, usage) : null;
                if (this._state.uv) {
                    memoryStats.uvs += this._state.uv.numItems;
                }
                this._uvDirty = false;

                // Need to rebuild tangents
                // next time the renderer gets them from the state

                this._tangentsDirty = true;
            }

            if (this._indicesDirty) {
                if (this._state.indices) {
                    memoryStats.indices -= this._state.indices.numItems;
                    this._state.indices.destroy();
                }
                this._state.indices = this._indicesData ? new XEO.renderer.webgl.ArrayBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indicesData), this._indicesData.length, 1, usage) : null;
                if (this._state.indices) {
                    memoryStats.indices += this._state.indices.numItems;
                }
                this._indicesDirty = false;

                // Need to rebuild pick mesh next time the
                // renderer gets it from the state

                this._pickVBOsDirty = true;
            }

            this._dirty = false;
        },

        _buildTangents: function () {

            if (!this._tangentsDirty) {
                return;
            }

            var memoryStats = this.scene.stats.memory;

            if (this._tangents) {
                memoryStats.tangents -= this._tangents.numItems;
                this._tangents.destroy();
            }

            var gl = this.scene.canvas.gl;

            var usage = gl.STATIC_DRAW;

            this._tangents = this._tangentsData ? new XEO.renderer.webgl.ArrayBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this._tangentsData), this._tangentsData.length, 4, usage) : null;

            if (this._tangents) {
                memoryStats.tangents += this._tangents.numItems;
            }

            this._tangentsDirty = false;
        },


        _buildPickVBOs: function () {

            if (!this._pickVBOsDirty) {
                return;
            }

            this._destroyPickVBOs();

            if (this._positionsData && this._indicesData) {

                var gl = this.scene.canvas.gl;

                var usage = gl.STATIC_DRAW;

                var arrays = XEO.math.getPickPrimitives(this._positionsData, this._indicesData);

                var pickPositions = arrays.pickPositions;
                var pickColors = arrays.pickColors;
                var pickIndices = arrays.pickIndices;

                this._pickPositions = new XEO.renderer.webgl.ArrayBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(pickPositions), pickPositions.length, 3, usage);
                this._pickColors = new XEO.renderer.webgl.ArrayBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(pickColors), pickColors.length, 4, usage);
                this._pickIndices = new XEO.renderer.webgl.ArrayBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pickIndices), pickIndices.length, 1, usage);

                var memoryStats = this.scene.stats.memory;

                memoryStats.positions += this._pickPositions.numItems;
                memoryStats.colors += this._pickColors.numItems;
                memoryStats.indices += this._pickIndices.numItems;
            }

            this._pickVBOsDirty = false;
        },


        _destroyPickVBOs: function () {

            var memoryStats = this.scene.stats.memory;

            if (this._pickPositions) {
                this._pickPositions.destroy();
                memoryStats.positions -= this._pickPositions.numItems;
                this._pickPositions = null;
            }

            if (this._pickColors) {
                this._pickColors.destroy();
                memoryStats.colors -= this._pickColors.numItems;
                this._pickColors = null;
            }

            if (this._pickIndices) {
                this._pickIndices.destroy();
                memoryStats.indices -= this._pickIndices.numItems;
                this._pickIndices = null;
            }

            this._pickVBOsDirty = true;
        },


        _props: {

            /**
             * The Geometry's usage type.
             *
             * Valid types are: 'static', 'lines', 'line-loop', 'line-strip', 'triangles', 'triangle-strip' and 'triangle-fan'.
             *
             * Fires a {{#crossLink "Geometry/usage:event"}}{{/crossLink}} event on change.
             *
             * @property usage
             * @default "triangles"
             * @type String
             */
            usage: {

                set: function (value) {

                    value = value || "static";

                    if (value !== "static" && value !== "dynamic" && value !== "stream") {

                        this.error("Unsupported value for 'usage': '" + value +
                            "' - supported values are 'static', 'dynamic' and 'stream'.");

                        value = "static";
                    }

                    this._state.usageName = value;

                    this._scheduleBuild();

                    this.fire("dirty", true);

                    /**
                     * Fired whenever this Geometry's {{#crossLink "Geometry/usage:property"}}{{/crossLink}} property changes.
                     * @event usage
                     * @type String
                     * @param value The property's new value
                     */
                    this.fire("usage", this._state.usageName);
                },

                get: function () {
                    return this._state.usageName;
                }
            },

            /**
             * The Geometry's primitive type.
             *
             * Valid types are: 'points', 'lines', 'line-loop', 'line-strip', 'triangles', 'triangle-strip' and 'triangle-fan'.
             *
             * Fires a {{#crossLink "Geometry/primitive:event"}}{{/crossLink}} event on change.
             *
             * @property primitive
             * @default "triangles"
             * @type String
             */
            primitive: {

                set: function (value) {

                    value = value || "triangles";

                    if (value !== "points" &&
                        value !== "lines" &&
                        value !== "line-loop" &&
                        value !== "line-strip" &&
                        value !== "triangles" &&
                        value !== "triangle-strip" &&
                        value !== "triangle-fan") {

                        this.error("Unsupported value for 'primitive': '" + value +
                            "' - supported values are 'points', 'lines', 'line-loop', 'line-strip', 'triangles', " +
                            "'triangle-strip' and 'triangle-fan'. Defaulting to 'triangles'.");

                        value = "triangles";
                    }

                    this._state.primitiveName = value;

                    this._scheduleBuild();

                    this._hashDirty = true;

                    this.fire("dirty", true);

                    /**
                     * Fired whenever this Geometry's {{#crossLink "Geometry/primitive:property"}}{{/crossLink}} property changes.
                     * @event primitive
                     * @type String
                     * @param value The property's new value
                     */
                    this.fire("primitive", this._state.primitiveName);
                },

                get: function () {
                    return this._state.primitiveName;
                }
            },

            /**
             * The Geometry's positions array.
             *
             * This property is a one-dimensional array - use  {{#crossLink "XEO.math/flatten:method"}}{{/crossLink}} to
             * convert two-dimensional arrays for assignment to this property.
             *
             * Fires a {{#crossLink "Geometry/positions:event"}}{{/crossLink}} event on change.
             *
             * @property positions
             * @default null
             * @type {Array of Number}
             */
            positions: {

                set: function (value) {

                    // Only recompile when adding or removing this property, not when modifying
                    var dirty = (!this._positionsData !== !value);

                    this._positionsData = value;
                    this._positionsDirty = true;

                    this._scheduleBuild();

                    this._setBoundaryDirty();

                    if (dirty) {
                        this._hashDirty = true;
                        this.fire("dirty", true);
                    }

                    /**
                     * Fired whenever this Geometry's {{#crossLink "Geometry/positions:property"}}{{/crossLink}} property changes.
                     * @event positions
                     * @param value The property's new value
                     */
                    this.fire("positions", this._positionsData);

                    /**
                     * Fired whenever this Geometry's {{#crossLink "Geometry/boundary:property"}}{{/crossLink}} property changes.
                     *
                     * Note that this event does not carry the value of the property. In order to avoid needlessly
                     * calculating unused values for this property, it will be lazy-calculated next time it's referenced
                     * on this Geometry.
                     *
                     * @event positions
                     * @param value The property's new value
                     */
                    this.fire("boundary", true);

                    this._renderer.imageDirty = true;
                },

                get: function () {
                    return this._positionsData;
                }
            },

            /**
             * The Geometry's normal vectors array.
             *
             * Fires a {{#crossLink "Geometry/normals:event"}}{{/crossLink}} event on change.
             *
             * @property normals
             * @default null
             * @type {Array of Number}
             */
            normals: {

                set: function (value) {

                    // Only recompile when adding or removing this property, not when modifying
                    var dirty = (!this._normalsData !== !value);

                    this._normalsData = value;
                    this._normalsDirty = true;

                    this._scheduleBuild();

                    if (dirty) {
                        this._hashDirty = true;
                        this.fire("dirty", true);
                    }

                    /**
                     * Fired whenever this Geometry's {{#crossLink "Geometry/ normals:property"}}{{/crossLink}} property changes.
                     * @event  normals
                     * @param value The property's new value
                     */
                    this.fire(" normals", this._normalsData);

                    this._renderer.imageDirty = true;
                },

                get: function () {
                    return this._normalsData;
                }
            },

            /**
             * The Geometry's UV coordinate array.
             *
             * Fires a {{#crossLink "Geometry/uv:event"}}{{/crossLink}} event on change.
             *
             * @property uv
             * @default null
             * @type {Array of Number}
             */
            uv: {

                set: function (value) {

                    // Only recompile when adding or removing this property, not when modifying
                    var dirty = (!this._uvData !== !value);

                    this._uvData = value;
                    this._uvDirty = true;

                    this._scheduleBuild();

                    if (dirty) {
                        this._hashDirty = true;
                        this.fire("dirty", true);
                    }

                    /**
                     * Fired whenever this Geometry's {{#crossLink "Geometry/uv:property"}}{{/crossLink}} property changes.
                     * @event uv
                     * @param value The property's new value
                     */
                    this.fire("uv", this._uvData);

                    this._renderer.imageDirty = true;
                },

                get: function () {
                    return this._uvData;
                }
            },

            /**
             * The Geometry's vertex colors array.
             *
             * Fires a {{#crossLink "Geometry/colors:event"}}{{/crossLink}} event on change.
             *
             * @property colors
             * @default null
             * @type {Array of Number}
             */
            colors: {

                set: function (value) {

                    // Only recompile when adding or removing this property, not when modifying
                    var dirty = (!this._colorsData != !value);

                    this._colorsData = value;
                    this._colorsDirty = true;

                    this._scheduleBuild();

                    if (dirty) {
                        this._hashDirty = true;
                        this.fire("dirty", true);
                    }

                    /**
                     * Fired whenever this Geometry's {{#crossLink "Geometry/colors:property"}}{{/crossLink}} property changes.
                     * @event colors
                     * @param value The property's new value
                     */
                    this.fire("colors", this._colorsData);

                    this._renderer.imageDirty = true;
                },

                get: function () {
                    return this._colorsData;
                }
            },

            /**
             * The Geometry's indices array.
             *
             * Fires a {{#crossLink "Geometry/indices:event"}}{{/crossLink}} event on change.
             *
             * @property indices
             * @default null
             * @type {Array of Number}
             */
            indices: {

                set: function (value) {

                    // Only recompile when adding or removing this property, not when modifying
                    var dirty = (!this._indicesData && !value);

                    this._indicesData = value;
                    this._indicesDirty = true;

                    this._scheduleBuild();

                    if (dirty) {
                        this._hashDirty = true;
                        this.fire("dirty", true);
                    }

                    /**
                     * Fired whenever this Geometry's {{#crossLink "Geometry/indices:property"}}{{/crossLink}} property changes.
                     * @event indices
                     * @param value The property's new value
                     */
                    this.fire("indices", this._indicesData);

                    this._renderer.imageDirty = true;
                },

                get: function () {
                    return this._indicesData;
                }
            },

            /**
             * Local-space 3D boundary.
             *
             * The a {{#crossLink "Boundary3D"}}{{/crossLink}} is lazy-instantiated the first time that this
             * property is referenced. If {{#crossLink "Component/destroy:method"}}{{/crossLink}} is then called on it,
             * then this property will be assigned to a fresh {{#crossLink "Boundary3D"}}{{/crossLink}} instance next
             * time it's referenced.
             *
             * @property boundary
             * @type Boundary3D
             * @final
             */
            boundary: {

                get: function () {

                    if (!this._boundary) {

                        var self = this;

                        this._boundary = new XEO.Boundary3D(this.scene, {

                            // Inject callbacks through which this Geometry
                            // can manage caching for the boundary

                            getDirty: function () {
                                if (self._boundaryDirty) {
                                    self._boundaryDirty = false;
                                    return true;
                                }
                                return false;
                            },

                            getPositions: function () {
                                return self._positionsData;
                            }
                        });

                        this._boundary.on("destroyed",
                            function () {
                                self._boundary = null;
                            });

                        this._setBoundaryDirty();
                    }

                    return this._boundary;
                }
            },

            /**
             * Set true to make this Geometry automatically generate {{#crossLink "Geometry/normals:property"}}{{/crossLink}} from
             * {{#crossLink "Geometry/positions:property"}}{{/crossLink}} and {{#crossLink "Geometry/indices:property"}}{{/crossLink}}.
             *
             * This Geomatry will auto-generate its {{#crossLink "Geometry/normals:property"}}{{/crossLink}} on the
             * next {{#crossLink "Scene"}}{{/crossLink}} {{#crossLink "Scene/tick:event"}}{{/crossLink}} event.
             *
             * Fires a {{#crossLink "Geometry/autoNormals:event"}}{{/crossLink}} event on change.
             *
             * @property autoNormals
             * @default  false
             * @type Boolean
             */
            autoNormals: {

                set: function (value) {

                    value = !!value;

                    if (this._autoNormals === value) {
                        return;
                    }

                    this._autoNormals = value;

                    this._normalsDirty = true;

                    /**
                     * Fired whenever this Geometry's {{#crossLink "Geometry/autoNormals:property"}}{{/crossLink}} property changes.
                     * @event autoNormals
                     * @type Boolean
                     * @param value The property's new value
                     */
                    this.fire("autoNormals", this._autoNormals);

                    this._scheduleBuild();
                },

                get: function () {
                    return this._autoNormals;
                }
            }
            //,
            //
            ///**
            // * Set true to make this Geometry automatically generate {{#crossLink "Geometry/tangents:property"}}{{/crossLink}} from
            // * {{#crossLink "Geometry/uv:property"}}{{/crossLink}} and {{#crossLink "Geometry/normals:property"}}{{/crossLink}}.
            // *
            // * This Geomatry will auto-generate its {{#crossLink "Geometry/tangents:property"}}{{/crossLink}} on the
            // * next {{#crossLink "Scene"}}{{/crossLink}} {{#crossLink "Scene/tick:event"}}{{/crossLink}} event.
            // *
            // * Fires a {{#crossLink "Geometry/autoTangents:event"}}{{/crossLink}} event on change.
            // *
            // * @property autoTangents
            // * @default  false
            // * @type Boolean
            // */
            //autoTangents: {
            //
            //    set: function (value) {
            //
            //        value = !!value;
            //
            //        if (this._autoTangents === value) {
            //            return;
            //        }
            //
            //        this._autoTangents = value;
            //
            //        /**
            //         * Fired whenever this Geometry's {{#crossLink "Geometry/autoTangents:property"}}{{/crossLink}} property changes.
            //         * @event autoTangents
            //         * @type Boolean
            //         * @param value The property's new value
            //         */
            //        this.fire("autoTangents", this._primitive);
            //
            //        this._scheduleBuild();
            //    },
            //
            //    get: function () {
            //        return this._autoTangents;
            //    }
            //}

        },

        _setBoundaryDirty: function () {

            if (this._boundaryDirty) {
                return;
            }

            this._boundaryDirty = true;

            if (this._boundary) {
                this._boundary.fire("updated", true);
            }
        },

        _compile: function () {

            if (this._dirty) {
                this._build();
            }

            if (this._hashDirty) {
                this._makeHash();
                this._hashDirty = false;
            }

            this._renderer.geometry = this._state;
        },

        _makeHash: function () {

            var state = this._state;

            var hash = ["/g"];

            hash.push("/" + state.primitive + ";");

            if (state.positions) {
                hash.push("0");
            }

            if (state.colors) {
                hash.push("1");
            }

            if (state.normals) {
                hash.push("2");
            }

            if (state.uv) {
                hash.push("3");
            }

            // TODO: Tangents

            hash.push(";");

            state.hash = hash.join("");
        },

        _getJSON: function () {

            return {
                primitive: this._state.primitiveName,
                positions: this._positionsData,
                normals: this._normalsData,
                uv: this._uvData,
                colors: this._colorsData,
                indices: this._indicesData
            };
        },

        _destroy: function () {

            this.scene.canvas.off(this._webglContextRestored);

            // Destroy VBOs

            if (this._state.positions) {
                this._state.positions.destroy();
            }

            if (this._state.colors) {
                this._state.colors.destroy();
            }

            if (this._state.normals) {
                this._state.normals.destroy();
            }

            if (this._state.uv) {
                this._state.uv.destroy();
            }

            if (this._state.indices) {
                this._state.indices.destroy();
            }

            // Destroy lazy-generated VBOs

            if (this._tangentsData) {
                this._tangentsData.destroy();
            }

            if (this._pickPositions) {
                this._pickPositions.destroy();
            }

            if (this._pickColors) {
                this._pickColors.destroy();
            }

            if (this._pickIndices) {
                this._pickIndices.destroy();
            }

            // Destroy boundary

            if (this._boundary) {
                this._boundary.destroy();
            }

            // Destroy state

            this._state.destroy();

            // Decrement geometry statistic

            this.scene.stats.memory.meshes--;
        }
    });
})();
