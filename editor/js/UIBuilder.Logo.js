var UIBuilder_Keys_Logo_Enabled = 'project/ui/logo/enabled';
var UIBuilder_Keys_Logo_Image = 'project/ui/logo/image';
var UIBuilder_Keys_Logo_ImageName = 'project/ui/logo/imagename';

var UIBuilder_Build_Logo = function (content, container, editor) {
	
	console.log("UIBuilder.Logo.js: BuildingBanner");

	var enabled = editor.config.getKey( UIBuilder_Keys_Logo_Enabled );
	var image = editor.config.getKey( UIBuilder_Keys_Logo_Image );
	var imageName = editor.config.getKey( UIBuilder_Keys_Logo_ImageName );
	var height = editor.config.getKey( UIBuilder_Keys_Banner_Height );
	
	console.log("UIBuilder.Logo.js: FetchBanner: content=" + content + " hidden=" + !enabled);
	
	if ((image === '')||(image === undefined)||(image.startsWith("http:")))
	{
		image = UIBuilder_Transparent_Pixel_Image;
		editor.config.setKey( UIBuilder_Keys_Logo_Image, image);
	}
	
	uilogo = new UI.Image( image, 'auto', height );
	//uilogo.dom.style.paddingTop = "100%";
	uilogo.setPosition( 'absolute' );
	uilogo.setLeft( 0);
	uilogo.setTop( 0);
	uilogo.dom.style.backgroundColor = '#00000000';
//	uilogo.dom.style.display = 'block';
//	uilogo.dom.style.marginLeft = 'auto';
//	uilogo.dom.style.marginRight = 'auto';
	//uilogo.setWidth('50%');
	uilogo.dom.hidden = !enabled;

	console.log("UIBuilder.Logo.js: FetchBanner End: hidden=" + !enabled);
	console.log(uilogo);
	
	return uilogo;
}