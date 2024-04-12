(function( $ ){
    $.fn.jAppendTo = function( whereTo, onComplete ) {
        return this.each(function() {
            var $this = $(this);
            var posFrom = $this.position();
            var clone = $this.clone().appendTo($this.parent());
            var hole = $this.clone().insertBefore($this).css("visibility", "hidden");
            $this.css('visibility','hidden').appendTo(whereTo);
            var posTo = $this.position();
            clone.addClass("hovered")
                .css('position', 'absolute')
                .css('left', posFrom.left)
                .css('top', posFrom.top)
                .animate({left: posTo.left, top: posTo.top, opacity: 0.3}, 300, function(){
                    clone.remove();
                    $this.css('visibility','visible').show().unbind();
                    onComplete();
                });
        });
    };

    $.fn.jShakeInline = function(options, time, onComplete) {
        time = time || 300;
        return this.each(function() {
            var $toShake = $(this);
            var $clone = $toShake.clone();
            $toShake.before($clone);
            var $wrapper = $("<div />")
                .css({display: "inline-block"})
                .append($toShake);
            $clone.replaceWith($wrapper);
            $toShake.effect('bounce', options, time, function() {
                    $wrapper.replaceWith($toShake);
                    onComplete();
                });
        });
    };

    $.fn.jReplaceWithSpanText = function( what, onComplete ) {
        return this.each(function() {
            var $span = $(what),
                $wrapper = $("<div />").css({display: "inline-block"});
            $(this).replaceWith($wrapper);
            $span.jAppendTo($wrapper, function() {
                var margin = Math.round($wrapper.width()*0.2);
                $wrapper.css({marginRight: margin + "px"});
                $span.effect('bounce', {times:2, direction: "right"}, 300, function() {
                    $wrapper.animate({marginRight:0}, 100, function(){
                        $wrapper.replaceWith($span.text());
                    });
                    onComplete();
                });
            });
        });
    };
})( jQuery );