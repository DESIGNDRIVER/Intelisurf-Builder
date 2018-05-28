
var UIBuilder_Keys_Banner_Enabled = 'project/ui/banner/enabled';
var UIBuilder_Keys_Banner_Image = 'project/ui/banner/image';

var UIBuilder_Build_Banner = function (content, container, editor) {
	
	console.log("UI.Banner.js: BuildingBanner");

	var enabled = editor.config.getKey( UIBuilder_Keys_Banner_Enabled );
	var image = editor.config.getKey( UIBuilder_Keys_Banner_Image );
	
	console.log("UI.Banner.js: FetchBanner: " + content + " " + enabled);
	
	uibanner = new UI.Image( image, '100%', '50px' );
	uibanner.setPosition( 'absolute' );
	uibanner.setLeft( container.Left );
	uibanner.setTop( container.Top );
	uibanner.dom.style.backgroundColor = "#333333";
	
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
		console.log("UIBuilderBanner.js: getEnabled: " + editor.config.getKey(UIBuilder_Keys_Banner_Enabled));
		return editor.config.getKey(UIBuilder_Keys_Banner_Enabled);
	}

	function setEnabled(enabled)
	{
		console.log("UIBuilderBanner.js: setEnabled: " + enabled);
		editor.config.setKey(UIBuilder_Keys_Banner_Enabled, enabled);
	}
	
	function getImage()
	{
		return editor.config.getKey(UIBuilder_Keys_Banner_Image);
	}

	function setImage(image)
	{
		console.log("UIBuilderBanner.js: setImage: " + image);
		editor.config.setKey(UIBuilder_Keys_Banner_Image, image);
	}
}