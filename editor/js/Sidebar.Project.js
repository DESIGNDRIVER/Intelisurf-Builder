/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Project = function(editor) {

    var config = editor.config;
    var signals = editor.signals;

    var rendererTypes = {

        'WebGLRenderer': THREE.WebGLRenderer,
        'CanvasRenderer': THREE.CanvasRenderer,
        'SVGRenderer': THREE.SVGRenderer,
        'SoftwareRenderer': THREE.SoftwareRenderer,
        'RaytracingRenderer': THREE.RaytracingRenderer

    };

    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');

    // Title

    var titleRow = new UI.Row();
    var title = new UI.Input(config.getKey('project/title')).setLeft('100px').onChange(function() {

        config.setKey('project/title', this.getValue());
        signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();

    });

    titleRow.add(new UI.Text('Title').setWidth('90px'));
    titleRow.add(title);

    container.add(titleRow);

    // Editable

    var editableRow = new UI.Row();
    var editable = new UI.Checkbox(config.getKey('project/editable')).setLeft('100px').onChange(function() {

        config.setKey('project/editable', this.getValue());
        signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();

    });

    editableRow.add(new UI.Text('Editable').setWidth('90px'));
    editableRow.add(editable);

    container.add(editableRow);

    // VR

    var vrRow = new UI.Row();
    var vr = new UI.Checkbox(config.getKey('project/vr')).setLeft('100px').onChange(function() {

        config.setKey('project/vr', this.getValue());
        signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();

    });

    vrRow.add(new UI.Text('VR').setWidth('90px'));
    vrRow.add(vr);

    container.add(vrRow);

    // Renderer

    var options = {};

    for (var key in rendererTypes) {

        if (key.indexOf('WebGL') >= 0 && System.support.webgl === false) continue;

        options[key] = key;

    }

    var rendererTypeRow = new UI.Row();
    var rendererType = new UI.Select().setOptions(options).setWidth('150px').onChange(function() {

        var value = this.getValue();

        config.setKey('project/renderer', value);

        updateRenderer();

    });

    //rendererTypeRow.add( new UI.Text( 'Renderer' ).setWidth( '90px' ) );
    //rendererTypeRow.add( rendererType );

    //container.add( rendererTypeRow );

    if (config.getKey('project/renderer') !== undefined) {

        rendererType.setValue(config.getKey('project/renderer'));

    }

    // Renderer / Antialias

    var rendererPropertiesRow = new UI.Row().setMarginLeft('0px');

    var rendererAntialias = new UI.THREE.Boolean(config.getKey('project/renderer/antialias'), 'antialias').onChange(function() {

        config.setKey('project/renderer/antialias', this.getValue());
        updateRenderer();

    });
    //rendererPropertiesRow.add( rendererAntialias );

    // Renderer / Shadows

    rendererPropertiesRow.add(new UI.Text('Shadows').setWidth('90px'));

    var rendererShadows = new UI.THREE.Boolean(config.getKey('project/renderer/shadows')).onChange(function() {

        config.setKey('project/renderer/shadows', this.getValue());
        //signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();
        updateRenderer();

    });
    rendererPropertiesRow.add(rendererShadows);

    //rendererPropertiesRow.add( new UI.Break() );

    // Renderer / Gamma input

    var rendererGammaInput = new UI.THREE.Boolean(config.getKey('project/renderer/gammaInput'), 'γ input').onChange(function() {

        config.setKey('project/renderer/gammaInput', this.getValue());
        updateRenderer();

    });
    //rendererPropertiesRow.add( rendererGammaInput );

    // Renderer / Gamma output

    var rendererGammaOutput = new UI.THREE.Boolean(config.getKey('project/renderer/gammaOutput'), 'γ output').onChange(function() {

        config.setKey('project/renderer/gammaOutput', this.getValue());
        updateRenderer();

    });
    //rendererPropertiesRow.add( rendererGammaOutput );

    container.add(rendererPropertiesRow);

    var rule = new UI.HorizontalRule();
    container.add(rule);

    // UI BANNER
    console.log("Sidebar.Project.js: adding uibanner UI uibanner.getEnabled()=" + uibanner.getEnabled());
    console.log(uibanner);
    var uibannerRow = new UI.Row(); {
        var uibannerEnabled = new UI.Checkbox(editor.config.getKey(UIBuilder_Keys_Banner_Enabled)).onChange(uibuilderUpdate);
        var uibannerTexture = new UI.Texture(THREE.SphericalReflectionMapping).onChange(uibuilderUpdate);
        console.log("Sidebar.Project.js: Banner setting uibannerdomhidden: " + !uibannerEnabled.getValue());
        uibanner.dom.hidden = !uibannerEnabled.getValue();
        uibannerRow.add(new UI.Text('UI Banner').setWidth('90px'));
        uibannerRow.add(uibannerEnabled);
        uibannerRow.add(uibannerTexture);
    }
    container.add(uibannerRow);
    var uibannerRow2 = new UI.Row(); {
        var uibannerHeight = new UI.Input(editor.config.getKey(UIBuilder_Keys_Banner_Height)).setWidth('50px').onChange(uibuilderUpdate);
        uibannerRow2.add(new UI.Text('Height').setWidth('50px'));
        uibannerRow2.add(uibannerHeight);
        var uibannerColor = new UI.Color(editor.config.getKey(UIBuilder_Keys_Banner_BGColor)).onChange(uibuilderUpdate);
        uibannerRow2.add(new UI.Text('').setWidth('10px')); // spacer
        uibannerRow2.add(new UI.Text('BGColor').setWidth('50px'));
        uibannerRow2.add(new UI.Text('').setWidth('10px')); // spacer
        uibannerRow2.add(uibannerColor);
    }
    container.add(uibannerRow2);

    var uilogoRow = new UI.Row(); {
        var uilogoEnabled = new UI.Checkbox(editor.config.getKey(UIBuilder_Keys_Logo_Enabled)).onChange(uibuilderUpdate);
        var uilogoTexture = new UI.Texture(THREE.SphericalReflectionMapping).onChange(uibuilderUpdate);
        console.log("Sidebar.Project.js: Logo setting uibannerdomhidden: " + !uilogoEnabled.getValue());
        uilogo.dom.hidden = !uilogoEnabled.getValue();
        uilogoRow.add(new UI.Text('UI Logo').setWidth('90px'));
        uilogoRow.add(uilogoEnabled);
        uilogoRow.add(uilogoTexture);
    }
    container.add(uilogoRow);

    var uititleInputRow = new UI.Row(); {
        var uititleEnabled = new UI.Checkbox(editor.config.getKey(UIBuilder_Keys_Title_Enabled)).onClick(uibuilderUpdate).onChange(uibuilderUpdate);
        var uititleText = new UI.Input(editor.config.getKey(UIBuilder_Keys_Title_Text)).onClick(uibuilderUpdate).onChange(uibuilderUpdate);
        console.log("Sidebar.Project.js: Title setting uibannerdomhidden: " + !uititleEnabled.getValue());
        uititle.dom.hidden = !uititleEnabled.getValue();
        uititleInputRow.add(new UI.Text('UI Title').setWidth('90px'));
        uititleInputRow.add(uititleEnabled);
        uititleInputRow.add(uititleText);
    }
    container.add(uititleInputRow);

    var uititleInputRowb = new UI.Row(); {
        var uiPlayButtonEnabled = new UI.Checkbox(editor.config.getKey(UIBuilder_Keys_Button_Enabled)).onClick(uibuilderUpdate).onChange(uibuilderUpdate);
        console.log("Sidebar.Project.js: Title setting uibuttondomhidden: " + !uiPlayButtonEnabled.getValue());
        //uititle.dom.hidden = !uititleEnabled.getValue();
        uiplaybutton.dom.hidden = !uiPlayButtonEnabled.getValue();
        uititleInputRowb.add(new UI.Text('UI Play Button').setWidth('90px'));
        uititleInputRowb.add(uiPlayButtonEnabled);
    }
    container.add(uititleInputRowb);

    var uititleInputRow2 = new UI.Row(); {
        var uititleSize = new UI.Input(editor.config.getKey(UIBuilder_Keys_Title_Size)).setWidth('50px').onChange(uibuilderUpdate);
        uititleInputRow2.add(new UI.Text('Size').setWidth('50px'));
        uititleInputRow2.add(uititleSize);
        var uititleColor = new UI.Color(editor.config.getKey(UIBuilder_Keys_Title_TextColor)).onChange(uibuilderUpdate);
        uititleInputRow2.add(new UI.Text('').setWidth('10px')); // spacer
        uititleInputRow2.add(new UI.Text('Color').setWidth('50px'));
        uititleInputRow2.add(new UI.Text('').setWidth('10px')); // spacer
        uititleInputRow2.add(uititleColor);
    }
    container.add(uititleInputRow2);

    signals.editorCleared.add(updateFromConfig);
    signals.editorStorageGet.add(updateFromConfig);

    function uibuilderUpdate() {
        // Update UI Banner based on what is happening in the UI

        console.log("Sidebar.Project.js: uibuilderUpdate Begin: uibanner.getEnabled=" + uibanner.getEnabled());
        console.log(uititle);
        //console.log(uibannerTexture);
        //console.log(uibanner);
        //console.log(uilogo);

        // Get Enabled, Texture & TextureName Values From UI Controls
        var uibanner_enabled = uibannerEnabled.getValue();
        var uibanner_texture = uibannerTexture.texture.image.src;
        var uibanner_texturename = uibannerTexture.texture.sourceFile;
        var uibanner_height = uibannerHeight.getValue();
        var uibanner_color = uibannerColor.getValue();
        var uilogo_enabled = uilogoEnabled.getValue();
        var uilogo_texture = uilogoTexture.texture.image.src;
        var uilogo_texturename = uilogoTexture.texture.sourceFile;
        var uititle_enabled = uititleEnabled.getValue();
        var uititle_text = uititleText.getValue();
        var uititle_size = uititleSize.getValue();
        var uititle_color = uititleColor.getValue();

        // Save Enabled, Texture & Texture Name Values in Config
        config.setKey(UIBuilder_Keys_Banner_Enabled, uibanner_enabled);
        config.setKey(UIBuilder_Keys_Banner_Image, uibanner_texture);
        config.setKey(UIBuilder_Keys_Banner_ImageName, uibanner_texturename);
        config.setKey(UIBuilder_Keys_Banner_Height, uibanner_height);
        config.setKey(UIBuilder_Keys_Banner_BGColor, uibanner_color);
        config.setKey(UIBuilder_Keys_Logo_Enabled, uilogo_enabled);
        config.setKey(UIBuilder_Keys_Logo_Image, uilogo_texture);
        config.setKey(UIBuilder_Keys_Logo_ImageName, uilogo_texturename);
        config.setKey(UIBuilder_Keys_Title_Enabled, uititle_enabled);
        config.setKey(UIBuilder_Keys_Button_Enabled, uiPlayButtonEnabled.getValue());
        config.setKey(UIBuilder_Keys_Title_Text, uititle_text);
        config.setKey(UIBuilder_Keys_Title_Size, uititle_size);
        config.setKey(UIBuilder_Keys_Title_TextColor, uititle_color);

        // Set Value of Image Preview In Viewport
        if (uibannerTexture.texture.image != undefined) {
            uibannerTexture.texture.image.src.sourceFile = uibanner_texturename;
            console.log("Sidebar.Project.js: uibuilderUpdate: imageName=" + uibanner_texturename);
            console.log(uibanner);
            uibanner.setValue(UIBuilder_Fix_MissingImage(uibannerTexture.texture.image.src));
            uibanner.setHeight(uibanner_height);
            uibanner.dom.style.backgroundColor = uibanner_color;
        }

        if (uilogoTexture.texture.image != undefined) {
            uilogoTexture.texture.image.src.sourceFile = uilogo_texturename;
            console.log("Sidebar.Project.js: uibuilderUpdate: imageName=" + uilogo_texturename);
            console.log(uilogo);
            uilogo.setValue(UIBuilder_Fix_MissingImage(uilogoTexture.texture.image.src));
            //uilogo.setHeight(uibanner_height);
            //uilogo.setWidth(uibanner_height * 2);
            uilogo.dom.style.backgroundColor = '#00000000';
        }

        // Set Value for Title Settings in Viewport
        uititle.setValue(uititle_text);
        uititle.setHeight(uibanner_height);
        uititle.setFontSize(uititle_size);
        console.log(uititle);

        // Set UI Control Hidden
        uibanner.dom.hidden = !uibanner_enabled;
        uilogo.dom.hidden = !uilogo_enabled;
        if (!uititle_enabled)
            uititle.dom.style.color = '#00000000';
        else
            uititle.dom.style.color = uititle_color;

        uiplaybutton.dom.hidden = !uiPlayButtonEnabled.getValue();

        console.log("Sidebar.Project.js: uibuilderUpdate End: uibanner.getEnabled=" + uibanner.getEnabled() + " uilogo.enabled=" + uilogo_enabled);

        signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();

        updateRenderer();
    }

    function updateFromConfig() {
        // Read Config and update the user interface and viewport based on what is in the config store
        console.log("Sidebar.Project.js: updateFromConfig: Begin: uibanner.getEnabled()=" + uibanner.getEnabled());

        uibannerEnabled.setValue(editor.config.getKey(UIBuilder_Keys_Banner_Enabled));
        uilogoEnabled.setValue(editor.config.getKey(UIBuilder_Keys_Logo_Enabled));
        uititleEnabled.setValue(editor.config.getKey(UIBuilder_Keys_Title_Enabled));

        uititleSize.setValue(config.getKey(UIBuilder_Keys_Title_Size));
        uititleColor.setValue(config.getKey(UIBuilder_Keys_Title_TextColor));
        uibannerHeight.setValue(config.getKey(UIBuilder_Keys_Banner_Height));
        uibannerColor.setValue(config.getKey(UIBuilder_Keys_Banner_BGColor));
        uiPlayButtonEnabled.setValue(config.getKey(UIBuilder_Keys_Button_Enabled));

        var image = document.createElement('img');
        image.src = editor.config.getKey(UIBuilder_Keys_Banner_Image);
        var texture = new Object();
        texture.image = image;
        uibannerTexture.setValue(texture);
        uibannerTexture.setName(editor.config.getKey(UIBuilder_Keys_Banner_ImageName));
        if (uibannerTexture.texture.image != undefined)
            uibanner.setValue(uibannerTexture.texture.image.src);

        var limage = document.createElement('img');
        limage.src = editor.config.getKey(UIBuilder_Keys_Logo_Image);
        var texture = new Object();
        texture.image = limage;
        uilogoTexture.setValue(texture);
        uilogoTexture.setName(editor.config.getKey(UIBuilder_Keys_Logo_ImageName));
        if (uibannerTexture.texture.image != undefined)
            uibanner.setValue(uibannerTexture.texture.image.src);

        uibanner.dom.hidden = !editor.config.getKey(UIBuilder_Keys_Banner_Enabled);
        uilogo.dom.hidden = !editor.config.getKey(UIBuilder_Keys_Logo_Enabled);

        if (!editor.config.getKey(UIBuilder_Keys_Title_Enabled))
            uititle.dom.style.color = '#00000000';
        else
            uititle.dom.style.color = editor.config.getKey(UIBuilder_Keys_Title_TextColor);

        console.log(uilogo);
        console.log("Sidebar.Project.js: updateFromConfig: End: uibannerHidden=" + uibanner.dom.hidden + " imageName=" + editor.config.getKey(UIBuilder_Keys_Banner_ImageName));
    }

    function updateRenderer() {

        createRenderer(rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue(), rendererGammaInput.getValue(), rendererGammaOutput.getValue());

    }

    function createRenderer(type, antialias, shadows, gammaIn, gammaOut) {

        if (type === 'WebGLRenderer' && System.support.webgl === false) {

            type = 'CanvasRenderer';

        }

        //rendererPropertiesRow.setDisplay( type === 'WebGLRenderer' ? '' : 'none' );

        var renderer = new rendererTypes[type]({ antialias: antialias });
        renderer.gammaInput = gammaIn;
        renderer.gammaOutput = gammaOut;
        if (shadows && renderer.shadowMap) {

            console.log("Sidebar.Project.js: Shadows Enabled begin");
            renderer.shadowMapEnabled = true;
            renderer.shadowMapType = THREE.PCFSoftShadowMap;
            console.log("Sidebar.Project.js: Shadows Enabled end");
        } else
            console.log("Sidebar.Project.js: Shadows Disabled");

        signals.rendererChanged.dispatch(renderer);
    }

    createRenderer(config.getKey('project/renderer'), config.getKey('project/renderer/antialias'), config.getKey('project/renderer/shadows'), config.getKey('project/renderer/gammaInput'), config.getKey('project/renderer/gammaOutput'));

    return container;

};