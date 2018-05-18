const app =  angular.module('mainApp',[]);
app.service('editorUtil',function () {
    return {
        editor:null,
        gp:null,
        init(selector){
            //-----解析 demo-----
            this.gp =  new GrammarParser({
                type:'lucene',//语言类型
                //字段列表 name:字段名 type:值类型
                fields: {
                    school:{type:'string'},
                    grade:{type:'enum',enumVal:[1,2,3,4,5,6]},
                    name:{type:'string'},
                    sex:{type:'integer'},
                    telephone:{type:'telephone'},
                    email:{type:'email'}
                }
            });

            this.editor = ace.edit(selector);
            this.editor.$blockScrolling = Infinity;
            this.editor.setOptions({wrap:'free',enableBasicAutocompletion: true, enableSnippets: true, enableLiveAutocompletion: true});
            this.editor.getSession().setMode('ace/mode/customJson');

            var langTools = ace.require("ace/ext/language_tools");
            // langTools.autocomplete

            this.editor.getSession().on('change',(evt,session) => {
                let content = session.doc.$lines.join('\n');
                let result = this.gp.parse(content);
                if(result.success){
                    //校验成功
                    console.log(result.res);
                    this.editor.getSession().setAnnotations([]);
                }else {
                    let row = evt.end.row;
                    if(evt.action !== 'insert')
                        row = evt.start.row;
                    this.showErrorInfo(result.error,row);
                }
            });

            return editor;
        },
        showErrorInfo(e,row){
            this.editor.getSession().setAnnotations([{
                row:row,
                column:0,
                text:e.name + '\n' + e.message,
                type:'error'
            }]);
        }
    }
});