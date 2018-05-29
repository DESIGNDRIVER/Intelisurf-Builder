
var UIBuilder_Keys_Banner_Enabled = 'project/ui/banner/enabled';
var UIBuilder_Keys_Banner_Image = 'project/ui/banner/image';
var UIBuilder_Keys_Banner_ImageName = 'project/ui/banner/imagename';
var UIBuilder_Keys_Banner_Height = 'project/ui/banner/height';
var UIBuilder_Keys_Banner_BGColor = 'project/ui/banner/bgcolor';

var UIBuilder_Build_Banner = function (content, container, editor) {
	
	console.log("UI.Banner.js: BuildingBanner");

	var enabled = editor.config.getKey( UIBuilder_Keys_Banner_Enabled );
	var image = editor.config.getKey( UIBuilder_Keys_Banner_Image );
	var imageName = editor.config.getKey( UIBuilder_Keys_Banner_ImageName );
	var height = editor.config.getKey( UIBuilder_Keys_Banner_Height );
	var bgcolor = editor.config.getKey( UIBuilder_Keys_Banner_BGColor );
	
	console.log("UI.Banner.js: FetchBanner: " + content + " " + enabled);
	editor.config.setKey( UIBuilder_Keys_Banner_Image, UIBuilder_Fix_MissingImage(image));
	
	uibanner = new UI.Image( image, '100%', height );
	uibanner.setPosition( 'absolute' );
	uibanner.setLeft( container.Left );
	uibanner.setTop( container.Top );
	uibanner.dom.style.backgroundColor = bgcolor;
	
	uibanner.dom.hidden = !enabled;
	
	uibanner.getEnabled = getEnabled;
	uibanner.setEnabled = setEnabled;
	uibanner.getImage = getImage;
	uibanner.setImage = setImage;

	console.log("UI.Banner.js: FetchBanner End: " + !enabled);
	console.log(uibanner);
	
	return uibanner;
	
	function getEnabled()
	{
		return editor.config.getKey(UIBuilder_Keys_Banner_Enabled);
	}

	function setEnabled(enabled)
	{
		editor.config.setKey(UIBuilder_Keys_Banner_Enabled, enabled);
	}
	
	function getImage()
	{
		return editor.config.getKey(UIBuilder_Keys_Banner_Image);
	}

	function setImage(image)
	{
		editor.config.setKey(UIBuilder_Keys_Banner_Image, image);
	}
}