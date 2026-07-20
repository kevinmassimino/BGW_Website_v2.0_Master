(function(){
  const data=window.BGW_COMPETITION_DATA;
  if(!data)return;
  const years=Object.keys(data.years).sort((a,b)=>Number(b)-Number(a));
  const params=new URLSearchParams(location.search);
  let activeYear=params.get('year')&&data.years[params.get('year')]?params.get('year'):years[0];
  let activeSession=params.get('session')||data.years[activeYear].sessions[0].id;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmt=n=>Number.isInteger(Number(n))?String(Number(n)):Number(n).toFixed(1);
  function team(year,id){return year.teams.find(t=>t.id===id)||{name:'Team',color:'#777',players:[]}}
  function playerNames(side){return String(side).split('/').map(x=>x.trim()).filter(Boolean)}
  function playerImage(name){const p=data.players[name]||data.players[name.replace('Santomuaro','Santomauro')];return p?'../assets/images/'+p.image:'../assets/logos/trophy.png'}
  function profileLink(name){const p=data.players[name]||data.players[name.replace('Santomuaro','Santomauro')];return p?'../players/'+p.profile:'#'}
  function updateUrl(){history.replaceState(null,'',`?year=${activeYear}&session=${activeSession}`)}
  function renderYears(){
    $('yearNav').innerHTML=years.map(y=>`<button class="year-button ${y===activeYear?'active':''}" data-year="${y}">${y}<span class="sr-only"> BGW scoring</span></button>`).join('');
    $('yearNav').querySelectorAll('button').forEach(b=>b.onclick=()=>{activeYear=b.dataset.year;activeSession=data.years[activeYear].sessions[0].id;render();});
  }
  function renderBoard(){
    const y=data.years[activeYear],a=y.teams[0],b=y.teams[1],sa=y.overallScores[a.id]||0,sb=y.overallScores[b.id]||0;
    const target=(y.totalPointsAvailable/2)+0.5;
    $('overallScoreboard').innerHTML=`<section class="overall-board"><div class="board-head"><div class="team-score"><div class="board-kicker">${esc(activeYear)} • ${esc(y.location)}</div><div class="team-name" style="color:${a.color}">${esc(a.name)}</div><div class="team-points" style="color:${a.color}">${fmt(sa)}</div></div><div class="score-divider"><span>OVERALL</span><strong>${target} to win</strong></div><div class="team-score"><div class="board-kicker">Competition Score</div><div class="team-name" style="color:${b.color}">${esc(b.name)}</div><div class="team-points" style="color:${b.color}">${fmt(sb)}</div></div></div><div class="score-breakdown"><div><strong>${fmt(y.matchScores[a.id]||0)} – ${fmt(y.matchScores[b.id]||0)}</strong><span>Match points</span></div><div><strong>${fmt(y.netScores[a.id]||0)} – ${fmt(y.netScores[b.id]||0)}</strong><span>Net Championship points</span></div><div><strong>${y.totalPointsAvailable}</strong><span>Total points available</span></div></div></section>${y.historicalNote?`<p class="historical-note">${y.historicalNote}</p>`:''}`;
  }
  function renderSessions(){
    const y=data.years[activeYear];
    if(!y.sessions.some(s=>s.id===activeSession))activeSession=y.sessions[0].id;
    $('sessionNav').innerHTML=y.sessions.map(s=>`<button class="session-button ${s.id===activeSession?'active':''}" data-session="${s.id}">${esc(s.name)}</button>`).join('');
    $('sessionNav').querySelectorAll('button').forEach(b=>b.onclick=()=>{activeSession=b.dataset.session;renderSessions();renderSession();updateUrl();});
  }
  function sessionTeamScores(y,s){
    const scores=Object.fromEntries(y.teams.map(t=>[t.id,0]));
    if(s.type==='net'){s.podium.forEach(p=>{if(p.teamId)scores[p.teamId]+=p.points})} else if(s.type==='special'){Object.entries(s.scores||{}).forEach(([id,v])=>scores[id]+=v)}
    else s.matches.forEach(m=>{if(m.teamA)scores[m.teamA]+=m.sideAPoints;if(m.teamB)scores[m.teamB]+=m.sideBPoints});
    return scores;
  }
  function renderSession(){
    const y=data.years[activeYear],s=y.sessions.find(x=>x.id===activeSession),a=y.teams[0],b=y.teams[1],scores=sessionTeamScores(y,s);
    $('sessionSummary').innerHTML=`<div class="session-header"><div><p class="eyebrow">${s.type==='net'?'Individual stroke play':'Session'}</p><h2>${esc(s.name)}</h2></div><div class="session-meta">${esc([s.date,s.course].filter(Boolean).join(' • '))}<div class="session-score"><span class="team-dot" style="background:${a.color}"></span>${fmt(scores[a.id]||0)} <span>–</span> ${fmt(scores[b.id]||0)}<span class="team-dot" style="background:${b.color}"></span></div></div></div>`;
    $('matchList').innerHTML=s.type==='net'?renderNet(y,s):s.type==='special'?renderSpecial(y,s):s.matches.map(m=>renderMatch(y,m)).join('');
    $('matchList').querySelectorAll('.match-summary').forEach(el=>el.onclick=()=>el.closest('.match-card').classList.toggle('open'));
  }

  function renderSpecial(y,s){const a=y.teams[0],b=y.teams[1];return `<section class="net-card"><div class="score-breakdown"><div><strong style="color:${a.color}">${fmt((s.scores||{})[a.id]||0)}</strong><span>${esc(a.name)}</span></div><div><strong style="color:${b.color}">${fmt((s.scores||{})[b.id]||0)}</strong><span>${esc(b.name)}</span></div><div><strong>${fmt(Object.values(s.scores||{}).reduce((x,v)=>x+Number(v),0))}</strong><span>Points available</span></div></div></section>`}
  function avatars(side){return `<div class="player-stack">${playerNames(side).map(n=>`<a href="${profileLink(n)}" title="${esc(n)}"><img src="${playerImage(n)}" alt="${esc(n)}"></a>`).join('')}</div>`}
  function renderMatch(y,m){
    const ta=team(y,m.teamA),tb=team(y,m.teamB),aWon=m.sideAPoints>m.sideBPoints,bWon=m.sideBPoints>m.sideAPoints;
    const holes=(m.holes||[]).map(h=>{const color=h.winner==='SideA'?ta.color:h.winner==='SideB'?tb.color:'#cbd2cc';return `<div class="hole-cell"><div class="hole-number">${h.hole}</div><div class="hole-scores"><strong>${esc(h.a)}</strong><br>${esc(h.b)}</div><div class="hole-marker" style="background:${color}"></div><div class="hole-status">${esc(h.status||'—')}</div></div>`}).join('');
    return `<article class="match-card"><div class="match-summary"><div class="match-side">${avatars(m.sideA)}<div><div class="side-label" style="color:${ta.color}">${esc(m.sideA)}</div><small>${esc(ta.name)}</small>${aWon?`<span class="winner-chevron" style="background:${ta.color}">Winner</span>`:''}</div></div><div class="match-result"><span>${esc(m.format)}</span><strong>${esc(m.result)}</strong><span>${aWon?esc(m.sideA):bWon?esc(m.sideB):'Halved'}</span><button type="button">Hole-by-hole ▾</button></div><div class="match-side side-b"><div><div class="side-label" style="color:${tb.color}">${esc(m.sideB)}</div><small>${esc(tb.name)}</small>${bWon?`<span class="winner-chevron" style="background:${tb.color}">Winner</span>`:''}</div>${avatars(m.sideB)}</div></div><div class="match-details"><div class="hole-scroll"><div class="hole-grid">${holes}</div></div><p class="details-note">Scores shown are the handicap-adjusted values supplied in the BGW Match Holes data. No handicap calculation is performed on this page.</p></div></article>`
  }
  function renderNet(y,s){
    const podium=s.podium.map(p=>{const t=team(y,p.teamId);return `<div class="podium-place"><span class="place-number">${esc(p.placeLabel||p.place)}</span><img src="${playerImage(p.player)}" alt="${esc(p.player)}"><h3>${esc(p.player)}</h3><p>${esc(t.name)}</p><p>Net ${esc(p.net)} • Gross ${esc(p.gross)}</p><div class="podium-points">+${fmt(p.points)} pts</div></div>`}).join('');
    const rows=s.standings.map((p,i)=>{const t=team(y,(data.years[activeYear].teams.find(tt=>tt.players.some(pp=>pp.name===p.player))||{}).id);return `<tr><td>${esc(p.placeLabel||p.place||i+1)}</td><td><a href="${profileLink(p.player)}"><strong>${esc(p.player)}</strong></a></td><td><span class="team-dot" style="background:${t.color}"></span> ${esc(t.name)}</td><td>${esc(p.gross)}</td><td>${esc(p.net)}</td></tr>`}).join('');
    return `<section class="net-card"><div class="podium">${podium}</div><div class="hole-scroll"><table class="standings-table"><thead><tr><th>Pos.</th><th>Player</th><th>Team</th><th>Gross</th><th>Net</th></tr></thead><tbody>${rows}</tbody></table></div></section>`
  }
  function render(){renderYears();renderBoard();renderSessions();renderSession();updateUrl()}
  render();
})();
