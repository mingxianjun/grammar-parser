ace.define("ace/mode/customJson_highlight_rules", function (require, exports, module) {
    "use strict";
    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    var DroolsHighlightRules = function () {
        let keywordMapper = this.createKeywordMapper({
            "keyword":
                "school|grade|name|sex|telephone|email"
        }, "identifier");
        this.$rules = {
            "start" : [
                {token : keywordMapper,regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},
                {token: 'symbol',regex: /[\s]+(!|&&|\|\||AND|and|OR|or|NOT|not)[\s]+/},
                {token: 'number',regex: /[0-9]+/},
                {token: 'notes',regex: /\/\*/,next:'notes'}
            ],
            "notes":[
                {
                    token : "notes",
                    regex : /[^\/\*\\\\]+/
                },
                {
                    token : "notes",
                    regex : /\*\//,
                    next  : "start"
                },
                {
                    token : "notes",
                    regex : '[*]+'
                }
            ]
        };
    };
    oop.inherits(DroolsHighlightRules, TextHighlightRules);
    exports.DroolsHighlightRules = DroolsHighlightRules;
});

ace.define("ace/mode/customJson", function(require, exports, module) {
    "use strict";
    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var DroolsHighlightRules = require("./customJson_highlight_rules").DroolsHighlightRules;
    var DroolsMode = function(){
        this.HighlightRules = DroolsHighlightRules;
    };
    oop.inherits(DroolsMode, TextMode);
    (function() {
        this.$id = "ace/mode/customJson"
    }).call(DroolsMode.prototype),
        exports.Mode = DroolsMode;
});

