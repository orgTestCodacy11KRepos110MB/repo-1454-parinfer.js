// Compiled by ClojureScript 1.7.122 {}
goog.provide('parinfer_site.core');
goog.require('cljs.core');
goog.require('parinfer_site.vcr_data');
goog.require('parinfer_site.editor_support');
goog.require('parinfer_site.toc');
goog.require('parinfer_site.parinfer');
goog.require('sablono.core');
goog.require('parinfer_site.vcr');
goog.require('clojure.string');
goog.require('om.core');
goog.require('parinfer_site.gears');
goog.require('parinfer_site.editor');
goog.require('parinfer_site.state');
cljs.core.enable_console_print_BANG_.call(null);
/**
 * get all lines (even empty ones)
 *   source: http://stackoverflow.com/a/29614863/142317
 */
parinfer_site.core.get_lines = (function parinfer_site$core$get_lines(text){
return clojure.string.split.call(null,text,/\n/,(-1));
});
parinfer_site.core.create_indent_before_after_BANG_ = (function parinfer_site$core$create_indent_before_after_BANG_(){
var cm_input = parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-indent-input",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mode","mode",654403691),"clojure-parinfer"], null));
var cm_output = parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-indent-output",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"readOnly","readOnly",-1749118317),true,new cljs.core.Keyword(null,"mode","mode",654403691),"clojure-parinfer"], null));
var sync_BANG_ = ((function (cm_input,cm_output){
return (function (){
return cm_output.setValue(new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(parinfer_site.parinfer.indent_mode.call(null,cm_input.getValue())));
});})(cm_input,cm_output))
;
if(cljs.core.truth_(cm_input)){
cm_input.on("change",sync_BANG_);

return sync_BANG_.call(null);
} else {
return null;
}
});
parinfer_site.core.create_paren_before_after_BANG_ = (function parinfer_site$core$create_paren_before_after_BANG_(){
var cm_input = parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-paren-input");
var cm_output = parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-paren-output",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"readOnly","readOnly",-1749118317),true,new cljs.core.Keyword(null,"mode","mode",654403691),"clojure-parinfer"], null));
var clear_marks_BANG_ = ((function (cm_input,cm_output){
return (function (cm){
var seq__22507 = cljs.core.seq.call(null,cm.getAllMarks());
var chunk__22508 = null;
var count__22509 = (0);
var i__22510 = (0);
while(true){
if((i__22510 < count__22509)){
var m = cljs.core._nth.call(null,chunk__22508,i__22510);
m.clear();

var G__22523 = seq__22507;
var G__22524 = chunk__22508;
var G__22525 = count__22509;
var G__22526 = (i__22510 + (1));
seq__22507 = G__22523;
chunk__22508 = G__22524;
count__22509 = G__22525;
i__22510 = G__22526;
continue;
} else {
var temp__4425__auto__ = cljs.core.seq.call(null,seq__22507);
if(temp__4425__auto__){
var seq__22507__$1 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__22507__$1)){
var c__17070__auto__ = cljs.core.chunk_first.call(null,seq__22507__$1);
var G__22527 = cljs.core.chunk_rest.call(null,seq__22507__$1);
var G__22528 = c__17070__auto__;
var G__22529 = cljs.core.count.call(null,c__17070__auto__);
var G__22530 = (0);
seq__22507 = G__22527;
chunk__22508 = G__22528;
count__22509 = G__22529;
i__22510 = G__22530;
continue;
} else {
var m = cljs.core.first.call(null,seq__22507__$1);
m.clear();

var G__22531 = cljs.core.next.call(null,seq__22507__$1);
var G__22532 = null;
var G__22533 = (0);
var G__22534 = (0);
seq__22507 = G__22531;
chunk__22508 = G__22532;
count__22509 = G__22533;
i__22510 = G__22534;
continue;
}
} else {
return null;
}
}
break;
}
});})(cm_input,cm_output))
;
var add_mark_BANG_ = ((function (cm_input,cm_output,clear_marks_BANG_){
return (function (cm,line_no,x,value,class_name){
var from = {"line": line_no, "ch": x};
var to = {"line": line_no, "ch": (x + cljs.core.count.call(null,value))};
var opts = {"className": class_name};
return cm.markText(from,to,opts);
});})(cm_input,cm_output,clear_marks_BANG_))
;
var diff_BANG_ = ((function (cm_input,cm_output,clear_marks_BANG_,add_mark_BANG_){
return (function (){
clear_marks_BANG_.call(null,cm_input);

clear_marks_BANG_.call(null,cm_output);

var in_lines = parinfer_site.core.get_lines.call(null,cm_input.getValue());
var out_lines = parinfer_site.core.get_lines.call(null,cm_output.getValue());
var seq__22511 = cljs.core.seq.call(null,cljs.core.map.call(null,cljs.core.vector,cljs.core.range.call(null),in_lines,out_lines));
var chunk__22512 = null;
var count__22513 = (0);
var i__22514 = (0);
while(true){
if((i__22514 < count__22513)){
var vec__22515 = cljs.core._nth.call(null,chunk__22512,i__22514);
var line_no = cljs.core.nth.call(null,vec__22515,(0),null);
var in$ = cljs.core.nth.call(null,vec__22515,(1),null);
var out = cljs.core.nth.call(null,vec__22515,(2),null);
var changes_22535 = JsDiff.diffChars(in$,out);
cljs.core.reduce.call(null,((function (seq__22511,chunk__22512,count__22513,i__22514,changes_22535,vec__22515,line_no,in$,out,in_lines,out_lines,cm_input,cm_output,clear_marks_BANG_,add_mark_BANG_){
return (function (p__22516,change){
var map__22517 = p__22516;
var map__22517__$1 = ((((!((map__22517 == null)))?((((map__22517.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22517.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22517):map__22517);
var result = map__22517__$1;
var in_x = cljs.core.get.call(null,map__22517__$1,new cljs.core.Keyword(null,"in-x","in-x",771816369));
var out_x = cljs.core.get.call(null,map__22517__$1,new cljs.core.Keyword(null,"out-x","out-x",-1435897095));
var value = (change["value"]);
var length = cljs.core.count.call(null,value);
if(cljs.core.truth_((change["added"]))){
add_mark_BANG_.call(null,cm_output,line_no,out_x,value,"inserted");

return cljs.core.update.call(null,result,new cljs.core.Keyword(null,"out-x","out-x",-1435897095),cljs.core._PLUS_,length);
} else {
if(cljs.core.truth_((change["removed"]))){
add_mark_BANG_.call(null,cm_input,line_no,in_x,value,"removed");

return cljs.core.update.call(null,result,new cljs.core.Keyword(null,"in-x","in-x",771816369),cljs.core._PLUS_,length);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"in-x","in-x",771816369),(in_x + length),new cljs.core.Keyword(null,"out-x","out-x",-1435897095),(out_x + length)], null);

}
}
});})(seq__22511,chunk__22512,count__22513,i__22514,changes_22535,vec__22515,line_no,in$,out,in_lines,out_lines,cm_input,cm_output,clear_marks_BANG_,add_mark_BANG_))
,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"in-x","in-x",771816369),(0),new cljs.core.Keyword(null,"out-x","out-x",-1435897095),(0)], null),changes_22535);

var G__22536 = seq__22511;
var G__22537 = chunk__22512;
var G__22538 = count__22513;
var G__22539 = (i__22514 + (1));
seq__22511 = G__22536;
chunk__22512 = G__22537;
count__22513 = G__22538;
i__22514 = G__22539;
continue;
} else {
var temp__4425__auto__ = cljs.core.seq.call(null,seq__22511);
if(temp__4425__auto__){
var seq__22511__$1 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__22511__$1)){
var c__17070__auto__ = cljs.core.chunk_first.call(null,seq__22511__$1);
var G__22540 = cljs.core.chunk_rest.call(null,seq__22511__$1);
var G__22541 = c__17070__auto__;
var G__22542 = cljs.core.count.call(null,c__17070__auto__);
var G__22543 = (0);
seq__22511 = G__22540;
chunk__22512 = G__22541;
count__22513 = G__22542;
i__22514 = G__22543;
continue;
} else {
var vec__22519 = cljs.core.first.call(null,seq__22511__$1);
var line_no = cljs.core.nth.call(null,vec__22519,(0),null);
var in$ = cljs.core.nth.call(null,vec__22519,(1),null);
var out = cljs.core.nth.call(null,vec__22519,(2),null);
var changes_22544 = JsDiff.diffChars(in$,out);
cljs.core.reduce.call(null,((function (seq__22511,chunk__22512,count__22513,i__22514,changes_22544,vec__22519,line_no,in$,out,seq__22511__$1,temp__4425__auto__,in_lines,out_lines,cm_input,cm_output,clear_marks_BANG_,add_mark_BANG_){
return (function (p__22520,change){
var map__22521 = p__22520;
var map__22521__$1 = ((((!((map__22521 == null)))?((((map__22521.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22521.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22521):map__22521);
var result = map__22521__$1;
var in_x = cljs.core.get.call(null,map__22521__$1,new cljs.core.Keyword(null,"in-x","in-x",771816369));
var out_x = cljs.core.get.call(null,map__22521__$1,new cljs.core.Keyword(null,"out-x","out-x",-1435897095));
var value = (change["value"]);
var length = cljs.core.count.call(null,value);
if(cljs.core.truth_((change["added"]))){
add_mark_BANG_.call(null,cm_output,line_no,out_x,value,"inserted");

return cljs.core.update.call(null,result,new cljs.core.Keyword(null,"out-x","out-x",-1435897095),cljs.core._PLUS_,length);
} else {
if(cljs.core.truth_((change["removed"]))){
add_mark_BANG_.call(null,cm_input,line_no,in_x,value,"removed");

return cljs.core.update.call(null,result,new cljs.core.Keyword(null,"in-x","in-x",771816369),cljs.core._PLUS_,length);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"in-x","in-x",771816369),(in_x + length),new cljs.core.Keyword(null,"out-x","out-x",-1435897095),(out_x + length)], null);

}
}
});})(seq__22511,chunk__22512,count__22513,i__22514,changes_22544,vec__22519,line_no,in$,out,seq__22511__$1,temp__4425__auto__,in_lines,out_lines,cm_input,cm_output,clear_marks_BANG_,add_mark_BANG_))
,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"in-x","in-x",771816369),(0),new cljs.core.Keyword(null,"out-x","out-x",-1435897095),(0)], null),changes_22544);

var G__22545 = cljs.core.next.call(null,seq__22511__$1);
var G__22546 = null;
var G__22547 = (0);
var G__22548 = (0);
seq__22511 = G__22545;
chunk__22512 = G__22546;
count__22513 = G__22547;
i__22514 = G__22548;
continue;
}
} else {
return null;
}
}
break;
}
});})(cm_input,cm_output,clear_marks_BANG_,add_mark_BANG_))
;
var sync_BANG_ = ((function (cm_input,cm_output,clear_marks_BANG_,add_mark_BANG_,diff_BANG_){
return (function (){
var in_text = cm_input.getValue();
var out_text = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(parinfer_site.parinfer.paren_mode.call(null,in_text));
cm_output.setValue(out_text);

return diff_BANG_.call(null);
});})(cm_input,cm_output,clear_marks_BANG_,add_mark_BANG_,diff_BANG_))
;
if(cljs.core.truth_(cm_input)){
cm_input.on("change",sync_BANG_);

return sync_BANG_.call(null);
} else {
return null;
}
});
parinfer_site.core.create_index_editors_BANG_ = (function parinfer_site$core$create_index_editors_BANG_(){
parinfer_site.editor.create_editor_BANG_.call(null,"code-intro-indent",new cljs.core.Keyword(null,"intro-indent","intro-indent",-813700553));

parinfer_site.editor.create_editor_BANG_.call(null,"code-intro-insert",new cljs.core.Keyword(null,"intro-insert","intro-insert",-230366434));

parinfer_site.editor.create_editor_BANG_.call(null,"code-intro-comment",new cljs.core.Keyword(null,"intro-comment","intro-comment",-769304496));

parinfer_site.editor.create_editor_BANG_.call(null,"code-intro-paredit",new cljs.core.Keyword(null,"intro-paredit","intro-paredit",841862079));

parinfer_site.editor.create_editor_BANG_.call(null,"code-intro-paren",new cljs.core.Keyword(null,"intro-paren","intro-paren",-775257330),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"parinfer-mode","parinfer-mode",-851652980),new cljs.core.Keyword(null,"paren-mode","paren-mode",-2068924645)], null));

parinfer_site.editor.create_editor_BANG_.call(null,"code-indent",new cljs.core.Keyword(null,"indent","indent",-148200125));

parinfer_site.editor.create_editor_BANG_.call(null,"code-indent-far",new cljs.core.Keyword(null,"indent-far","indent-far",-1792364104));

parinfer_site.editor.create_editor_BANG_.call(null,"code-indent-multi",new cljs.core.Keyword(null,"indent-multi","indent-multi",92834895));

parinfer_site.editor.create_editor_BANG_.call(null,"code-line",new cljs.core.Keyword(null,"line","line",212345235));

parinfer_site.editor.create_editor_BANG_.call(null,"code-comment",new cljs.core.Keyword(null,"comment","comment",532206069));

parinfer_site.editor.create_editor_BANG_.call(null,"code-wrap",new cljs.core.Keyword(null,"wrap","wrap",851669987));

parinfer_site.editor.create_editor_BANG_.call(null,"code-splice",new cljs.core.Keyword(null,"splice","splice",449588165));

parinfer_site.editor.create_editor_BANG_.call(null,"code-barf",new cljs.core.Keyword(null,"barf","barf",1329753296));

parinfer_site.editor.create_editor_BANG_.call(null,"code-slurp",new cljs.core.Keyword(null,"slurp","slurp",1288450555));

parinfer_site.editor.create_editor_BANG_.call(null,"code-string",new cljs.core.Keyword(null,"string","string",-1989541586));

parinfer_site.editor.create_editor_BANG_.call(null,"code-enter",new cljs.core.Keyword(null,"enter","enter",1792452624));

var opts_22549 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"readOnly","readOnly",-1749118317),true], null);
parinfer_site.editor.create_editor_BANG_.call(null,"code-warn-good",new cljs.core.Keyword(null,"warn-good","warn-good",-1077746036),opts_22549);

parinfer_site.editor.create_editor_BANG_.call(null,"code-warn-bad",new cljs.core.Keyword(null,"warn-bad","warn-bad",-2133697481),opts_22549);

parinfer_site.editor.create_editor_BANG_.call(null,"code-displaced",new cljs.core.Keyword(null,"displaced","displaced",-136492349));

parinfer_site.editor.create_editor_BANG_.call(null,"code-not-displaced",new cljs.core.Keyword(null,"not-displaced","not-displaced",-1750218077));

var opts_22550 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"parinfer-mode","parinfer-mode",-851652980),new cljs.core.Keyword(null,"paren-mode","paren-mode",-2068924645)], null);
parinfer_site.editor.create_editor_BANG_.call(null,"code-paren-tune",new cljs.core.Keyword(null,"paren-tune","paren-tune",-218999215),opts_22550);

parinfer_site.editor.create_editor_BANG_.call(null,"code-paren-frac",new cljs.core.Keyword(null,"paren-frac","paren-frac",858872585),opts_22550);

parinfer_site.editor.create_editor_BANG_.call(null,"code-paren-comment",new cljs.core.Keyword(null,"paren-comment","paren-comment",263180335),opts_22550);

parinfer_site.editor.create_editor_BANG_.call(null,"code-paren-wrap",new cljs.core.Keyword(null,"paren-wrap","paren-wrap",1218947070),opts_22550);

parinfer_site.editor.create_editor_BANG_.call(null,"code-displaced-after-balance",new cljs.core.Keyword(null,"displaced-after-balance","displaced-after-balance",449431016),opts_22550);

parinfer_site.editor.create_editor_BANG_.call(null,"code-not-displaced-on-enter",new cljs.core.Keyword(null,"not-displaced-on-enter","not-displaced-on-enter",-747667702),opts_22550);

parinfer_site.editor.create_editor_BANG_.call(null,"code-displaced-after-cursor-leaves",new cljs.core.Keyword(null,"displaced-after-cursor-leaves","displaced-after-cursor-leaves",-1478894415),opts_22550);

parinfer_site.editor.start_editor_sync_BANG_.call(null);

parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-c-expr",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mode","mode",654403691),"javascript"], null));

parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-lisp-expr");

parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-c-indent");

parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-lisp-indent");

parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-skim");

parinfer_site.editor.create_regular_editor_BANG_.call(null,"code-inspect",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"matchBrackets","matchBrackets",1256448936),true], null));

parinfer_site.core.create_indent_before_after_BANG_.call(null);

return parinfer_site.core.create_paren_before_after_BANG_.call(null);
});
parinfer_site.core.animate_when_visible_BANG_ = (function parinfer_site$core$animate_when_visible_BANG_(key_){
var G__22552 = cljs.core.get_in.call(null,cljs.core.deref.call(null,parinfer_site.state.state),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [key_,new cljs.core.Keyword(null,"watcher","watcher",2145165251)], null));
G__22552.enterViewport(((function (G__22552){
return (function (){
return parinfer_site.vcr.play_recording_BANG_.call(null,key_);
});})(G__22552))
);

G__22552.exitViewport(((function (G__22552){
return (function (){
return parinfer_site.vcr.stop_playing_BANG_.call(null,key_);
});})(G__22552))
);

return G__22552;
});
parinfer_site.core.index_anims = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"indent","indent",-148200125),new cljs.core.Keyword(null,"not-displaced","not-displaced",-1750218077),new cljs.core.Keyword(null,"displaced","displaced",-136492349),new cljs.core.Keyword(null,"wrap","wrap",851669987),new cljs.core.Keyword(null,"splice","splice",449588165),new cljs.core.Keyword(null,"displaced-after-balance","displaced-after-balance",449431016),new cljs.core.Keyword(null,"paren-frac","paren-frac",858872585),new cljs.core.Keyword(null,"not-displaced-on-enter","not-displaced-on-enter",-747667702),new cljs.core.Keyword(null,"warn-good","warn-good",-1077746036),new cljs.core.Keyword(null,"string","string",-1989541586),new cljs.core.Keyword(null,"intro-paren","intro-paren",-775257330),new cljs.core.Keyword(null,"paren-comment","paren-comment",263180335),new cljs.core.Keyword(null,"indent-multi","indent-multi",92834895),new cljs.core.Keyword(null,"enter","enter",1792452624),new cljs.core.Keyword(null,"intro-comment","intro-comment",-769304496),new cljs.core.Keyword(null,"barf","barf",1329753296),new cljs.core.Keyword(null,"displaced-after-cursor-leaves","displaced-after-cursor-leaves",-1478894415),new cljs.core.Keyword(null,"paren-tune","paren-tune",-218999215),new cljs.core.Keyword(null,"line","line",212345235),new cljs.core.Keyword(null,"comment","comment",532206069),new cljs.core.Keyword(null,"warn-bad","warn-bad",-2133697481),new cljs.core.Keyword(null,"intro-indent","intro-indent",-813700553),new cljs.core.Keyword(null,"indent-far","indent-far",-1792364104),new cljs.core.Keyword(null,"slurp","slurp",1288450555),new cljs.core.Keyword(null,"intro-insert","intro-insert",-230366434),new cljs.core.Keyword(null,"paren-wrap","paren-wrap",1218947070),new cljs.core.Keyword(null,"intro-paredit","intro-paredit",841862079)],[parinfer_site.vcr_data.indent,parinfer_site.vcr_data.not_displaced,parinfer_site.vcr_data.displaced,parinfer_site.vcr_data.wrap,parinfer_site.vcr_data.splice,parinfer_site.vcr_data.displaced_after_balance,parinfer_site.vcr_data.paren_frac,parinfer_site.vcr_data.not_displaced_on_enter,parinfer_site.vcr_data.warn_good,parinfer_site.vcr_data.string,parinfer_site.vcr_data.intro_paren,parinfer_site.vcr_data.paren_comment,parinfer_site.vcr_data.indent_multi,parinfer_site.vcr_data.enter,parinfer_site.vcr_data.comment_,parinfer_site.vcr_data.barf,parinfer_site.vcr_data.displaced_after_cursor_leaves,parinfer_site.vcr_data.paren_tune,parinfer_site.vcr_data.line,parinfer_site.vcr_data.comment_,parinfer_site.vcr_data.warn_bad,parinfer_site.vcr_data.indent_multi,parinfer_site.vcr_data.indent_far,parinfer_site.vcr_data.slurp_,parinfer_site.vcr_data.line,parinfer_site.vcr_data.paren_wrap,parinfer_site.vcr_data.intro_paredit]);
parinfer_site.core.load_index_anims_BANG_ = (function parinfer_site$core$load_index_anims_BANG_(){
cljs.core.swap_BANG_.call(null,parinfer_site.vcr.vcr,(function (data){
return cljs.core.reduce.call(null,(function (result,p__22561){
var vec__22562 = p__22561;
var key_ = cljs.core.nth.call(null,vec__22562,(0),null);
var state = cljs.core.nth.call(null,vec__22562,(1),null);
return cljs.core.update.call(null,result,key_,cljs.core.merge,state);
}),data,parinfer_site.core.index_anims);
}));

var seq__22563_22569 = cljs.core.seq.call(null,parinfer_site.core.index_anims);
var chunk__22564_22570 = null;
var count__22565_22571 = (0);
var i__22566_22572 = (0);
while(true){
if((i__22566_22572 < count__22565_22571)){
var vec__22567_22573 = cljs.core._nth.call(null,chunk__22564_22570,i__22566_22572);
var key__22574 = cljs.core.nth.call(null,vec__22567_22573,(0),null);
var __22575 = cljs.core.nth.call(null,vec__22567_22573,(1),null);
parinfer_site.core.animate_when_visible_BANG_.call(null,key__22574);

var G__22576 = seq__22563_22569;
var G__22577 = chunk__22564_22570;
var G__22578 = count__22565_22571;
var G__22579 = (i__22566_22572 + (1));
seq__22563_22569 = G__22576;
chunk__22564_22570 = G__22577;
count__22565_22571 = G__22578;
i__22566_22572 = G__22579;
continue;
} else {
var temp__4425__auto___22580 = cljs.core.seq.call(null,seq__22563_22569);
if(temp__4425__auto___22580){
var seq__22563_22581__$1 = temp__4425__auto___22580;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__22563_22581__$1)){
var c__17070__auto___22582 = cljs.core.chunk_first.call(null,seq__22563_22581__$1);
var G__22583 = cljs.core.chunk_rest.call(null,seq__22563_22581__$1);
var G__22584 = c__17070__auto___22582;
var G__22585 = cljs.core.count.call(null,c__17070__auto___22582);
var G__22586 = (0);
seq__22563_22569 = G__22583;
chunk__22564_22570 = G__22584;
count__22565_22571 = G__22585;
i__22566_22572 = G__22586;
continue;
} else {
var vec__22568_22587 = cljs.core.first.call(null,seq__22563_22581__$1);
var key__22588 = cljs.core.nth.call(null,vec__22568_22587,(0),null);
var __22589 = cljs.core.nth.call(null,vec__22568_22587,(1),null);
parinfer_site.core.animate_when_visible_BANG_.call(null,key__22588);

var G__22590 = cljs.core.next.call(null,seq__22563_22581__$1);
var G__22591 = null;
var G__22592 = (0);
var G__22593 = (0);
seq__22563_22569 = G__22590;
chunk__22564_22570 = G__22591;
count__22565_22571 = G__22592;
i__22566_22572 = G__22593;
continue;
}
} else {
}
}
break;
}

return scrollMonitor.recalculateLocations();
});
parinfer_site.core.base_gears = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"paren","paren",-294107600),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"x","x",2099068185),(280),new cljs.core.Keyword(null,"y","y",-1757859776),(70),new cljs.core.Keyword(null,"factor","factor",-2103172748),(96),new cljs.core.Keyword(null,"classes","classes",2037804510),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["paren-gear"], null),new cljs.core.Keyword(null,"caption","caption",-855383902),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"text","text",-1790561697),"change parens",new cljs.core.Keyword(null,"side","side",389652279),new cljs.core.Keyword(null,"left","left",-399115937)], null)], null),new cljs.core.Keyword(null,"indent","indent",-148200125),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"x","x",2099068185),(420),new cljs.core.Keyword(null,"y","y",-1757859776),(70),new cljs.core.Keyword(null,"factor","factor",-2103172748),(96),new cljs.core.Keyword(null,"classes","classes",2037804510),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["indent-gear"], null),new cljs.core.Keyword(null,"caption","caption",-855383902),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"text","text",-1790561697),"change indentation",new cljs.core.Keyword(null,"side","side",389652279),new cljs.core.Keyword(null,"right","right",-452581833)], null)], null)], null);
parinfer_site.core.svg_opts = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"width","width",-384071477),"100%",new cljs.core.Keyword(null,"height","height",1025178622),(170)], null);
parinfer_site.core.index_gears = new cljs.core.PersistentArrayMap(null, 3, ["naive-gears",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"svg-opts","svg-opts",1860471806),parinfer_site.core.svg_opts,new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"init-gears","init-gears",1422313814),parinfer_site.core.base_gears,new cljs.core.Keyword(null,"anim-frames","anim-frames",2117672923),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"paren","paren",-294107600),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),0.01], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(2000)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"paren","paren",-294107600),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),(0)], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(1000)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"indent","indent",-148200125),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),-0.01], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(2000)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"indent","indent",-148200125),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),(0)], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(1000)], null)], null)], null)], null),"helper-gears",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"svg-opts","svg-opts",1860471806),parinfer_site.core.svg_opts,new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"init-gears","init-gears",1422313814),cljs.core.merge.call(null,parinfer_site.core.base_gears,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"auto-indent","auto-indent",2046865160),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"x","x",2099068185),(465),new cljs.core.Keyword(null,"y","y",-1757859776),(116),new cljs.core.Keyword(null,"factor","factor",-2103172748),(48),new cljs.core.Keyword(null,"classes","classes",2037804510),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["auto-indent-gear"], null),new cljs.core.Keyword(null,"caption","caption",-855383902),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"text","text",-1790561697),"auto-indent",new cljs.core.Keyword(null,"side","side",389652279),new cljs.core.Keyword(null,"right","right",-452581833)], null)], null),new cljs.core.Keyword(null,"paredit","paredit",-1195358877),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"x","x",2099068185),(235),new cljs.core.Keyword(null,"y","y",-1757859776),(116),new cljs.core.Keyword(null,"factor","factor",-2103172748),(48),new cljs.core.Keyword(null,"classes","classes",2037804510),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["paredit-gear"], null),new cljs.core.Keyword(null,"caption","caption",-855383902),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"text","text",-1790561697),"paredit",new cljs.core.Keyword(null,"side","side",389652279),new cljs.core.Keyword(null,"left","left",-399115937)], null)], null)], null)),new cljs.core.Keyword(null,"anim-frames","anim-frames",2117672923),new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"auto-indent","auto-indent",2046865160),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"classes","classes",2037804510),new cljs.core.PersistentArrayMap(null, 1, ["invisible",false], null)], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(500)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"auto-indent","auto-indent",2046865160),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"power","power",-937852079),0.15,new cljs.core.Keyword(null,"classes","classes",2037804510),new cljs.core.PersistentArrayMap(null, 1, ["invisible",false], null)], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(500)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"auto-indent","auto-indent",2046865160),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),(0)], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(500)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"auto-indent","auto-indent",2046865160),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"classes","classes",2037804510),new cljs.core.PersistentArrayMap(null, 1, ["invisible",true], null)], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(1000)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"paredit","paredit",-1195358877),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),0.05], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(1000)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"paredit","paredit",-1195358877),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),(0)], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(1000)], null)], null)], null)], null),"parinfer-gears",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"svg-opts","svg-opts",1860471806),parinfer_site.core.svg_opts,new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"init-gears","init-gears",1422313814),cljs.core.merge.call(null,parinfer_site.core.base_gears,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"parinfer","parinfer",1893066885),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"x","x",2099068185),(350),new cljs.core.Keyword(null,"y","y",-1757859776),(95),new cljs.core.Keyword(null,"factor","factor",-2103172748),(64),new cljs.core.Keyword(null,"classes","classes",2037804510),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["parinfer-gear"], null),new cljs.core.Keyword(null,"caption","caption",-855383902),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"text","text",-1790561697),"Parinfer",new cljs.core.Keyword(null,"side","side",389652279),new cljs.core.Keyword(null,"bottom","bottom",-1550509018)], null)], null)], null)),new cljs.core.Keyword(null,"anim-frames","anim-frames",2117672923),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"indent","indent",-148200125),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),0.01], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(2000)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"indent","indent",-148200125),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),(0)], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(1000)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"paren","paren",-294107600),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),-0.01], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(2000)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gear-attrs","gear-attrs",525658925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"paren","paren",-294107600),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"power","power",-937852079),(0)], null)], null),new cljs.core.Keyword(null,"dt","dt",-368444759),(1000)], null)], null)], null)], null)], null);
parinfer_site.core.create_index_gears_BANG_ = (function parinfer_site$core$create_index_gears_BANG_(){
var seq__22604 = cljs.core.seq.call(null,parinfer_site.core.index_gears);
var chunk__22605 = null;
var count__22606 = (0);
var i__22607 = (0);
while(true){
if((i__22607 < count__22606)){
var vec__22608 = cljs.core._nth.call(null,chunk__22605,i__22607);
var id = cljs.core.nth.call(null,vec__22608,(0),null);
var map__22609 = cljs.core.nth.call(null,vec__22608,(1),null);
var map__22609__$1 = ((((!((map__22609 == null)))?((((map__22609.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22609.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22609):map__22609);
var data = cljs.core.get.call(null,map__22609__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var svg_opts = cljs.core.get.call(null,map__22609__$1,new cljs.core.Keyword(null,"svg-opts","svg-opts",1860471806));
parinfer_site.gears.create_gears_BANG_.call(null,[cljs.core.str("#"),cljs.core.str(id)].join(''),data,svg_opts);

var G__22614 = seq__22604;
var G__22615 = chunk__22605;
var G__22616 = count__22606;
var G__22617 = (i__22607 + (1));
seq__22604 = G__22614;
chunk__22605 = G__22615;
count__22606 = G__22616;
i__22607 = G__22617;
continue;
} else {
var temp__4425__auto__ = cljs.core.seq.call(null,seq__22604);
if(temp__4425__auto__){
var seq__22604__$1 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__22604__$1)){
var c__17070__auto__ = cljs.core.chunk_first.call(null,seq__22604__$1);
var G__22618 = cljs.core.chunk_rest.call(null,seq__22604__$1);
var G__22619 = c__17070__auto__;
var G__22620 = cljs.core.count.call(null,c__17070__auto__);
var G__22621 = (0);
seq__22604 = G__22618;
chunk__22605 = G__22619;
count__22606 = G__22620;
i__22607 = G__22621;
continue;
} else {
var vec__22611 = cljs.core.first.call(null,seq__22604__$1);
var id = cljs.core.nth.call(null,vec__22611,(0),null);
var map__22612 = cljs.core.nth.call(null,vec__22611,(1),null);
var map__22612__$1 = ((((!((map__22612 == null)))?((((map__22612.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22612.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22612):map__22612);
var data = cljs.core.get.call(null,map__22612__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var svg_opts = cljs.core.get.call(null,map__22612__$1,new cljs.core.Keyword(null,"svg-opts","svg-opts",1860471806));
parinfer_site.gears.create_gears_BANG_.call(null,[cljs.core.str("#"),cljs.core.str(id)].join(''),data,svg_opts);

var G__22622 = cljs.core.next.call(null,seq__22604__$1);
var G__22623 = null;
var G__22624 = (0);
var G__22625 = (0);
seq__22604 = G__22622;
chunk__22605 = G__22623;
count__22606 = G__22624;
i__22607 = G__22625;
continue;
}
} else {
return null;
}
}
break;
}
});
parinfer_site.core.render_index_BANG_ = (function parinfer_site$core$render_index_BANG_(){
parinfer_site.toc.init_BANG_.call(null);

parinfer_site.core.create_index_editors_BANG_.call(null);

parinfer_site.core.create_index_gears_BANG_.call(null);

parinfer_site.core.load_index_anims_BANG_.call(null);

return parinfer_site.vcr.render_controls_BANG_.call(null);
});
parinfer_site.core.render_dev_BANG_ = (function parinfer_site$core$render_dev_BANG_(){
parinfer_site.editor.create_editor_BANG_.call(null,"code-indent-mode",new cljs.core.Keyword(null,"indent-mode","indent-mode",1737814542));

parinfer_site.editor.create_editor_BANG_.call(null,"code-paren-mode",new cljs.core.Keyword(null,"paren-mode","paren-mode",-2068924645),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"parinfer-mode","parinfer-mode",-851652980),new cljs.core.Keyword(null,"paren-mode","paren-mode",-2068924645)], null));

return parinfer_site.editor.start_editor_sync_BANG_.call(null);
});
parinfer_site.core.state_viewer = (function parinfer_site$core$state_viewer(p__22626,owner){
var map__22676 = p__22626;
var map__22676__$1 = ((((!((map__22676 == null)))?((((map__22676.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22676.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22676):map__22676);
var postline_states = cljs.core.get.call(null,map__22676__$1,new cljs.core.Keyword(null,"postline-states","postline-states",1667653678));
var cursor_line = cljs.core.get.call(null,map__22676__$1,new cljs.core.Keyword(null,"cursor-line","cursor-line",-1089611007));
if(typeof parinfer_site.core.t_parinfer_site$core22678 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {om.core.IRender}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
parinfer_site.core.t_parinfer_site$core22678 = (function (state_viewer,p__22626,owner,map__22676,postline_states,cursor_line,meta22679){
this.state_viewer = state_viewer;
this.p__22626 = p__22626;
this.owner = owner;
this.map__22676 = map__22676;
this.postline_states = postline_states;
this.cursor_line = cursor_line;
this.meta22679 = meta22679;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
parinfer_site.core.t_parinfer_site$core22678.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (map__22676,map__22676__$1,postline_states,cursor_line){
return (function (_22680,meta22679__$1){
var self__ = this;
var _22680__$1 = this;
return (new parinfer_site.core.t_parinfer_site$core22678(self__.state_viewer,self__.p__22626,self__.owner,self__.map__22676,self__.postline_states,self__.cursor_line,meta22679__$1));
});})(map__22676,map__22676__$1,postline_states,cursor_line))
;

parinfer_site.core.t_parinfer_site$core22678.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (map__22676,map__22676__$1,postline_states,cursor_line){
return (function (_22680){
var self__ = this;
var _22680__$1 = this;
return self__.meta22679;
});})(map__22676,map__22676__$1,postline_states,cursor_line))
;

parinfer_site.core.t_parinfer_site$core22678.prototype.om$core$IRender$ = true;

parinfer_site.core.t_parinfer_site$core22678.prototype.om$core$IRender$render$arity$1 = ((function (map__22676,map__22676__$1,postline_states,cursor_line){
return (function (_){
var self__ = this;
var ___$1 = this;
return React.createElement("table",{"className": "state-table"},cljs.core.into_array.call(null,(function (){var iter__17039__auto__ = ((function (___$1,map__22676,map__22676__$1,postline_states,cursor_line){
return (function parinfer_site$core$state_viewer_$_iter__22685(s__22686){
return (new cljs.core.LazySeq(null,((function (___$1,map__22676,map__22676__$1,postline_states,cursor_line){
return (function (){
var s__22686__$1 = s__22686;
while(true){
var temp__4425__auto__ = cljs.core.seq.call(null,s__22686__$1);
if(temp__4425__auto__){
var s__22686__$2 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__22686__$2)){
var c__17037__auto__ = cljs.core.chunk_first.call(null,s__22686__$2);
var size__17038__auto__ = cljs.core.count.call(null,c__17037__auto__);
var b__22688 = cljs.core.chunk_buffer.call(null,size__17038__auto__);
if((function (){var i__22687 = (0);
while(true){
if((i__22687 < size__17038__auto__)){
var vec__22707 = cljs.core._nth.call(null,c__17037__auto__,i__22687);
var i = cljs.core.nth.call(null,vec__22707,(0),null);
var map__22708 = cljs.core.nth.call(null,vec__22707,(1),null);
var map__22708__$1 = ((((!((map__22708 == null)))?((((map__22708.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22708.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22708):map__22708);
var insert = cljs.core.get.call(null,map__22708__$1,new cljs.core.Keyword(null,"insert","insert",1286475395));
var stack = cljs.core.get.call(null,map__22708__$1,new cljs.core.Keyword(null,"stack","stack",-793405930));
cljs.core.chunk_append.call(null,b__22688,React.createElement("tr",{"className": ((cljs.core._EQ_.call(null,i,self__.cursor_line))?"active-line":null)},(function (){var attrs22681 = (i + (1));
return cljs.core.apply.call(null,React.createElement,"td",((cljs.core.map_QMARK_.call(null,attrs22681))?sablono.interpreter.attributes.call(null,sablono.util.merge_with_class.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"class","class",-2030961996),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["line-no"], null)], null),attrs22681)):{"className": "line-no"}),cljs.core.remove.call(null,cljs.core.nil_QMARK_,((cljs.core.map_QMARK_.call(null,attrs22681))?cljs.core.PersistentVector.EMPTY:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [sablono.interpreter.interpret.call(null,attrs22681)], null))));
})(),(function (){var attrs22682 = new cljs.core.Keyword(null,"line-dy","line-dy",41667486).cljs$core$IFn$_invoke$arity$1(insert);
return cljs.core.apply.call(null,React.createElement,"td",((cljs.core.map_QMARK_.call(null,attrs22682))?sablono.interpreter.attributes.call(null,sablono.util.merge_with_class.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"class","class",-2030961996),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["line-dy"], null)], null),attrs22682)):{"className": "line-dy"}),cljs.core.remove.call(null,cljs.core.nil_QMARK_,((cljs.core.map_QMARK_.call(null,attrs22682))?cljs.core.PersistentVector.EMPTY:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [sablono.interpreter.interpret.call(null,attrs22682)], null))));
})(),(function (){var attrs22683 = new cljs.core.Keyword(null,"x-pos","x-pos",-382213783).cljs$core$IFn$_invoke$arity$1(insert);
return cljs.core.apply.call(null,React.createElement,"td",((cljs.core.map_QMARK_.call(null,attrs22683))?sablono.interpreter.attributes.call(null,attrs22683):null),cljs.core.remove.call(null,cljs.core.nil_QMARK_,((cljs.core.map_QMARK_.call(null,attrs22683))?cljs.core.PersistentVector.EMPTY:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [sablono.interpreter.interpret.call(null,attrs22683)], null))));
})(),(function (){var attrs22684 = new cljs.core.Keyword(null,"string","string",-1989541586).cljs$core$IFn$_invoke$arity$1(cljs.core.reduce.call(null,((function (i__22687,vec__22707,i,map__22708,map__22708__$1,insert,stack,c__17037__auto__,size__17038__auto__,b__22688,s__22686__$2,temp__4425__auto__,___$1,map__22676,map__22676__$1,postline_states,cursor_line){
return (function (p__22710,p__22711){
var map__22712 = p__22710;
var map__22712__$1 = ((((!((map__22712 == null)))?((((map__22712.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22712.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22712):map__22712);
var result = map__22712__$1;
var next_x = cljs.core.get.call(null,map__22712__$1,new cljs.core.Keyword(null,"next-x","next-x",-1503991420));
var map__22713 = p__22711;
var map__22713__$1 = ((((!((map__22713 == null)))?((((map__22713.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22713.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22713):map__22713);
var x_pos = cljs.core.get.call(null,map__22713__$1,new cljs.core.Keyword(null,"x-pos","x-pos",-382213783));
var ch = cljs.core.get.call(null,map__22713__$1,new cljs.core.Keyword(null,"ch","ch",-554717905));
var pad = cljs.core.apply.call(null,cljs.core.str,cljs.core.repeat.call(null,(x_pos - next_x)," "));
return cljs.core.assoc.call(null,cljs.core.update.call(null,result,new cljs.core.Keyword(null,"string","string",-1989541586),cljs.core.str,pad,ch),new cljs.core.Keyword(null,"next-x","next-x",-1503991420),(x_pos + (1)));
});})(i__22687,vec__22707,i,map__22708,map__22708__$1,insert,stack,c__17037__auto__,size__17038__auto__,b__22688,s__22686__$2,temp__4425__auto__,___$1,map__22676,map__22676__$1,postline_states,cursor_line))
,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"next-x","next-x",-1503991420),(0),new cljs.core.Keyword(null,"string","string",-1989541586),""], null),stack));
return cljs.core.apply.call(null,React.createElement,"td",((cljs.core.map_QMARK_.call(null,attrs22684))?sablono.interpreter.attributes.call(null,attrs22684):null),cljs.core.remove.call(null,cljs.core.nil_QMARK_,((cljs.core.map_QMARK_.call(null,attrs22684))?cljs.core.PersistentVector.EMPTY:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [sablono.interpreter.interpret.call(null,attrs22684)], null))));
})()));

var G__22725 = (i__22687 + (1));
i__22687 = G__22725;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__22688),parinfer_site$core$state_viewer_$_iter__22685.call(null,cljs.core.chunk_rest.call(null,s__22686__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__22688),null);
}
} else {
var vec__22716 = cljs.core.first.call(null,s__22686__$2);
var i = cljs.core.nth.call(null,vec__22716,(0),null);
var map__22717 = cljs.core.nth.call(null,vec__22716,(1),null);
var map__22717__$1 = ((((!((map__22717 == null)))?((((map__22717.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22717.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22717):map__22717);
var insert = cljs.core.get.call(null,map__22717__$1,new cljs.core.Keyword(null,"insert","insert",1286475395));
var stack = cljs.core.get.call(null,map__22717__$1,new cljs.core.Keyword(null,"stack","stack",-793405930));
return cljs.core.cons.call(null,React.createElement("tr",{"className": ((cljs.core._EQ_.call(null,i,self__.cursor_line))?"active-line":null)},(function (){var attrs22681 = (i + (1));
return cljs.core.apply.call(null,React.createElement,"td",((cljs.core.map_QMARK_.call(null,attrs22681))?sablono.interpreter.attributes.call(null,sablono.util.merge_with_class.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"class","class",-2030961996),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["line-no"], null)], null),attrs22681)):{"className": "line-no"}),cljs.core.remove.call(null,cljs.core.nil_QMARK_,((cljs.core.map_QMARK_.call(null,attrs22681))?cljs.core.PersistentVector.EMPTY:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [sablono.interpreter.interpret.call(null,attrs22681)], null))));
})(),(function (){var attrs22682 = new cljs.core.Keyword(null,"line-dy","line-dy",41667486).cljs$core$IFn$_invoke$arity$1(insert);
return cljs.core.apply.call(null,React.createElement,"td",((cljs.core.map_QMARK_.call(null,attrs22682))?sablono.interpreter.attributes.call(null,sablono.util.merge_with_class.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"class","class",-2030961996),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["line-dy"], null)], null),attrs22682)):{"className": "line-dy"}),cljs.core.remove.call(null,cljs.core.nil_QMARK_,((cljs.core.map_QMARK_.call(null,attrs22682))?cljs.core.PersistentVector.EMPTY:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [sablono.interpreter.interpret.call(null,attrs22682)], null))));
})(),(function (){var attrs22683 = new cljs.core.Keyword(null,"x-pos","x-pos",-382213783).cljs$core$IFn$_invoke$arity$1(insert);
return cljs.core.apply.call(null,React.createElement,"td",((cljs.core.map_QMARK_.call(null,attrs22683))?sablono.interpreter.attributes.call(null,attrs22683):null),cljs.core.remove.call(null,cljs.core.nil_QMARK_,((cljs.core.map_QMARK_.call(null,attrs22683))?cljs.core.PersistentVector.EMPTY:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [sablono.interpreter.interpret.call(null,attrs22683)], null))));
})(),(function (){var attrs22684 = new cljs.core.Keyword(null,"string","string",-1989541586).cljs$core$IFn$_invoke$arity$1(cljs.core.reduce.call(null,((function (vec__22716,i,map__22717,map__22717__$1,insert,stack,s__22686__$2,temp__4425__auto__,___$1,map__22676,map__22676__$1,postline_states,cursor_line){
return (function (p__22719,p__22720){
var map__22721 = p__22719;
var map__22721__$1 = ((((!((map__22721 == null)))?((((map__22721.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22721.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22721):map__22721);
var result = map__22721__$1;
var next_x = cljs.core.get.call(null,map__22721__$1,new cljs.core.Keyword(null,"next-x","next-x",-1503991420));
var map__22722 = p__22720;
var map__22722__$1 = ((((!((map__22722 == null)))?((((map__22722.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22722.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__22722):map__22722);
var x_pos = cljs.core.get.call(null,map__22722__$1,new cljs.core.Keyword(null,"x-pos","x-pos",-382213783));
var ch = cljs.core.get.call(null,map__22722__$1,new cljs.core.Keyword(null,"ch","ch",-554717905));
var pad = cljs.core.apply.call(null,cljs.core.str,cljs.core.repeat.call(null,(x_pos - next_x)," "));
return cljs.core.assoc.call(null,cljs.core.update.call(null,result,new cljs.core.Keyword(null,"string","string",-1989541586),cljs.core.str,pad,ch),new cljs.core.Keyword(null,"next-x","next-x",-1503991420),(x_pos + (1)));
});})(vec__22716,i,map__22717,map__22717__$1,insert,stack,s__22686__$2,temp__4425__auto__,___$1,map__22676,map__22676__$1,postline_states,cursor_line))
,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"next-x","next-x",-1503991420),(0),new cljs.core.Keyword(null,"string","string",-1989541586),""], null),stack));
return cljs.core.apply.call(null,React.createElement,"td",((cljs.core.map_QMARK_.call(null,attrs22684))?sablono.interpreter.attributes.call(null,attrs22684):null),cljs.core.remove.call(null,cljs.core.nil_QMARK_,((cljs.core.map_QMARK_.call(null,attrs22684))?cljs.core.PersistentVector.EMPTY:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [sablono.interpreter.interpret.call(null,attrs22684)], null))));
})()),parinfer_site$core$state_viewer_$_iter__22685.call(null,cljs.core.rest.call(null,s__22686__$2)));
}
} else {
return null;
}
break;
}
});})(___$1,map__22676,map__22676__$1,postline_states,cursor_line))
,null,null));
});})(___$1,map__22676,map__22676__$1,postline_states,cursor_line))
;
return iter__17039__auto__.call(null,cljs.core.map_indexed.call(null,cljs.core.vector,self__.postline_states));
})()));
});})(map__22676,map__22676__$1,postline_states,cursor_line))
;

parinfer_site.core.t_parinfer_site$core22678.getBasis = ((function (map__22676,map__22676__$1,postline_states,cursor_line){
return (function (){
return new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"state-viewer","state-viewer",76240899,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"keys","keys",1068423698),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"postline-states","postline-states",-986782091,null),new cljs.core.Symbol(null,"cursor-line","cursor-line",550920520,null)], null)], null),new cljs.core.Symbol(null,"owner","owner",1247919588,null)], null)))], null)),new cljs.core.Symbol(null,"p__22626","p__22626",249319001,null),new cljs.core.Symbol(null,"owner","owner",1247919588,null),new cljs.core.Symbol(null,"map__22676","map__22676",155201078,null),new cljs.core.Symbol(null,"postline-states","postline-states",-986782091,null),new cljs.core.Symbol(null,"cursor-line","cursor-line",550920520,null),new cljs.core.Symbol(null,"meta22679","meta22679",281845935,null)], null);
});})(map__22676,map__22676__$1,postline_states,cursor_line))
;

parinfer_site.core.t_parinfer_site$core22678.cljs$lang$type = true;

parinfer_site.core.t_parinfer_site$core22678.cljs$lang$ctorStr = "parinfer-site.core/t_parinfer_site$core22678";

parinfer_site.core.t_parinfer_site$core22678.cljs$lang$ctorPrWriter = ((function (map__22676,map__22676__$1,postline_states,cursor_line){
return (function (this__16865__auto__,writer__16866__auto__,opt__16867__auto__){
return cljs.core._write.call(null,writer__16866__auto__,"parinfer-site.core/t_parinfer_site$core22678");
});})(map__22676,map__22676__$1,postline_states,cursor_line))
;

parinfer_site.core.__GT_t_parinfer_site$core22678 = ((function (map__22676,map__22676__$1,postline_states,cursor_line){
return (function parinfer_site$core$state_viewer_$___GT_t_parinfer_site$core22678(state_viewer__$1,p__22626__$1,owner__$1,map__22676__$2,postline_states__$1,cursor_line__$1,meta22679){
return (new parinfer_site.core.t_parinfer_site$core22678(state_viewer__$1,p__22626__$1,owner__$1,map__22676__$2,postline_states__$1,cursor_line__$1,meta22679));
});})(map__22676,map__22676__$1,postline_states,cursor_line))
;

}

return (new parinfer_site.core.t_parinfer_site$core22678(parinfer_site$core$state_viewer,p__22626,owner,map__22676__$1,postline_states,cursor_line,cljs.core.PersistentArrayMap.EMPTY));
});
parinfer_site.core.render_debug_state_BANG_ = (function parinfer_site$core$render_debug_state_BANG_(){
var temp__4425__auto__ = parinfer_site.editor.create_editor_BANG_.call(null,"code-editor",new cljs.core.Keyword(null,"editor","editor",-989377770),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"viewportMargin","viewportMargin",948056881),Infinity,new cljs.core.Keyword(null,"lineNumbers","lineNumbers",1374890941),true,new cljs.core.Keyword(null,"styleActiveLine","styleActiveLine",-677594147),true], null));
if(cljs.core.truth_(temp__4425__auto__)){
var cm = temp__4425__auto__;
parinfer_site.editor.start_editor_sync_BANG_.call(null);

return om.core.root.call(null,parinfer_site.core.state_viewer,parinfer_site.editor_support.get_prev_state.call(null,cm),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"target","target",253001721),document.getElementById("debug-state")], null));
} else {
return null;
}
});
parinfer_site.core.init_BANG_ = (function parinfer_site$core$init_BANG_(){
if(cljs.core.truth_(window.parinfer_devpage)){
return parinfer_site.core.render_dev_BANG_.call(null);
} else {
if(cljs.core.truth_(window.parinfer_debug_state)){
return parinfer_site.core.render_debug_state_BANG_.call(null);
} else {
return parinfer_site.core.render_index_BANG_.call(null);

}
}
});
parinfer_site.core.init_BANG_.call(null);

//# sourceMappingURL=core.js.map?rel=1450835341570