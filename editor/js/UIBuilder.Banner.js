
var UIBuilder_Keys_Banner_Enabled = 'project/ui/banner/enabled';
var UIBuilder_Keys_Banner_Image = 'project/ui/banner/image';

var UIBuilder_Build_Banner = function (content, container, editor) {
	console.log("UI.Banner.js: FetchBanner: " + content);
	
	var enabled = editor.config.getKey( UIBuilder_Keys_Banner_Enabled );
	var image = editor.config.getKey( UIBuilder_Keys_Banner_Image );
	
	uibanner = new UI.Image( image, '100%', '50px' );
	uibanner.setPosition( 'absolute' );
	uibanner.setLeft( container.Left );
	uibanner.setTop( container.Top );
	uibanner.dom.style.backgroundColor = "#333333";
	
	uibanner.dom.hidden = !enabled;

	console.log("UI.Banner.js: FetchBanner End: " + !enabled);
	console.log(uibanner);
	
	return uibanner;
}