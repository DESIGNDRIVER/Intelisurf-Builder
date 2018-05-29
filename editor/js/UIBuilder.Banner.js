
var UIBuilder_Keys_Banner_Enabled = 'project/ui/banner/enabled';
var UIBuilder_Keys_Banner_Image = 'project/ui/banner/image';
var UIBuilder_Keys_Banner_ImageName = 'project/ui/banner/imagename';
var UIBuilder_Keys_Banner_Height = 'project/ui/banner/height';
var UIBuilder_Keys_Banner_BGColor = 'project/ui/banner/bgcolor';

var UIBuilder_Keys_Logo_Enabled = 'project/ui/logo/enabled';
var UIBuilder_Keys_Logo_Image = 'project/ui/logo/image';
var UIBuilder_Keys_Logo_ImageName = 'project/ui/logo/imagename';

var UIBuilder_Keys_Title_Enabled = 'project/ui/title/enabled';
var UIBuilder_Keys_Title_Font = 'project/ui/title/font';
var UIBuilder_Keys_Title_Size = 'project/ui/title/size';
var UIBuilder_Keys_Title_TextColor = 'project/ui/title/textcolor';
var UIBuilder_Keys_Title_Text = 'project/ui/title/text';

var UIBuilder_Keys_Button_Enabled = 'project/ui/button/enabled';
var UIBuilder_Keys_Button_Font = 'project/ui/button/font';
var UIBuilder_Keys_Button_TextColor = 'project/ui/button/textcolor';
var UIBuilder_Keys_Button_ProgressColor = 'project/ui/button/progresscolor';

var UIBuilder_Build_Banner = function (content, container, editor) {
	
	console.log("UI.Banner.js: BuildingBanner");

	var enabled = editor.config.getKey( UIBuilder_Keys_Banner_Enabled );
	var image = editor.config.getKey( UIBuilder_Keys_Banner_Image );
	var imageName = editor.config.getKey( UIBuilder_Keys_Banner_ImageName );
	var height = editor.config.getKey( UIBuilder_Keys_Banner_Height );
	var bgcolor = editor.config.getKey( UIBuilder_Keys_Banner_BGColor );
	
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