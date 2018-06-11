const app =  angular.module('mainApp',[]);
app.service('editorUtil',function () {
    return {
        editor:null,
        gp:null,
        init(selector,type){
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
            //ace 配置
            this.editor = ace.edit(selector);
            this.editor.$blockScrolling = Infinity;
            this.editor.setOptions({wrap:'free',enableBasicAutocompletion: true, enableSnippets: true, enableLiveAutocompletion: true});
            let editorSession = this.editor.getSession();
            editorSession.setMode('ace/mode/customJson');
            //示例数据
            editorSession.setValue(tipsList[type]);

            //补全提示
            let autoList = autoListMap[type];
            let langTools = ace.require("ace/ext/language_tools");
            let _this = this;
            langTools.setCompleters([{
                getCompletions(editor,session,pos,prefix,callback,e){
                    let content = session.doc.$lines.join(''),index = pos.column;
                    for(let i=0;i<pos.row;i++){
                        index += session.doc.$lines[i].length;
                    }
                    if(!content || !(content.replace(/\s/g,'')))
                        return callback(null,autoList.statics);
                    else{
                        let key = _this.getKey(content,prefix,index);
                        if(key)
                            return callback(null,autoList.relation && autoList.relation[key] || []);
                        else
                            return callback(null,autoList.statics);
                    }
                }
            }]);

            editorSession.on('change',(evt,session) => {
                let content = session.doc.$lines.join('\n');
                let result = this.gp.parse(content);
                if(result.success){
                    //校验成功
                    console.log(result.res);
                    editorSession.setAnnotations([]);
                }else {
                    let row = evt.end.row;
                    if(evt.action !== 'insert')
                        row = evt.start.row;
                    this.showErrorInfo(result.error,row);
                }
            });

            return editor;
        },
        getKey(line,prefix,index){
            let key,quoIndex = this.initQuotes(line,index);
            //在双引号里面
            if(quoIndex.s){
                let kl = this.findChar(line,':',quoIndex.s,-1);
                key = this.findObjectKey(line.substring(0,kl));
            }
            return key && key.replace(/\"/g,'') || '';
        },
        findChar(str,key,i,next){
            if(str.charAt(i) === key) return i;
            if(i>0 && i<= str.length) return this.findChar(str,key,i+next,next);
            else
                return -1;
        },
        findObjectKey(str,notKey){
            let breakReg = /[\{}:,;\s\/\(\)\|&]/,key = '',strs = str.split('');
            for (let i=strs.length-1;i>=0;i--){
                if(breakReg.test(strs[i])) break;
                if(notKey && strs[i] == notKey) break;
                key = strs[i] + key;
            }
            return key;
        },
        initQuotes(str,index){
            let _s = str.split(''),start = null;
            for (let i = 0;i<_s.length;i++){
                if(_s[i] == '"'){
                    if (start == null){
                        if(i> index)
                            return false;
                        start = i;
                    }else {
                        if(i>=index)
                            return {s:start,e:i};
                        start = null;
                    }
                }
            }
            return false;
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

const autoListMap = {
    student:{
        statics:[
            {meta:'学校名称',caption:'school',value:'school:""'},
            {meta:'年级',caption:'grade',value:'grade:""'},
            {meta:'姓名',caption:'name',value:'name:""'},
            {meta:'性别',caption:'sex',value:'sex:""'},
            {meta:'电话',caption:'telephone',value:'telephone:""'},
            {meta:'邮箱',caption:'email',value:'email:""'}
        ]
    }
};
const tipsList = {
    student:'/**示例\nschool:"Sichuan University" && grade:1 && (name:"qin lee" || name:"lemon")\n*/'
};