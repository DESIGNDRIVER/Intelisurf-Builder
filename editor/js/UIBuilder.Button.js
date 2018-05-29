var UIBuilder_Keys_Button_Enabled = 'project/ui/button/enabled';
var UIBuilder_Keys_Button_Font = 'project/ui/button/font';
var UIBuilder_Keys_Button_TextColor = 'project/ui/button/textcolor';
var UIBuilder_Keys_Button_ProgressColor = 'project/ui/button/progresscolor';

var UIBuilder_Build_Button = function (content, container, editor) {
	
	console.log("UIBuilder.Button.js: BuildingBanner");

	var enabled = editor.config.getKey( UIBuilder_Keys_Button_Enabled );
	var font = editor.config.getKey( UIBuilder_Keys_Button_Font );
	var textColor = editor.config.getKey( UIBuilder_Keys_Button_TextColor );
	var progressColor = editor.config.getKey( UIBuilder_Keys_Button_ProgressColor );
	
	console.log("UIBuilder.Button.js: FetchBanner: content=" + content + " hidden=" + !enabled);

	uiplaybutton = new UI.Image( '', '30%', '30%' );
	//uiplaybutton.dom.style.paddingTop ='100%';
	uiplaybutton.setPosition( 'absolute' );
	uiplaybutton.setRight( 0 );
	uiplaybutton.setBottom( 0 );
	uiplaybutton.dom.style.backgroundColor = progressColor;
	
	uiplaybutton.dom.hidden = !enabled;

	console.log("UIBuilder.Button.js: FetchBanner End: hidden=" + !enabled);
	console.log(uiplaybutton);
	console.log(container);
	
	return uiplaybutton;
}