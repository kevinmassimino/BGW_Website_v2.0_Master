const PASSWORD='BGW';
function checkPassword(){const input=document.getElementById('passwordInput');const msg=document.getElementById('passwordMessage');if(input&&input.value===PASSWORD){localStorage.setItem('bgw-auth','true');document.getElementById('gate').classList.add('hidden');document.getElementById('site').classList.remove('hidden')}else if(msg){msg.textContent='Wrong password. Try again.'}}
function unlockIfAuthed(){if(localStorage.getItem('bgw-auth')==='true'){const g=document.getElementById('gate'),s=document.getElementById('site');if(g&&s){g.classList.add('hidden');s.classList.remove('hidden')}}}
unlockIfAuthed();
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&document.getElementById('passwordInput')===document.activeElement)checkPassword()});
function tick(){const el=document.getElementById('countdown');if(!el)return;const target=new Date('2026-09-17T00:00:00');const now=new Date();let diff=Math.max(0,target-now);const d=Math.floor(diff/86400000);diff-=d*86400000;const h=Math.floor(diff/3600000);diff-=h*3600000;const m=Math.floor(diff/60000);diff-=m*60000;const sec=Math.floor(diff/1000);el.innerHTML=`<div><strong>${d}</strong><span>Days</span></div><div><strong>${h}</strong><span>Hours</span></div><div><strong>${m}</strong><span>Minutes</span></div><div><strong>${sec}</strong><span>Seconds</span></div>`}tick();setInterval(tick,1000);
const toggle=document.querySelector('.menu-toggle');if(toggle){toggle.addEventListener('click',()=>document.querySelector('.nav-links').classList.toggle('open'))}


// Click-to-enlarge treatment for historical trip logos.
document.addEventListener('DOMContentLoaded', () => {
  const logos = document.querySelectorAll('.trip-logo-row img');
  if (!logos.length) return;
  const lightbox = document.createElement('div');
  lightbox.className = 'bgw-logo-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = '<button type="button" aria-label="Close enlarged logo">×</button><img alt="Enlarged trip logo">';
  document.body.appendChild(lightbox);
  const enlarged = lightbox.querySelector('img');
  const close = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); };
  logos.forEach(logo => {
    logo.classList.add('clickable-trip-logo');
    logo.setAttribute('tabindex','0');
    logo.setAttribute('role','button');
    const open = () => { enlarged.src=logo.src; enlarged.alt=logo.alt || 'Enlarged trip logo'; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); };
    logo.addEventListener('click', open);
    logo.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();open();} });
  });
  lightbox.addEventListener('click', e => { if(e.target===lightbox || e.target.tagName==='BUTTON') close(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') close(); });
});

// Site-wide footer error link.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer').forEach(footer => {
    if (footer.querySelector('.report-error-link')) return;
    const scriptTag = [...document.scripts].find(s => /(?:^|\/)script\.js(?:\?.*)?$/.test(s.getAttribute('src') || ''));
    const src = scriptTag ? (scriptTag.getAttribute('src') || '') : '';
    const prefix = src.replace(/script\.js(?:\?.*)?$/, '');
    const link = document.createElement('a');
    link.className = 'report-error-link'; link.href = prefix + 'report-error.html'; link.textContent = 'Report An Error';
    footer.appendChild(link);
  });
});


// Player profile round-result year tabs.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.player-rounds-section').forEach(section => {
    const tabs=[...section.querySelectorAll('[data-round-year]')];
    const panels=[...section.querySelectorAll('[data-round-panel]')];
    tabs.forEach(tab => tab.addEventListener('click', () => {
      const year=tab.dataset.roundYear;
      tabs.forEach(t => { t.classList.toggle('active', t===tab); t.setAttribute('aria-selected', t===tab ? 'true' : 'false'); });
      panels.forEach(panel => panel.classList.toggle('hidden', panel.dataset.roundPanel!==year));
    }));
  });
});
