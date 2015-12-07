// Compiled by ClojureScript 1.7.122 {}
goog.provide('parinfer_site.editor_support');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('parinfer.indent_mode');
goog.require('parinfer.paren_mode');
goog.require('parinfer_site.state');

/**
 * Custom data/methods for a CodeMirror editor.
 * @interface
 */
parinfer_site.editor_support.IEditor = function(){};

parinfer_site.editor_support.cm_key = (function parinfer_site$editor_support$cm_key(this$){
if((!((this$ == null))) && (!((this$.parinfer_site$editor_support$IEditor$cm_key$arity$1 == null)))){
return this$.parinfer_site$editor_support$IEditor$cm_key$arity$1(this$);
} else {
var x__16922__auto__ = (((this$ == null))?null:this$);
var m__16923__auto__ = (parinfer_site.editor_support.cm_key[goog.typeOf(x__16922__auto__)]);
if(!((m__16923__auto__ == null))){
return m__16923__auto__.call(null,this$);
} else {
var m__16923__auto____$1 = (parinfer_site.editor_support.cm_key["_"]);
if(!((m__16923__auto____$1 == null))){
return m__16923__auto____$1.call(null,this$);
} else {
throw cljs.core.missing_protocol.call(null,"IEditor.cm-key",this$);
}
}
}
});

parinfer_site.editor_support.get_prev_state = (function parinfer_site$editor_support$get_prev_state(this$){
if((!((this$ == null))) && (!((this$.parinfer_site$editor_support$IEditor$get_prev_state$arity$1 == null)))){
return this$.parinfer_site$editor_support$IEditor$get_prev_state$arity$1(this$);
} else {
var x__16922__auto__ = (((this$ == null))?null:this$);
var m__16923__auto__ = (parinfer_site.editor_support.get_prev_state[goog.typeOf(x__16922__auto__)]);
if(!((m__16923__auto__ == null))){
return m__16923__auto__.call(null,this$);
} else {
var m__16923__auto____$1 = (parinfer_site.editor_support.get_prev_state["_"]);
if(!((m__16923__auto____$1 == null))){
return m__16923__auto____$1.call(null,this$);
} else {
throw cljs.core.missing_protocol.call(null,"IEditor.get-prev-state",this$);
}
}
}
});

parinfer_site.editor_support.frame_updated_QMARK_ = (function parinfer_site$editor_support$frame_updated_QMARK_(this$){
if((!((this$ == null))) && (!((this$.parinfer_site$editor_support$IEditor$frame_updated_QMARK_$arity$1 == null)))){
return this$.parinfer_site$editor_support$IEditor$frame_updated_QMARK_$arity$1(this$);
} else {
var x__16922__auto__ = (((this$ == null))?null:this$);
var m__16923__auto__ = (parinfer_site.editor_support.frame_updated_QMARK_[goog.typeOf(x__16922__auto__)]);
if(!((m__16923__auto__ == null))){
return m__16923__auto__.call(null,this$);
} else {
var m__16923__auto____$1 = (parinfer_site.editor_support.frame_updated_QMARK_["_"]);
if(!((m__16923__auto____$1 == null))){
return m__16923__auto____$1.call(null,this$);
} else {
throw cljs.core.missing_protocol.call(null,"IEditor.frame-updated?",this$);
}
}
}
});

parinfer_site.editor_support.set_frame_updated_BANG_ = (function parinfer_site$editor_support$set_frame_updated_BANG_(this$,value){
if((!((this$ == null))) && (!((this$.parinfer_site$editor_support$IEditor$set_frame_updated_BANG_$arity$2 == null)))){
return this$.parinfer_site$editor_support$IEditor$set_frame_updated_BANG_$arity$2(this$,value);
} else {
var x__16922__auto__ = (((this$ == null))?null:this$);
var m__16923__auto__ = (parinfer_site.editor_support.set_frame_updated_BANG_[goog.typeOf(x__16922__auto__)]);
if(!((m__16923__auto__ == null))){
return m__16923__auto__.call(null,this$,value);
} else {
var m__16923__auto____$1 = (parinfer_site.editor_support.set_frame_updated_BANG_["_"]);
if(!((m__16923__auto____$1 == null))){
return m__16923__auto____$1.call(null,this$,value);
} else {
throw cljs.core.missing_protocol.call(null,"IEditor.set-frame-updated!",this$);
}
}
}
});

parinfer_site.editor_support.record_change_BANG_ = (function parinfer_site$editor_support$record_change_BANG_(this$,thing){
if((!((this$ == null))) && (!((this$.parinfer_site$editor_support$IEditor$record_change_BANG_$arity$2 == null)))){
return this$.parinfer_site$editor_support$IEditor$record_change_BANG_$arity$2(this$,thing);
} else {
var x__16922__auto__ = (((this$ == null))?null:this$);
var m__16923__auto__ = (parinfer_site.editor_support.record_change_BANG_[goog.typeOf(x__16922__auto__)]);
if(!((m__16923__auto__ == null))){
return m__16923__auto__.call(null,this$,thing);
} else {
var m__16923__auto____$1 = (parinfer_site.editor_support.record_change_BANG_["_"]);
if(!((m__16923__auto____$1 == null))){
return m__16923__auto____$1.call(null,this$,thing);
} else {
throw cljs.core.missing_protocol.call(null,"IEditor.record-change!",this$);
}
}
}
});

/**
 * Correctly position cursor after text that was just typed.
 *   We need this since reformatting the text can shift things forward past our cursor.
 */
parinfer_site.editor_support.update_cursor_BANG_ = (function parinfer_site$editor_support$update_cursor_BANG_(cm,change){
if(cljs.core._EQ_.call(null,"+input",change.origin)){
var selection_QMARK_ = cm.somethingSelected();
var text = clojure.string.join.call(null,"\n",change.text);
var from_x = change.from.ch;
var line_no = change.from.line;
var line = cm.getLine(line_no);
var insert_x = line.indexOf(text,from_x);
var after_x = (insert_x + cljs.core.count.call(null,text));
if(cljs.core.truth_(selection_QMARK_)){
return null;
} else {
if(cljs.core._EQ_.call(null,text,"\n")){
return null;
} else {
if(cljs.core._EQ_.call(null,text,";")){
return cm.setCursor(line_no,after_x);
} else {
if((cljs.core._EQ_.call(null,(-1),insert_x)) || ((insert_x > from_x))){
return cm.setCursor(line_no,from_x);
} else {
return null;

}
}
}
}
} else {
return null;
}
});
parinfer_site.editor_support.compute_cursor_dx = (function parinfer_site$editor_support$compute_cursor_dx(cursor,change){
if(cljs.core.truth_(change)){
var ignore_QMARK_ = cljs.core._EQ_.call(null,"+indenthack",change.origin);
if(ignore_QMARK_){
return (0);
} else {
var start_x = change.to.ch;
var new_lines = change.text;
var len_last_line = cljs.core.count.call(null,cljs.core.last.call(null,new_lines));
var end_x = (((cljs.core.count.call(null,new_lines) > (1)))?len_last_line:(len_last_line + change.from.ch));
return (end_x - start_x);
}
} else {
return null;
}
});
parinfer_site.editor_support.compute_cm_change = (function parinfer_site$editor_support$compute_cm_change(cm,change,options,prev_state){
var map__31063 = (cljs.core.truth_(change)?new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"start-line","start-line",-41746654),change.from.line,new cljs.core.Keyword(null,"end-line","end-line",1837326455),(change.to.line + (1)),new cljs.core.Keyword(null,"num-new-lines","num-new-lines",-1319642646),change.text.length], null):(function (){var start = new cljs.core.Keyword(null,"cursor-line","cursor-line",-1089611007).cljs$core$IFn$_invoke$arity$1(prev_state);
var end = (start + (1));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"start-line","start-line",-41746654),start,new cljs.core.Keyword(null,"end-line","end-line",1837326455),end,new cljs.core.Keyword(null,"num-new-lines","num-new-lines",-1319642646),(end - start)], null);
})());
var map__31063__$1 = ((((!((map__31063 == null)))?((((map__31063.cljs$lang$protocol_mask$partition0$ & (64))) || (map__31063.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__31063):map__31063);
var start_line = cljs.core.get.call(null,map__31063__$1,new cljs.core.Keyword(null,"start-line","start-line",-41746654));
var end_line = cljs.core.get.call(null,map__31063__$1,new cljs.core.Keyword(null,"end-line","end-line",1837326455));
var num_new_lines = cljs.core.get.call(null,map__31063__$1,new cljs.core.Keyword(null,"num-new-lines","num-new-lines",-1319642646));
var lines = (function (){var iter__17039__auto__ = ((function (map__31063,map__31063__$1,start_line,end_line,num_new_lines){
return (function parinfer_site$editor_support$compute_cm_change_$_iter__31065(s__31066){
return (new cljs.core.LazySeq(null,((function (map__31063,map__31063__$1,start_line,end_line,num_new_lines){
return (function (){
var s__31066__$1 = s__31066;
while(true){
var temp__4425__auto__ = cljs.core.seq.call(null,s__31066__$1);
if(temp__4425__auto__){
var s__31066__$2 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__31066__$2)){
var c__17037__auto__ = cljs.core.chunk_first.call(null,s__31066__$2);
var size__17038__auto__ = cljs.core.count.call(null,c__17037__auto__);
var b__31068 = cljs.core.chunk_buffer.call(null,size__17038__auto__);
if((function (){var i__31067 = (0);
while(true){
if((i__31067 < size__17038__auto__)){
var i = cljs.core._nth.call(null,c__17037__auto__,i__31067);
cljs.core.chunk_append.call(null,b__31068,cm.getLine(i));

var G__31069 = (i__31067 + (1));
i__31067 = G__31069;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__31068),parinfer_site$editor_support$compute_cm_change_$_iter__31065.call(null,cljs.core.chunk_rest.call(null,s__31066__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__31068),null);
}
} else {
var i = cljs.core.first.call(null,s__31066__$2);
return cljs.core.cons.call(null,cm.getLine(i),parinfer_site$editor_support$compute_cm_change_$_iter__31065.call(null,cljs.core.rest.call(null,s__31066__$2)));
}
} else {
return null;
}
break;
}
});})(map__31063,map__31063__$1,start_line,end_line,num_new_lines))
,null,null));
});})(map__31063,map__31063__$1,start_line,end_line,num_new_lines))
;
return iter__17039__auto__.call(null,cljs.core.range.call(null,start_line,(start_line + num_new_lines)));
})();
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"line-no","line-no",-666819466),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [start_line,end_line], null),new cljs.core.Keyword(null,"new-line","new-line",1060819447),lines], null);
});
/**
 * Correctly format the text from the given editor.
 */
parinfer_site.editor_support.fix_text_BANG_ = (function parinfer_site$editor_support$fix_text_BANG_(var_args){
var args__17332__auto__ = [];
var len__17325__auto___31076 = arguments.length;
var i__17326__auto___31077 = (0);
while(true){
if((i__17326__auto___31077 < len__17325__auto___31076)){
args__17332__auto__.push((arguments[i__17326__auto___31077]));

var G__31078 = (i__17326__auto___31077 + (1));
i__17326__auto___31077 = G__31078;
continue;
} else {
}
break;
}

var argseq__17333__auto__ = ((((1) < args__17332__auto__.length))?(new cljs.core.IndexedSeq(args__17332__auto__.slice((1)),(0))):null);
return parinfer_site.editor_support.fix_text_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__17333__auto__);
});

parinfer_site.editor_support.fix_text_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (cm,p__31072){
var map__31073 = p__31072;
var map__31073__$1 = ((((!((map__31073 == null)))?((((map__31073.cljs$lang$protocol_mask$partition0$ & (64))) || (map__31073.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__31073):map__31073);
var change = cljs.core.get.call(null,map__31073__$1,new cljs.core.Keyword(null,"change","change",-1163046502),null);
var use_cache_QMARK_ = cljs.core.get.call(null,map__31073__$1,new cljs.core.Keyword(null,"use-cache?","use-cache?",-81331778),false);
var current_text = cm.getValue();
var selection_QMARK_ = cm.somethingSelected();
var selections = cm.listSelections();
var cursor = cm.getCursor();
var scroller = cm.getScrollerElement();
var scroll_x = scroller.scrollLeft;
var scroll_y = scroller.scrollTop;
var options = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"cursor-line","cursor-line",-1089611007),cursor.line,new cljs.core.Keyword(null,"cursor-x","cursor-x",475204266),cursor.ch,new cljs.core.Keyword(null,"cursor-dx","cursor-dx",133069327),parinfer_site.editor_support.compute_cursor_dx.call(null,cursor,change)], null);
var key_ = parinfer_site.editor_support.cm_key.call(null,cm);
var mode = (function (){var or__16267__auto__ = cljs.core.get_in.call(null,cljs.core.deref.call(null,parinfer_site.state.state),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [key_,new cljs.core.Keyword(null,"mode","mode",654403691)], null));
if(cljs.core.truth_(or__16267__auto__)){
return or__16267__auto__;
} else {
return new cljs.core.Keyword(null,"indent-mode","indent-mode",1737814542);
}
})();
var prev_state = parinfer_site.editor_support.get_prev_state.call(null,cm);
var new_text = (function (){var G__31075 = (((mode instanceof cljs.core.Keyword))?mode.fqn:null);
switch (G__31075) {
case "indent-mode":
var result = (cljs.core.truth_((function (){var and__16255__auto__ = use_cache_QMARK_;
if(cljs.core.truth_(and__16255__auto__)){
return cljs.core.deref.call(null,prev_state);
} else {
return and__16255__auto__;
}
})())?parinfer.indent_mode.format_text_change.call(null,current_text,cljs.core.deref.call(null,prev_state),parinfer_site.editor_support.compute_cm_change.call(null,cm,change,options,cljs.core.deref.call(null,prev_state)),options):parinfer.indent_mode.format_text.call(null,current_text,options));
if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result))){
cljs.core.reset_BANG_.call(null,prev_state,new cljs.core.Keyword(null,"state","state",-1988618099).cljs$core$IFn$_invoke$arity$1(result));
} else {
}

return new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(result);

break;
case "paren-mode":
var result = parinfer.paren_mode.format_text.call(null,current_text,options);
return new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(result);

break;
default:
return null;

}
})();
cljs.core.swap_BANG_.call(null,parinfer_site.state.state,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [key_,new cljs.core.Keyword(null,"text","text",-1790561697)], null),new_text);

if(cljs.core.truth_(selection_QMARK_)){
cm.setSelections(selections);
} else {
cm.setCursor(cursor);
}

return cm.scrollTo(scroll_x,scroll_y);
});

parinfer_site.editor_support.fix_text_BANG_.cljs$lang$maxFixedArity = (1);

parinfer_site.editor_support.fix_text_BANG_.cljs$lang$applyTo = (function (seq31070){
var G__31071 = cljs.core.first.call(null,seq31070);
var seq31070__$1 = cljs.core.next.call(null,seq31070);
return parinfer_site.editor_support.fix_text_BANG_.cljs$core$IFn$_invoke$arity$variadic(G__31071,seq31070__$1);
});

//# sourceMappingURL=editor_support.js.map?rel=1449460869239