(() => {
  'use strict';

  const roles = {
    'AI Automation Specialist': {
      summary: 'Map repetitive work, connect tools, define triggers, and document reliable handoffs.',
      project: 'Missed-Call Rescue', skill: 'Webhooks + APIs', credential: 'Automation & Agentic AI'
    },
    'Agentic AI Operations': {
      summary: 'Structure multi-step AI workflows with routing, evaluation controls, evidence checks, and human approval.',
      project: 'Prompt & Runbook Systems', skill: 'Agent routing + evaluation', credential: 'Agentic architecture'
    },
    'AI Evaluation / Governance': {
      summary: 'Inspect model outputs, label assumptions, surface risk, and build review gates before consequential use.',
      project: 'Evidence Confidence Map', skill: 'Model auditing + risk control', credential: 'AI security & governance'
    },
    'Workflow Builder': {
      summary: 'Translate operational friction into triggers, actions, exception paths, SOPs, and measurable handoffs.',
      project: 'No-Show Reduction', skill: 'Process mapping + sequencing', credential: 'Digital transformation'
    },
    'Operations Analyst': {
      summary: 'Analyze bottlenecks, communication failures, resource use, and process consistency across teams.',
      project: 'Consumer Documentation Pack', skill: 'Business analysis', credential: 'Analytics & operations'
    },
    'Customer Operations / RevOps': {
      summary: 'Improve lead response, booking, follow-up, pipeline visibility, and customer communication.',
      project: 'Missed-Call Rescue', skill: 'CRM + follow-up systems', credential: 'Leadership & automation'
    }
  };
  const roleButtons = document.querySelectorAll('[data-role-target]');
  const roleTitle = document.querySelector('[data-role-title]');
  const roleSummary = document.querySelector('[data-role-summary]');
  const roleProject = document.querySelector('[data-role-project]');
  const roleSkill = document.querySelector('[data-role-skill]');
  const roleCredential = document.querySelector('[data-role-credential]');
  roleButtons.forEach((button) => button.addEventListener('click', () => {
    const role = button.dataset.roleTarget;
    const data = roles[role];
    if (!data) return;
    roleButtons.forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    roleTitle.textContent = role;
    roleSummary.textContent = data.summary;
    roleProject.textContent = data.project;
    roleSkill.textContent = data.skill;
    roleCredential.textContent = data.credential;
  }));

  const labs = {
    orchestration: {
      title: 'AGENT ORCHESTRATION / ACTIVE',
      input: 'Define the business objective, evidence, constraints, and stop rule.',
      tools: 'LLM routing · APIs · search · structured templates',
      validation: 'Assumption labels · challenge pass · human review',
      output: 'Documented workflow with an executable next action.',
      nodes: [['INPUT','Business goal','constraints + evidence'],['ROUTER','Task decomposition','route by risk and tool fit'],['AGENTS','Specialist execution','research · ops · challenger'],['GATE','Human approval','verify before irreversible action']]
    },
    'missed-call': {
      title: 'MISSED-CALL RESCUE / SIMULATION',
      input: 'Inbound missed call from a service-business prospect.',
      tools: 'Telephony event · SMS · qualification form · booking link · CRM',
      validation: 'Consent · business hours · exception path · human escalation',
      output: 'Qualified lead routed to booking with status recorded.',
      nodes: [['TRIGGER','Missed call','capture number + timestamp'],['RESPONSE','Rapid text-back','set expectation + permission'],['QUALIFY','Intent check','service · urgency · location'],['HANDOFF','Book or escalate','calendar + CRM status']]
    },
    evaluation: {
      title: 'EVIDENCE EVALUATION / CONTROLLED',
      input: 'AI-generated recommendation with source claims and assumptions.',
      tools: 'Source registry · contradiction scan · risk rubric · evidence map',
      validation: 'Known / assumed / unknown · unsupported certainty · policy gate',
      output: 'Review-ready result with failed gates and residual risk.',
      nodes: [['CLAIM','Candidate output','facts + inference'],['TRACE','Source mapping','authority + recency'],['CHALLENGE','Adversarial pass','contradictions + failure modes'],['VERDICT','Ship / patch / hold','human adjudication']]
    },
    runbook: {
      title: 'PROMPT + RUNBOOK / STANDARDIZED',
      input: 'Recurring task that currently depends on memory or ad hoc execution.',
      tools: 'Prompt template · checklist · data schema · approval rule',
      validation: 'Golden cases · edge cases · stop conditions · regression check',
      output: 'Reusable runbook another operator can follow consistently.',
      nodes: [['FRAME','Task contract','goal + inputs + constraints'],['PROMPT','Structured instruction','steps + failure rules'],['TEST','Golden cases','normal + messy + adversarial'],['HANDOFF','Runbook','owner + triggers + review']]
    }
  };
  const labButtons = document.querySelectorAll('[data-lab-tab]');
  const map = document.querySelector('[data-flow-map]');
  const title = document.querySelector('[data-lab-console-title]');
  const input = document.querySelector('[data-lab-input]');
  const tools = document.querySelector('[data-lab-tools]');
  const validation = document.querySelector('[data-lab-validation]');
  const output = document.querySelector('[data-lab-output]');
  function renderLab(key) {
    const data = labs[key];
    if (!data) return;
    title.textContent = data.title;
    input.textContent = data.input;
    tools.textContent = data.tools;
    validation.textContent = data.validation;
    output.textContent = data.output;
    map.innerHTML = data.nodes.map((node, index) => {
      const item = `<div class="flow-node${index === 0 ? ' is-active' : ''}"><span>${node[0]}</span><b>${node[1]}</b><small>${node[2]}</small></div>`;
      return index === data.nodes.length - 1 ? item : `${item}<div class="flow-connector"><i></i></div>`;
    }).join('');
  }
  labButtons.forEach((button) => button.addEventListener('click', () => {
    labButtons.forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-selected', String(item === button)); });
    renderLab(button.dataset.labTab);
  }));

  const certificates = [
    { title: 'Inside Agentic AI: Core Architecture of Agentic Systems', provider: 'Skillsoft', date: 'Completed March 18, 2026', image: 'assets/images/certificates/inside-agentic-ai-core-architecture.webp', pdf: 'assets/docs/certificates/inside-agentic-ai-core-architecture.pdf' },
    { title: 'Inside Agentic AI: Foundations and Frontiers', provider: 'Skillsoft', date: 'Completed March 2, 2026', image: 'assets/images/certificates/inside-agentic-ai-foundations-frontiers.webp', pdf: 'assets/docs/certificates/inside-agentic-ai-foundations-frontiers.pdf' },
    { title: 'Generative AI Foundations: Advanced Techniques for IT', provider: 'Skillsoft', date: 'Completed March 29, 2026', image: 'assets/images/certificates/generative-ai-advanced-it.webp', pdf: 'assets/docs/certificates/generative-ai-advanced-it.pdf' },
    { title: 'Improper Business Practices in Government Contracting', provider: 'Metrix Learning / Skillsoft', date: 'Completed March 27, 2026', image: 'assets/images/certificates/improper-business-practices.webp', pdf: '' }
  ];
  const frames = [...document.querySelectorAll('[data-certificate-index]')];
  const position = document.querySelector('[data-cert-position]');
  const dialog = document.querySelector('[data-certificate-dialog]');
  const dialogImage = dialog?.querySelector('[data-dialog-image]');
  const dialogTitle = dialog?.querySelector('[data-dialog-title]');
  const dialogProvider = dialog?.querySelector('[data-dialog-provider]');
  const dialogDate = dialog?.querySelector('[data-dialog-date]');
  const dialogPdf = dialog?.querySelector('[data-dialog-pdf]');
  let active = 0;
  function setActive(index) {
    active = (index + frames.length) % frames.length;
    frames.forEach((frame, i) => frame.classList.toggle('is-active', i === active));
    position.textContent = `${active + 1} / ${frames.length}`;
    frames[active]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }
  function openCertificate(index) {
    setActive(index);
    const item = certificates[active];
    if (!dialog || !item) return;
    dialogImage.src = item.image;
    dialogImage.alt = `${item.title} certificate`;
    dialogTitle.textContent = item.title;
    dialogProvider.textContent = item.provider;
    dialogDate.textContent = item.date;
    if (item.pdf) { dialogPdf.href = item.pdf; dialogPdf.hidden = false; } else { dialogPdf.hidden = true; }
    dialog.showModal();
  }
  frames.forEach((frame, index) => {
    frame.addEventListener('focus', () => setActive(index));
    frame.addEventListener('pointerenter', () => setActive(index));
    frame.addEventListener('click', () => openCertificate(index));
  });
  document.querySelector('[data-cert-prev]')?.addEventListener('click', () => setActive(active - 1));
  document.querySelector('[data-cert-next]')?.addEventListener('click', () => setActive(active + 1));
  dialog?.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
  dialog?.querySelector('[data-dialog-prev]')?.addEventListener('click', () => { setActive(active - 1); openCertificate(active); });
  dialog?.querySelector('[data-dialog-next]')?.addEventListener('click', () => { setActive(active + 1); openCertificate(active); });
  dialog?.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  document.addEventListener('keydown', (event) => {
    if (dialog?.open) {
      if (event.key === 'ArrowLeft') { setActive(active - 1); openCertificate(active); }
      if (event.key === 'ArrowRight') { setActive(active + 1); openCertificate(active); }
      return;
    }
    if (event.key === 'ArrowLeft') setActive(active - 1);
    if (event.key === 'ArrowRight') setActive(active + 1);
  });
})();
