ace.define("ace/mode/customJson_highlight_rules", function (require, exports, module) {
    "use strict";
    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    var DroolsHighlightRules = function () {
        this.$rules = {
            "start" : [
                {token: 'keyword',regex: /[a-zA-Z0-9]/},
                {token: 'symbol',regex: /[\s]+(-|&&|\|\||AND|OR|NOT)[\s]+/},
                {token: 'number',regex: /:[a-zA-Z0-9\.<>]+/},
                {token: 'notes',regex: /\/\*/,next:'notes'},
                {token: 'string',regex: '"',next:'string'}
            ],
            "string":[
                {
                    token : "constant.language.escape",
                    regex : /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\\\/bfnrt])/
                }, {
                    token : "number",
                    regex : '[^"\\\\]+'
                }, {
                    token : "string",
                    regex : '"',
                    next  : "start"
                }, {
                    token : "string",
                    regex : ":",
                    next  : "start"
                }
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

