(function(){
"use strict";

/* ============================================================
   CONSTANTS
   ============================================================ */
var MODULES = [
  {id:'calendar', label:'Calendar', icon:'calendar'},
  {id:'today', label:'Today', icon:'sun'},
  {id:'notes', label:'Notes', icon:'note'},
  {id:'journal', label:'Journal', icon:'book'},
  {id:'todos', label:'To-Dos', icon:'check'},
  {id:'habits', label:'Habits', icon:'flame'},
  {id:'goals', label:'Goals', icon:'target'},
  {id:'settings', label:'Settings', icon:'gear'}
];

var ICONS = {
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  note:'<path d="M9 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11z"/><path d="M9 3v6a2 2 0 0 0 2 2h6z"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  check:'<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  flame:'<path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.3-2-1-3 1 0 3 2 3 6a6 6 0 0 1-12 0c0-4 2-6 4-10z"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z"/>',
  pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  pin:'<path d="M12 2 9 8l-5 1 4 4-1 6 5-3 5 3-1-6 4-4-5-1z"/>',
  chevL:'<path d="m15 18-6-6 6-6"/>',
  chevR:'<path d="m9 18 6-6-6-6"/>',
  download:'<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 19h16"/>'
};
function icon(name,size){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="'+(size||18)+'" height="'+(size||18)+'">'+ICONS[name]+'</svg>'; }

var TAGS = ['coral','marigold','sage','sky','lavender','rose','mint','sand'];
var MOODS = [
  {v:5, e:'😄', label:'Great'}, {v:4, e:'🙂', label:'Good'}, {v:3, e:'😐', label:'Okay'},
  {v:2, e:'😕', label:'Rough'}, {v:1, e:'😢', label:'Hard'}
];
var STICKERS = ['✨','🌸','🌻','🍀','🌙','⭐️','💛','🧸','📌','🍄','☕️','🎀','🌈','🍯','🐝','📖'];
var WEEKDAYS_SUN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var PRIORITY_ORDER = {high:0, medium:1, low:2};

/* ============================================================
   STATE
   ============================================================ */
var STATE = {
  events:[], notes:[], todoLists:[], todos:[], habits:[], journal:[], goals:[],
  dailyPlans:{}, settings:{theme:'peach', firstDay:'sun', dark:null}
};
var db = null;
var persistMode = 'connecting'; // connecting | db | local
var activeModule = 'calendar';
var calView = 'month';
var calCursor = new Date();
var todayCursor = todayStr();
var activeListId = null;
var journalDraftDate = todayStr();
var LS_KEY = 'dahliaPlannerData_v1';

/* ============================================================
   UTILS
   ============================================================ */
function pad(n){ return n<10?'0'+n:''+n; }
function todayStr(){ var d=new Date(); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function toStr(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function fromStr(s){ var p=s.split('-'); return new Date(parseInt(p[0],10), parseInt(p[1],10)-1, parseInt(p[2],10)); }
function addDays(d,n){ var r=new Date(d); r.setDate(r.getDate()+n); return r; }
function addMonths(d,n){ var r=new Date(d); r.setMonth(r.getMonth()+n); return r; }
function isSameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function genId(){ return 'id'+Date.now().toString(36)+Math.random().toString(36).slice(2,9); }
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function niceDate(dateStr){
  var d=fromStr(dateStr);
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]+', '+MONTH_NAMES[d.getMonth()].slice(0,3)+' '+d.getDate();
}
function fullDate(dateStr){
  var d=fromStr(dateStr);
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()]+', '+MONTH_NAMES[d.getMonth()]+' '+d.getDate();
}
function timeLabel(t){
  if(!t) return '';
  var p=t.split(':'); var h=parseInt(p[0],10); var m=p[1];
  var ap = h>=12?'PM':'AM'; var h12 = h%12; if(h12===0) h12=12;
  return h12+':'+m+' '+ap;
}
function scrollHourIntoView(container,hour){
  var h=Math.max(0,(hour||7)-1);
  requestAnimationFrame(function(){
    var target=container.querySelector('[data-hour="'+h+'"]');
    if(target) target.scrollIntoView({block:'start'});
  });
}
function fmtCountdown(dateStr){
  var diff = Math.round((fromStr(dateStr)-fromStr(todayStr()))/86400000);
  if(diff===0) return 'Today';
  if(diff===1) return 'Tomorrow';
  if(diff>1) return 'in '+diff+' days';
  return Math.abs(diff)+'d overdue';
}
function tagClass(t){ return 'tag-'+(t||'coral'); }
function debounce(fn,ms){ var t; return function(){ var a=arguments; clearTimeout(t); t=setTimeout(function(){ fn.apply(null,a); },ms); }; }
function byId(arr,id){ for(var i=0;i<arr.length;i++){ if(arr[i].id===id) return arr[i]; } return null; }
function escAttr(s){ return escapeHtml(s).replace(/`/g,'&#96;'); }

/* ============================================================
   PERSISTENCE
   ============================================================ */
function saveLocal(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(STATE)); }catch(e){} }
function loadLocal(){
  try{
    var raw = localStorage.getItem(LS_KEY);
    if(raw){
      var parsed = JSON.parse(raw);
      for(var k in parsed){ STATE[k]=parsed[k]; }
    }
  }catch(e){}
}

function setSyncUI(){
  var dot=document.getElementById('syncDot'), label=document.getElementById('syncLabel');
  if(!dot) return;
  dot.className='sync-dot'+(persistMode==='db'?' on':persistMode==='connecting'?' wait':'');
  label.textContent = persistMode==='db' ? 'Synced' : persistMode==='connecting' ? 'Connecting…' : 'Saved on this device';
}

function collFor(kind){ return kind; }

function upsertLocalArr(kind,id,data){
  var arr = STATE[kind];
  var found=false;
  for(var i=0;i<arr.length;i++){ if(arr[i].id===id){ arr[i]=Object.assign({id:id},data); found=true; break; } }
  if(!found) arr.push(Object.assign({id:id},data));
}
function removeLocalArr(kind,id){
  STATE[kind] = STATE[kind].filter(function(x){ return x.id!==id; });
}

function saveItem(kind,id,data,cb){
  if(persistMode==='db'){
    db.collection(collFor(kind)).doc(id).set(data).then(function(){ if(cb) cb(); }).catch(function(e){ toast('Could not save — try again'); });
  } else {
    upsertLocalArr(kind,id,data); saveLocal(); render(); if(cb) cb();
  }
}
function deleteItem(kind,id,cb){
  if(persistMode==='db'){
    db.collection(collFor(kind)).doc(id).delete().then(function(){ if(cb) cb(); }).catch(function(){ toast('Could not delete'); });
  } else {
    removeLocalArr(kind,id); saveLocal(); render(); if(cb) cb();
  }
}
function saveDailyPlan(dateStr,data){
  if(persistMode==='db'){
    db.collection('dailyPlans').doc(dateStr).set(data).catch(function(){});
  } else {
    STATE.dailyPlans[dateStr]=data; saveLocal(); render();
  }
}
function saveSettings(){
  STATE.settings.theme = STATE.settings.theme||'peach';
  if(persistMode==='db'){
    db.collection('settings').doc('app').set(STATE.settings).catch(function(){});
  } else {
    saveLocal();
  }
  applyTheme(); render();
}

function isTypingInContent(){
  var el=document.activeElement;
  var content=document.getElementById('content');
  return !!(el && (el.tagName==='INPUT'||el.tagName==='TEXTAREA') && content && content.contains(el));
}
function safeRender(){ if(isTypingInContent()) return; render(); }

function subscribeAll(){
  ['events','notes','todoLists','todos','habits','journal','goals'].forEach(function(kind){
    db.collection(kind).onSnapshot(function(snap){
      STATE[kind] = snap.docs.map(function(d){ return Object.assign({id:d.id}, d.data()); });
      safeRender();
    }, function(){ /* ignore transient errors, local mirror keeps working */ });
  });
  db.collection('dailyPlans').onSnapshot(function(snap){
    var m={};
    snap.docs.forEach(function(d){ m[d.id]=d.data(); });
    STATE.dailyPlans=m; safeRender();
  });
  db.collection('settings').doc('app').onSnapshot(function(snap){
    if(snap.exists){ STATE.settings=Object.assign(STATE.settings,snap.data()); applyTheme(); safeRender(); }
  });
}

function initPersistence(){
  setSyncUI();
  if(!window.claude || !window.claude.use){ persistMode='local'; loadLocal(); applyTheme(); afterBoot(); return; }
  window.claude.use('db').then(function(d){
    if(d){ db=d; persistMode='db'; subscribeAll(); setSyncUI(); applyTheme(); afterBoot(); }
    else { persistMode='local'; loadLocal(); applyTheme(); setSyncUI(); afterBoot(); }
  }).catch(function(){ persistMode='local'; loadLocal(); applyTheme(); setSyncUI(); afterBoot(); });
  // fallback if the promise never settles
  setTimeout(function(){ if(persistMode==='connecting'){ persistMode='local'; loadLocal(); applyTheme(); setSyncUI(); afterBoot(); } }, 4500);
}
var booted=false;
function afterBoot(){ if(booted) return; booted=true; render(); }

/* ============================================================
   THEME
   ============================================================ */
function applyTheme(){
  document.documentElement.setAttribute('data-planner-theme', STATE.settings.theme||'peach');
  if(STATE.settings.dark==='dark') document.documentElement.setAttribute('data-theme','dark');
  else if(STATE.settings.dark==='light') document.documentElement.setAttribute('data-theme','light');
  else document.documentElement.removeAttribute('data-theme');
}

/* ============================================================
   TOAST + MODAL
   ============================================================ */
var toastTimer;
function toast(msg){
  var t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(function(){ t.classList.remove('show'); },2200);
}
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; }
function openModal(title,bodyHtml,opts){
  opts=opts||{};
  var root=document.getElementById('modalRoot');
  root.innerHTML =
    '<div class="scrim" data-close="1"></div>'+
    '<div id="modalWrap"><div class="modal">'+
      '<button class="iconbtn modal-close" data-close="1">'+icon('x',18)+'</button>'+
      '<h2 class="hand">'+title+'</h2>'+
      '<div id="modalBody">'+bodyHtml+'</div>'+
    '</div></div>';
  root.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click',closeModal); });
  document.addEventListener('keydown', escListener);
  var first = root.querySelector('input,textarea,select');
  if(first) setTimeout(function(){ first.focus(); },30);
}
function escListener(e){ if(e.key==='Escape'){ closeModal(); document.removeEventListener('keydown',escListener); } }

/* ============================================================
   RENDER SHELL
   ============================================================ */
function renderShell(){
  var nav=document.getElementById('navlist');
  nav.innerHTML = MODULES.map(function(m){
    return '<button class="navbtn'+(activeModule===m.id?' active':'')+'" data-nav="'+m.id+'">'+icon(m.icon,19)+'<span class="navlabel">'+m.label+'</span></button>';
  }).join('');
  nav.querySelectorAll('[data-nav]').forEach(function(b){ b.addEventListener('click', function(){ navigate(b.getAttribute('data-nav')); }); });

  var tabbar=document.getElementById('tabbar');
  tabbar.innerHTML = MODULES.filter(function(m){return m.id!=='settings';}).map(function(m){
    return '<button class="'+(activeModule===m.id?'active':'')+'" data-nav="'+m.id+'">'+icon(m.icon,19)+'<span>'+m.label+'</span></button>';
  }).join('');
  tabbar.querySelectorAll('[data-nav]').forEach(function(b){ b.addEventListener('click', function(){ navigate(b.getAttribute('data-nav')); }); });

  document.getElementById('pageTitle').textContent = MODULES.filter(function(m){return m.id===activeModule;})[0].label;
}
function navigate(mod){ activeModule=mod; render(); }

/* ============================================================
   MAIN RENDER DISPATCH
   ============================================================ */
function render(){
  renderShell();
  setSyncUI();
  var c=document.getElementById('content');
  var actions=document.getElementById('topActions');
  actions.innerHTML='';
  if(activeModule==='calendar') renderCalendar(c,actions);
  else if(activeModule==='today') renderToday(c,actions);
  else if(activeModule==='notes') renderNotes(c,actions);
  else if(activeModule==='journal') renderJournal(c,actions);
  else if(activeModule==='todos') renderTodos(c,actions);
  else if(activeModule==='habits') renderHabits(c,actions);
  else if(activeModule==='goals') renderGoals(c,actions);
  else if(activeModule==='settings') renderSettings(c,actions);
}

/* ============================================================
   CALENDAR
   ============================================================ */
function eventsOn(dateStr){ return STATE.events.filter(function(e){ return e.date===dateStr; }).sort(function(a,b){ return (a.start||'').localeCompare(b.start||''); }); }
function weekdayOrder(){
  if(STATE.settings.firstDay==='mon') return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return WEEKDAYS_SUN;
}
function renderCalendar(c,actions){
  actions.innerHTML = '<button class="btn" id="addEventBtn">'+icon('plus',15)+' Add event</button>';
  document.getElementById('addEventBtn').addEventListener('click', function(){ openEventForm(toStr(calCursor)); });

  var html = '<div class="cal-head">'+
    '<button class="iconbtn" id="calPrev">'+icon('chevL',18)+'</button>'+
    '<button class="iconbtn" id="calNext">'+icon('chevR',18)+'</button>'+
    '<span class="month-label hand">'+(calView==='month'?MONTH_NAMES[calCursor.getMonth()]+' '+calCursor.getFullYear():calView==='week'?weekRangeLabel(calCursor):fullDate(toStr(calCursor)))+'</span>'+
    '<button class="btn ghost" id="calToday">Today</button>'+
    '<div class="spacer"></div>'+
    '<div class="viewtoggle">'+['month','week','day'].map(function(v){ return '<button class="'+(calView===v?'active':'')+'" data-view="'+v+'">'+v.charAt(0).toUpperCase()+v.slice(1)+'</button>'; }).join('')+'</div>'+
  '</div><div id="calBody"></div>';
  c.innerHTML=html;
  document.getElementById('calPrev').addEventListener('click', function(){ shiftCal(-1); });
  document.getElementById('calNext').addEventListener('click', function(){ shiftCal(1); });
  document.getElementById('calToday').addEventListener('click', function(){ calCursor=new Date(); render(); });
  c.querySelectorAll('[data-view]').forEach(function(b){ b.addEventListener('click', function(){ calView=b.getAttribute('data-view'); render(); }); });

  var body=document.getElementById('calBody');
  if(calView==='month') renderMonthGrid(body);
  else if(calView==='week') renderWeekGrid(body);
  else renderDayGrid(body);
}
function shiftCal(dir){
  if(calView==='month') calCursor=addMonths(calCursor,dir);
  else if(calView==='week') calCursor=addDays(calCursor,7*dir);
  else calCursor=addDays(calCursor,dir);
  render();
}
function weekRangeLabel(d){
  var start=startOfWeek(d), end=addDays(start,6);
  return MONTH_NAMES[start.getMonth()].slice(0,3)+' '+start.getDate()+' – '+MONTH_NAMES[end.getMonth()].slice(0,3)+' '+end.getDate();
}
function startOfWeek(d){
  var r=new Date(d); var dow=r.getDay();
  var offset = STATE.settings.firstDay==='mon' ? (dow===0?6:dow-1) : dow;
  r.setDate(r.getDate()-offset); r.setHours(0,0,0,0); return r;
}
function renderMonthGrid(body){
  var first=new Date(calCursor.getFullYear(),calCursor.getMonth(),1);
  var gridStart=startOfWeek(first);
  var today=new Date();
  var html='<div class="cal-grid">'+weekdayOrder().map(function(w){return '<div class="cal-dow">'+w+'</div>';}).join('');
  for(var i=0;i<42;i++){
    var d=addDays(gridStart,i);
    var ds=toStr(d);
    var evs=eventsOn(ds);
    var isOther = d.getMonth()!==calCursor.getMonth();
    var isToday = isSameDay(d,today);
    html+='<div class="cal-cell'+(isOther?' other-month':'')+(isToday?' today':'')+'" data-day="'+ds+'">'+
      '<span class="cal-daynum">'+d.getDate()+'</span>'+
      evs.slice(0,3).map(function(e){ return '<span class="cal-evt '+tagClass(e.color)+'">'+(e.allDay?'':timeLabel(e.start)+' ')+escapeHtml(e.title)+'</span>'; }).join('')+
      (evs.length>3?'<span class="cal-more">+'+(evs.length-3)+' more</span>':'')+
    '</div>';
  }
  html+='</div>';
  body.innerHTML=html;
  body.querySelectorAll('[data-day]').forEach(function(cell){
    cell.addEventListener('click', function(){ openDayPanel(cell.getAttribute('data-day')); });
  });
}
var HOURS=[]; for(var hh=0; hh<=23; hh++) HOURS.push(hh);
function renderWeekGrid(body){
  var start=startOfWeek(calCursor);
  var days=[]; for(var i=0;i<7;i++) days.push(addDays(start,i));
  var today=new Date();
  var html='<div class="week-grid">';
  html+='<div class="wh"></div>'+days.map(function(d){ return '<div class="wh'+(isSameDay(d,today)?' today':'')+'">'+['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]+' '+d.getDate()+'</div>'; }).join('');
  HOURS.forEach(function(h){
    html+='<div class="hourlabel">'+timeLabel(pad(h)+':00')+'</div>';
    days.forEach(function(d){
      var ds=toStr(d);
      var evs=eventsOn(ds).filter(function(e){ return !e.allDay && parseInt((e.start||'0:0').split(':')[0],10)===h; });
      html+='<div class="wcell" data-day="'+ds+'" data-hour="'+h+'">'+evs.map(function(e){ return '<div class="wevt" data-evt="'+e.id+'">'+escapeHtml(e.title)+'</div>'; }).join('')+'</div>';
    });
  });
  html+='</div>';
  body.innerHTML=html;
  scrollHourIntoView(body, days.some(function(d){return isSameDay(d,today);})?new Date().getHours():7);
  body.querySelectorAll('.wcell').forEach(function(cell){
    cell.addEventListener('click', function(e){
      if(e.target.closest('[data-evt]')) return;
      openEventForm(cell.getAttribute('data-day'), cell.getAttribute('data-hour'));
    });
  });
  body.querySelectorAll('[data-evt]').forEach(function(el){
    el.addEventListener('click', function(e){ e.stopPropagation(); openEventForm(null,null,el.getAttribute('data-evt')); });
  });
}
function renderDayGrid(body){
  var ds=toStr(calCursor);
  var evs=eventsOn(ds);
  var all=evs.filter(function(e){return e.allDay;});
  var html = all.length?('<div style="margin-bottom:10px;display:flex;gap:6px;flex-wrap:wrap;">'+all.map(function(e){return '<span class="chip '+tagClass(e.color)+'" data-evt="'+e.id+'" style="cursor:pointer;">'+escapeHtml(e.title)+'</span>';}).join('')+'</div>'):'';
  html+='<div class="timeline">';
  HOURS.forEach(function(h){
    var hevs=evs.filter(function(e){ return !e.allDay && parseInt((e.start||'0:0').split(':')[0],10)===h; });
    html+='<div class="tl-row" data-hour="'+h+'"><div class="tl-time">'+timeLabel(pad(h)+':00')+'</div><div class="tl-evts">'+
      hevs.map(function(e){ return '<div class="wevt" data-evt="'+e.id+'" style="max-width:320px;">'+timeLabel(e.start)+(e.end?'–'+timeLabel(e.end):'')+' · '+escapeHtml(e.title)+'</div>'; }).join('')+
    '</div></div>';
  });
  html+='</div>';
  body.innerHTML=html;
  scrollHourIntoView(body, isSameDay(calCursor,new Date())?new Date().getHours():7);
  body.querySelectorAll('[data-hour]').forEach(function(row){
    row.addEventListener('click', function(e){ if(e.target.closest('[data-evt]')) return; openEventForm(ds,row.getAttribute('data-hour')); });
  });
  body.querySelectorAll('[data-evt]').forEach(function(el){
    el.addEventListener('click', function(e){ e.stopPropagation(); openEventForm(null,null,el.getAttribute('data-evt')); });
  });
}
function openDayPanel(dateStr){
  var evs=eventsOn(dateStr);
  var html='<div style="display:flex;flex-direction:column;gap:8px;max-height:50vh;overflow:auto;margin-bottom:14px;">'+
    (evs.length? evs.map(function(e){
      return '<div class="card" style="padding:12px;display:flex;justify-content:space-between;gap:10px;align-items:center;">'+
        '<div><div style="font-weight:700;">'+escapeHtml(e.title)+'</div><div style="font-size:12px;color:var(--ink-soft);">'+(e.allDay?'All day':timeLabel(e.start)+(e.end?'–'+timeLabel(e.end):''))+'</div></div>'+
        '<div style="display:flex;gap:4px;"><button class="iconbtn" data-editevt="'+e.id+'">'+icon('pencil',15)+'</button><button class="iconbtn" data-delevt="'+e.id+'">'+icon('trash',15)+'</button></div>'+
      '</div>';
    }).join('') : '<p style="color:var(--ink-soft);font-size:13.5px;">No events yet on this day.</p>')+
  '</div>'+
  '<div class="modal-actions" style="justify-content:space-between;">'+
    '<button class="btn ghost" id="goToday">Open in Today view</button>'+
    '<button class="btn" id="addEvtHere">'+icon('plus',15)+' Add event</button>'+
  '</div>';
  openModal(fullDate(dateStr), html);
  document.getElementById('addEvtHere').addEventListener('click', function(){ closeModal(); openEventForm(dateStr); });
  document.getElementById('goToday').addEventListener('click', function(){ closeModal(); todayCursor=dateStr; activeModule='today'; render(); });
  document.querySelectorAll('[data-editevt]').forEach(function(b){ b.addEventListener('click', function(){ closeModal(); openEventForm(null,null,b.getAttribute('data-editevt')); }); });
  document.querySelectorAll('[data-delevt]').forEach(function(b){ b.addEventListener('click', function(){ var id=b.getAttribute('data-delevt'); deleteItem('events',id); closeModal(); toast('Event deleted'); }); });
}
function openEventForm(dateStr,hour,editId){
  var ev = editId ? byId(STATE.events,editId) : null;
  dateStr = dateStr || (ev?ev.date:todayStr());
  var start = ev?ev.start:(hour?pad(hour)+':00':'09:00');
  var end = ev?ev.end:(hour?pad(parseInt(hour,10)+1)+':00':'10:00');
  var html =
    '<label class="field">Title<input type="text" id="fTitle" value="'+escAttr(ev?ev.title:'')+'" placeholder="e.g. Client call"></label>'+
    '<div class="row"><label class="field">Date<input type="date" id="fDate" value="'+dateStr+'"></label></div>'+
    '<label class="checkline" style="margin-bottom:12px;"><input type="checkbox" id="fAllDay" '+(ev&&ev.allDay?'checked':'')+'> All day</label>'+
    '<div class="row" id="timeRow" style="'+(ev&&ev.allDay?'display:none;':'')+'">'+
      '<label class="field">Start<input type="time" id="fStart" value="'+start+'"></label>'+
      '<label class="field">End<input type="time" id="fEnd" value="'+end+'"></label>'+
    '</div>'+
    '<label class="field">Notes<textarea id="fNotes" placeholder="Optional details">'+escapeHtml(ev?ev.notes:'')+'</textarea></label>'+
    '<div class="field">Color<div class="swatchrow" id="fColor">'+TAGS.map(function(t){ return '<button type="button" class="swatch tag-'+t+' '+((ev?ev.color:'coral')===t?'picked':'')+'" data-color="'+t+'"></button>'; }).join('')+'</div></div>'+
    '<div class="modal-actions">'+(ev?'<button class="btn danger" id="fDelete">Delete</button>':'')+'<button class="btn" id="fSave">'+(ev?'Save changes':'Add event')+'</button></div>';
  openModal(ev?'Edit event':'New event', html);
  var pickedColor = ev?ev.color:'coral';
  document.getElementById('fAllDay').addEventListener('change', function(e){ document.getElementById('timeRow').style.display = e.target.checked?'none':'flex'; });
  document.querySelectorAll('#fColor .swatch').forEach(function(s){ s.addEventListener('click', function(){ pickedColor=s.getAttribute('data-color'); document.querySelectorAll('#fColor .swatch').forEach(function(x){x.classList.remove('picked');}); s.classList.add('picked'); }); });
  document.getElementById('fSave').addEventListener('click', function(){
    var title=document.getElementById('fTitle').value.trim();
    if(!title){ toast('Give the event a title'); return; }
    var data={
      title:title, date:document.getElementById('fDate').value||dateStr,
      allDay:document.getElementById('fAllDay').checked,
      start:document.getElementById('fStart').value, end:document.getElementById('fEnd').value,
      notes:document.getElementById('fNotes').value.trim(), color:pickedColor
    };
    saveItem('events', ev?ev.id:genId(), data);
    closeModal(); toast(ev?'Event updated':'Event added');
  });
  if(ev){ document.getElementById('fDelete').addEventListener('click', function(){ deleteItem('events',ev.id); closeModal(); toast('Event deleted'); }); }
}

/* ============================================================
   TODAY / DAILY PLANNER
   ============================================================ */
function renderToday(c,actions){
  var ds=todayCursor;
  var plan = STATE.dailyPlans[ds] || {priorities:['','',''], notes:''};
  var dayTodos = STATE.todos.filter(function(t){ return t.dueDate===ds; });
  var evs=eventsOn(ds);

  actions.innerHTML='<button class="btn ghost" id="tToday">Jump to today</button>';
  document.getElementById('tToday') && document.getElementById('tToday').addEventListener('click', function(){ todayCursor=todayStr(); render(); });

  var html = '<div class="date-nav">'+
      '<button class="iconbtn" id="tPrev">'+icon('chevL',18)+'</button>'+
      '<button class="iconbtn" id="tNext">'+icon('chevR',18)+'</button>'+
      '<span class="hand" style="font-size:26px;">'+fullDate(ds)+'</span>'+
      (ds===todayStr()?'<span class="chip tag-sage">Today</span>':'')+
    '</div>'+
    '<div class="today-grid">'+
      '<div>'+
        '<div class="card" style="padding:18px;margin-bottom:18px;">'+
          '<h3 class="hand" style="margin:0 0 12px;font-size:22px;">Top priorities</h3>'+
          '<div class="priorities">'+[0,1,2].map(function(i){
            return '<div class="priority-row"><span class="priority-num">'+(i+1)+'</span><input type="text" data-pi="'+i+'" value="'+escAttr(plan.priorities[i]||'')+'" placeholder="What matters most?"></div>';
          }).join('')+'</div>'+
        '</div>'+
        '<div class="card" style="padding:18px;">'+
          '<h3 class="hand" style="margin:0 0 12px;font-size:22px;">Schedule</h3>'+
          '<div class="timeline" id="dayTimeline"></div>'+
        '</div>'+
      '</div>'+
      '<div>'+
        '<div class="card" style="padding:18px;margin-bottom:18px;">'+
          '<h3 class="hand" style="margin:0 0 10px;font-size:22px;">To-dos due today</h3>'+
          (dayTodos.length? dayTodos.map(function(t){
            return '<div class="todo-mini"><button class="todo-check'+(t.done?' done':'')+'" data-tdone="'+t.id+'">'+(t.done?'✓':'')+'</button><span style="flex:1;'+(t.done?'text-decoration:line-through;color:var(--ink-faint);':'')+'">'+escapeHtml(t.text)+'</span></div>';
          }).join('') : '<p style="color:var(--ink-soft);font-size:13.5px;">Nothing due today — add one from To-Dos.</p>')+
        '</div>'+
        '<div class="card" style="padding:18px;">'+
          '<h3 class="hand" style="margin:0 0 10px;font-size:22px;">A note for today</h3>'+
          '<textarea class="editor" style="min-height:110px;" id="dayNotes" placeholder="Anything on your mind…">'+escapeHtml(plan.notes||'')+'</textarea>'+
        '</div>'+
      '</div>'+
    '</div>';
  c.innerHTML=html;

  document.getElementById('tPrev').addEventListener('click', function(){ todayCursor=toStr(addDays(fromStr(ds),-1)); render(); });
  document.getElementById('tNext').addEventListener('click', function(){ todayCursor=toStr(addDays(fromStr(ds),1)); render(); });

  var tl=document.getElementById('dayTimeline');
  tl.innerHTML = HOURS.map(function(h){
    var hevs=evs.filter(function(e){ return !e.allDay && parseInt((e.start||'0:0').split(':')[0],10)===h; });
    return '<div class="tl-row" data-hour="'+h+'"><div class="tl-time">'+timeLabel(pad(h)+':00')+'</div><div class="tl-evts">'+
      hevs.map(function(e){ return '<div class="wevt">'+timeLabel(e.start)+' · '+escapeHtml(e.title)+'</div>'; }).join('')+
    '</div></div>';
  }).join('');
  scrollHourIntoView(tl, ds===todayStr()?new Date().getHours():7);

  c.querySelectorAll('[data-tdone]').forEach(function(b){
    b.addEventListener('click', function(){
      var t=byId(STATE.todos,b.getAttribute('data-tdone'));
      if(t) saveItem('todos', t.id, Object.assign({},t,{done:!t.done}));
    });
  });
  var pInputs=c.querySelectorAll('[data-pi]');
  var savePriorities=debounce(function(){
    var arr=['','',''];
    pInputs.forEach(function(inp){ arr[parseInt(inp.getAttribute('data-pi'),10)] = inp.value; });
    saveDailyPlan(ds, {priorities:arr, notes:document.getElementById('dayNotes').value});
  },500);
  pInputs.forEach(function(inp){ inp.addEventListener('input', savePriorities); });
  document.getElementById('dayNotes').addEventListener('input', debounce(function(){
    var arr=['','',''];
    pInputs.forEach(function(inp){ arr[parseInt(inp.getAttribute('data-pi'),10)] = inp.value; });
    saveDailyPlan(ds, {priorities:arr, notes:document.getElementById('dayNotes').value});
  },500));
}

/* ============================================================
   NOTES
   ============================================================ */
function renderNotes(c,actions){
  actions.innerHTML='<button class="btn" id="addNoteBtn">'+icon('plus',15)+' New note</button>';
  document.getElementById('addNoteBtn').addEventListener('click', function(){ openNoteEditor(); });

  var notes = STATE.notes.slice().sort(function(a,b){
    if(!!b.pinned - !!a.pinned !== 0) return (b.pinned?1:0)-(a.pinned?1:0);
    return (b.updatedAt||0)-(a.updatedAt||0);
  });
  if(!notes.length){
    c.innerHTML='<div class="empty"><span class="emoji">🗒️</span><h3 class="hand">No notes yet</h3><p>Jot down ideas, lists, or anything worth remembering — they’ll show up here like sticky notes.</p><button class="btn" id="emptyAddNote">'+icon('plus',15)+' Write your first note</button></div>';
    document.getElementById('emptyAddNote').addEventListener('click', function(){ openNoteEditor(); });
    return;
  }
  c.innerHTML='<div class="grid-cards">'+notes.map(function(n){
    return '<div class="card note-card '+tagClass(n.color)+'" data-note="'+n.id+'">'+
      (n.pinned?'<span class="pin-badge">'+icon('pin',16)+'</span>':'')+
      '<div class="note-title">'+escapeHtml(n.title||'Untitled')+'</div>'+
      '<div class="note-body">'+escapeHtml(n.content||'')+'</div>'+
      '<div class="note-foot">'+(n.tags||[]).map(function(t){ return '<span class="chip '+tagClass(n.color)+'">'+escapeHtml(t)+'</span>'; }).join('')+'</div>'+
    '</div>';
  }).join('')+'</div>';
  c.querySelectorAll('[data-note]').forEach(function(el){ el.addEventListener('click', function(){ openNoteEditor(el.getAttribute('data-note')); }); });
}
function openNoteEditor(id){
  var n = id?byId(STATE.notes,id):null;
  var pickedColor = n?n.color:'marigold';
  var pinned = n?!!n.pinned:false;
  var html =
    '<label class="field">Title<input type="text" id="nTitle" value="'+escAttr(n?n.title:'')+'" placeholder="Note title"></label>'+
    '<label class="field">Content<textarea class="editor" id="nContent" style="min-height:180px;" placeholder="Write anything…">'+escapeHtml(n?n.content:'')+'</textarea></label>'+
    '<label class="field">Tags (comma separated)<input type="text" id="nTags" value="'+escAttr(n&&n.tags?n.tags.join(', '):'')+'" placeholder="e.g. work, ideas"></label>'+
    '<div class="field">Color<div class="swatchrow" id="nColor">'+TAGS.map(function(t){ return '<button type="button" class="swatch tag-'+t+' '+(pickedColor===t?'picked':'')+'" data-color="'+t+'"></button>'; }).join('')+'</div></div>'+
    '<label class="checkline" style="margin-bottom:16px;"><input type="checkbox" id="nPinned" '+(pinned?'checked':'')+'> Pin to top</label>'+
    '<div class="modal-actions">'+(n?'<button class="btn danger" id="nDelete">Delete</button>':'')+'<button class="btn" id="nSave">'+(n?'Save changes':'Save note')+'</button></div>';
  openModal(n?'Edit note':'New note', html);
  document.querySelectorAll('#nColor .swatch').forEach(function(s){ s.addEventListener('click', function(){ pickedColor=s.getAttribute('data-color'); document.querySelectorAll('#nColor .swatch').forEach(function(x){x.classList.remove('picked');}); s.classList.add('picked'); }); });
  document.getElementById('nSave').addEventListener('click', function(){
    var title=document.getElementById('nTitle').value.trim();
    var content=document.getElementById('nContent').value.trim();
    if(!title && !content){ toast('Write something first'); return; }
    var tags=document.getElementById('nTags').value.split(',').map(function(s){return s.trim();}).filter(Boolean);
    saveItem('notes', n?n.id:genId(), {
      title:title||'Untitled', content:content, tags:tags, color:pickedColor,
      pinned:document.getElementById('nPinned').checked, updatedAt:Date.now()
    });
    closeModal(); toast(n?'Note updated':'Note saved');
  });
  if(n){ document.getElementById('nDelete').addEventListener('click', function(){ deleteItem('notes',n.id); closeModal(); toast('Note deleted'); }); }
}

/* ============================================================
   JOURNAL
   ============================================================ */
function renderJournal(c,actions){
  actions.innerHTML='<button class="btn" id="addJournalBtn">'+icon('plus',15)+' New entry</button>';
  document.getElementById('addJournalBtn').addEventListener('click', function(){ openJournalEditor(); });

  var entries = STATE.journal.slice().sort(function(a,b){ return b.date.localeCompare(a.date); });
  if(!entries.length){
    c.innerHTML='<div class="empty"><span class="emoji">📔</span><h3 class="hand">Your journal is empty</h3><p>A few lines a day — how you felt, what you’re grateful for — builds a nice little archive over time.</p><button class="btn" id="emptyAddJournal">'+icon('plus',15)+' Write today’s entry</button></div>';
    document.getElementById('emptyAddJournal').addEventListener('click', function(){ openJournalEditor(); });
    return;
  }
  c.innerHTML='<div style="display:flex;flex-direction:column;gap:14px;max-width:640px;">'+entries.map(function(en){
    var mood = MOODS.filter(function(m){return m.v===en.mood;})[0];
    return '<div class="card journal-entry" data-jn="'+en.id+'">'+
      '<div class="journal-head"><span class="journal-date">'+niceDate(en.date)+'</span><span class="mood-emoji">'+(mood?mood.e:'')+'</span></div>'+
      (en.gratitude&&en.gratitude.some(Boolean)?'<ul class="gratitude-list">'+en.gratitude.filter(Boolean).map(function(g){return '<li>'+escapeHtml(g)+'</li>';}).join('')+'</ul>':'')+
      (en.content?'<div class="journal-text">'+escapeHtml(en.content)+'</div>':'')+
      (en.stickers&&en.stickers.length?'<div class="sticker-row">'+en.stickers.map(function(s){return '<span>'+s+'</span>';}).join('')+'</div>':'')+
    '</div>';
  }).join('')+'</div>';
  c.querySelectorAll('[data-jn]').forEach(function(el){ el.addEventListener('click', function(){ openJournalEditor(el.getAttribute('data-jn')); }); });
}
function openJournalEditor(id){
  var en = id?byId(STATE.journal,id):null;
  var pickedMood = en?en.mood:3;
  var pickedStickers = en&&en.stickers?en.stickers.slice():[];
  var html =
    '<label class="field">Date<input type="date" id="jDate" value="'+(en?en.date:journalDraftDate)+'"></label>'+
    '<div class="field">How was today?<div class="mood-pick" id="jMood">'+MOODS.map(function(m){ return '<button type="button" data-mood="'+m.v+'" class="'+(pickedMood===m.v?'picked':'')+'">'+m.e+'</button>'; }).join('')+'</div></div>'+
    '<label class="field">Grateful for #1<input type="text" id="jG1" value="'+escAttr(en&&en.gratitude?en.gratitude[0]:'')+'"></label>'+
    '<label class="field">Grateful for #2<input type="text" id="jG2" value="'+escAttr(en&&en.gratitude?en.gratitude[1]:'')+'"></label>'+
    '<label class="field">Grateful for #3<input type="text" id="jG3" value="'+escAttr(en&&en.gratitude?en.gratitude[2]:'')+'"></label>'+
    '<label class="field">Today, I’m thinking about…<textarea id="jContent" style="min-height:120px;">'+escapeHtml(en?en.content:'')+'</textarea></label>'+
    '<div class="field">Stickers<div class="emoji-pick" id="jStickers">'+STICKERS.map(function(s){ return '<button type="button" data-em="'+s+'" class="'+(pickedStickers.indexOf(s)>-1?'picked':'')+'">'+s+'</button>'; }).join('')+'</div></div>'+
    '<div class="modal-actions">'+(en?'<button class="btn danger" id="jDelete">Delete</button>':'')+'<button class="btn" id="jSave">'+(en?'Save changes':'Save entry')+'</button></div>';
  openModal(en?'Edit journal entry':'New journal entry', html);
  document.querySelectorAll('#jMood button').forEach(function(b){ b.addEventListener('click', function(){ pickedMood=parseInt(b.getAttribute('data-mood'),10); document.querySelectorAll('#jMood button').forEach(function(x){x.classList.remove('picked');}); b.classList.add('picked'); }); });
  document.querySelectorAll('#jStickers button').forEach(function(b){
    b.addEventListener('click', function(){
      var em=b.getAttribute('data-em'); var idx=pickedStickers.indexOf(em);
      if(idx>-1){ pickedStickers.splice(idx,1); b.classList.remove('picked'); }
      else if(pickedStickers.length<6){ pickedStickers.push(em); b.classList.add('picked'); }
    });
  });
  document.getElementById('jSave').addEventListener('click', function(){
    var date=document.getElementById('jDate').value||journalDraftDate;
    var data={
      date:date, mood:pickedMood,
      gratitude:[document.getElementById('jG1').value.trim(),document.getElementById('jG2').value.trim(),document.getElementById('jG3').value.trim()],
      content:document.getElementById('jContent').value.trim(), stickers:pickedStickers
    };
    saveItem('journal', en?en.id:genId(), data);
    closeModal(); toast(en?'Entry updated':'Entry saved');
  });
  if(en){ document.getElementById('jDelete').addEventListener('click', function(){ deleteItem('journal',en.id); closeModal(); toast('Entry deleted'); }); }
}

/* ============================================================
   TODOS
   ============================================================ */
function ensureDefaultList(){
  if(!STATE.todoLists.length && persistMode!=='connecting'){
    var id=genId();
    saveItem('todoLists', id, {name:'My To-Dos', color:'coral', order:0});
    activeListId=id;
  }
}
function renderTodos(c,actions){
  ensureDefaultList();
  if(!activeListId || !byId(STATE.todoLists,activeListId)){ activeListId = STATE.todoLists.length?STATE.todoLists[0].id:null; }
  actions.innerHTML='<button class="btn" id="addListBtn">'+icon('plus',15)+' New list</button>';
  document.getElementById('addListBtn').addEventListener('click', openListForm);

  if(!STATE.todoLists.length){
    c.innerHTML='<div class="empty"><span class="emoji">✅</span><h3 class="hand">No lists yet</h3><p>Create a list for today’s tasks, groceries, work — anything you need to track.</p></div>';
    return;
  }
  var lists=STATE.todoLists.slice().sort(function(a,b){return (a.order||0)-(b.order||0);});
  var listHtml = lists.map(function(l){
    var items=STATE.todos.filter(function(t){return t.listId===l.id;});
    var doneCt=items.filter(function(t){return t.done;}).length;
    return '<button class="listbtn'+(activeListId===l.id?' active':'')+'" data-list="'+l.id+'"><span>'+escapeHtml(l.name)+'</span><span class="count">'+doneCt+'/'+items.length+'</span></button>';
  }).join('');

  var list = byId(STATE.todoLists,activeListId);
  var items = STATE.todos.filter(function(t){return t.listId===activeListId;}).sort(function(a,b){
    if(!!a.done - !!b.done !== 0) return (a.done?1:0)-(b.done?1:0);
    var pa=PRIORITY_ORDER[a.priority||'medium'], pb=PRIORITY_ORDER[b.priority||'medium'];
    if(pa!==pb) return pa-pb;
    return (a.dueDate||'9999').localeCompare(b.dueDate||'9999');
  });
  var doneCt=items.filter(function(t){return t.done;}).length;
  var pct = items.length? Math.round(doneCt/items.length*100) : 0;

  c.innerHTML = '<div class="todos-layout">'+
    '<div class="listnav">'+listHtml+'</div>'+
    '<div>'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:2px;">'+
        '<h2 class="hand" style="margin:0;font-size:26px;">'+escapeHtml(list?list.name:'')+'</h2>'+
        (list?'<div style="display:flex;gap:4px;"><button class="iconbtn" id="editList">'+icon('pencil',15)+'</button><button class="iconbtn" id="delList">'+icon('trash',15)+'</button></div>':'')+
      '</div>'+
      '<div class="progressbar"><div style="width:'+pct+'%;"></div></div>'+
      '<div id="todoRows">'+(items.length? items.map(function(t){
        return '<div class="todo-row'+(t.done?' done':'')+'">'+
          '<button class="todo-check'+(t.done?' done':'')+'" data-done="'+t.id+'">✓</button>'+
          '<span class="todo-text" data-edit="'+t.id+'">'+escapeHtml(t.text)+'</span>'+
          '<div class="todo-meta">'+(t.dueDate?'<span class="chip tag-sand">'+niceDate(t.dueDate)+'</span>':'')+
            '<span class="chip tag-'+(t.priority==='high'?'coral':t.priority==='low'?'sky':'marigold')+'">'+(t.priority||'medium')+'</span>'+
            '<button class="iconbtn" data-deltodo="'+t.id+'">'+icon('trash',14)+'</button></div>'+
        '</div>';
      }).join('') : '<p style="color:var(--ink-soft);font-size:13.5px;padding:14px 4px;">Nothing here yet — add your first task below.</p>')+'</div>'+
      '<div class="addrow"><input type="text" id="newTodoText" placeholder="Add a task and press Enter…"><button class="btn" id="addTodoBtn">'+icon('plus',15)+'</button></div>'+
    '</div>'+
  '</div>';

  document.querySelectorAll('[data-list]').forEach(function(b){ b.addEventListener('click', function(){ activeListId=b.getAttribute('data-list'); render(); }); });
  if(list){
    document.getElementById('editList').addEventListener('click', function(){ openListForm(list); });
    document.getElementById('delList').addEventListener('click', function(){
      if(STATE.todoLists.length<2){ toast('Keep at least one list'); return; }
      STATE.todos.filter(function(t){return t.listId===list.id;}).forEach(function(t){ deleteItem('todos',t.id); });
      deleteItem('todoLists',list.id); activeListId=null; toast('List deleted');
    });
  }
  document.querySelectorAll('[data-done]').forEach(function(b){
    b.addEventListener('click', function(){ var t=byId(STATE.todos,b.getAttribute('data-done')); saveItem('todos',t.id,Object.assign({},t,{done:!t.done})); });
  });
  document.querySelectorAll('[data-deltodo]').forEach(function(b){ b.addEventListener('click', function(){ deleteItem('todos',b.getAttribute('data-deltodo')); }); });
  document.querySelectorAll('[data-edit]').forEach(function(el){ el.addEventListener('click', function(){ openTodoForm(byId(STATE.todos,el.getAttribute('data-edit'))); }); });
  function addQuickTodo(){
    var inp=document.getElementById('newTodoText'); var val=inp.value.trim();
    if(!val) return;
    saveItem('todos', genId(), {listId:activeListId, text:val, done:false, dueDate:'', priority:'medium', createdAt:Date.now()});
    inp.value='';
  }
  document.getElementById('addTodoBtn').addEventListener('click', addQuickTodo);
  document.getElementById('newTodoText').addEventListener('keydown', function(e){ if(e.key==='Enter') addQuickTodo(); });
}
function openListForm(list){
  var html='<label class="field">List name<input type="text" id="lName" value="'+escAttr(list?list.name:'')+'" placeholder="e.g. Groceries"></label>'+
    '<div class="modal-actions"><button class="btn" id="lSave">'+(list?'Save':'Create list')+'</button></div>';
  openModal(list?'Rename list':'New list', html);
  document.getElementById('lSave').addEventListener('click', function(){
    var name=document.getElementById('lName').value.trim();
    if(!name){ toast('Give the list a name'); return; }
    saveItem('todoLists', list?list.id:genId(), {name:name, color:list?list.color:'coral', order:list?list.order:STATE.todoLists.length});
    closeModal();
  });
}
function openTodoForm(t){
  var html='<label class="field">Task<input type="text" id="toText" value="'+escAttr(t.text)+'"></label>'+
    '<div class="row"><label class="field">Due date<input type="date" id="toDue" value="'+(t.dueDate||'')+'"></label>'+
    '<label class="field">Priority<select id="toPri"><option value="low"'+(t.priority==='low'?' selected':'')+'>Low</option><option value="medium"'+((!t.priority||t.priority==='medium')?' selected':'')+'>Medium</option><option value="high"'+(t.priority==='high'?' selected':'')+'>High</option></select></label></div>'+
    '<div class="modal-actions"><button class="btn" id="toSave">Save</button></div>';
  openModal('Edit task', html);
  document.getElementById('toSave').addEventListener('click', function(){
    saveItem('todos', t.id, Object.assign({},t,{text:document.getElementById('toText').value.trim()||t.text, dueDate:document.getElementById('toDue').value, priority:document.getElementById('toPri').value}));
    closeModal();
  });
}

/* ============================================================
   HABITS
   ============================================================ */
function last7Days(){ var arr=[]; for(var i=6;i>=0;i--) arr.push(toStr(addDays(new Date(),-i))); return arr; }
function computeStreak(h){
  var streak=0; var d=new Date();
  while(true){ var ds=toStr(d); if(h.completions && h.completions[ds]){ streak++; d=addDays(d,-1); } else break; }
  return streak;
}
function renderHabits(c,actions){
  actions.innerHTML='<button class="btn" id="addHabitBtn">'+icon('plus',15)+' New habit</button>';
  document.getElementById('addHabitBtn').addEventListener('click', function(){ openHabitForm(); });
  if(!STATE.habits.length){
    c.innerHTML='<div class="empty"><span class="emoji">🔥</span><h3 class="hand">Start a streak</h3><p>Track daily habits — water, reading, workouts — and watch your streaks grow.</p><button class="btn" id="emptyHabit">'+icon('plus',15)+' Add your first habit</button></div>';
    document.getElementById('emptyHabit').addEventListener('click', function(){ openHabitForm(); });
    return;
  }
  var days=last7Days();
  c.innerHTML='<div class="grid-cards">'+STATE.habits.map(function(h){
    var streak=computeStreak(h);
    return '<div class="card habit-card">'+
      '<div class="habit-top"><span class="habit-emoji">'+(h.emoji||'⭐')+'</span><span class="habit-name">'+escapeHtml(h.name)+'</span>'+(streak?'<span class="streak '+tagClass(h.color)+'">'+streak+'d streak</span>':'')+
        '<button class="iconbtn" data-edithabit="'+h.id+'">'+icon('pencil',14)+'</button></div>'+
      '<div class="habit-dowrow">'+days.map(function(d){ return '<span>'+['S','M','T','W','T','F','S'][fromStr(d).getDay()]+'</span>'; }).join('')+'</div>'+
      '<div class="habit-grid">'+days.map(function(d){
        var done = h.completions && h.completions[d];
        return '<button class="habit-day '+tagClass(h.color)+(done?' done':'')+'" data-toggle="'+h.id+'|'+d+'">'+ (done?'✓':fromStr(d).getDate()) +'</button>';
      }).join('')+'</div>'+
    '</div>';
  }).join('')+'</div>';
  c.querySelectorAll('[data-toggle]').forEach(function(b){
    b.addEventListener('click', function(){
      var parts=b.getAttribute('data-toggle').split('|'); var h=byId(STATE.habits,parts[0]); var d=parts[1];
      var comp=Object.assign({}, h.completions||{});
      if(comp[d]) delete comp[d]; else comp[d]=true;
      saveItem('habits', h.id, Object.assign({},h,{completions:comp}));
    });
  });
  c.querySelectorAll('[data-edithabit]').forEach(function(b){ b.addEventListener('click', function(){ openHabitForm(byId(STATE.habits,b.getAttribute('data-edithabit'))); }); });
}
function openHabitForm(h){
  var pickedColor = h?h.color:'sage';
  var emojis=['⭐','💧','📚','🏃','🧘','🥗','😴','✍️','🎯','🧹'];
  var pickedEmoji = h?h.emoji:'⭐';
  var html='<label class="field">Habit name<input type="text" id="hName" value="'+escAttr(h?h.name:'')+'" placeholder="e.g. Drink water"></label>'+
    '<div class="field">Icon<div class="emoji-pick" id="hEmoji">'+emojis.map(function(e){ return '<button type="button" data-em="'+e+'" class="'+(pickedEmoji===e?'picked':'')+'">'+e+'</button>'; }).join('')+'</div></div>'+
    '<div class="field">Color<div class="swatchrow" id="hColor">'+TAGS.map(function(t){ return '<button type="button" class="swatch tag-'+t+' '+(pickedColor===t?'picked':'')+'" data-color="'+t+'"></button>'; }).join('')+'</div></div>'+
    '<div class="modal-actions">'+(h?'<button class="btn danger" id="hDelete">Delete</button>':'')+'<button class="btn" id="hSave">'+(h?'Save changes':'Add habit')+'</button></div>';
  openModal(h?'Edit habit':'New habit', html);
  document.querySelectorAll('#hEmoji button').forEach(function(b){ b.addEventListener('click', function(){ pickedEmoji=b.getAttribute('data-em'); document.querySelectorAll('#hEmoji button').forEach(function(x){x.classList.remove('picked');}); b.classList.add('picked'); }); });
  document.querySelectorAll('#hColor .swatch').forEach(function(s){ s.addEventListener('click', function(){ pickedColor=s.getAttribute('data-color'); document.querySelectorAll('#hColor .swatch').forEach(function(x){x.classList.remove('picked');}); s.classList.add('picked'); }); });
  document.getElementById('hSave').addEventListener('click', function(){
    var name=document.getElementById('hName').value.trim();
    if(!name){ toast('Name the habit first'); return; }
    saveItem('habits', h?h.id:genId(), {name:name, emoji:pickedEmoji, color:pickedColor, completions:h?h.completions||{}:{}, createdAt:h?h.createdAt:Date.now()});
    closeModal(); toast(h?'Habit updated':'Habit added');
  });
  if(h){ document.getElementById('hDelete').addEventListener('click', function(){ deleteItem('habits',h.id); closeModal(); toast('Habit deleted'); }); }
}

/* ============================================================
   GOALS
   ============================================================ */
function goalProgress(g){
  if(!g.milestones || !g.milestones.length) return g.progress||0;
  var done=g.milestones.filter(function(m){return m.done;}).length;
  return Math.round(done/g.milestones.length*100);
}
function renderGoals(c,actions){
  actions.innerHTML='<button class="btn" id="addGoalBtn">'+icon('plus',15)+' New goal</button>';
  document.getElementById('addGoalBtn').addEventListener('click', function(){ openGoalForm(); });
  if(!STATE.goals.length){
    c.innerHTML='<div class="empty"><span class="emoji">🎯</span><h3 class="hand">No goals yet</h3><p>Big or small — set a goal, break it into milestones, and watch your progress bar fill up.</p><button class="btn" id="emptyGoal">'+icon('plus',15)+' Set your first goal</button></div>';
    document.getElementById('emptyGoal').addEventListener('click', function(){ openGoalForm(); });
    return;
  }
  c.innerHTML='<div class="grid-cards">'+STATE.goals.map(function(g){
    var pct=goalProgress(g);
    return '<div class="card goal-card">'+
      '<div class="goal-top"><div><div class="goal-title">'+escapeHtml(g.title)+'</div>'+(g.targetDate?'<div class="goal-due">'+fmtCountdown(g.targetDate)+' · '+niceDate(g.targetDate)+'</div>':'')+'</div>'+
        '<div style="display:flex;gap:4px;"><button class="iconbtn" data-editgoal="'+g.id+'">'+icon('pencil',14)+'</button><button class="iconbtn" data-delgoal="'+g.id+'">'+icon('trash',14)+'</button></div></div>'+
      (g.description?'<div class="goal-desc">'+escapeHtml(g.description)+'</div>':'')+
      '<div><div class="goal-progress-label"><span>Progress</span><span>'+pct+'%</span></div><div class="progressbar"><div style="width:'+pct+'%;"></div></div></div>'+
      (g.milestones&&g.milestones.length?'<div>'+g.milestones.map(function(m,i){
        return '<div class="milestone'+(m.done?' done':'')+'" data-mtoggle="'+g.id+'|'+i+'"><button class="todo-check'+(m.done?' done':'')+'" style="width:16px;height:16px;">'+(m.done?'✓':'')+'</button>'+escapeHtml(m.text)+'</div>';
      }).join('')+'</div>':'')+
    '</div>';
  }).join('')+'</div>';
  c.querySelectorAll('[data-editgoal]').forEach(function(b){ b.addEventListener('click', function(){ openGoalForm(byId(STATE.goals,b.getAttribute('data-editgoal'))); }); });
  c.querySelectorAll('[data-delgoal]').forEach(function(b){ b.addEventListener('click', function(){ deleteItem('goals',b.getAttribute('data-delgoal')); toast('Goal deleted'); }); });
  c.querySelectorAll('[data-mtoggle]').forEach(function(el){
    el.addEventListener('click', function(){
      var parts=el.getAttribute('data-mtoggle').split('|'); var g=byId(STATE.goals,parts[0]); var i=parseInt(parts[1],10);
      var ms=g.milestones.slice(); ms[i]=Object.assign({},ms[i],{done:!ms[i].done});
      saveItem('goals', g.id, Object.assign({},g,{milestones:ms}));
    });
  });
}
function openGoalForm(g){
  var milestones = g&&g.milestones?g.milestones.slice():[];
  var html='<label class="field">Goal<input type="text" id="gTitle" value="'+escAttr(g?g.title:'')+'" placeholder="e.g. Launch my portfolio site"></label>'+
    '<label class="field">Description<textarea id="gDesc">'+escapeHtml(g?g.description:'')+'</textarea></label>'+
    '<label class="field">Target date<input type="date" id="gDate" value="'+(g?g.targetDate:'')+'"></label>'+
    '<div class="field">Milestones<div id="gMiles" style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px;"></div>'+
      '<div class="addrow" style="margin-top:0;"><input type="text" id="gNewMile" placeholder="Add a milestone…"><button type="button" class="btn subtle" id="gAddMile">'+icon('plus',14)+'</button></div></div>'+
    '<div class="modal-actions" style="margin-top:14px;">'+(g?'<button class="btn danger" id="gDelete">Delete</button>':'')+'<button class="btn" id="gSave">'+(g?'Save changes':'Create goal')+'</button></div>';
  openModal(g?'Edit goal':'New goal', html);
  function renderMiles(){
    document.getElementById('gMiles').innerHTML = milestones.map(function(m,i){
      return '<div class="checkline"><input type="checkbox" data-mi="'+i+'" '+(m.done?'checked':'')+'><span style="flex:1;">'+escapeHtml(m.text)+'</span><button type="button" class="iconbtn" data-mdel="'+i+'">'+icon('x',14)+'</button></div>';
    }).join('') || '<p style="font-size:12.5px;color:var(--ink-faint);">No milestones yet.</p>';
    document.querySelectorAll('[data-mi]').forEach(function(cb){ cb.addEventListener('change', function(){ milestones[parseInt(cb.getAttribute('data-mi'),10)].done=cb.checked; }); });
    document.querySelectorAll('[data-mdel]').forEach(function(b){ b.addEventListener('click', function(){ milestones.splice(parseInt(b.getAttribute('data-mdel'),10),1); renderMiles(); }); });
  }
  renderMiles();
  document.getElementById('gAddMile').addEventListener('click', function(){
    var inp=document.getElementById('gNewMile'); if(inp.value.trim()){ milestones.push({text:inp.value.trim(), done:false}); inp.value=''; renderMiles(); }
  });
  document.getElementById('gSave').addEventListener('click', function(){
    var title=document.getElementById('gTitle').value.trim();
    if(!title){ toast('Name your goal'); return; }
    saveItem('goals', g?g.id:genId(), {title:title, description:document.getElementById('gDesc').value.trim(), targetDate:document.getElementById('gDate').value, milestones:milestones, color:g?g.color:'sky'});
    closeModal(); toast(g?'Goal updated':'Goal created');
  });
  if(g){ document.getElementById('gDelete').addEventListener('click', function(){ deleteItem('goals',g.id); closeModal(); toast('Goal deleted'); }); }
}

/* ============================================================
   SETTINGS
   ============================================================ */
var THEME_DEFS = [
  {id:'peach', label:'Peach Bloom', a:'#FF9776', b:'#F2B84B'},
  {id:'lavender', label:'Lavender Sky', a:'#9B87C4', b:'#EE9BC0'},
  {id:'sage', label:'Sage Meadow', a:'#7DA377', b:'#D9AE5E'},
  {id:'ocean', label:'Ocean Mist', a:'#57A0B4', b:'#F0B15C'}
];
function renderSettings(c,actions){
  actions.innerHTML='';
  var theme=STATE.settings.theme||'peach';
  c.innerHTML =
    '<div class="settings-block card"><h3 class="hand">Appearance</h3><p>Pick the accent palette for your planner.</p>'+
      '<div class="theme-pick" id="themePick">'+THEME_DEFS.map(function(t){
        return '<button type="button" class="theme-opt'+(theme===t.id?' active':'')+'" data-theme="'+t.id+'"><span class="theme-swatch"><span style="background:'+t.a+';"></span><span style="background:'+t.b+';"></span></span><small>'+t.label+'</small></button>';
      }).join('')+'</div>'+
      '<div style="margin-top:18px;display:flex;gap:8px;">'+
        '<button class="btn subtle" data-mode="system">System</button><button class="btn subtle" data-mode="light">Light</button><button class="btn subtle" data-mode="dark">Dark</button>'+
      '</div>'+
    '</div>'+
    '<div class="settings-block card"><h3 class="hand">Calendar</h3><p>Choose which day starts your week.</p>'+
      '<div style="display:flex;gap:8px;"><button class="btn subtle" data-fd="sun">Sunday</button><button class="btn subtle" data-fd="mon">Monday</button></div>'+
    '</div>'+
    '<div class="settings-block card"><h3 class="hand">Your data</h3><p>Everything you write is saved automatically'+(persistMode==='db'?' and synced to your account.':' on this device.')+' Export a backup anytime.</p>'+
      '<button class="btn ghost" id="exportBtn">'+icon('download',15)+' Export as JSON</button>'+
    '</div>';
  document.querySelectorAll('[data-theme]').forEach(function(b){ b.addEventListener('click', function(){ STATE.settings.theme=b.getAttribute('data-theme'); saveSettings(); }); });
  document.querySelectorAll('[data-mode]').forEach(function(b){ b.addEventListener('click', function(){ STATE.settings.dark=b.getAttribute('data-mode')==='system'?null:b.getAttribute('data-mode'); saveSettings(); }); });
  document.querySelectorAll('[data-fd]').forEach(function(b){ b.addEventListener('click', function(){ STATE.settings.firstDay=b.getAttribute('data-fd'); saveSettings(); }); });
  document.getElementById('exportBtn').addEventListener('click', function(){
    var payload = JSON.stringify({events:STATE.events,notes:STATE.notes,todoLists:STATE.todoLists,todos:STATE.todos,habits:STATE.habits,journal:STATE.journal,goals:STATE.goals,dailyPlans:STATE.dailyPlans}, null, 2);
    if(window.claude && window.claude.use){
      window.claude.use('downloads').then(function(dl){
        if(dl){ dl.save({filename:'dahlia-planner-backup.json', data:payload}).then(function(){ toast('Backup saved'); }).catch(function(){ toast('Export cancelled'); }); }
        else fallbackDownload(payload);
      }).catch(function(){ fallbackDownload(payload); });
    } else fallbackDownload(payload);
  });
}
function fallbackDownload(payload){
  try{
    var blob=new Blob([payload],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a'); a.href=url; a.download='dahlia-planner-backup.json'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},1000);
  }catch(e){ toast('Export unavailable'); }
}

/* ============================================================
   GLOBAL SEARCH
   ============================================================ */
var searchInput, searchResults;
function initSearch(){
  searchInput=document.getElementById('searchInput');
  searchResults=document.getElementById('searchResults');
  searchInput.addEventListener('input', debounce(runSearch,150));
  searchInput.addEventListener('focus', function(){ if(searchInput.value.trim()) runSearch(); });
  document.addEventListener('click', function(e){ if(!e.target.closest('.searchbox')){ searchResults.style.display='none'; } });
}
function runSearch(){
  var q=searchInput.value.trim().toLowerCase();
  if(!q){ searchResults.style.display='none'; return; }
  var results=[];
  STATE.notes.forEach(function(n){ if((n.title+' '+n.content).toLowerCase().indexOf(q)>-1) results.push({type:'Note',title:n.title||'Untitled',go:function(){activeModule='notes';render();setTimeout(function(){openNoteEditor(n.id);},60);}}); });
  STATE.journal.forEach(function(j){ if((j.content||'').toLowerCase().indexOf(q)>-1) results.push({type:'Journal',title:niceDate(j.date),go:function(){activeModule='journal';render();setTimeout(function(){openJournalEditor(j.id);},60);}}); });
  STATE.todos.forEach(function(t){ if(t.text.toLowerCase().indexOf(q)>-1) results.push({type:'To-do',title:t.text,go:function(){activeListId=t.listId;activeModule='todos';render();}}); });
  STATE.goals.forEach(function(g){ if(g.title.toLowerCase().indexOf(q)>-1) results.push({type:'Goal',title:g.title,go:function(){activeModule='goals';render();setTimeout(function(){openGoalForm(g);},60);}}); });
  STATE.events.forEach(function(e){ if(e.title.toLowerCase().indexOf(q)>-1) results.push({type:'Event',title:e.title+' · '+niceDate(e.date),go:function(){activeModule='calendar';calCursor=fromStr(e.date);render();}}); });
  results=results.slice(0,12);
  if(!results.length){ searchResults.innerHTML='<div class="search-item"><span>No matches</span></div>'; }
  else{
    searchResults.innerHTML=results.map(function(r,i){ return '<div class="search-item" data-r="'+i+'"><b>'+escapeHtml(r.title)+'</b><span>'+r.type+'</span></div>'; }).join('');
    searchResults.querySelectorAll('[data-r]').forEach(function(el){ el.addEventListener('click', function(){ results[parseInt(el.getAttribute('data-r'),10)].go(); searchResults.style.display='none'; searchInput.value=''; }); });
  }
  searchResults.style.display='block';
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function(){
  initSearch();
  initPersistence();
});
})();