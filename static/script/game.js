(function () {
    "use strict";
    var App = window.App = function (poetry, perSection, onComplete, onError, onAction, $problem, $result) {
        this.isError = false;
        this.perSection = perSection;
        this.onAction = onAction;
        this.onComplete = onComplete;
        this.onError = onError;
        this.$problem = $problem;
        this.$result = $result;
        this.curItem = 0;
        this.curSection = 0;
        this.mistakes = 0;
        this.text = poetry;
        this.textWithSpans = "";
        this.longWords = 0;
        this.missedWords = [];
        this.sections = this.parsePoetry();
    };


    App.prototype.missWords = function () {
        var numOfMissedWords = Math.round(this.longWords/2);
        var arr = [], missedNum = [];
        for (var i=0;i<this.longWords;i++) {
            arr.push(i);
        }
        var missedNum = $.shuffle(arr).slice(0, numOfMissedWords).sort(function(a,b){return a - b});
        var txtInSects = this.textWithSpans.split("<br /><br />");
        var $tmp = $("<p />"), before = 0;
        for (var sectN in txtInSects) {
            this.missedWords[sectN] = [];
            $tmp.html(txtInSects[sectN]);
            var spans = $tmp.find("span");
            for (var i in missedNum) {
                if (missedNum[i] >= before && missedNum[i] < before + spans.length) {
                    var $elem = $(spans[missedNum[i]- before]);
                    this.missedWords[sectN].push($elem.text());
                    $elem.text("").addClass("underlined");
                }
            }
            before+= spans.length;
            this.$result.html(this.$result.html() + "<br /><br />" + $tmp.html());
        }
        this.renderWordsSect(this.curSection);
        this.$result.find("span.underlined").first().addClass("highlight");
    };


    App.prototype.renderWordsSect = function(num) {
        this.$problem.text("");
        var cp = this.missedWords[num].slice();
        if (cp.length == 0) { //if no words in section
            this.curSection++;
            this.curItem = 0;
            if (this.curSection == this.sections.length) {
                this.onComplete();
                return;
            }
            this.renderWordsSect(me.curSection);
        }
        cp.sort();
        var me = this;
        $.each(cp, function() {
            $('<span/>').appendTo(me.$problem).text(this.toString()+ " ").click(function() {
                if (!this.clicked) {
                    this.clicked = true;
                } else {
                    return;
                }
                var elem = this;
                var myText = $.trim($(this).text()), $this = $(this);
                var isCorrect = (me.missedWords[me.curSection][me.curItem] == myText);
                var isFirst = me.curSection == 0 && me.curItem == 0;
                if (isCorrect) {
                    me.$result.find("span.underlined").first().jReplaceWithSpanText($this, function() {});
                    me.curItem++;
                    if (me.curItem == me.missedWords[me.curSection].length) {
                        me.curSection++;
                        me.curItem = 0;
                        if (me.curSection == me.sections.length) {
                            setTimeout(me.onComplete, 500);
                            elem.clicked = false;
                            return;
                        }
                        me.renderWordsSect(me.curSection);
                    }
                    me.onAction(isCorrect, isFirst);
                    var $nextSpan = me.$result.find("span.underlined").first();
                    $nextSpan.addClass("highlight");
                    me.$result.scrollTop(me.$result.scrollTop() + $nextSpan.position().top - me.$result.height()/2);
                    elem.clicked = false;
                    return;
                } else {
                    me.mistakes++;
                    $this.addClass("wrong");
                    $this.jShakeInline({direction: "down"}, 100, function() {
                        $this.removeClass("wrong");
                        me.onAction(isCorrect, isFirst);
                        elem.clicked = false;
                        return;
                    });
                }
            });
        });
    };

    App.prototype.parsePoetry = function () {
        var arr = this.text.split(/\n+/);
        var sections = [], section = [], line=[], lineNum = 0, textWithSpans="";
        this.longWords = 0;
        for (var b in arr) {
            arr[b] = $.trim(arr[b]);
            var words = arr[b].split(/\s+/);
            if (words.length == 1 && words[0] == "") {continue; }
            if (section.length == this.perSection) {
                sections.push(section);
                textWithSpans += "<br />";
                section = [];
            }
            line = [];
            for (var word in words) {
                if (words[word].length > 3) {
                    textWithSpans += "<span>" + words[word] + "</span> ";
                    this.longWords++;
                } else {
                    textWithSpans += words[word] + " ";
                }
                line.push(words[word]);
            }
            textWithSpans += "<br />";
            section.push(line);
            var tmp = $.trim(line.join("")).length;
            if (tmp > 46) {
                this.isError = true;
                this.onError("big_line");
                return [];
            }
            lineNum++;
        }
        this.textWithSpans = textWithSpans;
        if (section.length > 0) {
            sections.push(section);
        }
        if (lineNum < 4) {
            this.isError = true;
            this.onError("small_text");
        }
        if (this.longWords < 4) {
            this.isError = true;
            this.onError("small_words");
        }
        return sections;
    };

    App.prototype.cleanUp = function () {
        this.$problem.text('');
        this.$result.text('');
        this.$result.scrollTop();
    };

    App.prototype.shuffle = function(num) {
        if (isNaN(num)) {
            num = 0;
        }
        this.$problem.text("");
        var cp = this.sections[num].slice();
        $.shuffle(cp);
        var $ul = $('<ul/>');
        $.each(cp, function() {
            $('<li/>').appendTo($ul).text(this.join(" ").toString());
        });
        this.$problem.append($ul);
        var me = this;

        this.$problem.find("ul > li").click(function() {
            if (!this.clicked) {
                this.clicked = true;
            } else {
                return;
            }
            var elem = this;
            var isCorrect = $(this).text() == me.sections[me.curSection][me.curItem].join(" ");
            var isFirst = me.curSection == 0 & me.curItem == 0;
            if (!isCorrect) {
                me.mistakes++;
                var $this = $(this);
                $this.addClass("wrong");
                $this.jShakeInline({direction: "down"}, 100, function() {
                    $this.removeClass("wrong");
                    me.onAction(isCorrect, isFirst);
                    elem.clicked = false;
                });
                return;
            } else {
                if (me.curItem == 0 && me.curSection == 0) {
                    me.$result.text('');
                }
                me.curItem ++;
                var curSect = me.sections[me.curSection];
                var $this = $(this);
                var $parent = $this.parent();
                me.$result.scrollTop(me.$result.prop("scrollHeight"));
                $this.jAppendTo(me.$result, function() {
                    $this.effect("bounce", {direction: "up"}, 150);
                    if (me.curItem % me.perSection == 0) {
                        $parent.remove();
                        me.$result.append($("<li />").html("&nbsp;"));
                    }
                    if (me.curItem > curSect.length - 1) {
                        me.curItem = 0;
                        me.curSection += 1;
                        if (me.curSection > me.sections.length - 1) {
                            setTimeout(me.onComplete, 300);
                            elem.clicked = false;
                            return;
                        }
                        me.shuffle(me.curSection);
                    }
                    me.onAction(isCorrect, isFirst);
                });
            }
        });
    };

})();

