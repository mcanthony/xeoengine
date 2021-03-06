/**
 A **Scene** models a 3D scene as a fully-editable and serializable <a href="http://gameprogrammingpatterns.com/component.html" target="_other">component-object</a> graph.

 ## Contents

 <Ul>
 <li><a href="#sceneStructure">Scene Structure</a></li>
 <li><a href="#sceneCanvas">The Scene Canvas</a></li>
 <li><a href="#findingByID">Finding Scenes and Components by ID</a></li>
 <li><a href="#defaults">The Default Scene</a></li>
 <li><a href="#savingAndLoading">Saving and Loading Scenes</a></li>
 </ul>

 ## <a name="sceneStructure">Scene Structure</a>

 A Scene contains a soup of instances of various {{#crossLink "Component"}}Component{{/crossLink}} subtypes, such as
 {{#crossLink "GameObject"}}GameObject{{/crossLink}}, {{#crossLink "Camera"}}Camera{{/crossLink}}, {{#crossLink "Material"}}Material{{/crossLink}},
 {{#crossLink "Lights"}}Lights{{/crossLink}} etc.  Each {{#crossLink "GameObject"}}GameObject{{/crossLink}} has a link to one of each of the other types,
 and the same component instances can be shared among many {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.

 *** Under the hood:*** Within xeoEngine, each {{#crossLink "GameObject"}}GameObject{{/crossLink}} represents a draw call,
 while its components define all the WebGL state that will be bound for that call. To render a Scene, xeoEngine traverses
 the graph to bind the states and make the draw calls, while using many optimizations for efficiency (eg. draw list caching and GL state sorting).

 <img src="../../../assets/images/Scene.png"></img>

 #### Default Components

 A Scene provides its own default *flyweight* instance of each component type
 (except for {{#crossLink "GameObject"}}GameObject{{/crossLink}}). Each {{#crossLink "GameObject"}}GameObject{{/crossLink}} you create
 will implicitly link to a default instance for each type of component that you don't explicitly link it to. For example, when you create a {{#crossLink "GameObject"}}GameObject{{/crossLink}} without
 a {{#crossLink "Lights"}}Lights{{/crossLink}}, the {{#crossLink "GameObject"}}GameObject{{/crossLink}} will link to the
 {{#crossLink "Scene"}}Scene{{/crossLink}}'s default {{#crossLink "Scene/lights:property"}}{{/crossLink}}. This mechanism
 provides ***training wheels*** to help you learn the API, and also helps keep examples simple, where many of the examples in this
 documentation are implicitly using those defaults when they are not central to discussion.

 At the bottom of the diagram above, the blue {{#crossLink "Material"}}Material{{/crossLink}},
 {{#crossLink "Geometry"}}Geometry{{/crossLink}} and {{#crossLink "Camera"}}Camera{{/crossLink}} components
 represent some of the defaults provided by our Scene. For brevity, the diagram only shows those three
 types of component (there are actually around two dozen).

 Note that we did not link the second {{#crossLink "GameObject"}}GameObject{{/crossLink}} to a
 {{#crossLink "Material"}}Material{{/crossLink}}, causing it to be implicitly linked to our Scene's
 default {{#crossLink "Material"}}Material{{/crossLink}}. That {{#crossLink "Material"}}Material{{/crossLink}}
 is the only default our {{#crossLink "GameObject"}}GameObjects{{/crossLink}} are falling back on in this example, with other
 default component types, such as the {{#crossLink "Geometry"}}Geometry{{/crossLink}} and the {{#crossLink "Camera"}}Camera{{/crossLink}},
 hanging around dormant until a {{#crossLink "GameObject"}}GameObject{{/crossLink}} is linked to them.

 Note also how the same {{#crossLink "Camera"}}Camera{{/crossLink}} is linked to both of our
 {{#crossLink "GameObject"}}GameObjects{{/crossLink}}. Whenever we update that
 {{#crossLink "Camera"}}Camera{{/crossLink}}, it's going to affect both of those
 {{#crossLink "GameObject"}}GameObjects{{/crossLink}} in one shot. Think of the defaults as the Scene's ***global*** component
 instances, which you may optionally override on a per-{{#crossLink "GameObject"}}GameObject{{/crossLink}} basis with your own
 component instances. In many Scenes, for example, you might not even bother to create your own {{#crossLink "Camera"}}Camera{{/crossLink}} and just
 let all your {{#crossLink "GameObject"}}GameObjects{{/crossLink}} fall back on the default one.

 ## Example

 Here's the JavaScript for the diagram above. As mentioned earlier, note that we only provide components for our {{#crossLink "GameObject"}}GameObjects{{/crossLink}} when we need to
 override the default components that the Scene would have provided them, and that the same component instances may be shared among multiple Objects.

 ```` javascript
 var scene = new XEO.Scene({
       id: "myScene"   // ID is optional on all components
  });

 var material = new XEO.PhongMaterial(myScene, {
       id: "myMaterial",         // We'll use this ID to show how to find components by ID
       diffuse: [ 0.6, 0.6, 0.7 ],
       specular: [ 1.0, 1.0, 1.0 ]
   });

 var geometry = new XEO.Geometry(myScene, {
       primitive: "triangles",
       positions: [...],
       normals: [...],
       uvs: [...],
       indices: [...]
  });

 var camera = new XEO.Camera(myScene);

 var object1 = new XEO.GameObject(myScene, {
       material: myMaterial,
       geometry: myGeometry,
       camera: myCamera
  });

 // Second object uses Scene's default Material
 var object3 = new XEO.GameObject(myScene, {
       geometry: myGeometry,
       camera: myCamera
  });
 ````

 ## <a name="sceneCanvas">The Scene Canvas</a>

 See the {{#crossLink "Canvas"}}{{/crossLink}} component.

 ## <a name="findingByID">Finding Scenes and Components by ID</a>

 We can have as many Scenes as we want, and can find them by ID on the {{#crossLink "XEO"}}XEO{{/crossLink}} object's {{#crossLink "XEO/scenes:property"}}scenes{{/crossLink}} map:

 ````javascript
 var theScene = XEO.scenes["myScene"];
 ````

 Likewise we can find a Scene's components within the Scene itself, such as the {{#crossLink "Material"}}Material{{/crossLink}} we
 created earlier:

 ````javascript
 var theMaterial = myScene.components["myMaterial"];
 ````

 ## <a name="defaults">The Default Scene</a>

 When you create components without specifying a Scene for them, xeoEngine will put them in its default Scene.

 For example:

 ```` javascript
 var material2 = new XEO.PhongMaterial({
    diffuse: { r: 0.6, g: 0.6, b: 0.7 },
    specular: { 1.0, 1.0, 1.0 }
});

 var geometry2 = new XEO.Geometry({
     primitive: "triangles",
     positions: [...],
     normals: [...],
     uvs: [...],
     indices: [...]
});

 var camera = new XEO.Camera();

 var object1 = new XEO.GameObject({
     material: material2,
     geometry: geometry2,
     camera: camera2
});
 ````

 You can then obtain the default Scene from the {{#crossLink "XEO"}}XEO{{/crossLink}} object's
 {{#crossLink "XEO/scene:property"}}scene{{/crossLink}} property:

 ````javascript
 var theScene = XEO.scene;
 ````

 or from one of the components we just created:
 ````javascript
 var theScene = material2.scene;
 ````

 ***Note:*** xeoEngine creates the default Scene as soon as you either
 create your first Sceneless {{#crossLink "GameObject"}}GameObject{{/crossLink}} or reference the
 {{#crossLink "XEO"}}XEO{{/crossLink}} object's {{#crossLink "XEO/scene:property"}}scene{{/crossLink}} property. Expect to
 see the HTML canvas for the default Scene magically appear in the page when you do that.

 ## <a name="savingAndLoading">Saving and Loading Scenes</a>

 The entire runtime state of a Scene can be serialized and deserialized to and from JSON. This means you can create a
 Scene, then save it and restore it again to exactly how it was when you saved it.

 ````javascript
 // Serialize the scene to JSON
 var json = myScene.json;

 // Create another scene from that JSON, in a fresh canvas:
 var myOtherScene = new XEO.Scene({
      json: json
  });

 ````

 ***Note:*** this will save your {{#crossLink "Geometry"}}Geometry{{/crossLink}}s' array properties
 ({{#crossLink "Geometry/positions:property"}}positions{{/crossLink}}, {{#crossLink "Geometry/normals:property"}}normals{{/crossLink}},
 {{#crossLink "Geometry/indices:property"}}indices{{/crossLink}} etc) as JSON arrays, which may stress your browser
 if those arrays are huge.

 @class Scene
 @module XEO
 @constructor
 @param [cfg] Scene parameters
 @param [cfg.id] {String} Optional ID, unique among all Scenes in xeoEngine, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Scene.
 @param [cfg.canvasId] {String} ID of existing HTML5 canvas in the DOM - creates a full-page canvas automatically if this is omitted
 @param [cfg.components] {Array(Object)} JSON array containing parameters for {{#crossLink "Component"}}Component{{/crossLink}} subtypes to immediately create within the Scene.
 @extends Component
 */
(function () {

    "use strict";

    /**
     * Fired whenever a debug message logged on a component within this Scene.
     * @event log
     * @param {String} value The debug message
     */

    /**
     * Fired whenever an error is logged on a component within this Scene.
     * @event error
     * @param {String} value The error message
     */

    /**
     * Fired whenever a warning is logged on a component within this Scene.
     * @event warn
     * @param {String} value The warning message
     */

    /**
     * Signals the first rendering phase
     * @event tick
     * @param {String} sceneID The ID of this Scene.
     * @param {Number} startTime The time in seconds since 1970 that this Scene was instantiated.
     * @param {Number} time The time in seconds since 1970 of this "tick" event.
     * @param {Number} prevTime The time of the previous "tick" event from this Scene.
     * @param {Number} deltaTime The time in seconds since the previous "tick" event from this Scene.
     */

    /**
     * Signals the second rendering phase
     * @event tick2
     * @param {String} sceneID The ID of this Scene.
     * @param {Number} startTime The time in seconds since 1970 that this Scene was instantiated.
     * @param {Number} time The time in seconds since 1970 of this "tick2" event.
     * @param {Number} prevTime The time of the previous "tick2" event from this Scene.
     * @param {Number} deltaTime The time in seconds since the previous "tick2" event from this Scene.
     */

    /**
     * Signals the third rendering phase
     * @event tick3
     * @param {String} sceneID The ID of this Scene.
     * @param {Number} startTime The time in seconds since 1970 that this Scene was instantiated.
     * @param {Number} time The time in seconds since 1970 of this "tick3" event.
     * @param {Number} prevTime The time of the previous "tick3" event from this Scene.
     * @param {Number} deltaTime The time in seconds since the previous "tick3" event from this Scene.
     */

    /**
     * Signals the fourth rendering phase
     * @event tick4
     * @param {String} sceneID The ID of this Scene.
     * @param {Number} startTime The time in seconds since 1970 that this Scene was instantiated.
     * @param {Number} time The time in seconds since 1970 of this "tick4" event.
     * @param {Number} prevTime The time of the previous "tick4" event from this Scene.
     * @param {Number} deltaTime The time in seconds since the previous "tick4" event from this Scene.
     */

    /**
     * Signals the fifth rendering phase
     * @event tick5
     * @param {String} sceneID The ID of this Scene.
     * @param {Number} startTime The time in seconds since 1970 that this Scene was instantiated.
     * @param {Number} time The time in seconds since 1970 of this "tick5" event.
     * @param {Number} prevTime The time of the previous "tick5" event from this Scene.
     * @param {Number} deltaTime The time in seconds since the previous "tick5" event from this Scene.
     */

    XEO.Scene = XEO.Component.extend({

        type: "XEO.Scene",

        _init: function (cfg) {

            var self = this;

            /**
             * Tracks statistics within this Scene, such as numbers of
             * textures, geometries etc.
             * @final
             * @property stats
             * @type {*}
             * @final
             */
            this.stats = {
                build: {
                    version: XEO.version
                },
                client: {
                    browser: (navigator && navigator.userAgent) ? navigator.userAgent : "n/a"
                },
                canvas: {
                    width: 0,
                    height: 0
                },
                scene: {
                    objects: 0
                },
                memory: {

                    // Note that these counts will include any positions, colors,
                    // normals and indices that xeoEngine internally creates on-demand
                    // to support color-index triangle picking.

                    meshes: 0,
                    positions: 0,
                    colors: 0,
                    normals: 0,
                    tangents: 0,
                    uvs: 0,
                    indices: 0,
                    textures: 0,
                    programs: 0
                },
                frame: {
                    frameCount: 0,
                    renderTime: 0,
                    useProgram: 0,
                    setUniform: 0,
                    setUniformCacheHits: 0,
                    bindTexture: 0,
                    bindArray: 0,
                    drawElements: 0,
                    drawChunks: 0
                }
            };

            this._componentIDMap = new XEO.utils.Map();

            /**
             * The epoch time (in milliseconds since 1970) when this Scene was instantiated.
             *
             * @property timeCreated
             * @type {Number}
             */
            this.startTime = (new Date()).getTime();

            /**
             * The {{#crossLink "Component"}}Component{{/crossLink}}s within
             * this Scene, mapped to their IDs.
             *
             * Will also contain the {{#crossLink "GameObject"}}{{/crossLink}}s
             * contained in {{#crossLink "GameObject/components:property"}}{{/crossLink}}.
             *
             * @property components
             * @type {String:XEO.Component}
             */
            this.components = {};

            /**
             * For each {{#crossLink "Component"}}Component{{/crossLink}} type, a map of
             * IDs to instances.
             *
             * @property types
             * @type {String:{String:XEO.Component}}
             */
            this.types = {};

            /**
             * The {{#crossLink "GameObject"}}{{/crossLink}}s within
             * this Scene, mapped to their IDs.
             *
             * The {{#crossLink "GameObject"}}{{/crossLink}}s in this map
             * will also be contained in {{#crossLink "GameObject/components:property"}}{{/crossLink}}.
             *
             * @property objects
             * @type {String:XEO.GameObject}
             */
            this.objects = {};

            // Contains XEO.GameObjects that need to be recompiled back into this._renderer
            this._dirtyObjects = {};

            /**
             * Configurations for this Scene. Set whatever properties on here
             * that will be useful to the components within the Scene.
             * @final
             * @property configs
             * @type {Configs}
             */
            this.configs = new XEO.Configs(this, cfg.configs);

            /**
             * Manages the HTML5 canvas for this Scene.
             * @final
             * @property canvas
             * @type {Canvas}
             */
            this.canvas = new XEO.Canvas(this, {
                canvas: cfg.canvas, // Can be canvas ID, canvas element, or null
                contextAttr: cfg.contextAttr || {}
            });

            // Redraw as canvas resized
            this.canvas.on("size",
                function () {
                    self._renderer.render({
                        force: true,
                        clear: true
                    });
                });

            this.canvas.on("webglContextFailed",
                function () {
                    alert("xeoEngine failed to find WebGL!");
                });

            this._renderer = new XEO.renderer.Renderer(this.stats, {
                canvas: this.canvas,
                transparent: cfg.transparent
            });

            /**
             * Publishes input events that occur on this Scene's canvas.
             * @final
             * @property input
             * @type {Input}
             * @final
             */
            this.input = new XEO.Input(this, {
                element: this.canvas.overlay
            });

            /**
             * Tracks any asynchronous tasks that occur within this Scene.
             * @final
             * @property tasks
             * @type {Tasks}
             * @final
             */
            this.tasks = new XEO.Tasks(this);

            // Register Scene on engine
            // Do this BEFORE we add components below
            XEO._addScene(this);

            // Add components specified as JSON
            // This will also add the default components for this Scene,
            // if this JSON was serialized from a XEO.Scene instance.

            var componentJSONs = cfg.components;

            if (componentJSONs) {

                var componentJSON;
                var type;
                var constructor;

                for (var i = 0, len = componentJSONs.length; i < len; i++) {

                    componentJSON = componentJSONs[i];
                    type = componentJSON.type;

                    if (type) {

                        constructor = window[type];

                        if (constructor) {
                            new constructor(this, componentJSON);
                        }
                    }
                }
            }

            // Create the default components if not already created.
            // These may have already been created in the JSON above.

            this._initDefaults();
        },

        _initDefaults: function () {

            // Create this Scene's default components, which every
            // GameObject created in this Scene will inherit by default

            this.view;
            this.project;
            this.camera;
            this.clips;
            this.colorTarget;
            this.colorBuf;
            this.depthTarget;
            this.depthBuf;
            this.visibility;
            this.modes;
            this.geometry;
            this.layer;
            this.lights;
            this.material;
            this.morphTargets;
            this.reflect;
            this.shader;
            this.shaderParams;
            this.stage;
            this.transform;
        },

        // Called by each component that is created with this Scene as parent.
        // Registers the component within this scene.
        _addComponent: function (c) {

            if (c.id) {

                // User-supplied ID

                if (this.components[c.id]) {
                    this.error("Component " + XEO._inQuotes(c.id) + " already exists");
                    return;
                }
            } else {

                // Auto-generated ID

                c.id = this._componentIDMap.addItem(c);
            }

            this.components[c.id] = c;

            // Register for class type

            //var type = c.type.indexOf("XEO.") > -1 ? c.type.substring(4) : c.type;
            var type = c.type;

            var types = this.types[c.type];

            if (!types) {
                types = this.types[type] = {};
            }

            types[c.id] = c;

            var self = this;

            c.on("destroyed",
                function () {

                    self._componentIDMap.removeItem(c.id);

                    delete self.components[c.id];

                    var types = self.types[c.type];

                    if (types) {

                        delete types[c.id];

                        if (XEO._isEmptyObject(types)) {
                            delete self.types[c.type];
                        }
                    }

                    if (c.type === "XEO.GameObject") {

                        // Component is a XEO.GameObject

                        // Update scene statistics,
                        // Unschedule any pending recompilation of
                        // the GameObject into the renderer

                        self.stats.scene.objects--;

                        delete self.objects[c.id];

                        delete self._dirtyObjects[c.id];
                    }

                    /**
                     * Fired whenever a component within this Scene has been destroyed.
                     * @event componentDestroyed
                     * @param {Component} value The component that was destroyed
                     */
                    self.fire("componentDestroyed", c, true);

                    //self.log("Destroyed " + c.type + " " + XEO._inQuotes(c.id));
                });

            if (c.type === "XEO.GameObject") {

                // Component is a XEO.GameObject

                c.on("dirty",
                    function () {

                        // Whenever the GameObject signals dirty,
                        // schedule its recompilation into the renderer

                        if (!self._dirtyObjects[c.id]) {
                            self._dirtyObjects[c.id] = c;
                        }
                    });

                this.objects[c.id] = c;

                // Update scene statistics

                this.stats.scene.objects++;
            }

            /**
             * Fired whenever a component has been created within this Scene.
             * @event componentCreated
             * @param {Component} value The component that was created
             */
            this.fire("componentCreated", c, true);

            //self.log("Created " + c.type + " " + XEO._inQuotes(c.id));
        },

        _props: {

            /**
             * The default projection transform provided by this Scene, which is
             * a {{#crossLink "Perspective"}}Perspective{{/crossLink}}.
             *
             * This {{#crossLink "Perspective"}}Perspective{{/crossLink}} has an
             * {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to
             * "default.project", with all other properties set to their default
             * values.
             *
             * {{#crossLink "Camera"}}Cameras{{/crossLink}} within this Scene
             * are attached to this {{#crossLink "Perspective"}}Perspective{{/crossLink}}
             * by default.
             *
             * @property project
             * @final
             * @type Perspective
             */
            project: {

                get: function () {
                    return this.components["default.project"] ||
                        new XEO.Perspective(this, {
                            id: "default.project",
                            isDefault: true
                        });
                }
            },

            /**
             * The default viewing transform provided by this Scene, which is a {{#crossLink "Lookat"}}Lookat{{/crossLink}}.
             *
             * This {{#crossLink "Lookat"}}Lookat{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.view",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "Camera"}}Cameras{{/crossLink}} within this Scene are attached to
             * this {{#crossLink "Lookat"}}Lookat{{/crossLink}} by default.
             * @property view
             * @final
             * @type Lookat
             */
            view: {

                get: function () {
                    return this.components["default.view"] ||
                        new XEO.Lookat(this, {
                            id: "default.view",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "Camera"}}Camera{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "Camera"}}Camera{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.camera",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to
             * this {{#crossLink "Camera"}}Camera{{/crossLink}} by default.
             * @property camera
             * @final
             * @type Camera
             */
            camera: {

                get: function () {
                    return this.components["default.camera"] ||
                        new XEO.Camera(this, {
                            id: "default.camera",
                            isDefault: true,
                            project: "default.project",
                            view: "default.view"
                        });
                }
            },

            /**
             * The default modelling {{#crossLink "Transform"}}{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "Transform"}}{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.transform",
             * with all other properties initialised to their default values (ie. an identity matrix).
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to
             * this {{#crossLink "Transform"}}{{/crossLink}} by default.
             *
             * @property transform
             * @final
             * @type Transform
             */
            transform: {

                get: function () {
                    return this.components["default.transform"] ||
                        new XEO.Transform(this, {
                            id: "default.transform",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "Billboard"}}Billboard{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "Billboard"}}Billboard{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.billboard"
             * and an {{#crossLink "Billboard/active:property"}}{{/crossLink}} property set to false to disable it.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Billboard"}}Billboard{{/crossLink}} by default.
             * @property billboard
             * @final
             * @type Billboard
             */
            billboard: {
                get: function () {
                    return this.components["default.billboard"] ||
                        new XEO.Billboard(this, {
                            id: "default.billboard",
                            active: false,
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "Clips"}}Clips{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "Clips"}}Clips{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.clips",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Clips"}}Clips{{/crossLink}} by default.
             * @property clips
             * @final
             * @type Clips
             */
            clips: {

                get: function () {
                    return this.components["default.clips"] ||
                        new XEO.Clips(this, {
                            id: "default.clips",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "ColorBuf"}}ColorBuf{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "ColorBuf"}}ColorBuf{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.colorBuf",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "ColorBuf"}}ColorBuf{{/crossLink}} by default.
             * @property colorBuf
             * @final
             * @type ColorBuf
             */
            colorBuf: {

                get: function () {
                    return this.components["default.colorBuf"] ||
                        new XEO.ColorBuf(this, {
                            id: "default.colorBuf",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "ColorTarget"}}ColorTarget{{/crossLink}} provided by this Scene.
             *
             * The {{#crossLink "ColorTarget"}}DepthTarget{{/crossLink}} is
             * {{#crossLink "ColorTarget/active:property"}}inactive{{/crossLink}} by default and will have an
             * {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.depthTarget".
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "ColorTarget"}}ColorTarget{{/crossLink}} by default.
             * @property colorTarget
             * @final
             * @type ColorTarget
             */
            colorTarget: {
                get: function () {
                    return this.components["default.colorTarget"] ||
                        new XEO.ColorTarget(this, {
                            id: "default.colorTarget",
                            isDefault: true,
                            active: false
                        })
                }
            },

            /**
             * The default {{#crossLink "DepthBuf"}}DepthBuf{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "DepthBuf"}}DepthBuf{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.depthBuf",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "DepthBuf"}}DepthBuf{{/crossLink}} by default.
             *
             * @property depthBuf
             * @final
             * @type DepthBuf
             */
            depthBuf: {
                get: function () {
                    return this.components["default.depthBuf"] ||
                        new XEO.DepthBuf(this, {
                            id: "default.depthBuf",
                            isDefault: true,
                            active: false
                        });
                }
            },

            /**
             * The default {{#crossLink "DepthTarget"}}DepthTarget{{/crossLink}} provided by this Scene.
             *
             * The {{#crossLink "DepthTarget"}}DepthTarget{{/crossLink}} is
             * {{#crossLink "DepthTarget/active:property"}}inactive{{/crossLink}} by default and has an
             * {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.depthTarget".
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "DepthTarget"}}DepthTarget{{/crossLink}} by default.
             * @property depthTarget
             * @final
             * @type DepthTarget
             */
            depthTarget: {
                get: function () {
                    return this.components["default.depthTarget"] ||
                        new XEO.DepthTarget(this, {
                            id: "default.depthTarget",
                            isDefault: true,
                            active: false
                        });
                }
            },

            /**
             * The default {{#crossLink "Visibility"}}Visibility{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "Visibility"}}Visibility{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.visibility",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Visibility"}}Visibility{{/crossLink}} by default.
             * @property visibility
             * @final
             * @type Visibility
             */
            visibility: {
                get: function () {
                    return this.components["default.visibility"] ||
                        new XEO.Visibility(this, {
                            id: "default.visibility",
                            isDefault: true,
                            visible: true
                        });
                }
            },

            /**
             * The default {{#crossLink "Modes"}}Modes{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "Modes"}}Modes{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.modes",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Modes"}}Modes{{/crossLink}} by default.
             * @property modes
             * @final
             * @type Modes
             */
            modes: {
                get: function () {
                    return this.components["default.modes"] ||
                        new XEO.Modes(this, {
                            id: "default.modes",
                            isDefault: true
                        });
                }
            },

            /**
             * The default geometry provided by this Scene, which is a {{#crossLink "BoxGeometry"}}BoxGeometry{{/crossLink}}.
             *
             * This {{#crossLink "BoxGeometry"}}BoxGeometry{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.geometry".
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Geometry"}}Geometry{{/crossLink}} by default.
             * @property geometry
             * @final
             * @type BoxGeometry
             */
            geometry: {
                get: function () {
                    return this.components["default.geometry"] ||
                        new XEO.BoxGeometry(this, {
                            id: "default.geometry",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "Layer"}}Layer{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "Layer"}}Layer{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.layer",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Layer"}}Layer{{/crossLink}} by default.
             * @property layer
             * @final
             * @type Layer
             */
            layer: {
                get: function () {
                    return this.components["default.layer"] ||
                        new XEO.Layer(this, {
                            id: "default.layer",
                            isDefault: true,
                            priority: 0
                        });
                }
            },

            /**
             * The default {{#crossLink "Lights"}}Lights{{/crossLink}} provided
             * by this Scene.
             *
             * This {{#crossLink "Lights"}}Lights{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to *````"default.lights"````*,
             * with all other properties initialised to their default values (ie. the default set of light sources for a {{#crossLink "Lights"}}Lights{{/crossLink}}).
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Lights"}}Lights{{/crossLink}} by default.
             *
             * @property lights
             * @final
             * @type Lights
             */
            lights: {
                get: function () {
                    return this.components["default.lights"] ||
                        new XEO.Lights(this, {
                            id: "default.lights",
                            isDefault: true,

                            // By default a XEO.Lights has an empty lights
                            // property, so we must provide some lights

                            lights: [

                                // Ambient light source #0
                                new XEO.AmbientLight(this, {
                                    id: "default.light0",
                                    color: [0.8, 0.8, 0.9],
                                    intensity: 0.6
                                }),

                                // Directional light source #1
                                new XEO.DirLight(this, {
                                    id: "default.light1",
                                    dir: [-0.5, -0.5, 1.0],
                                    color: [1.0, 1.0, 0.9],
                                    intensity: 0.5,
                                    space: "world"
                                }),
                                //
                                // Directional light source #2
                                new XEO.DirLight(this, {
                                    id: "default.light2",
                                    dir: [1.0, -0.9, 0.7],
                                    color: [1.0, 1.0, 1.0],
                                    intensity: 0.5,
                                    space: "world"
                                })
                            ]
                        });
                }
            },

            /**
             * The {{#crossLink "PhongMaterial"}}PhongMaterial{{/crossLink}} provided as the default material by this Scene.
             *
             * This {{#crossLink "PhongMaterial"}}PhongMaterial{{/crossLink}} has
             * an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.material", with all
             * other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "PhongMaterial"}}PhongMaterial{{/crossLink}} by default.
             * @property material
             * @final
             * @type PhongMaterial
             */
            material: {
                get: function () {
                    return this.components["default.material"] ||
                        new XEO.PhongMaterial(this, {
                            id: "default.material",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "MorphTargets"}}MorphTargets{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "MorphTargets"}}MorphTargets{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.morphTargets",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "MorphTargets"}}MorphTargets{{/crossLink}} by default.
             * @property morphTargets
             * @final
             * @type MorphTargets
             */
            morphTargets: {
                get: function () {
                    return this.components["default.morphTargets"] ||
                        new XEO.MorphTargets(this, {
                            id: "default.morphTargets",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "Reflect"}}Reflect{{/crossLink}} provided by this Scene,
             * (which is initially an empty {{#crossLink "Reflect"}}Reflect{{/crossLink}} that has no effect).
             *
             * This {{#crossLink "Reflect"}}Reflect{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.reflect",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Reflect"}}Reflect{{/crossLink}} by default.
             * @property reflect
             * @final
             * @type Reflect
             */
            reflect: {
                get: function () {
                    return this.components["default.reflect"] ||
                        new XEO.Reflect(this, {
                            id: "default.reflect",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "Shader"}}Shader{{/crossLink}} provided by this Scene
             * (which is initially an empty {{#crossLink "Shader"}}Shader{{/crossLink}} that has no effect).
             *
             * This {{#crossLink "Shader"}}Shader{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.shader",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Shader"}}Shader{{/crossLink}} by default.
             * @property shader
             * @final
             * @type Shader
             */
            shader: {
                get: function () {
                    return this.components["default.shader"] ||
                        this.components["default.shader"] || new XEO.Shader(this, {
                            id: "default.shader",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "ShaderParams"}}ShaderParams{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "ShaderParams"}}ShaderParams{{/crossLink}} has an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.shaderParams",
             * with all other properties initialised to their default values.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "ShaderParams"}}{{/crossLink}} by default.
             *
             * @property shaderParams
             * @final
             * @type ShaderParams
             */
            shaderParams: {
                get: function () {
                    return this.components["default.shaderParams"] ||
                        new XEO.ShaderParams(this, {
                            id: "default.shaderParams",
                            isDefault: true
                        });
                }
            },

            /**
             * The default {{#crossLink "Stage"}}Stage{{/crossLink}} provided by this Scene.
             *
             * This {{#crossLink "Stage"}}Stage{{/crossLink}} has
             * an {{#crossLink "Component/id:property"}}id{{/crossLink}} equal to "default.stage" and
             * a {{#crossLink "Stage/priority:property"}}priority{{/crossLink}} equal to ````0````.
             *
             * {{#crossLink "GameObject"}}GameObjects{{/crossLink}} within this Scene are attached to this
             * {{#crossLink "Stage"}}Stage{{/crossLink}} by default.
             * @property stage
             * @final
             * @type Stage
             */
            stage: {
                get: function () {
                    return this.components["default.stage"] ||
                        new XEO.Stage(this, {
                            id: "default.stage",
                            priority: 0,
                            isDefault: true
                        });
                }
            },

            /**
             * World-space 3D boundary.
             *
             * If you call {{#crossLink "Component/destroy:method"}}{{/crossLink}} on this boundary, then
             * this property will be assigned to a fresh {{#crossLink "Boundary3D"}}{{/crossLink}} instance next
             * time you reference it.
             *
             * @property worldBoundary
             * @type Boundary3D
             * @final
             */
            worldBoundary: {

                get: function () {

                    if (!this._worldBoundary) {

                        var self = this;
                        var aabb = XEO.math.AABB3();

                        // TODO: bind to transform updates here, for lazy-binding efficiency goodness?

                        this._worldBoundary = new XEO.Boundary3D(this.scene, {

                            getDirty: function () {

                                return true; // This boundary always rebuilds when queried, no caching.

                                //return self._worldBoundaryDirty;
                            },

                            getAABB: function () {

                                aabb.min[0] = 100000;
                                aabb.min[1] = 100000;
                                aabb.min[2] = 100000;
                                aabb.max[0] = -100000;
                                aabb.max[1] = -100000;
                                aabb.max[2] = -100000;

                                var objects = self.objects;
                                var object;

                                for (var objectId in objects) {
                                    if (objects.hasOwnProperty(objectId)) {

                                        object = objects[objectId];

                                        XEO.math.expandAABB3(object.worldBoundary.aabb, aabb);
                                    }
                                }

                                return aabb;
                            }
                        });

                        this._worldBoundary.on("destroyed",
                            function () {
                                self._worldBoundary = null;
                            });

                        this._setWorldBoundaryDirty();
                    }

                    return this._worldBoundary;
                }
            }
        },

        _setWorldBoundaryDirty: function () {
            this._worldBoundaryDirty = true;
            if (this._worldBoundary) {
                this._worldBoundary.fire("updated", true);
            }
        },

        /**
         * Attempts to pick a {{#crossLink "GameObject"}}GameObject{{/crossLink}} at the given Canvas-space coordinates.
         *
         * Ignores {{#crossLink "GameObject"}}GameObjects{{/crossLink}} that are attached
         * to either a {{#crossLink "Stage"}}Stage{{/crossLink}} with {{#crossLink "Stage/pickable:property"}}pickable{{/crossLink}}
         * set *false* or a {{#crossLink "Modes"}}Modes{{/crossLink}} with {{#crossLink "Modes/pickable:property"}}pickable{{/crossLink}} set *false*.
         *
         * On success, will fire a {{#crossLink "Scene/picked:event"}}{{/crossLink}} event on this Scene, along with
         * a separate {{#crossLink "Object/picked:event"}}{{/crossLink}} event on the target {{#crossLink "GameObject"}}GameObject{{/crossLink}}.
         *
         * ````javascript
         *
         * pick({
         *      canvasPos: [23, 131],
         *      rayPick: true
         *      });
         *
         * ````
         * @method pick
         *
         * @param {*} params Picking parameters.
         * @param {Array of Number} [params.canvasPos] Canvas-space coordinates.
         * @param {Boolean} [params.rayPick=false] Whether to ray-pick.
         * @returns {*} Hit record, returned when a {{#crossLink "GameObject"}}{{/crossLink}} is picked, else null.
         */
        pick: (function () {

            // Cached vectors to avoid garbage collection

            var origin = XEO.math.vec3();
            var dir = XEO.math.vec3();

            var a = XEO.math.vec3();
            var b = XEO.math.vec3();
            var c = XEO.math.vec3();

            var triangleVertices = XEO.math.vec3();
            var position = XEO.math.vec4();
            var worldPos = XEO.math.vec4();
            var barycentric = XEO.math.vec3();

            var na = XEO.math.vec3();
            var nb = XEO.math.vec3();
            var nc = XEO.math.vec3();

            var uva = XEO.math.vec3();
            var uvb = XEO.math.vec3();
            var uvc = XEO.math.vec3();

            var tempMat4 = XEO.math.mat4();
            var tempMat4b = XEO.math.mat4();

            var tempVec4 = XEO.math.vec4();
            var tempVec4b = XEO.math.vec4();

            var tempVec3 = XEO.math.vec3();
            var tempVec3b = XEO.math.vec3();
            var tempVec3c = XEO.math.vec3();
            var tempVec3d = XEO.math.vec3();
            var tempVec3e = XEO.math.vec3();
            var tempVec3f = XEO.math.vec3();
            var tempVec3g = XEO.math.vec3();
            var tempVec3h = XEO.math.vec3();
            var tempVec3i = XEO.math.vec3();
            var tempVec3j = XEO.math.vec3();


            // Given a GameObject and camvas coordinates, gets a ray
            // originating at the World-space eye position that passes
            // through the perspective projection plane. The ray is
            // returned via the origin and dir arguments.

            function getLocalRay(object, canvasCoords, origin, dir) {

                var math = XEO.math;

                var canvas = object.scene.canvas.canvas;

                var modelMat = object.transform.matrix;
                var viewMat = object.camera.view.matrix;
                var projMat = object.camera.project.matrix;

                var vmMat = math.mulMat4(viewMat, modelMat, tempMat4);
                var pvMat = math.mulMat4(projMat, vmMat, tempMat4b);
                var pvMatInverse = math.inverseMat4(pvMat, tempMat4b);

                //var modelMatInverse = math.inverseMat4(modelMat, tempMat4c);

                // Calculate clip space coordinates, which will be in range
                // of x=[-1..1] and y=[-1..1], with y=(+1) at top

                var canvasWidth = canvas.width;
                var canvasHeight = canvas.height;

                var clipX = (canvasCoords[0] - canvasWidth / 2) / (canvasWidth / 2);  // Calculate clip space coordinates
                var clipY = -(canvasCoords[1] - canvasHeight / 2) / (canvasHeight / 2);

                var local1 = math.transformVec4(pvMatInverse, [clipX, clipY, -1, 1], tempVec4);
                local1 = math.mulVec4Scalar(local1, 1 / local1[3]);

                var local2 = math.transformVec4(pvMatInverse, [clipX, clipY, 1, 1], tempVec4b);
                local2 = math.mulVec4Scalar(local2, 1 / local2[3]);

                origin[0] = local1[0];
                origin[1] = local1[1];
                origin[2] = local1[2];

                math.subVec3(local2, local1, dir);

                math.normalizeVec3(dir);
            }

            return function (params) {

                var math = XEO.math;

                params = params || {};

                params.canvasPos = params.canvasPos || math.vec3();

                var hit = this._renderer.pick(params);

                if (hit) {

                    var object = this.objects[hit.object];

                    hit.object = object; // Swap string ID for XEO.Object

                    if (hit.primitiveIndex !== -1) {

                        var geometry = object.geometry;

                        if (geometry.primitive === "triangles") {

                            // Triangle picked; this only happens when the
                            // GameObject has a Geometry that has primitives of type "triangle"

                            hit.primitive = "triangle";

                            // Get the World-space positions of the triangle's vertices

                            var i = hit.primitiveIndex; // Indicates the first triangle index in the indices array

                            var indices = geometry.indices;
                            var positions = geometry.positions;

                            var ia = indices[i];
                            var ib = indices[i + 1];
                            var ic = indices[i + 2];

                            triangleVertices[0] = ia;
                            triangleVertices[1] = ib;
                            triangleVertices[2] = ic;

                            hit.indices = triangleVertices;

                            a[0] = positions[(ia * 3)];
                            a[1] = positions[(ia * 3) + 1];
                            a[2] = positions[(ia * 3) + 2];

                            b[0] = positions[(ib * 3)];
                            b[1] = positions[(ib * 3) + 1];
                            b[2] = positions[(ib * 3) + 2];

                            c[0] = positions[(ic * 3)];
                            c[1] = positions[(ic * 3) + 1];
                            c[2] = positions[(ic * 3) + 2];

                            // Attempt to ray-pick the triangle; in World-space, fire a ray
                            // from the eye position through the mouse position
                            // on the perspective projection plane

                            getLocalRay(object, params.canvasPos, origin, dir);

                            math.rayPlaneIntersect(origin, dir, a, b, c, position);

                            // Get Local-space cartesian coordinates of the ray-triangle intersection

                            hit.position = position;

                            // Get interpolated World-space coordinates

                            // Need to transform homogeneous coords

                            tempVec4[0] = position[0];
                            tempVec4[1] = position[1];
                            tempVec4[2] = position[2];
                            tempVec4[3] = 1;

                            // Get World-space cartesian coordinates of the ray-triangle intersection

                            math.transformVec4(object.transform.matrix, tempVec4, tempVec4b);

                            worldPos[0] = tempVec4b[0];
                            worldPos[1] = tempVec4b[1];
                            worldPos[2] = tempVec4b[2];

                            hit.worldPos = worldPos;

                            // Get barycentric coordinates of the ray-triangle intersection

                            math.cartesianToBarycentric2(position, a, b, c, barycentric);

                            hit.barycentric = barycentric;

                            // Get interpolated normal vector

                            var normals = geometry.normals;

                            if (normals) {

                                na[0] = normals[(ia * 3)];
                                na[1] = normals[(ia * 3) + 1];
                                na[2] = normals[(ia * 3) + 2];

                                nb[0] = normals[(ib * 3)];
                                nb[1] = normals[(ib * 3) + 1];
                                nb[2] = normals[(ib * 3) + 2];

                                nc[0] = normals[(ic * 3)];
                                nc[1] = normals[(ic * 3) + 1];
                                nc[2] = normals[(ic * 3) + 2];

                                hit.normal = math.addVec3(math.addVec3(
                                        math.mulVec3Scalar(na, barycentric[0], tempVec3),
                                        math.mulVec3Scalar(nb, barycentric[1], tempVec3b), tempVec3c),
                                    math.mulVec3Scalar(nc, barycentric[2], tempVec3d), tempVec3e);
                            }

                            // Get interpolated UV coordinates

                            var uvs = geometry.uv;

                            if (uvs) {

                                uva[0] = uvs[(ia * 2)];
                                uva[1] = uvs[(ia * 2) + 1];

                                uvb[0] = uvs[(ib * 2)];
                                uvb[1] = uvs[(ib * 2) + 1];

                                uvc[0] = uvs[(ic * 2)];
                                uvc[1] = uvs[(ic * 2) + 1];

                                hit.uv = math.addVec3(
                                    math.addVec3(
                                        math.mulVec2Scalar(uva, barycentric[0], tempVec3f),
                                        math.mulVec2Scalar(uvb, barycentric[1], tempVec3g), tempVec3h),
                                    math.mulVec2Scalar(uvc, barycentric[2], tempVec3i), tempVec3j);
                            }
                        }
                    }

                    return hit;
                }
            };

        })(),

        /**
         * Resets this Scene to its default state.
         *
         * References to any components in this Scene will become invalid.
         *
         * @method clear
         */
        clear: function () {  // FIXME: should only clear user-created components

            for (var id in this.components) {
                if (this.components.hasOwnProperty(id)) {

                    // Each component fires "destroyed" as it is destroyed,
                    // which this Scene handles by removing the component

                    this.components[id].destroy();
                }
            }

            // Reinitialise defaults

            this._initDefaults();

            this._dirtyObjects = {};
        }

        ,

        /**
         * Displays a simple test object.
         *
         * Clears the Scene first.
         *
         * The test object is destroyed as soon as anything else is created in this Scene.
         *
         * @method testPattern
         */
        testPattern: function () {

            // Clear the scene

            this.clear();

            // Create spinning test object

            var rotate = new XEO.Rotate(this, {
                xyz: [0, .5, .5],
                angle: 0
            });

            var object = new XEO.GameObject(this, {
                transform: rotate
            });

            var angle = 0;

            var spin = this.on("tick",
                function () {
                    object.transform.angle = angle;
                    angle += 0.5;
                });

            var self = this;

            object.on("destroyed",
                function () {
                    self.off(spin);
                });

            // Destroy spinning test object as soon as something
            // is created subsequently in the scene

            this.on("componentCreated",
                function () {
                    object.destroy();
                    rotate.destroy();
                });
        }
        ,

        /**
         * Compiles and renders this Scene
         * @private
         */
        _compile: function () {

            // Compile dirty objects into this._renderer

            var countCompiledObjects = 0;

            for (var id in this._dirtyObjects) {
                if (this._dirtyObjects.hasOwnProperty(id)) {

                    this._dirtyObjects[id]._compile();

                    delete this._dirtyObjects[id];

                    countCompiledObjects++;
                }
            }

            if (countCompiledObjects > 0) {
                //    this.log("Compiled " + countCompiledObjects + " XEO.GameObject" + (countCompiledObjects > 1 ? "s" : ""));
            }

            // Render a frame
            // Only renders if there was a state update

            this._renderer.render({
                clear: true // Clear buffers
            });
        }
        ,

        _getJSON: function () {

            // Get list of component JSONs, in ascending order of component
            // creation. We need them in that order so that any dependencies
            // that exist between them are resolved correctly as the
            // components are instantiawhen when we load the JSON again.

            var components = [];
            var component;
            var priorities = [];

            for (var id in this.components) {
                if (this.components.hasOwnProperty(id)) {

                    component = this.components[id];

                    // Don't serialize service components that
                    // will always be created on this Scene

                    if (!component._getJSON) {
                        continue;
                    }

                    // Serialize in same order as creation
                    // in order to resolve inter-component dependencies

                    components.unshift(component);
                }
            }

            components.sort(function (a, b) {
                return a._componentOrder - b._componentOrder
            });

            var componentJSONs = [];

            for (var i = 0, len = components.length; i < len; i++) {
                componentJSONs.push(components[i].json);
            }

            return {
                components: componentJSONs
            };
        }
        ,

        _destroy: function () {
            this.clear();
        }
    });

})();
