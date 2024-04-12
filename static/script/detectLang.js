(function($){

    $.browserLanguage = function(callback){
        var language;
        $.ajax({
            url: "/echorequest.php",
            dataType: "json",
            success: function(headers) {
                language = headers['HTTP_ACCEPT_LANGUAGE'].substring(0,2);
                callback(language);
            }
        });
    }

})(jQuery);

$.browserLanguage(function( language ) {
    if (document.cookie.search("from=btn") != -1) { return;}
    var url = window.location.href;
    if (language == "ru" && url.search("/ru") == -1) { window.location = "ru/"; }
    if (language != "ru" && url.search("/ru") != -1) { window.location = ""; }
})

$(function() {
    $(".langBtn").click(function(e){
        function setCookie(c_name,value,exdays) {
            var exdate=new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value= escape(value) + ((exdays==null) ? "" : "; path=/; expires="+exdate.toUTCString());
            document.cookie= c_name + "=" + c_value;
        }
        setCookie("from", "btn", 1);
    });
});
