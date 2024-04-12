$.fn.fancybox.defaults = {
    padding : $(window).width() > 1023 ? 50 : 20,
    margin : $(window).width() > 1023 ? 40 : 10,
    opacity : false,
    modal : false,
    cyclic : false,
    scrolling : 'auto',    // 'auto', 'yes' or 'no'

    width : 560,
    height : 340,

    autoScale : true,
    autoDimensions : true,
    centerOnScroll : false,

    ajax : {},
    swf : { wmode: 'transparent' },

    hideOnOverlayClick : true,
    hideOnContentClick : false,

    overlayShow : true,
    overlayOpacity : 0.7,
    overlayColor : '#000',

    titleShow : true,
    titlePosition : 'float', // 'float', 'outside', 'inside' or 'over'
    titleFormat : null,
    titleFromAlt : false,

    transitionIn : 'fade', // 'elastic', 'fade' or 'none'
    transitionOut : 'fade', // 'elastic', 'fade' or 'none'

    speedIn : 300,
    speedOut : 300,

    changeSpeed : 300,
    changeFade : 'fast',

    easingIn : 'swing',
    easingOut : 'swing',

    showCloseButton     : true,
    showNavArrows : true,
    enableEscapeButton : true,
    enableKeyboardNav : true,

    onStart : function() {
    },
    onCancel : function() {
    },
    onComplete : function() {
    },
    onCleanup : function() {
    },
    onClosed : function() {
    },
    onError : function() {
    }
}
