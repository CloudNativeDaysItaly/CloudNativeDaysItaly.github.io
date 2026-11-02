/* Template card "pro" per speaker e sponsor: porting 1:1 dei layout
   approvati (cnd-generator/experiments/templates.js, handoff v11/v12
   del 2026-08-11). Le coordinate dell'oggetto `L` di ogni template SONO
   il design approvato: non toccarle senza una nuova approvazione.
   Firma: fn(ctx, A, S, F) con F = { W, H, fmt }. */
import {
  C,
  FONT,
  sunburst,
  halftone,
  comicSlab,
  comicText,
  bandText,
  ring,
  roundPhoto,
  popPhoto,
  stamp,
  stampWidth,
  drawLogoWhite,
  drawLogoStampBox,
  drawEl,
  coverCrop,
  fitDisplayLines,
  drawDisplayTitle,
  drawSpeakersBlock,
  pizzaPoint,
} from './helpers';
import { EVENT } from '../event';


/* ── Duo: la seconda foto ─────────────────────────────────────────────
   I template duo disegnano due ritratti. Con due upload distinti ognuno
   va inquadrato al centro; con un solo upload si tengono due crop diversi
   (0.28 e 0.72) per non ripetere la stessa inquadratura due volte. */
/* ── Badge di ruolo (ex tier): l'etichetta arriva completa dal dato, così
   la stessa card serve "GOLD SPONSOR", "MEDIA PARTNER" o "HOST". Fino a 20
   caratteri resta alla size approvata, oltre si riduce in proporzione per
   non uscire dalla card. */
/* ── Logo sponsor: la larghezza nominale è quella del layout, ma un logo
   quadrato o verticale la supererebbe in altezza e uscirebbe dal pannello.
   Qui si tiene la larghezza finché l'altezza sta nel box, poi si scala per
   altezza. Centrato su (cx, cy). */
function drawSponsorLogo(ctx, logo, cx, cy, targetW, maxH) {
  const ratio = (logo.naturalHeight || logo.height || 1) / (logo.naturalWidth || logo.width || 1);
  let w = targetW;
  let h = w * ratio;
  if (h > maxH) {
    h = maxH;
    w = h / ratio;
  }
  ctx.drawImage(logo, cx - w / 2, cy - h / 2, w, h);
}

const badgeSize = (text, base) =>
  text.length <= 20 ? base : Math.max(Math.round((base * 20) / text.length), Math.round(base * 0.62));

const duoPhoto2 = (A) => A.photo2 || A.photo;
const duoCrops = (A) => (A.photo2 && A.photo2 !== A.photo ? [0.5, 0.5] : [0.28, 0.72]);

export const FORMATS = {
  portrait: { W: 1080, H: 1350 },
  square: { W: 1080, H: 1080 },
  landscape: { W: 1920, H: 1080 },
  story: { W: 1080, H: 1920 },
};

/* Dati di default + casi limite REALI (da src/config del sito, ed. 2026) */
export const SPEAKER = {
  badge: 'KEYNOTE SPEAKER',
  title: 'The New Digital Nervous System',
  speakers: [{
    name: 'Serena Sensini',
    roles: ['Innovation & Emerging Technologies Leader at Dedalus', 'Writer at Apogeo | Blogger at TheRedCode.it'],
  }],
  date: EVENT.date,
  city: 'Bologna',
};

export const SPEAKER_LONG = {
  badge: 'SPEAKER',
  title: 'Orchestrating Add-ons and Applications Across Multi-Cluster Kubernetes Environments with Sveltos',
  speakers: [{
    name: 'Giuseppe Vincenzo Abbaticchio',
    roles: ['Head of Platform Engineering and Cloud Operations at Wolters Kluwer'],
  }],
  date: EVENT.date,
  city: 'Bologna',
};

export const SPEAKER_DUO = {
  badge: 'SPEAKER',
  title: 'AI e Sicurezza Cloud-Native: Potenziare la Gestione della Sicurezza con gli Assistenti AI',
  speakers: [
    { name: 'Giulio Puri', roles: ['Sr Solutions Engineer at Sysdig'] },
    { name: 'Andrea Vivaldi', roles: ['Sr Customer Solution Architect at Sysdig'] },
  ],
  date: EVENT.date,
  city: 'Bologna',
};

export const SPONSOR = {
  tier: 'GOLD SPONSOR',
  company: 'Clastix',
  date: EVENT.date,
  city: 'Bologna',
  venue: 'Savoia Hotel Regency, Bologna',
};

/* Pizza dritta lungo una banda diagonale, a sinistra del testo centrato */
export function pizzaInBand(ctx, A, band, x, w) {
  const ang = Math.atan2(band.y1 - band.y0, band.x1 - band.x0);
  const y = band.y0 + ((x - band.x0) / (band.x1 - band.x0)) * (band.y1 - band.y0);
  pizzaPoint(ctx, A.el.pizza, x, y, w, x + Math.cos(ang) * 200, y + Math.sin(ang) * 200);
}

/* ══ S1. Comic blue ═══════════════════════════════════════════════════ */
export function speakerComicBlue(ctx, A, S = SPEAKER, F = FORMATS.portrait) {
  const { W, H, fmt } = F;
  const L = {
    portrait: { logo: [W / 2 - 130, 195, 260], slabY: [118, 52], badgeY: 495, titleY: 588, titleMaxW: W - 180, titleSize: 72, photo: [250, 950, 150], nameX: 455, nameY: 860, roleGap: 38, roleSize: 30, donutBR: [W - 80, H - 200], band: { x0: -60, y0: H - 150, x1: W + 60, y1: H - 232 } },
    square: { logo: [W / 2 - 120, 110, 240], slabY: [66, 24], badgeY: 350, titleY: 440, titleMaxW: W - 180, titleSize: 64, photo: [220, 750, 120], nameX: 400, nameY: 672, roleGap: 40, roleSize: 28, donutBR: [W - 80, H - 160], band: { x0: -60, y0: H - 120, x1: W + 60, y1: H - 190 } },
    landscape: { logo: [W / 2 - 130, 55, 260], slabY: [44, 14], badgeY: 300, titleY: 390, titleMaxW: 950, titleSize: 76, photo: [1550, 560, 190], nameX: 90, nameY: 700, roleGap: 50, roleSize: 31, donutBR: [W - 90, H - 260], band: { x0: -60, y0: H - 120, x1: W + 60, y1: H - 190 } },
    story: { logo: [W / 2 - 130, 290, 260], slabY: [200, 130], badgeY: 660, titleY: 760, titleMaxW: W - 180, titleSize: 74, photo: [255, 1300, 155], nameX: 465, nameY: 1225, roleGap: 42, roleSize: 34, donutBR: [W - 80, H - 300], band: { x0: -60, y0: H - 200, x1: W + 60, y1: H - 285 } },
  }[fmt];
  sunburst(ctx, W, H, C.blue, C.blueDark, 0.62, 0.4, 40);
  halftone(ctx, -20, H * 0.3, 300, 380, 'rgba(255,255,255,0.3)', { fade: 'x' });
  halftone(ctx, W - 280, H * 0.56, 300, 340, 'rgba(17,17,17,0.22)', { fade: 'none' });
  comicSlab(ctx, -80, L.slabY[0], W + 80, L.slabY[1], 20, 0.7);
  drawEl(ctx, A.el.donut3rings, 60, 70, fmt === 'square' ? 220 : 300, 0.2);
  drawEl(ctx, A.el.donutStripes, W - 30, fmt === 'landscape' ? 260 : 300, 210, -0.3);
  drawEl(ctx, A.el.donut3rings, L.donutBR[0], L.donutBR[1], fmt === 'square' ? 200 : 260, 0.5);
  drawLogoWhite(ctx, A.logoWhite, L.logo[0], L.logo[1], L.logo[2]);
  ctx.textAlign = 'left';
  comicText(ctx, S.badge, 90, L.badgeY, { size: 52, weight: 800, fill: C.magenta, stroke: C.white, strokeW: 0.18 });
  const fit = fitDisplayLines(ctx, S.title, { maxW: L.titleMaxW, size: L.titleSize, maxLines: 2, minSize: 44, font: FONT.sans, weight: 800 });
  fit.lines.forEach((line, i) =>
    comicText(ctx, line, 90, L.titleY + i * fit.size * 1.2, { size: fit.size, weight: 800, fill: C.white, stroke: C.ink }));
  // foto + nome + ruoli (in landscape il blocco testo sta sotto il titolo)
  roundPhoto(ctx, A.photo, L.photo[0], L.photo[1], L.photo[2], [{ c: C.white, w: 14 }, { c: C.magenta, w: 18 }]);
  const sp = S.speakers[0];
  const nameMaxW = fmt === 'landscape' ? 900 : W - L.nameX - 155;
  const nameFit = fitDisplayLines(ctx, sp.name, { maxW: nameMaxW, size: 62, maxLines: 2, minSize: 36, font: FONT.sans, weight: 800 });
  nameFit.lines.forEach((line, i) =>
    comicText(ctx, line, L.nameX, L.nameY + i * nameFit.size * 1.13, { size: nameFit.size, weight: 800, fill: C.magenta, stroke: C.white, strokeW: 0.16 }));
  // ruoli leggibili: wrap max 2 righe, STESSA size per tutti i ruoli
  let roleY = L.nameY + (nameFit.lines.length - 1) * nameFit.size * 1.13 + L.roleGap;
  const probe = sp.roles.map((role) =>
    fitDisplayLines(ctx, role, { maxW: nameMaxW, size: L.roleSize, maxLines: 2, minSize: 26, font: FONT.sans, weight: 500, caps: false }));
  const rSize = Math.min(...probe.map((f) => f.size));
  sp.roles.forEach((role) => {
    const rFit = fitDisplayLines(ctx, role, { maxW: nameMaxW, size: rSize, maxLines: 2, minSize: rSize, font: FONT.sans, weight: 500, caps: false });
    ctx.font = `500 ${rSize}px ${FONT.sans}`;
    ctx.fillStyle = C.white;
    rFit.lines.forEach((line) => {
      ctx.fillText(line, L.nameX, roleY);
      roleY += rSize * 1.25;
    });
    roleY += 6;
  });
  comicSlab(ctx, L.band.x0, L.band.y0, L.band.x1, L.band.y1, 42, 0.85);
  bandText(ctx, `${S.date} | ${S.city}`, L.band.x0, L.band.y0, L.band.x1, L.band.y1, { size: 42 });
  pizzaInBand(ctx, A, L.band, fmt === 'landscape' ? 420 : 195, 90);
}

/* ══ S3. Pop 2027 ═════════════════════════════════════════════════════ */
export function speakerPop2027(ctx, A, S = SPEAKER, F = FORMATS.portrait) {
  const { W, H, fmt } = F;
  const duo = S.speakers.length > 1;
  const duoFx = duoCrops(A);
  const L = {
    portrait: { logo: [80, 80, 250], badgeY: 92, photo1: [80, 260, 430], duo1: [80, 280, 320], duo2: [430, 315, 320], titleY: 770, titleSize: 115, titleMaxW: W - 160, bandH: 118, textX: 80 },
    square: { logo: [70, 65, 230], badgeY: 78, photo1: [70, 215, 360], duo1: [70, 235, 280], duo2: [380, 265, 280], titleY: 630, titleSize: 84, titleMaxW: W - 140, bandH: 100, textX: 70 },
    landscape: { logo: [90, 70, 250], badgeY: 82, photo1: [90, 220, 560], duo1: [90, 250, 400], duo2: [520, 300, 400], titleY: 260, titleSize: 96, titleMaxW: 0, bandH: 110, textX: 0 },
    story: { logo: [80, 100, 260], badgeY: 115, photo1: [80, 420, 480], duo1: [80, 440, 360], duo2: [470, 480, 360], titleY: 1030, titleSize: 115, titleMaxW: W - 160, bandH: 130, textX: 80 },
  }[fmt];
  ctx.fillStyle = C.blue;
  ctx.fillRect(0, 0, W, H);
  drawLogoWhite(ctx, A.logoWhite, L.logo[0], L.logo[1], L.logo[2]);
  // ciambella glassata DIETRO l'angolo destro della foto (mai sotto il testo)
  if (!duo) {
    const gl = { portrait: [505, 640, 170], square: [455, 520, 150], landscape: [630, 750, 190], story: [545, 890, 180] }[fmt];
    drawEl(ctx, A.el.donutGlaze, gl[0], gl[1], gl[2], -0.15);
  }
  if (duo) {
    popPhoto(ctx, A.photo, L.duo1[0], L.duo1[1], L.duo1[2], { rot: -0.03, fx: duoFx[0] });
    popPhoto(ctx, duoPhoto2(A), L.duo2[0], L.duo2[1], L.duo2[2], { rot: 0.035, fx: duoFx[1] });
  } else {
    popPhoto(ctx, A.photo, L.photo1[0], L.photo1[1], L.photo1[2], { zoom: 1 });
  }
  // duo su formati larghi/alti: relatori impilati (nomi stessa size)
  const blockLayout = fmt === 'landscape' || fmt === 'story' ? 'rows' : 'columns';
  if (fmt === 'landscape') {
    // elementi PRIMA dello stamp badge (lo stamp resta a livello superiore)
    const textX = duo ? 990 : 720;
    const titleMaxW = W - textX - 250;
    drawEl(ctx, A.el.donut3rings, W - 120, 420, 260, 0.15);
    drawEl(ctx, A.el.star4, W - 190, 780, 160, -0.2);
    drawEl(ctx, A.el.donutBitten, 1245, 165, 145, 0.2);
    ctx.textAlign = 'left';
    const yTitle = drawDisplayTitle(ctx, S.title, textX, duo ? 320 : 300, { maxW: titleMaxW, size: L.titleSize, maxLines: 3 });
    drawSpeakersBlock(ctx, S.speakers, textX, yTitle + 26, { nameSize: 50, nameColor: C.white, roleColor: 'rgba(255,255,255,0.92)', maxW: titleMaxW, layout: blockLayout });
  } else {
    if (duo) {
      drawEl(ctx, A.el.donut3rings, W - 95, fmt === 'square' ? 220 : 260, 230, 0.15);
      drawEl(ctx, A.el.star4, W - 75, fmt === 'square' ? 560 : 700, 140, -0.2);
    } else {
      halftone(ctx, L.photo1[0] + L.photo1[2] + 100, L.photo1[1] - 30, W - L.photo1[2] - 320, 250, 'rgba(255,255,255,0.2)', { fade: 'y' });
      drawEl(ctx, A.el.donut3rings, fmt === 'story' ? W - 180 : W - 290, L.photo1[1] + 180, fmt === 'square' ? 280 : 340, 0.15);
      if (fmt !== 'square') drawEl(ctx, A.el.star4, fmt === 'story' ? W - 150 : W - 140, L.photo1[1] + 420, 170, -0.2);
      if (fmt === 'story') {
        drawEl(ctx, A.el.donutBitten, 90, H - 300, 170, -0.1);
        drawEl(ctx, A.el.donutGlaze, W - 110, 1520, 170, 0.2);
        drawEl(ctx, A.el.donut3rings, W - 250, 1690, 130, -0.1);
      }
    }
    ctx.textAlign = 'left';
    const yTitle = drawDisplayTitle(ctx, S.title, L.textX, L.titleY, { maxW: L.titleMaxW, size: L.titleSize, maxLines: fmt === 'square' ? 2 : 3 });
    drawSpeakersBlock(ctx, S.speakers, L.textX, yTitle + 26, { nameSize: fmt === 'square' ? 42 : 52, roleSize: fmt === 'square' ? 26 : 28, nameColor: C.white, roleColor: 'rgba(255,255,255,0.92)', maxW: W - 160, layout: blockLayout });
  }
  // stamp badge SOPRA gli elementi grafici (livello superiore)
  stamp(ctx, S.badge, W - 60 - stampWidth(ctx, S.badge, 54), L.badgeY, { size: 54, rot: 0.05 });
  // banda magenta in basso; pizza nella banda punta al testo
  ctx.fillStyle = C.magenta;
  ctx.fillRect(0, H - L.bandH, W, L.bandH);
  ctx.font = `600 34px ${FONT.sans}`;
  ctx.fillStyle = C.white;
  ctx.textBaseline = 'middle';
  ctx.fillText(`${S.date} · ${S.city} · cloudnativedaysitaly.org`, 80, H - L.bandH / 2);
  ctx.textBaseline = 'alphabetic';
  pizzaPoint(ctx, A.el.pizza, W - 60, H - L.bandH / 2 + 3, 88, W - 220, H - L.bandH / 2);
}

/* ══ S4. Pop split ════════════════════════════════════════════════════ */
export function speakerPopSplit(ctx, A, S = SPEAKER, F = FORMATS.portrait) {
  const { W, H, fmt } = F;
  const duo = S.speakers.length > 1;
  const duoFx = duoCrops(A);
  const L = {
    portrait: { split: [0.62, 0.45], texSize: 260, texY: 30, logo: [W - 270, 75, 230], photo1: [90, 260, 430], duo1: [90, 270, 330], duo2: [450, 320, 330], donut: [640, 620, 190], donutDuo: [865, 620, 190], star: [W - 130, 500, 150], starDuo: [W - 130, 430, 150], titleY: 795, titleSize: 96, titleMaxW: W - 180, stampMin: 1160, stampMax: 1225 },
    square: { split: [0.58, 0.42], texSize: 210, texY: 22, logo: [W - 250, 62, 210], photo1: [80, 210, 350], duo1: [80, 220, 280], duo2: [390, 255, 280], donut: [540, 480, 160], donutDuo: [730, 480, 160], star: [W - 115, 390, 130], titleY: 630, titleSize: 78, titleMaxW: W - 160, stampMin: 930, stampMax: 985 },
    landscape: { split: [0.72, 0.5], texSize: 270, texY: 24, logo: [W - 320, 60, 270], photo1: [110, 250, 410], duo1: [110, 255, 360], duo2: [500, 295, 360], donut: [1300, 290, 190], star: [W - 170, 460, 160], glaze: [1520, 350, 160], bitten: [1600, 640, 150], titleY: 745, titleSize: 80, titleMaxW: W - 160, stampFixed: [1350, 950] },
    story: { split: [0.65, 0.52], texSize: 300, texY: 40, logo: [W - 290, 100, 250], photo1: [90, 430, 500], duo1: [90, 450, 390], duo2: [510, 500, 390], donut: [700, 890, 200], donutDuo: [700, 980, 200], star: [W - 140, 720, 150], titleY: 1170, titleSize: 96, titleMaxW: W - 180, stampMin: 1720, stampMax: 1780 },
  }[fmt];
  // Con due foto il donut andrebbe a coprire il secondo ritratto: nei
  // formati verticali e quadrato ha una posizione dedicata (sfiora il lato
  // destro della foto, in 9:16 scende sotto il bordo inferiore). In 4:5 sale
  // anche la stella, altrimenti il donut spostato le finisce addosso.
  // Il landscape resta com'è: là il donut è già fuori dalle foto.
  const donutPos = (duo && L.donutDuo) || L.donut;
  const starPos = (duo && L.starDuo) || L.star;
  ctx.fillStyle = C.blue;
  ctx.fillRect(0, 0, W, H);
  ctx.beginPath();
  ctx.moveTo(0, H * L.split[0]);
  ctx.lineTo(W, H * L.split[1]);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fillStyle = C.ink;
  ctx.fill();
  ctx.font = `${L.texSize}px ${FONT.display}`;
  ctx.fillStyle = C.blueDark;
  ctx.textBaseline = 'top';
  ctx.fillText('SPEAKER', 35, L.texY); // S iniziale visibile per intero
  halftone(ctx, W - 360, H - 420, 380, 440, 'rgba(255,255,255,0.22)', { fade: 'none' });
  // logo centrato in altezza sulla scritta SPEAKER
  drawLogoWhite(ctx, A.logoWhite, L.logo[0], L.logo[1], L.logo[2]);
  if (duo) {
    popPhoto(ctx, A.photo, L.duo1[0], L.duo1[1], L.duo1[2], { rot: -0.03, frame: C.ink, fx: duoFx[0] });
    popPhoto(ctx, duoPhoto2(A), L.duo2[0], L.duo2[1], L.duo2[2], { rot: 0.03, frame: C.ink, fx: duoFx[1] });
  } else {
    popPhoto(ctx, A.photo, L.photo1[0], L.photo1[1], L.photo1[2], { rot: -0.03, frame: C.ink });
  }
  drawEl(ctx, A.el.donut3rings, donutPos[0], donutPos[1], donutPos[2], 0.2);
  drawEl(ctx, A.el.star4, starPos[0], starPos[1], starPos[2], 0.15);
  if (L.glaze) drawEl(ctx, A.el.donutGlaze, L.glaze[0], L.glaze[1], L.glaze[2], -0.2);
  if (L.bitten) drawEl(ctx, A.el.donutBitten, L.bitten[0], L.bitten[1], L.bitten[2], 0.25);
  // titolo: se entra in UNA riga (landscape) la spezzo comunque in due
  // colori, prima metà bianca e seconda gialla, come negli altri formati
  const fit4 = fitDisplayLines(ctx, S.title, { maxW: L.titleMaxW, size: L.titleSize, maxLines: 3 });
  ctx.font = `${fit4.size}px ${FONT.display}`;
  ctx.textBaseline = 'top';
  let yTitle;
  if (fit4.lines.length === 1) {
    const words = fit4.lines[0].split(' ');
    const head = words.slice(0, Math.ceil(words.length / 2)).join(' ') + ' ';
    const tail = words.slice(Math.ceil(words.length / 2)).join(' ');
    ctx.fillStyle = C.white;
    ctx.fillText(head, 90, L.titleY);
    ctx.fillStyle = C.yellow;
    ctx.fillText(tail, 90 + ctx.measureText(head).width, L.titleY);
    yTitle = L.titleY + fit4.size * 1.05;
  } else {
    fit4.lines.forEach((line, i) => {
      ctx.fillStyle = i === fit4.lines.length - 1 ? C.yellow : C.white;
      ctx.fillText(line, 90, L.titleY + i * fit4.size * 1.05);
    });
    yTitle = L.titleY + fit4.lines.length * fit4.size * 1.05;
  }
  const yBlock = drawSpeakersBlock(ctx, S.speakers, 90, yTitle + 22, { nameSize: 50, nameColor: C.magenta, roleColor: C.white, maxW: L.titleMaxW });
  if (L.stampFixed) {
    // landscape: stamp in basso a destra, pizza a fianco che lo punta
    stamp(ctx, `${S.date} · ${S.city}`, L.stampFixed[0], L.stampFixed[1], { size: 40, rot: -0.02, fill: C.yellow });
    pizzaPoint(ctx, A.el.pizza, L.stampFixed[0] - 95, L.stampFixed[1] + 32, 90, L.stampFixed[0] + 5, L.stampFixed[1] + 30);
  } else {
    const stampY = Math.min(Math.max(yBlock + 18, L.stampMin), L.stampMax);
    stamp(ctx, `${S.date} · ${S.city}`, 90, stampY, { size: 40, rot: -0.02, fill: C.yellow });
    // pizza a destra dello stamp, punta al testo della data
    pizzaPoint(ctx, A.el.pizza, 600, stampY + 42, 95, 470, stampY + 38);
  }
  ctx.textBaseline = 'alphabetic';
}

/* ══ S5. Ibrido (foto tonda o quadrata; bg sunburst o facets SVG) ═════ */
export function speakerHybrid(ctx, A, S = SPEAKER, F = FORMATS.portrait, photoShape = 'round', bgStyle = 'sunburst') {
  const { W, H, fmt } = F;
  const L = {
    portrait: { logo: [80, 80, 250], stampY: 235, donutA: [585, 345, 190], donutB: [W - 55, 790, 170], donutC: [30, 470, 130], glaze: [W - 60, 290, 140], round: [W - 310, 560, 190], sq: [W - 520, 355, 420], titleY: 560, titleMaxW: 450, titleSize: 92, blockMin: 950, roleSize: 29, band: { x0: -60, y0: H - 128, x1: W + 60, y1: H - 196 }, pizzaX: 195 },
    square: { logo: [70, 65, 230], stampY: 205, donutA: [545, 250, 160], donutB: [W - 50, 640, 150], donutC: [25, 380, 110], glaze: [W - 55, 245, 120], round: [W - 280, 440, 160], sq: [W - 450, 260, 360], titleY: 430, titleMaxW: 560, titleSize: 74, blockMin: 745, nameSize: 46, roleSize: 28, band: { x0: -60, y0: H - 108, x1: W + 60, y1: H - 168 }, pizzaX: 195 },
    landscape: { logo: [90, 70, 250], stampY: 225, donutA: [1290, 220, 200], donutB: [W - 60, 740, 180], donutC: [60, 620, 200], glaze: [1140, 860, 180], extra: [W - 90, 180, 160], round: [W - 380, 480, 230], sq: [W - 610, 220, 500], titleY: 330, titleMaxW: 820, titleSize: 96, blockMin: 730, roleSize: 30, band: { x0: -60, y0: H - 115, x1: W + 60, y1: H - 175 }, pizzaX: 420 },
    story: { logo: [80, 95, 260], stampY: 270, donutA: [620, 520, 200], donutB: [W - 55, 1180, 180], donutC: [W - 70, 850, 150], glaze: [W - 140, 400, 180], round: [320, 680, 195], sq: [80, 480, 420], titleY: 990, titleMaxW: W - 160, titleSize: 96, blockMin: 1420, roleSize: 32, band: { x0: -60, y0: H - 185, x1: W + 60, y1: H - 260 }, pizzaX: 195 },
  }[fmt];
  const facets = bgStyle === 'facets-blue' || bgStyle === 'facets-magenta';
  // sui facets in 4:5 il titolo ha più respiro (come già fatto in square):
  // più su, box più largo, size ridotta, foto un po' più a destra
  if (facets && fmt === 'portrait') {
    Object.assign(L, {
      titleY: 515, titleMaxW: 500, titleSize: 76,
      round: [W - 265, 565, 165], sq: [W - 450, 365, 370],
      donutA: [560, 350, 175],
    });
  }
  if (facets) {
    // i poligoni degli SVG hanno opacità: base bianca piena sotto tutto,
    // altrimenti il PNG esportato resta semitrasparente
    ctx.fillStyle = C.white;
    ctx.fillRect(0, 0, W, H);
    // background2.svg ha margini trasparenti nel viewBox → inset;
    // velo scuro per la leggibilità dei testi chiari (feedback v7)
    if (bgStyle === 'facets-blue') {
      // in square/story il crop guarda a sinistra: più blu, meno giallo
      const fx = fmt === 'square' || fmt === 'story' ? 0.15 : 0.5;
      coverCrop(ctx, A.bg.facetsBlue, W, H, fx, 0.5, 0.02);
    } else {
      coverCrop(ctx, A.bg.facetsMagenta, W, H, 0.5, 0.5, 0.09);
    }
    ctx.fillStyle = 'rgba(17,17,17,0.10)';
    ctx.fillRect(0, 0, W, H);
    if (bgStyle === 'facets-blue') {
      // gradiente scuro dal basso, trasparente in alto (feedback v8)
      const grad = ctx.createLinearGradient(0, H, 0, H * 0.3);
      grad.addColorStop(0, 'rgba(17,17,17,0.30)');
      grad.addColorStop(1, 'rgba(17,17,17,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
  } else {
    sunburst(ctx, W, H, C.blue, C.blueLight, 0.3, 0.35, 32);
  }
  halftone(ctx, W - 320, H - 420, 340, 400, 'rgba(17,17,17,0.2)', { fade: 'none' });
  drawLogoWhite(ctx, A.logoWhite, L.logo[0], L.logo[1], L.logo[2]);
  stamp(ctx, S.badge, 80, L.stampY, { size: 44, rot: -0.03, fill: bgStyle === 'facets-magenta' ? C.yellow : C.magenta, color: bgStyle === 'facets-magenta' ? C.ink : C.white });
  // ciambelle DIETRO la foto + extra (glassa comprese)
  drawEl(ctx, A.el.donut3rings, L.donutA[0], L.donutA[1], L.donutA[2], -0.2);
  drawEl(ctx, A.el.donutStripes, L.donutB[0], L.donutB[1], L.donutB[2], 0.3);
  drawEl(ctx, A.el.donutBitten, L.donutC[0], L.donutC[1], L.donutC[2], 0.2);
  drawEl(ctx, A.el.donutGlaze, L.glaze[0], L.glaze[1], L.glaze[2], -0.15);
  if (L.extra) drawEl(ctx, A.el.donutBitten, L.extra[0], L.extra[1], L.extra[2], -0.3);
  if (photoShape === 'square') {
    popPhoto(ctx, A.photo, L.sq[0], L.sq[1], L.sq[2], { rot: 0.03, frame: C.ink });
  } else {
    ctx.beginPath();
    ctx.arc(L.round[0] + 14, L.round[1] + 14, L.round[2] + 15, 0, Math.PI * 2);
    ctx.fillStyle = C.ink;
    ctx.fill();
    roundPhoto(ctx, A.photo, L.round[0], L.round[1], L.round[2], [{ c: C.ink, w: 8 }, { c: C.white, w: 14 }]);
  }
  // sui facets: leggera ombra scura dietro i testi per la leggibilità
  // (eccezione concordata: altrove niente ombre sfumate)
  if (facets) {
    ctx.shadowColor = 'rgba(17,17,17,0.6)';
    ctx.shadowBlur = 16;
  }
  const yTitle = drawDisplayTitle(ctx, S.title, 80, L.titleY, { maxW: L.titleMaxW, size: L.titleSize, maxLines: 4, lineH: 1.02 });
  drawSpeakersBlock(ctx, S.speakers, 80, Math.max(yTitle + 22, L.blockMin), { nameSize: L.nameSize || 54, roleSize: L.roleSize, nameColor: C.white, roleColor: 'rgba(255,255,255,0.95)', maxW: W - 160 });
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  comicSlab(ctx, L.band.x0, L.band.y0, L.band.x1, L.band.y1, 38, 0.8);
  bandText(ctx, `${S.date} | ${S.city}`, L.band.x0, L.band.y0, L.band.x1, L.band.y1, { size: 40 });
  pizzaInBand(ctx, A, L.band, L.pizzaX, 88);
}

/* ══ S6. Comic bg vero + pannello ink ═════════════════════════════════ */
export function speakerComicRealBg(ctx, A, S = SPEAKER, F = FORMATS.portrait) {
  const { W, H, fmt } = F;
  const duo = S.speakers.length > 1;
  const duoFx = duoCrops(A);
  const L = {
    // duoExpl/duoBadge: explosion e badge A CAVALLO tra le due foto
    portrait: { logoBox: [80, 80, 200], expl: [820, 360, 400], duoExpl: [545, 430, 400], photo1: [W / 2 - 250, 340, 500], duo1: [70, 400, 400], duo2: [590, 430, 400], badge: [520, 295], duoBadge: [425, 372], star: [120, 780, 160], panelY: 905, titleSize: 86, blockGap: 4 },
    square: { logoBox: [70, 60, 170], expl: [790, 260, 360], duoExpl: [480, 330, 340], photo1: [W / 2 - 210, 230, 420], duo1: [60, 280, 340], duo2: [560, 290, 340], badge: [W - 40 - stampWidth(ctx, S.badge, 56), 170], duoBadge: [360, 260], star: [105, 590, 140], panelY: 715, titleSize: 68, blockGap: 18 },
    landscape: { logoBox: [W - 300, 70, 200], expl: [640, 210, 380], duoExpl: [505, 250, 380], photo1: [110, 170, 500], duo1: [110, 190, 380], duo2: [520, 230, 380], badge: [500, 135], duoBadge: [400, 155], star: [1270, 500, 170], glaze: [1520, 400, 190], panelY: 745, titleSize: 72, blockGap: 18 },
    story: { logoBox: [80, 95, 210], expl: [820, 600, 400], duoExpl: [560, 645, 420], photo1: [W / 2 - 290, 560, 580], duo1: [65, 600, 420], duo2: [600, 640, 420], badge: [490, 520], duoBadge: [440, 585], star: [115, 1180, 160], panelY: 1400, titleSize: 88, blockGap: 18 },
  }[fmt];
  coverCrop(ctx, A.bg.speakerBlue, W, H, 0.5, 0.35);
  drawLogoStampBox(ctx, A.logoColor, L.logoBox[0], L.logoBox[1], L.logoBox[2]);
  // explosion sempre INTERA: dietro l'angolo alto-destro della foto
  // singola, A CAVALLO tra le due foto nel duo
  const expl = duo ? L.duoExpl : L.expl;
  drawEl(ctx, A.el.explosion, expl[0], expl[1], expl[2], 0.1);
  if (duo) {
    popPhoto(ctx, A.photo, L.duo1[0], L.duo1[1], L.duo1[2], { rot: -0.035, frame: C.ink, shadow: 20, fx: duoFx[0] });
    popPhoto(ctx, duoPhoto2(A), L.duo2[0], L.duo2[1], L.duo2[2], { rot: 0.03, frame: C.ink, shadow: 20, fx: duoFx[1] });
  } else {
    popPhoto(ctx, A.photo, L.photo1[0], L.photo1[1], L.photo1[2], { rot: -0.035, frame: C.ink, shadow: 20 });
  }
  const badge = duo ? L.duoBadge : L.badge;
  stamp(ctx, S.badge, badge[0], badge[1], { size: 56, rot: 0.06, fill: C.yellow });
  drawEl(ctx, A.el.star4, L.star[0], L.star[1], L.star[2], -0.25);
  if (L.glaze) drawEl(ctx, A.el.donutGlaze, L.glaze[0], L.glaze[1], L.glaze[2], -0.15);
  if (fmt === 'landscape') {
    // due strisce diagonali di elementi nella zona pop (il pannello ink
    // viene disegnato DOPO: se sforano ci finiscono dietro)
    drawEl(ctx, A.el.star3, 1700, 280, 160, 0.2);
    drawEl(ctx, A.el.donutBitten, 1120, 640, 160, -0.2);
    drawEl(ctx, A.el.donut3rings, 1450, 645, 150, 0.1);
    drawEl(ctx, A.el.diamond, 1740, 580, 150, 0.15);
  }
  // pannello ink in basso
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, L.panelY, W, H - L.panelY);
  ctx.fillStyle = C.white;
  ctx.fillRect(0, L.panelY, W, 10);
  const titleMaxW = fmt === 'landscape' ? W - 700 : W - 160;
  // in landscape titolo e nome partono alla stessa altezza nel pannello
  const yTitle = drawDisplayTitle(ctx, S.title, 80, L.panelY + 55, { maxW: titleMaxW, size: L.titleSize, maxLines: 2 });
  const blockX = fmt === 'landscape' ? W - 560 : 80;
  const blockY = fmt === 'landscape' ? L.panelY + 55 : yTitle + L.blockGap;
  drawSpeakersBlock(ctx, S.speakers, blockX, blockY, { nameSize: fmt === 'square' ? 40 : 46, nameColor: C.magenta, roleColor: C.white, roleSize: 27, maxW: fmt === 'landscape' ? 480 : W - 160, layout: fmt === 'landscape' || fmt === 'story' ? 'rows' : 'columns' });
  // data in fondo, separata dal blocco relatori
  ctx.font = `600 30px ${FONT.sans}`;
  ctx.fillStyle = C.yellow;
  ctx.textBaseline = 'top';
  ctx.fillText(`${S.date} · ${S.city}`, 80, fmt === 'landscape' ? H - 70 : H - 58);
  ctx.textBaseline = 'alphabetic';
}

/* ══ S7. Bauhaus yellow ═══════════════════════════════════════════════ */
export function speakerBauhausYellow(ctx, A, S = SPEAKER, F = FORMATS.portrait) {
  const { W, H, fmt } = F;
  const L = {
    portrait: { logoBox: [80, 270, 260], badge: [W - 60 - stampWidth(ctx, S.badge, 50), 295], photo: [W - 500, 430, 420], diamond: [W - 130, 940, 180], bitten: [105, 1275, 230], titleY: 500, titleMaxW: 470, titleSize: 110, blockMin: 975, blockMaxW: W - 480, roleSize: 29, dateStamp: [420, 1180], pizza: [905, 1222] },
    square: { logoBox: [70, 185, 210], badge: [W - 60 - stampWidth(ctx, S.badge, 50), 215], photo: [W - 400, 330, 350], diamond: [W - 110, 780, 150], bitten: [90, 1020, 190], titleY: 420, titleMaxW: 560, titleSize: 84, blockMin: 810, blockMaxW: W - 420, roleSize: 28, dateStamp: [355, 975], pizza: [830, 1015] },
    landscape: { logoBox: [90, 215, 250], badge: [1170, 265], photo: [W - 580, 300, 480], diamond: [W - 145, 900, 170], bitten: [60, 1015, 210], titleY: 430, titleMaxW: 720, titleSize: 92, blockMin: 780, blockMaxW: 700, roleSize: 29, dateStamp: [1340, 850], pizza: [1245, 884], pizzaRight: true },
    story: { logoBox: [80, 380, 270], badge: [W - 60 - stampWidth(ctx, S.badge, 50), 405], photo: [80, 990, 420], diamond: [W - 130, 1120, 180], bitten: [105, 1840, 230], titleY: 630, titleMaxW: 900, titleSize: 110, blockMin: 1480, blockMaxW: W - 160, roleSize: 31, dateStamp: [560, 1740], pizza: [1005, 1782] },
  }[fmt];
  // In 9:16 la foto sta SOTTO il titolo (negli altri formati è a fianco):
  // una quarta riga di titolo le finiva addosso. Lo spazio verticale c'è, va
  // redistribuito: il titolo sale con logo e badge, foto e nomi scendono.
  if (fmt === 'story') {
    const titleLines = fitDisplayLines(ctx, S.title, {
      maxW: L.titleMaxW,
      size: L.titleSize,
      maxLines: 4,
    }).lines.length;
    const extra = Math.max(0, titleLines - 3) * Math.round(L.titleSize * 1.05);
    if (extra > 0) {
      const lift = Math.min(60, extra);
      L.logoBox = [L.logoBox[0], L.logoBox[1] - lift, L.logoBox[2]];
      L.badge = [L.badge[0], L.badge[1] - lift];
      L.titleY -= lift;
      L.photo = [L.photo[0], L.photo[1] + extra, L.photo[2]];
      L.blockMin += extra;
    }
  }
  ctx.fillStyle = C.yellow;
  ctx.fillRect(0, 0, W, H);
  // strip bauhaus: in landscape due tessere affiancate per non farla troppo alta
  if (fmt === 'landscape') {
    drawEl(ctx, A.el.bauhaus2, W / 4, 100, W / 2 + 4);
    drawEl(ctx, A.el.bauhaus2, (W * 3) / 4, 100, W / 2 + 4);
  } else {
    drawEl(ctx, A.el.bauhaus2, W / 2, 105, W + 4);
  }
  halftone(ctx, W - 320, H - 450, 340, 420, 'rgba(17,17,17,0.15)', { fade: 'none' });
  drawLogoStampBox(ctx, A.logoColor, L.logoBox[0], L.logoBox[1], L.logoBox[2]);
  popPhoto(ctx, A.photo, L.photo[0], L.photo[1], L.photo[2], { rot: 0.03, frame: C.ink });
  // badge DOPO la foto: resta visibile anche dove i box si avvicinano
  stamp(ctx, S.badge, L.badge[0], L.badge[1], { size: 50, rot: 0.05, fill: C.magenta, color: C.white });
  drawEl(ctx, A.el.diamond, L.diamond[0], L.diamond[1], L.diamond[2], 0.15);
  drawEl(ctx, A.el.donutBitten, L.bitten[0], L.bitten[1], L.bitten[2], -0.15);
  const yTitle = drawDisplayTitle(ctx, S.title, 80, L.titleY, { maxW: L.titleMaxW, size: L.titleSize, maxLines: 4, colors: [C.ink, C.magenta] });
  drawSpeakersBlock(ctx, S.speakers, 80, Math.max(yTitle + 24, L.blockMin), { nameSize: 52, nameColor: C.ink, roleColor: C.ink, roleSize: L.roleSize, maxW: L.blockMaxW });
  ctx.textBaseline = 'top';
  stamp(ctx, `${S.date} · ${S.city}`, L.dateStamp[0], L.dateStamp[1], { size: 40, rot: -0.02 });
  if (L.pizzaRight) {
    // pizza a sinistra dello stamp, punta a destra verso la data
    pizzaPoint(ctx, A.el.pizza, L.pizza[0], L.pizza[1], 90, L.pizza[0] + 115, L.pizza[1] - 2);
  } else {
    pizzaPoint(ctx, A.el.pizza, L.pizza[0], L.pizza[1], 95, L.pizza[0] - 125, L.pizza[1] - 4);
  }
  ctx.textBaseline = 'alphabetic';
}

/* ══ S8. Pop magenta "maximal" ════════════════════════════════════════ */
export function speakerPopMagentaMax(ctx, A, S = SPEAKER, F = FORMATS.portrait) {
  const { W, H, fmt } = F;
  /* bandY = [topLeft, topRight, bottomLeft, bottomRight] in frazioni di H.
     La banda deve finire ESATTAMENTE tra riga 1 e riga 2 del titolo:
     bottomLeft ≈ (titleY + titleSize * 1.05) / H, così la riga 1 (ink)
     sta tutta sul giallo e la riga 2 (bianca) tutta sul magenta. */
  const L = {
    portrait: { bandY: [0.585, 0.53, 0.685, 0.63], photo: [W - 480, 250, 400], star: [150, 460, 190], stripes: [W - 60, 740, 200], bomb: [95, 700, 170], bomb2: [330, 585, 140], cloud: [255, 168, 415], logo: [105, 100, 260], badgeY: 268, titleY: 810, titleSize: 100, titleMaxW: W - 160, nameSize: 50, roleSize: 28, stampMin: 1150, stampMax: 1215 },
    square: { bandY: [0.60, 0.545, 0.68, 0.625], photo: [W - 430, 200, 350], star: [125, 400, 160], stripes: [W - 55, 620, 170], bomb: [80, 580, 150], bomb2: [330, 475, 130], cloud: [232, 138, 365], logo: [95, 80, 230], badgeY: 225, titleY: 655, titleSize: 76, titleMaxW: W - 140, nameSize: 44, roleSize: 26, stampMin: 920, stampMax: 985 },
    landscape: { bandY: [0.595, 0.525, 0.692, 0.622], photo: [W - 520, 130, 440], star: [1250, 210, 180], stripes: [W - 65, 760, 190], bomb: [1000, 420, 160], bomb2: [1170, 495, 140], star2: [1090, 250, 130], cloud: [280, 152, 445], logo: [115, 95, 290], badgeY: 300, titleY: 655, titleSize: 88, titleMaxW: 1250, nameSize: 50, roleSize: 28, stampFixed: [1420, 900] },
    story: { bandY: [0.615, 0.58, 0.6875, 0.6525], photo: [W - 500, 430, 460], star: [150, 640, 240], stripes: [W - 65, 1000, 240], bomb: [100, 930, 210], cloud: [255, 203, 415], logo: [105, 135, 260], badgeY: 310, titleY: 1215, titleSize: 100, titleMaxW: W - 160, nameSize: 50, roleSize: 28, stampMin: 1750, stampMax: 1800 },
  }[fmt];
  ctx.fillStyle = C.magenta;
  ctx.fillRect(0, 0, W, H);
  // banda gialla diagonale piatta dietro il blocco testo
  ctx.beginPath();
  ctx.moveTo(0, H * L.bandY[0]);
  ctx.lineTo(W, H * L.bandY[1]);
  ctx.lineTo(W, H * L.bandY[3]);
  ctx.lineTo(0, H * L.bandY[2]);
  ctx.closePath();
  ctx.fillStyle = C.yellow;
  ctx.fill();
  halftone(ctx, -20, -20, 360, 320, 'rgba(255,255,255,0.25)', { fade: 'x' });
  halftone(ctx, W - 300, H - 360, 320, 380, 'rgba(17,17,17,0.2)', { fade: 'none' });
  popPhoto(ctx, A.photo, L.photo[0], L.photo[1], L.photo[2], { rot: 0.035, frame: C.ink });
  drawEl(ctx, A.el.star3, L.star[0], L.star[1], L.star[2], -0.2);
  drawEl(ctx, A.el.donutStripes, L.stripes[0], L.stripes[1], L.stripes[2], 0.3);
  drawEl(ctx, A.el.bomb, L.bomb[0], L.bomb[1], L.bomb[2], 0.1);
  if (L.bomb2) drawEl(ctx, A.el.bomb2, L.bomb2[0], L.bomb2[1], L.bomb2[2], -0.15);
  if (L.star2) drawEl(ctx, A.el.star4, L.star2[0], L.star2[1], L.star2[2], 0.2);
  // nuvola dietro il logo, logo a COLORI sopra
  drawEl(ctx, A.el.cloud, L.cloud[0], L.cloud[1], L.cloud[2], -0.06);
  ctx.drawImage(A.logoColor, L.logo[0], L.logo[1], L.logo[2], L.logo[2] * (A.logoColor.naturalHeight / A.logoColor.naturalWidth));
  stamp(ctx, S.badge, 80, L.badgeY, { size: 46, rot: -0.03, fill: C.yellow });
  // prima riga ink (cade sulla banda gialla), le altre bianche su magenta;
  // se il titolo entra in UNA riga sola, quella riga sta sulla banda → ink
  const fit8 = fitDisplayLines(ctx, S.title, { maxW: L.titleMaxW, size: L.titleSize, maxLines: 3 });
  ctx.font = `${fit8.size}px ${FONT.display}`;
  ctx.textBaseline = 'top';
  fit8.lines.forEach((line, i) => {
    ctx.fillStyle = i === 0 ? C.ink : C.white;
    ctx.fillText(line, 80, L.titleY + i * fit8.size * 1.05);
  });
  const yTitle = L.titleY + fit8.lines.length * fit8.size * 1.05;
  const yBlock = drawSpeakersBlock(ctx, S.speakers, 80, yTitle + 22, { nameSize: L.nameSize, roleSize: L.roleSize, nameColor: C.white, roleColor: 'rgba(255,255,255,0.95)', maxW: L.titleMaxW });
  if (L.stampFixed) {
    // landscape: dettagli evento a destra (sotto la foto), pizza a
    // sinistra dello stamp che punta a destra
    stamp(ctx, `${S.date} · ${S.city}`, L.stampFixed[0], L.stampFixed[1], { size: 40, rot: -0.02 });
    pizzaPoint(ctx, A.el.pizza, L.stampFixed[0] - 95, L.stampFixed[1] + 32, 90, L.stampFixed[0] + 5, L.stampFixed[1] + 30);
  } else {
    const stampY = Math.min(Math.max(yBlock + 16, L.stampMin), L.stampMax);
    stamp(ctx, `${S.date} · ${S.city}`, 90, stampY, { size: 40, rot: -0.02 });
    pizzaPoint(ctx, A.el.pizza, 615, stampY + 42, 95, 490, stampY + 38);
  }
}

/* ══ P3. Sponsor pop (cream / blue) ═══════════════════════════════════ */
export function sponsorPopCream(ctx, A, P = SPONSOR, F = FORMATS.portrait, palette = 'cream') {
  const { W, H, fmt } = F;
  const isCream = palette === 'cream';
  const L = {
    portrait: { inkH: 190, headY: 280, proudY: 350, proudSize: 120, cardY: 680, cardH: 380, cardX: 80, cardW: W - 160, thanksY: 1130, logoW: W * 0.52, stampX: W - 480 },
    square: { inkH: 160, headY: 215, proudY: 275, proudSize: 100, cardY: 545, cardH: 320, cardX: 80, cardW: W - 160, thanksY: 925, logoW: W * 0.46, stampX: W - 460 },
    // landscape: headline e card centrati verticalmente, thanks in fondo
    landscape: { inkH: 150, headY: 385, proudY: 450, proudSize: 110, cardY: 400, cardH: 430, cardX: 950, cardW: 850, thanksY: 930, logoW: 620, stampX: 1450 },
    story: { inkH: 220, headY: 430, proudY: 500, proudSize: 125, cardY: 900, cardH: 420, cardX: 80, cardW: W - 160, thanksY: 1700, logoW: W * 0.52, stampX: W - 480 },
  }[fmt];
  ctx.fillStyle = isCream ? C.cream : C.blue;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, W, L.inkH);
  // logo e data allo stesso livello: entrambi centrati nella banda ink
  const logoH = 240 * (A.logoWhite.naturalHeight / A.logoWhite.naturalWidth);
  drawLogoWhite(ctx, A.logoWhite, 80, L.inkH / 2 - logoH / 2, 240);
  ctx.font = `600 28px ${FONT.sans}`;
  ctx.fillStyle = C.white;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${P.date} · ${P.city}`, W - 80, L.inkH / 2);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  if (isCream) {
    drawEl(ctx, A.el.donut3rings, W - 80, L.inkH + 210, 260, 0.2);
    drawEl(ctx, A.el.donutStripes, 40, H - 420, 220, -0.25);
    halftone(ctx, -20, L.inkH + 30, 260, 300, 'rgba(17,17,17,0.12)', { fade: 'x' });
  } else {
    drawEl(ctx, A.el.donutStripes, W - 70, L.inkH + 210, 250, 0.25);
    // in landscape la stella sta tra headline e thanks, non sotto il testo
    drawEl(ctx, A.el.star4, 60, fmt === 'landscape' ? 830 : H - 400, 190, -0.2);
    halftone(ctx, -20, L.inkH + 30, 260, 300, 'rgba(255,255,255,0.2)', { fade: 'x' });
  }
  const fg = isCream ? C.ink : C.white;
  const accent = isCream ? C.magenta : C.yellow;
  ctx.font = `44px ${FONT.display}`;
  ctx.fillStyle = accent;
  ctx.textBaseline = 'top';
  ctx.fillText('THEY MAKE IT POSSIBLE', 80, L.headY);
  ctx.font = `${L.proudSize}px ${FONT.display}`;
  ctx.fillStyle = fg;
  if (fmt === 'landscape') {
    ctx.fillText('PROUD', 80, L.proudY);
    ctx.fillText('SPONSOR!', 80, L.proudY + L.proudSize * 1.05);
  } else {
    ctx.fillText('PROUD', 80, L.proudY);
    ctx.fillText('SPONSOR!', 80, L.proudY + L.proudSize * 1.05);
  }
  // card logo con tier stamp sovrapposto all'angolo alto-destro
  ctx.fillStyle = C.ink;
  ctx.fillRect(L.cardX + 18, L.cardY + 18, L.cardW, L.cardH);
  ctx.fillStyle = C.white;
  ctx.fillRect(L.cardX, L.cardY, L.cardW, L.cardH);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.strokeRect(L.cardX + 3, L.cardY + 3, L.cardW - 6, L.cardH - 6);
  drawSponsorLogo(
    ctx,
    A.sponsorLogo,
    L.cardX + L.cardW / 2,
    L.cardY + L.cardH / 2,
    L.logoW,
    L.cardH * 0.74,
  );
  stamp(ctx, P.tier, L.stampX, L.cardY - 40, { size: badgeSize(P.tier, 48), rot: 0.05, fill: C.yellow });
  // pizza punta al tier stamp (in landscape sta a sinistra dello stamp,
  // per non finire dentro la banda ink con la data)
  if (fmt === 'landscape') {
    pizzaPoint(ctx, A.el.pizza, L.stampX - 110, L.cardY - 105, 95, L.stampX + 10, L.cardY - 32);
  } else {
    pizzaPoint(ctx, A.el.pizza, L.stampX + 250, L.cardY - 145, 100, L.stampX + 190, L.cardY - 60);
  }
  ctx.font = `700 34px ${FONT.sans}`;
  ctx.fillStyle = fg;
  ctx.fillText('Thank you for believing in the community.', 80, L.thanksY);
  ctx.font = `600 30px ${FONT.sans}`;
  ctx.fillStyle = accent;
  ctx.fillText('cloudnativedaysitaly.org', 80, L.thanksY + 62);
  ctx.textBaseline = 'alphabetic';
}

export function sponsorPopBlue(ctx, A, P = SPONSOR, F = FORMATS.portrait) {
  sponsorPopCream(ctx, A, P, F, 'blue');
}

/* ══ P5. Facets veri + bauhaus ════════════════════════════════════════ */
export function sponsorFacetsRealBg(ctx, A, P = SPONSOR, F = FORMATS.portrait) {
  const { W, H, fmt } = F;
  const L = {
    // pizza sempre vicino alla fascia ink in basso (tutti i formati)
    portrait: { bh: 430, panelW: W * 0.76, panelH: 340, panelCY: H / 2 + 20, logoBox: [W - 350, 70, 250], stampPos: [640, 462], pizza: [150, H - 185, 115], logoW: W * 0.5 },
    square: { bh: 360, panelW: W * 0.78, panelH: 300, panelCY: H / 2 + 10, logoBox: [W - 320, 55, 230], stampPos: [660, 355], pizza: [140, H - 175, 105], logoW: W * 0.5 },
    landscape: { bh: 420, panelW: 1150, panelH: 380, panelCY: H / 2 + 15, logoBox: [W - 380, 60, 270], stampPos: [1180, 330], pizza: [250, H - 180, 115], logoW: 720 },
    story: { bh: 430, panelW: W * 0.82, panelH: 400, panelCY: H / 2 - 40, logoBox: [W - 350, 90, 250], stampPos: [620, 690], pizza: [150, H - 195, 115], logoW: W * 0.55 },
  }[fmt];
  coverCrop(ctx, A.bg.sponsorSoft, W, H, 0.45, 0.5);
  drawEl(ctx, A.el.bauhaus1, L.bh / 2 - 10, L.bh / 2 - 5, L.bh);
  ctx.save();
  ctx.translate(W - L.bh / 2 + 15, H - L.bh / 2 + 10);
  ctx.rotate(Math.PI);
  drawEl(ctx, A.el.bauhaus1, 0, 0, L.bh - 20);
  ctx.restore();
  drawLogoStampBox(ctx, A.logoColor, L.logoBox[0], L.logoBox[1], L.logoBox[2]);
  // pannello centrale bianco bordato col logo sponsor
  ctx.save();
  ctx.translate(W / 2, L.panelCY);
  ctx.rotate(-0.025);
  ctx.fillStyle = C.ink;
  ctx.fillRect(-L.panelW / 2 + 16, -L.panelH / 2 + 16, L.panelW, L.panelH);
  ctx.fillStyle = C.white;
  ctx.fillRect(-L.panelW / 2, -L.panelH / 2, L.panelW, L.panelH);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.strokeRect(-L.panelW / 2 + 3, -L.panelH / 2 + 3, L.panelW - 6, L.panelH - 6);
  drawSponsorLogo(ctx, A.sponsorLogo, 0, 0, L.logoW, L.panelH * 0.74);
  ctx.restore();
  // tier stamp sovrapposto all'angolo alto-destro del pannello
  stamp(ctx, P.tier, L.stampPos[0], L.stampPos[1], { size: badgeSize(P.tier, 52), rot: -0.05, fill: C.yellow });
  // fascia ink con data e venue; pizza punta alla fascia
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, H - 110, W, 110);
  ctx.font = `600 32px ${FONT.sans}`;
  ctx.fillStyle = C.white;
  ctx.textBaseline = 'middle';
  ctx.fillText(`${P.date} · ${P.venue}`, 80, H - 54);
  ctx.textBaseline = 'alphabetic';
  // pizza sotto-sinistra del pannello, punta al CENTRO del box logo
  const px = W / 2 - L.panelW / 2 + 40;
  const py = L.panelCY + L.panelH / 2 + 85;
  pizzaPoint(ctx, A.el.pizza, px, py, 115, W / 2 - 130, L.panelCY - 160);
}

/* ══ P6 (esplorazione). Famiglia sponsor per TIER ═════════════════════
   Variante di sponsor-03: niente fascia ink (stamp lungo e basso con
   data+venue), cluster di elementi diversi per tier negli angoli
   alto-sx / basso-dx, background SVG ricolorato per tier. */
/* Composizioni per angolo: tl = coordinate dall'angolo alto-sinistro,
   br = coordinate dall'angolo basso-destro (specchiate a runtime).
   Composizioni libere, non simmetriche: più ricche dove l'asset è
   semplice (rings/donuts), una nuvola gigante capovolta come angolo
   nei clouds. */
export const TIER_CLUSTERS = {
  bauhaus: null, // gestito a parte (asset bauhaus 1 come sponsor-03)
  diamonds: {
    tl: [['diamond', 150, 160, 230, -0.12], ['diamondSilver', 335, 90, 130, 0.25], ['diamondSilver', 85, 340, 120, 0.3], ['diamond', 305, 300, 100, 0.15]],
    br: [['diamond', 150, 160, 240, 0.12], ['diamondSilver', 340, 90, 135, -0.25], ['diamondSilver', 85, 340, 125, -0.3], ['diamond', 300, 300, 105, -0.15]],
  },
  rings: {
    tl: [['donut3rings', 150, 150, 250, 0.1], ['donutStripes', 340, 80, 140, -0.2], ['donut3rings', 80, 340, 130, 0.3], ['donutStripes', 305, 290, 100, 0.15], ['donut3rings', 435, 185, 90, -0.1]],
    br: [['donut3rings', 150, 150, 260, -0.15], ['donutStripes', 325, 90, 150, 0.2], ['donut3rings', 90, 330, 120, 0.1], ['donutStripes', 425, 235, 95, -0.2], ['donut3rings', 300, 310, 100, 0.25]],
  },
  donuts: {
    tl: [['donutGlaze', 150, 150, 240, -0.1], ['donutBitten', 340, 85, 150, 0.2], ['donutStripes', 85, 340, 140, -0.25], ['donutGlaze', 320, 300, 110, 0.3]],
    br: [['donutGlaze', 150, 150, 250, 0.12], ['donutStripes', 330, 90, 140, -0.15], ['donutBitten', 90, 330, 145, 0.2], ['donutGlaze', 430, 230, 100, -0.1]],
  },
  clouds: null, // gestito a parte in drawTierCorners (rotazioni precise)
};

/* Cluster di anelli concentrici brand: composizioni portate da
   src/components/decor/BrandRings.js del sito (viewBox 400). */
export const BRAND_RING_CLUSTERS = {
  a: [
    { cx: 150, cy: 150, r: 148, colors: [C.blue, C.white, C.magenta, C.white, C.yellow] },
    { cx: 335, cy: 75, r: 55, colors: [C.blue, C.white, C.yellow] },
  ],
  b: [
    { cx: 122, cy: 276, r: 120, colors: [C.blue, C.white, C.yellow, C.white, C.magenta] },
    { cx: 245, cy: 185, r: 55, colors: [C.blue, C.white, C.magenta] },
    { cx: 288, cy: 288, r: 110, colors: [C.blue, C.white, C.magenta, C.white, C.yellow] },
    { cx: 135, cy: 105, r: 45, colors: [C.magenta, C.white, C.yellow] },
  ],
};

export function drawBrandRings(ctx, cluster, ox, oy, scale) {
  BRAND_RING_CLUSTERS[cluster].forEach(({ cx, cy, r, colors }) =>
    ring(ctx, ox + cx * scale, oy + cy * scale, r * scale, colors, C.white));
}

export function drawTierCorners(ctx, A, corner, W, H, bh) {
  if (corner === 'bauhaus') {
    drawEl(ctx, A.el.bauhaus1, bh / 2 - 10, bh / 2 - 5, bh);
    ctx.save();
    ctx.translate(W - bh / 2 + 15, H - bh / 2 + 10);
    ctx.rotate(Math.PI);
    drawEl(ctx, A.el.bauhaus1, 0, 0, bh - 20);
    ctx.restore();
    return;
  }
  if (corner === 'brandrings') {
    // anelli brand come sulla hero del sito: 'a' in alto-sx, 'b' in basso-dx
    drawBrandRings(ctx, 'a', -50, -50, 1.1);
    drawBrandRings(ctx, 'b', W - 400 * 1.1 + 50, H - 400 * 1.1 + 50, 1.1);
    return;
  }
  if (corner === 'clouds') {
    // DEFINITIVO (Alessandro): comp3 ruotata 90° ORARI ancorata
    // all'angolo ALTO-SINISTRO; comp4 ruotata 180° ATTACCATA ai bordi
    // destro e inferiore (angolo basso-destro, zero spazio).
    // Ancoraggio calcolato dall'ingombro reale, non centrato a occhio.
    const w3 = 576;
    const h3 = A.el.cloudComp3.sh * (w3 / A.el.cloudComp3.sw);
    // dopo la rotazione di 90° l'ingombro è h3 (larghezza) × w3 (altezza)
    drawEl(ctx, A.el.cloudComp3, h3 / 2 - 8, w3 / 2 - 8, w3, Math.PI / 2);
    const w4 = 576;
    const h4 = A.el.cloudComp4.sh * (w4 / A.el.cloudComp4.sw);
    drawEl(ctx, A.el.cloudComp4, W - w4 / 2 + 8, H - h4 / 2 + 8, w4, Math.PI);
    // satelliti sulla diagonale opposta
    drawEl(ctx, A.el.cloud, W - 130, 300, 170, 0.08);
    drawEl(ctx, A.el.cloud1Tint, W - 70, 470, 135, -0.08);
    drawEl(ctx, A.el.cloud3, 150, H - 370, 205, 0.1);
    drawEl(ctx, A.el.cloud1Tint, 65, H - 555, 140, 0.12);
    return;
  }
  const c = TIER_CLUSTERS[corner];
  c.tl.forEach(([key, x, y, w, rot]) => drawEl(ctx, A.el[key], x, y, w, rot));
  c.br.forEach(([key, x, y, w, rot]) => drawEl(ctx, A.el[key], W - x, H - y, w, rot));
}

export function sponsorTier(ctx, A, P = SPONSOR, F = FORMATS.portrait, opts = {}) {
  const { W, H, fmt } = F;
  const { bg = 'sponsorSoft', corner = 'bauhaus' } = opts;
  const L = {
    portrait: { bh: 430, panelW: W * 0.76, panelH: 390, panelCY: H / 2 + 20, logoBox: [W - 350, 70, 250], stampGap: 63, logoW: W * 0.5 },
    square: { bh: 360, panelW: W * 0.78, panelH: 345, panelCY: H / 2 + 10, logoBox: [W - 320, 55, 230], stampGap: 45, logoW: W * 0.5 },
    landscape: { bh: 420, panelW: 1150, panelH: 425, panelCY: H / 2 + 15, logoBox: [W - 380, 60, 270], stampGap: 35, logoW: 720 },
    story: { bh: 430, panelW: W * 0.82, panelH: 450, panelCY: H / 2 - 40, logoBox: [W - 350, 90, 250], stampGap: 30, logoW: W * 0.55 },
  }[fmt];
  // Il badge sta sopra il bordo alto del pannello: se il pannello cresce, si
  // alza con lui invece di finirgli dentro.
  const stampY = L.panelCY - L.panelH / 2 - L.stampGap;
  // base bianca (gli SVG di background hanno opacità) + bg ricolorato
  ctx.fillStyle = C.white;
  ctx.fillRect(0, 0, W, H);
  if (bg === 'sponsorSoft') coverCrop(ctx, A.bg.sponsorSoft, W, H, 0.45, 0.5);
  else coverCrop(ctx, A.bg[bg], W, H, 0.5, 0.5, bg === 'softMain' ? 0.09 : 0.02);
  drawTierCorners(ctx, A, corner, W, H, L.bh);
  drawLogoStampBox(ctx, A.logoColor, L.logoBox[0], L.logoBox[1], L.logoBox[2]);
  // pannello centrale bianco bordato col logo sponsor
  ctx.save();
  ctx.translate(W / 2, L.panelCY);
  ctx.rotate(-0.025);
  ctx.fillStyle = C.ink;
  ctx.fillRect(-L.panelW / 2 + 16, -L.panelH / 2 + 16, L.panelW, L.panelH);
  ctx.fillStyle = C.white;
  ctx.fillRect(-L.panelW / 2, -L.panelH / 2, L.panelW, L.panelH);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.strokeRect(-L.panelW / 2 + 3, -L.panelH / 2 + 3, L.panelW - 6, L.panelH - 6);
  drawSponsorLogo(ctx, A.sponsorLogo, 0, 0, L.logoW, L.panelH * 0.74);
  ctx.restore();
  // tier stamp sull'angolo alto-destro del pannello, posizionato in base
  // alla larghezza REALE del testo (PLATINUM/WORKSHOP sono più lunghi)
  const tierText = P.tier;
  const tierSize = badgeSize(tierText, 52);
  const tw = stampWidth(ctx, tierText, tierSize);
  const stampX = Math.min(W / 2 + L.panelW / 2 - tw + 70, W - 40 - tw);
  stamp(ctx, tierText, stampX, stampY, { size: tierSize, rot: -0.05, fill: C.yellow });
  // data+città (senza venue): stamp basso con più aria attorno al testo
  stamp(ctx, `${P.date} · ${P.city}`, 80, H - 118, { size: 34, rot: -0.015, pad: 0.8, padY: 0.45 });
  // pizza sotto-sinistra del pannello, punta al CENTRO del box logo
  const px = W / 2 - L.panelW / 2 + 40;
  const py = L.panelCY + L.panelH / 2 + 85;
  pizzaPoint(ctx, A.el.pizza, px, py, 115, W / 2 - 130, L.panelCY - 160);
}

/* Naming per il generatore front-end: numero progressivo CONTINUO +
   nome parlante breve. La vecchia numerazione (01..09b con buchi, lo
   storico speaker-02 replica-facets era stato scartato) è rimappata:
   01 comic-blue, 02 pop-blue (ex pop-2027), 03 pop-split, 04
   hybrid-round (ex 05), 05 hybrid-square (ex 05b), 06 comic-panel
   (ex comic-realbg), 07 bauhaus-yellow, 08 magenta-max, 09
   facets-blue, 10 facets-magenta; sponsor: 01 pop-cream, 02 pop-blue,
   03 facets-soft. */
export const TEMPLATES = [
  { id: 'v11-speaker-01-comic-blue', fn: speakerComicBlue },
  { id: 'v11-speaker-02-pop-blue', fn: speakerPop2027 },
  { id: 'v11-speaker-03-pop-split', fn: speakerPopSplit },
  { id: 'v11-speaker-04-hybrid-round', fn: speakerHybrid },
  { id: 'v11-speaker-05-hybrid-square', fn: (ctx, A, S, F) => speakerHybrid(ctx, A, SPEAKER, F, 'square') },
  { id: 'v11-speaker-06-comic-panel', fn: speakerComicRealBg },
  { id: 'v11-speaker-07-bauhaus-yellow', fn: speakerBauhausYellow },
  { id: 'v11-speaker-08-magenta-max', fn: speakerPopMagentaMax },
  // background SVG facets veri (ricolorabili: nel generatore saranno selezionabili)
  { id: 'v11-speaker-09-facets-blue', fn: (ctx, A, S, F) => speakerHybrid(ctx, A, SPEAKER, F, 'square', 'facets-blue') },
  { id: 'v11-speaker-10-facets-magenta', fn: (ctx, A, S, F) => speakerHybrid(ctx, A, SPEAKER, F, 'round', 'facets-magenta') },
  { id: 'v11-sponsor-01-pop-cream', fn: (ctx, A, S, F) => sponsorPopCream(ctx, A, SPONSOR, F) },
  { id: 'v11-sponsor-02-pop-blue', fn: (ctx, A, S, F) => sponsorPopBlue(ctx, A, SPONSOR, F) },
  { id: 'v11-sponsor-03-facets-soft', fn: (ctx, A, S, F) => sponsorFacetsRealBg(ctx, A, SPONSOR, F) },
  // ESPLORAZIONE famiglia tier (v12): stamp lungo al posto della fascia,
  // cluster e background diversi per tier
  { id: 'v12-sponsor-04-gold-bauhaus', fn: (ctx, A, S, F) => sponsorTier(ctx, A, { ...SPONSOR, tier: 'GOLD' }, F, { bg: 'sponsorSoft', corner: 'bauhaus' }) },
  { id: 'v12-sponsor-05-platinum-diamonds', fn: (ctx, A, S, F) => sponsorTier(ctx, A, { ...SPONSOR, tier: 'PLATINUM' }, F, { bg: 'softPlatinum', corner: 'diamonds' }) },
  { id: 'v12-sponsor-06-silver-donuts', fn: (ctx, A, S, F) => sponsorTier(ctx, A, { ...SPONSOR, tier: 'SILVER' }, F, { bg: 'softSilver', corner: 'donuts' }) },
  { id: 'v12-sponsor-07-smart-rings', fn: (ctx, A, S, F) => sponsorTier(ctx, A, { ...SPONSOR, tier: 'SMART' }, F, { bg: 'softSmart', corner: 'rings' }) },
  { id: 'v12-sponsor-08-workshop-clouds', fn: (ctx, A, S, F) => sponsorTier(ctx, A, { ...SPONSOR, tier: 'WORKSHOP' }, F, { bg: 'softSky', corner: 'clouds' }) },
  { id: 'v12-sponsor-09-main-brandrings', fn: (ctx, A, S, F) => sponsorTier(ctx, A, { ...SPONSOR, tier: 'MAIN' }, F, { bg: 'softMain', corner: 'brandrings' }) },
  // Casi limite con dati reali 2026
  { id: 'v11-test-pop-split-longtitle', fn: (ctx, A, S, F) => speakerPopSplit(ctx, A, SPEAKER_LONG, F) },
  { id: 'v11-test-comic-panel-duo', fn: (ctx, A, S, F) => speakerComicRealBg(ctx, A, SPEAKER_DUO, F) },
  { id: 'v11-test-pop-blue-duo-longtitle', fn: (ctx, A, S, F) => speakerPop2027(ctx, A, SPEAKER_DUO, F) },
];
