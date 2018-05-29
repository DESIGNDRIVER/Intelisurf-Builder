
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

var UIBuilder_Transparent_Pixel_Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOC0wNS0yOVQxMDowNTo4ODwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+UGl4ZWxtYXRvciAzLjc8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+NTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgphng8RAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII="

var UIBuilder_Build_Banner = function (content, container, editor) {
	
	console.log("UI.Banner.js: BuildingBanner");

	var enabled = editor.config.getKey( UIBuilder_Keys_Banner_Enabled );
	var image = editor.config.getKey( UIBuilder_Keys_Banner_Image );
	var imageName = editor.config.getKey( UIBuilder_Keys_Banner_ImageName );
	var height = editor.config.getKey( UIBuilder_Keys_Banner_Height );
	var bgcolor = editor.config.getKey( UIBuilder_Keys_Banner_BGColor );
	
	console.log("UI.Banner.js: FetchBanner: " + content + " " + enabled + " " + image);
	
	if ((image === '')||(image === undefined)||(image.startsWith("http:")))
	{
		image = UIBuilder_Transparent_Pixel_Image;
		editor.config.setKey( UIBuilder_Keys_Banner_Image, image);
	}
	
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