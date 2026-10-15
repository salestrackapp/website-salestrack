// Recebe o formulário do site e envia o pedido por e-mail via Resend.
const TO = process.env.LEAD_TO || 'andre.kachan@salestrack.com.br';
const FROM = process.env.LEAD_FROM || 'Site Salestrack <site@salestrack.com.br>';
const MODES = { aprender: 'Quero aprender', fazer: 'Quero que façam por mim', entender: 'Ainda quero entender melhor' };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (s, n) => String(s ?? '').trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ success: false }); }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const isHtmlForm = String(req.headers['content-type'] || '').includes('application/x-www-form-urlencoded');
  const done = (code, payload) => {
    if (isHtmlForm) { res.statusCode = 303; res.setHeader('Location', code === 200 ? '/obrigado.html' : '/index.html#conversa'); return res.end(); }
    return res.status(code).json(payload);
  };

  // Honeypot: robôs preenchem o campo oculto. Respondemos sucesso sem enviar.
  if (clip(body._honey, 200)) return done(200, { success: true });

  const name = clip(body.name, 100);
  const email = clip(body.email, 254);
  const mode = MODES[body.mode] || clip(body.mode, 60) || 'Não informado';
  const need = clip(body.need, 2000);
  const page = clip(body._url, 300);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || need.length < 10) {
    return done(400, { success: false, error: 'invalid' });
  }
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY ausente');
    return done(500, { success: false, error: 'config' });
  }

  const row = (k, v) => `<tr><td style="padding:8px 12px;background:#f3f5f9;font-weight:600;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:8px 12px">${v}</td></tr>`;
  const html = `<div style="font-family:Arial,sans-serif;color:#10233d"><h2 style="margin:0 0 12px">Novo pedido pelo site</h2><table style="border-collapse:collapse;font-size:14px">${row('Nome', esc(name))}${row('E-mail', `<a href="mailto:${esc(email)}">${esc(email)}</a>`)}${row('Interesse', esc(mode))}${row('Mensagem', esc(need).replace(/\n/g, '<br>'))}${page ? row('Página', esc(page)) : ''}</table><p style="font-size:12px;color:#526078">Responda este e-mail para falar direto com ${esc(name)}.</p></div>`;
  const text = `Novo pedido pelo site\n\nNome: ${name}\nE-mail: ${email}\nInteresse: ${mode}\nMensagem:\n${need}\n${page ? `\nPágina: ${page}` : ''}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject: `Novo pedido — ${name} (${mode})`, html, text }),
    });
    if (!r.ok) { console.error('Resend falhou', r.status, await r.text()); return done(502, { success: false }); }
    return done(200, { success: true });
  } catch (e) {
    console.error('Erro ao chamar Resend', e);
    return done(502, { success: false });
  }
};
