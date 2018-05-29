var UIBuilder_Keys_Title_Enabled = 'project/ui/title/enabled';
var UIBuilder_Keys_Title_Font = 'project/ui/title/font';
var UIBuilder_Keys_Title_Size = 'project/ui/title/size';
var UIBuilder_Keys_Title_TextColor = 'project/ui/title/textcolor';
var UIBuilder_Keys_Title_Text = 'project/ui/title/text';

var UIBuilder_Build_Title = function (content, container, editor) {
	
	console.log("UIBuilder.Title.js: BuildingBanner");

	var enabled = editor.config.getKey( UIBuilder_Keys_Title_Enabled );
	var text_color = editor.config.getKey( UIBuilder_Keys_Title_TextColor );
	var text = editor.config.getKey( UIBuilder_Keys_Title_Text );
	var size = editor.config.getKey( UIBuilder_Keys_Title_Size );
	var font = editor.config.getKey( UIBuilder_Keys_Title_Font );
	var height = editor.config.getKey( UIBuilder_Keys_Banner_Height );
	
	console.log("UIBuilder.Title.js: FetchBanner: content=" + content + " hidden=" + !enabled);
	
	uititle = new UI.Label( text ).setWidth('100%').setHeight(height);
	uititle.setPosition( 'absolute' );
	uititle.setLeft( container.Left );
	uititle.setTop( container.Top );
	uititle.setFontSize(size);
	uititle.dom.style.fontSize = size;
	uititle.dom.style.color = text_color;
	uititle.dom.style.verticalAlign = 'middle';
	uititle.dom.style.horizontalAlign = 'middle';
	
	// hidden doesn't work for this class
	//uititle.dom.hidden = !enabled;
	
	if (!enabled)
    	uititle.dom.style.color = '#00000000';
    else
    	uititle.dom.style.color = text_color;

	console.log("UIBuilder.Title.js: FetchBanner End: hidden=" + !enabled);
	console.log(uititle);
	
	return uititle;
}