/**
 * PEER-TO-PEER AND CLIENT-SERVER NETWORKING EDUCATIONAL PLATFORM
 * Master Interactive Logic & Multimedia Engine
 * 
 * Includes:
 * 1. Web Audio API Sound Synthesizer (UI sounds, packet pings, quiz chimes)
 * 2. Speech Synthesis Narration (Audio accessibility guide)
 * 3. Hero Dynamic Topology Switcher
 * 4. Interactive Architecture Diagrams (P2P Mesh & Client-Server Star)
 * 5. Comprehensive Comparison Tab Switcher
 * 6. Design Principles Interactive Explorer
 * 7. Live Packet Network Simulator & Terminal Log
 * 8. Interactive Architecture Decision Engine
 * 9. Knowledge Check Assessment Quiz (Immediate feedback & explanations)
 * 10. Responsive Navigation & Scroll Spy
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (Multimedia Audio Component)
  // =========================================================================
  class AudioEngine {
    constructor() {
      this.audioCtx = null;
      this.soundEnabled = true;
      this.initSoundToggle();
    }

    initContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    initSoundToggle() {
      const toggleBtn = document.getElementById('soundToggleBtn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          this.initContext();
          this.soundEnabled = !this.soundEnabled;
          toggleBtn.classList.toggle('active', this.soundEnabled);
          toggleBtn.setAttribute('title', this.soundEnabled ? 'Sound FX: ON' : 'Sound FX: OFF');
          toggleBtn.innerHTML = this.soundEnabled 
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
          if (this.soundEnabled) this.playTone(520, 0.08, 'sine');
        });
      }
    }

    playTone(freq = 440, duration = 0.1, type = 'sine', gainVal = 0.08) {
      if (!this.soundEnabled) return;
      try {
        this.initContext();
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {
        // AudioContext error fallback
      }
    }

    playClick() {
      this.playTone(700, 0.04, 'sine', 0.05);
    }

    playPacketSent() {
      this.playTone(880, 0.08, 'triangle', 0.06);
    }

    playPacketReceived() {
      this.playTone(660, 0.06, 'sine', 0.05);
      setTimeout(() => this.playTone(990, 0.09, 'sine', 0.06), 50);
    }

    playSuccess() {
      if (!this.soundEnabled) return;
      this.playTone(523.25, 0.1, 'sine', 0.06);
      setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.06), 90);
      setTimeout(() => this.playTone(783.99, 0.18, 'sine', 0.08), 180);
    }

    playError() {
      if (!this.soundEnabled) return;
      this.playTone(320, 0.12, 'sawtooth', 0.04);
      setTimeout(() => this.playTone(280, 0.16, 'sawtooth', 0.05), 110);
    }
  }

  const audio = new AudioEngine();

  // Attach click audio to buttons with .btn or .quiz-opt-btn
  document.querySelectorAll('.btn, .comp-tab-btn, .sim-mode-btn, .top-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => audio.playClick());
  });

  // =========================================================================
  // 2. TEXT-TO-SPEECH NARRATOR (Educational Audio Guide)
  // =========================================================================
  const narratorBtn = document.getElementById('narratorToggleBtn');
  let isNarrating = false;

  if (narratorBtn && 'speechSynthesis' in window) {
    narratorBtn.addEventListener('click', () => {
      audio.initContext();
      if (isNarrating) {
        window.speechSynthesis.cancel();
        isNarrating = false;
        narratorBtn.classList.remove('active');
        narratorBtn.setAttribute('title', 'Start Audio Summary Narration');
      } else {
        const textToRead = "Welcome to the educational guide on Peer-to-Peer and Client-Server Networking. " +
          "In a Peer-to-Peer network, every connected computer shares equal status and resources without a central authority. " +
          "In a Client-Server network, client workstations send requests to a centralized server that manages data, security, and services. " +
          "Explore the interactive diagrams, simulators, and quiz below to master both network architectures.";

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          isNarrating = false;
          narratorBtn.classList.remove('active');
        };
        utterance.onerror = () => {
          isNarrating = false;
          narratorBtn.classList.remove('active');
        };

        window.speechSynthesis.speak(utterance);
        isNarrating = true;
        narratorBtn.classList.add('active');
        narratorBtn.setAttribute('title', 'Stop Audio Narration');
      }
    });
  }

  // =========================================================================
  // 3. HERO TOPOLOGY VISUALIZER (P2P Mesh vs Client-Server Star)
  // =========================================================================
  const heroTopologyContainer = document.getElementById('heroTopologyDiagram');
  const heroToggleBtns = document.querySelectorAll('.top-toggle-btn');
  const heroStatusText = document.getElementById('heroDiagramStatus');

  function renderHeroTopology(mode = 'p2p') {
    if (!heroTopologyContainer) return;

    if (mode === 'p2p') {
      heroTopologyContainer.innerHTML = `
        <svg viewBox="0 0 500 320" class="hero-diagram-svg">
          <defs>
            <radialGradient id="p2pGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#5BC0BE" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#5BC0BE" stop-opacity="0"/>
            </radialGradient>
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Interconnection Mesh Lines -->
          <g stroke="#3A506B" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.75">
            <line x1="250" y1="60" x2="110" y2="150" />
            <line x1="250" y1="60" x2="390" y2="150" />
            <line x1="250" y1="60" x2="160" y2="260" />
            <line x1="250" y1="60" x2="340" y2="260" />

            <line x1="110" y1="150" x2="390" y2="150" />
            <line x1="110" y1="150" x2="160" y2="260" />
            <line x1="110" y1="150" x2="340" y2="260" />

            <line x1="390" y1="150" x2="160" y2="260" />
            <line x1="390" y1="150" x2="340" y2="260" />

            <line x1="160" y1="260" x2="340" y2="260" />
          </g>

          <!-- Active Animated Data Packet Paths -->
          <g>
            <circle r="4" fill="#5BC0BE" filter="url(#glowFilter)">
              <animateMotion path="M250,60 L390,150" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r="4" fill="#5BC0BE" filter="url(#glowFilter)">
              <animateMotion path="M390,150 L160,260" dur="3.1s" repeatCount="indefinite" />
            </circle>
            <circle r="4" fill="#5BC0BE" filter="url(#glowFilter)">
              <animateMotion path="M110,150 L340,260" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <circle r="4" fill="#38BDF8" filter="url(#glowFilter)">
              <animateMotion path="M340,260 L250,60" dur="3.5s" repeatCount="indefinite" />
            </circle>
          </g>

          <!-- Peer Nodes -->
          <!-- Node 1: Top -->
          <g transform="translate(250, 60)">
            <circle r="22" fill="#1C2541" stroke="#5BC0BE" stroke-width="2"/>
            <text y="5" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer 1</text>
          </g>
          <!-- Node 2: Left -->
          <g transform="translate(110, 150)">
            <circle r="22" fill="#1C2541" stroke="#5BC0BE" stroke-width="2"/>
            <text y="5" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer 2</text>
          </g>
          <!-- Node 3: Right -->
          <g transform="translate(390, 150)">
            <circle r="22" fill="#1C2541" stroke="#5BC0BE" stroke-width="2"/>
            <text y="5" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer 3</text>
          </g>
          <!-- Node 4: Bottom-Left -->
          <g transform="translate(160, 260)">
            <circle r="22" fill="#1C2541" stroke="#5BC0BE" stroke-width="2"/>
            <text y="5" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer 4</text>
          </g>
          <!-- Node 5: Bottom-Right -->
          <g transform="translate(340, 260)">
            <circle r="22" fill="#1C2541" stroke="#5BC0BE" stroke-width="2"/>
            <text y="5" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer 5</text>
          </g>
        </svg>
      `;
      if (heroStatusText) heroStatusText.textContent = "TOPOLOGY: FULL MESH PEER-TO-PEER (DECENTRALIZED)";
    } else {
      heroTopologyContainer.innerHTML = `
        <svg viewBox="0 0 500 320" class="hero-diagram-svg">
          <defs>
            <filter id="serverGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Star Spokes Connecting to Central Server -->
          <g stroke="#3A506B" stroke-width="2" opacity="0.8">
            <line x1="250" y1="160" x2="110" y2="80" />
            <line x1="250" y1="160" x2="390" y2="80" />
            <line x1="250" y1="160" x2="90" y2="240" />
            <line x1="250" y1="160" x2="410" y2="240" />
          </g>

          <!-- Animated Request / Response Packets -->
          <g>
            <!-- Request from Client 1 to Server -->
            <circle r="4" fill="#38BDF8">
              <animateMotion path="M110,80 L250,160" dur="2s" repeatCount="indefinite" />
            </circle>
            <!-- Response from Server to Client 2 -->
            <circle r="4" fill="#5BC0BE">
              <animateMotion path="M250,160 L390,80" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <!-- Request from Client 3 to Server -->
            <circle r="4" fill="#38BDF8">
              <animateMotion path="M90,240 L250,160" dur="3s" repeatCount="indefinite" />
            </circle>
            <!-- Response from Server to Client 4 -->
            <circle r="4" fill="#5BC0BE">
              <animateMotion path="M250,160 L410,240" dur="2.7s" repeatCount="indefinite" />
            </circle>
          </g>

          <!-- Central Server Node -->
          <g transform="translate(250, 160)">
            <circle r="36" fill="#1C2541" stroke="#38BDF8" stroke-width="3" filter="url(#serverGlow)" />
            <rect x="-14" y="-12" width="28" height="24" rx="3" fill="#3A506B" stroke="#5BC0BE" stroke-width="1.5" />
            <line x1="-8" y1="-4" x2="8" y2="-4" stroke="#5BC0BE" stroke-width="2" />
            <line x1="-8" y1="2" x2="8" y2="2" stroke="#5BC0BE" stroke-width="2" />
            <circle cx="4" cy="7" r="1.5" fill="#10B981" />
            <text y="24" text-anchor="middle" fill="#38BDF8" font-size="9" font-family="Consolas, monospace" font-weight="bold">HOST SERVER</text>
          </g>

          <!-- Client Nodes -->
          <g transform="translate(110, 80)">
            <circle r="20" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
            <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="Consolas, monospace">Client A</text>
          </g>
          <g transform="translate(390, 80)">
            <circle r="20" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
            <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="Consolas, monospace">Client B</text>
          </g>
          <g transform="translate(90, 240)">
            <circle r="20" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
            <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="Consolas, monospace">Client C</text>
          </g>
          <g transform="translate(410, 240)">
            <circle r="20" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
            <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="Consolas, monospace">Client D</text>
          </g>
        </svg>
      `;
      if (heroStatusText) heroStatusText.textContent = "TOPOLOGY: STAR CLIENT-SERVER (CENTRALIZED HUB)";
    }
  }

  heroToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      heroToggleBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const mode = e.target.getAttribute('data-topology');
      renderHeroTopology(mode);
    });
  });

  // Initial hero render
  renderHeroTopology('p2p');

  // =========================================================================
  // 4. INTERACTIVE DIAGRAM SHOWCASES (Section 3 P2P & Section 4 Client-Server)
  // =========================================================================
  
  // Section 3 P2P Interactive Node Click
  const p2pNodes = document.querySelectorAll('.interactive-p2p-node');
  const p2pActiveInfo = document.getElementById('p2pActiveNodeInfo');
  const p2pTriggerShareBtn = document.getElementById('p2pTriggerShareBtn');
  const p2pPacketDot = document.getElementById('p2pInteractivePacket');

  p2pNodes.forEach(node => {
    node.addEventListener('click', () => {
      audio.playClick();
      const nodeName = node.getAttribute('data-node-name') || 'Peer Device';
      const nodeRole = node.getAttribute('data-node-role') || 'Servent (Client & Server)';
      const nodeFiles = node.getAttribute('data-node-files') || 'Encrypted Chunks #01-#48';
      
      p2pNodes.forEach(n => n.classList.remove('selected-node'));
      node.classList.add('selected-node');

      if (p2pActiveInfo) {
        p2pActiveInfo.innerHTML = `Selected: <strong>${nodeName}</strong> | Role: <span style="color:#5BC0BE">${nodeRole}</span> | Shared: ${nodeFiles}`;
      }
    });
  });

  if (p2pTriggerShareBtn && p2pPacketDot) {
    p2pTriggerShareBtn.addEventListener('click', () => {
      audio.playPacketSent();
      p2pPacketDot.style.display = 'block';
      p2pPacketDot.classList.remove('anim-p2p-pulse');
      void p2pPacketDot.offsetWidth; // trigger reflow
      p2pPacketDot.classList.add('anim-p2p-pulse');

      if (p2pActiveInfo) {
        p2pActiveInfo.textContent = "STATUS: Transmitting chunk 0xFA48 directly to peer swarm (No central server involved)...";
      }

      setTimeout(() => {
        audio.playPacketReceived();
        if (p2pActiveInfo) {
          p2pActiveInfo.textContent = "STATUS: Transfer complete. File chunk verified by MD5 checksum across all peers.";
        }
      }, 1800);
    });
  }

  // Section 4 Client-Server Interactive Request Trigger
  const csRequestBtn = document.getElementById('csTriggerReqBtn');
  const csServerNode = document.getElementById('csServerCenterNode');
  const csStatusInfo = document.getElementById('csActiveStatusInfo');
  const csPacketUp = document.getElementById('csPacketUp');
  const csPacketDown = document.getElementById('csPacketDown');

  if (csRequestBtn) {
    csRequestBtn.addEventListener('click', () => {
      audio.playPacketSent();
      if (csStatusInfo) csStatusInfo.textContent = "SENDING: HTTP GET /api/v1/resource to Centralized Server...";

      if (csPacketUp) {
        csPacketUp.beginElement ? csPacketUp.beginElement() : null;
      }

      setTimeout(() => {
        // Server processing effect
        if (csServerNode) csServerNode.classList.add('server-processing');
        if (csStatusInfo) csStatusInfo.textContent = "SERVER: Authenticating client token & querying database...";
        audio.playTone(400, 0.15, 'square', 0.04);
      }, 900);

      setTimeout(() => {
        if (csServerNode) csServerNode.classList.remove('server-processing');
        if (csPacketDown) csPacketDown.beginElement ? csPacketDown.beginElement() : null;
        if (csStatusInfo) csStatusInfo.textContent = "RETURNING: HTTP 200 OK (Payload: JSON 42.8 KB) to Client A.";
        audio.playPacketReceived();
      }, 1900);
    });
  }

  // =========================================================================
  // 5. COMPARISON SECTION VIEW SWITCHER (Matrix vs Card Duel)
  // =========================================================================
  const compTabBtns = document.querySelectorAll('.comp-tab-btn');
  const tableViewWrapper = document.getElementById('comparisonTableView');
  const duelViewWrapper = document.getElementById('comparisonDuelView');

  compTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetView = btn.getAttribute('data-view');
      if (targetView === 'matrix') {
        if (tableViewWrapper) tableViewWrapper.style.display = 'block';
        if (duelViewWrapper) duelViewWrapper.style.display = 'none';
      } else {
        if (tableViewWrapper) tableViewWrapper.style.display = 'none';
        if (duelViewWrapper) duelViewWrapper.style.display = 'grid';
      }
    });
  });

  // =========================================================================
  // 6. DESIGN PRINCIPLES & MULTIMEDIA EXPLORER (Educational PDF tie-in)
  // =========================================================================
  const principleChips = document.querySelectorAll('.principle-chip');
  const principleTextContainer = document.getElementById('principleDetailText');

  const principleKnowledgeMap = {
    'line': "<strong>Element of Design — Line:</strong> Lines connect network nodes and separate sections. Diagonal and zigzag lines convey active data packet motion across routers.",
    'shape': "<strong>Element of Design — Shape:</strong> Geometric circles represent client workstations, while hexagons and layered rectangles represent centralized servers.",
    'color': "<strong>Element of Design — Color:</strong> Deep Navy (#0B132B) conveys security and professionalism (as taught in PDF Slide 31). Teal (#5BC0BE) highlights active packet flows.",
    'texture': "<strong>Element of Design — Texture:</strong> Subtle cyber-grid digital textures evoke the technical reality of telecommunication infrastructure.",
    'space': "<strong>Element of Design — Space:</strong> Generous negative space between cards and diagrams ensures complex networking topologies remain digestible and organized.",
    'balance': "<strong>Principle of Design — Balance:</strong> Symmetrical balance illustrates client-server star hierarchies; asymmetrical balance represents decentralized peer swarms.",
    'contrast': "<strong>Principle of Design — Contrast:</strong> High-value contrast between glowing teal indicators and deep navy backgrounds guides the student's eye to active network nodes.",
    'hierarchy': "<strong>Principle of Design — Hierarchy:</strong> Typographic weights ensure students absorb definitions first, followed by architectural diagrams and technical specifications.",
    'unity': "<strong>Principle of Design — Unity:</strong> Consistent color palettes, border radiuses, and button mechanics unify the entire single-page educational resource."
  };

  principleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      audio.playClick();
      principleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const principleKey = chip.getAttribute('data-principle');
      if (principleTextContainer && principleKnowledgeMap[principleKey]) {
        principleTextContainer.innerHTML = principleKnowledgeMap[principleKey];
      }
    });
  });

  // =========================================================================
  // 7. LIVE NETWORK SIMULATOR & WIRESHARK-STYLE PACKET LOG
  // =========================================================================
  const simModeBtns = document.querySelectorAll('.sim-mode-btn');
  const simActionBtn = document.getElementById('simActionBtn');
  const simClearBtn = document.getElementById('simClearBtn');
  const simCanvasSvg = document.getElementById('simCanvasSvg');
  const terminalLog = document.getElementById('simTerminalLog');
  const inspectorIp = document.getElementById('inspIp');
  const inspectorRole = document.getElementById('inspRole');
  const inspectorBw = document.getElementById('inspBw');
  const inspectorStatus = document.getElementById('inspStatus');

  let currentSimMode = 'p2p';
  let simPacketCounter = 100;

  function appendTerminalLog(msg, type = 'info') {
    if (!terminalLog) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const div = document.createElement('div');
    div.className = `terminal-log-entry ${type}`;
    div.innerHTML = `<span class="log-time">[${timeStr}]</span> ${msg}`;
    terminalLog.appendChild(div);
    terminalLog.scrollTop = terminalLog.scrollHeight;
  }

  function updateInspector(ip, role, bw, status) {
    if (inspectorIp) inspectorIp.textContent = ip;
    if (inspectorRole) inspectorRole.textContent = role;
    if (inspectorBw) inspectorBw.textContent = bw;
    if (inspectorStatus) inspectorStatus.textContent = status;
  }

  function renderSimTopology(mode) {
    currentSimMode = mode;
    if (!simCanvasSvg) return;

    if (mode === 'p2p') {
      simCanvasSvg.innerHTML = `
        <defs>
          <filter id="simGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Connecting Mesh Grid -->
        <g stroke="#3A506B" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.65">
          <line x1="160" y1="120" x2="380" y2="120" />
          <line x1="160" y1="120" x2="100" y2="320" />
          <line x1="160" y1="120" x2="440" y2="320" />
          <line x1="160" y1="120" x2="270" y2="380" />

          <line x1="380" y1="120" x2="100" y2="320" />
          <line x1="380" y1="120" x2="440" y2="320" />
          <line x1="380" y1="120" x2="270" y2="380" />

          <line x1="100" y1="320" x2="440" y2="320" />
          <line x1="100" y1="320" x2="270" y2="380" />
          <line x1="440" y1="320" x2="270" y2="380" />
        </g>

        <!-- Dynamic Packet Stream Path -->
        <g id="simDynamicPacketGroup"></g>

        <!-- Peer Nodes -->
        <g class="sim-interactive-node" data-ip="192.168.1.101" data-role="Peer / Servent" data-bw="100 Mbps Up/Down" data-status="Active Seeding" transform="translate(160, 120)">
          <circle r="26" fill="#1C2541" stroke="#5BC0BE" stroke-width="2.5" cursor="pointer"/>
          <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer A</text>
        </g>
        <g class="sim-interactive-node" data-ip="192.168.1.102" data-role="Peer / Servent" data-bw="85 Mbps Up/Down" data-status="Leeching 64%" transform="translate(380, 120)">
          <circle r="26" fill="#1C2541" stroke="#5BC0BE" stroke-width="2.5" cursor="pointer"/>
          <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer B</text>
        </g>
        <g class="sim-interactive-node" data-ip="192.168.1.103" data-role="Peer / Servent" data-bw="150 Mbps Up/Down" data-status="Active Seeding" transform="translate(100, 320)">
          <circle r="26" fill="#1C2541" stroke="#5BC0BE" stroke-width="2.5" cursor="pointer"/>
          <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer C</text>
        </g>
        <g class="sim-interactive-node" data-ip="192.168.1.104" data-role="Peer / Servent" data-bw="90 Mbps Up/Down" data-status="Leeching 28%" transform="translate(440, 320)">
          <circle r="26" fill="#1C2541" stroke="#5BC0BE" stroke-width="2.5" cursor="pointer"/>
          <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer D</text>
        </g>
        <g class="sim-interactive-node" data-ip="192.168.1.105" data-role="Peer / Servent" data-bw="120 Mbps Up/Down" data-status="Active Seeding" transform="translate(270, 380)">
          <circle r="26" fill="#1C2541" stroke="#5BC0BE" stroke-width="2.5" cursor="pointer"/>
          <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Consolas, monospace" font-weight="bold">Peer E</text>
        </g>
      `;
      appendTerminalLog("Initialized P2P Swarm Topology. Distributed hash table ready.", "info");
      updateInspector("192.168.1.101", "Peer / Servent", "100 Mbps Up/Down", "Ready (Click node to inspect)");
    } else {
      simCanvasSvg.innerHTML = `
        <defs>
          <filter id="serverGlowFilter">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Star Spoke Connections -->
        <g stroke="#3A506B" stroke-width="2" opacity="0.75">
          <line x1="270" y1="220" x2="110" y2="100" />
          <line x1="270" y1="220" x2="430" y2="100" />
          <line x1="270" y1="220" x2="90" y2="360" />
          <line x1="270" y1="220" x2="450" y2="360" />
        </g>

        <!-- Dynamic Packet Stream Path -->
        <g id="simDynamicPacketGroup"></g>

        <!-- Central Server Node -->
        <g class="sim-interactive-node" data-ip="10.0.0.1" data-role="Enterprise Server" data-bw="10 Gbps Uplink" data-status="CPU 18% | Storage 12TB" transform="translate(270, 220)">
          <circle r="42" fill="#1C2541" stroke="#38BDF8" stroke-width="3" filter="url(#serverGlowFilter)" cursor="pointer"/>
          <rect x="-16" y="-14" width="32" height="28" rx="4" fill="#3A506B" stroke="#5BC0BE" stroke-width="1.5" />
          <line x1="-10" y1="-5" x2="10" y2="-5" stroke="#5BC0BE" stroke-width="2" />
          <line x1="-10" y1="2" x2="10" y2="2" stroke="#5BC0BE" stroke-width="2" />
          <circle cx="5" cy="8" r="2" fill="#10B981" />
          <text y="28" text-anchor="middle" fill="#38BDF8" font-size="9" font-family="Consolas, monospace" font-weight="bold">HOST SERVER</text>
        </g>

        <!-- Clients -->
        <g class="sim-interactive-node" data-ip="10.0.0.101" data-role="Client (Desktop)" data-bw="100 Mbps Down" data-status="Idle" transform="translate(110, 100)">
          <circle r="24" fill="#1C2541" stroke="#3A506B" stroke-width="2" cursor="pointer"/>
          <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="Consolas, monospace">Client A</text>
        </g>
        <g class="sim-interactive-node" data-ip="10.0.0.102" data-role="Client (Mobile)" data-bw="50 Mbps Down" data-status="Idle" transform="translate(430, 100)">
          <circle r="24" fill="#1C2541" stroke="#3A506B" stroke-width="2" cursor="pointer"/>
          <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="Consolas, monospace">Client B</text>
        </g>
        <g class="sim-interactive-node" data-ip="10.0.0.103" data-role="Client (Tablet)" data-bw="60 Mbps Down" data-status="Idle" transform="translate(90, 360)">
          <circle r="24" fill="#1C2541" stroke="#3A506B" stroke-width="2" cursor="pointer"/>
          <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="Consolas, monospace">Client C</text>
        </g>
        <g class="sim-interactive-node" data-ip="10.0.0.104" data-role="Client (Laptop)" data-bw="100 Mbps Down" data-status="Idle" transform="translate(450, 360)">
          <circle r="24" fill="#1C2541" stroke="#3A506B" stroke-width="2" cursor="pointer"/>
          <text y="4" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="Consolas, monospace">Client D</text>
        </g>
      `;
      appendTerminalLog("Initialized Client-Server Topology. Central Daemon listening on port 443.", "info");
      updateInspector("10.0.0.1", "Enterprise Server", "10 Gbps Uplink", "Ready (Click node to inspect)");
    }

    // Attach click listener to nodes
    document.querySelectorAll('.sim-interactive-node').forEach(node => {
      node.addEventListener('click', () => {
        audio.playClick();
        const ip = node.getAttribute('data-ip');
        const role = node.getAttribute('data-role');
        const bw = node.getAttribute('data-bw');
        const status = node.getAttribute('data-status');
        updateInspector(ip, role, bw, status);
        appendTerminalLog(`Inspected node [${ip}] (${role}): Status=${status}`, 'info');
      });
    });
  }

  simModeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      simModeBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const mode = e.target.getAttribute('data-sim-mode');
      renderSimTopology(mode);
    });
  });

  if (simActionBtn) {
    simActionBtn.addEventListener('click', () => {
      simPacketCounter++;
      audio.playPacketSent();

      if (currentSimMode === 'p2p') {
        appendTerminalLog(`PKT #${simPacketCounter} [P2P-CHUNK] Peer A broadcasting piece #0x${simPacketCounter.toString(16)} to swarm`, "info");
        
        // Simulate animated swarm packet
        const packetGroup = document.getElementById('simDynamicPacketGroup');
        if (packetGroup) {
          packetGroup.innerHTML = `
            <circle r="5" fill="#5BC0BE">
              <animateMotion path="M160,120 L380,120" dur="0.9s" fill="freeze" />
            </circle>
            <circle r="5" fill="#5BC0BE">
              <animateMotion path="M160,120 L100,320" dur="1.1s" fill="freeze" />
            </circle>
            <circle r="5" fill="#5BC0BE">
              <animateMotion path="M160,120 L440,320" dur="1.3s" fill="freeze" />
            </circle>
          `;
        }

        setTimeout(() => {
          audio.playPacketReceived();
          appendTerminalLog(`ACK #${simPacketCounter} Chunk #0x${simPacketCounter.toString(16)} verified by 3 peers. Swarm health 100%.`, "success");
        }, 1200);

      } else {
        appendTerminalLog(`PKT #${simPacketCounter} [HTTP-REQ] Client A -> Server: GET /api/v2/dataset`, "info");
        
        const packetGroup = document.getElementById('simDynamicPacketGroup');
        if (packetGroup) {
          packetGroup.innerHTML = `
            <circle r="5" fill="#38BDF8">
              <animateMotion path="M110,100 L270,220" dur="0.8s" fill="freeze" />
            </circle>
          `;
        }

        setTimeout(() => {
          appendTerminalLog(`SRV-PROC: Server authenticated request #${simPacketCounter}. Querying database cluster...`, "warn");
          audio.playTone(480, 0.1, 'sine', 0.05);

          setTimeout(() => {
            if (packetGroup) {
              packetGroup.innerHTML = `
                <circle r="5" fill="#10B981">
                  <animateMotion path="M270,220 L110,100" dur="0.8s" fill="freeze" />
                </circle>
              `;
            }
            audio.playPacketReceived();
            appendTerminalLog(`PKT #${simPacketCounter} [HTTP-RES] Server -> Client A: 200 OK (Content-Type: application/json)`, "success");
          }, 700);
        }, 900);
      }
    });
  }

  if (simClearBtn) {
    simClearBtn.addEventListener('click', () => {
      audio.playClick();
      if (terminalLog) terminalLog.innerHTML = '';
      appendTerminalLog("Terminal logs cleared.", "info");
    });
  }

  // Initial simulation render
  renderSimTopology('p2p');

  // =========================================================================
  // 8. ARCHITECTURE DECISION ENGINE (Summary Section Helper)
  // =========================================================================
  const decisionBtns = document.querySelectorAll('.decision-opt-btn');
  const recTitle = document.getElementById('decisionRecTitle');
  const recDesc = document.getElementById('decisionRecDesc');

  const userChoices = {
    budget: 'low',
    security: 'standard',
    failover: 'peer'
  };

  function evaluateDecision() {
    let p2pScore = 0;
    let csScore = 0;

    if (userChoices.budget === 'low') p2pScore += 2; else csScore += 2;
    if (userChoices.security === 'enterprise') csScore += 3; else p2pScore += 1;
    if (userChoices.failover === 'peer') p2pScore += 2; else csScore += 2;

    if (p2pScore >= csScore) {
      if (recTitle) recTitle.textContent = "RECOMMENDED: Peer-to-Peer (P2P) Architecture";
      if (recDesc) recDesc.textContent = "Your requirements prioritize low infrastructure costs and resilience against single-point failure. A decentralized mesh architecture like BitTorrent or WebRTC is ideal for your distributed workload.";
    } else {
      if (recTitle) recTitle.textContent = "RECOMMENDED: Client-Server Architecture";
      if (recDesc) recDesc.textContent = "Your requirements require strict enterprise security, centralized data integrity, and strict access compliance. A centralized hub-and-spoke model (e.g., REST API with cloud database) is required.";
    }
  }

  decisionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const category = btn.getAttribute('data-category');
      const val = btn.getAttribute('data-val');

      // Unselect siblings
      document.querySelectorAll(`.decision-opt-btn[data-category="${category}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      userChoices[category] = val;
      evaluateDecision();
    });
  });

  // =========================================================================
  // 9. KNOWLEDGE CHECK QUIZ SYSTEM (Assessment with Detailed Feedback)
  // =========================================================================
  const quizData = [
    {
      question: "Which of the following is a primary characteristic of a Peer-to-Peer (P2P) network?",
      options: [
        "A central mainframe authenticates every user transaction.",
        "Each computer can function as both a client and a server (servent).",
        "Clients have no processing power and rely entirely on the host.",
        "Data can only be transmitted in one direction sequentially."
      ],
      correctIndex: 1,
      explanation: "In a P2P network, there is no master server. Instead, every participating node (peer) acts as a 'servent'—both requesting resources and serving them directly to other peers."
    },
    {
      question: "What is a major vulnerability inherent to the standard Client-Server network architecture?",
      options: [
        "Excessive peer bandwidth consumption.",
        "Single point of failure: if the central server crashes, all clients lose service.",
        "Inability to enforce centralized access control policies.",
        "Inability to run relational databases."
      ],
      correctIndex: 1,
      explanation: "Because all clients connect to a central server (or server cluster), if that central host goes down or suffers a catastrophic failure without backup, the entire network is incapacitated."
    },
    {
      question: "In the context of the Elements and Principles of Design from our Multimedia lecture, what does 'Contrast' accomplish?",
      options: [
        "It makes all visual elements look identical to maintain repetition.",
        "It places identical objects symmetrically on both sides.",
        "It highlights differences between adjacent elements to make critical information stand out.",
        "It turns raster images into scalable mathematical vector files."
      ],
      correctIndex: 2,
      explanation: "As explained in the lecture slides, Contrast is the difference between adjacent visual elements (such as bright teal buttons on a dark navy background), directing attention and making vital content stand out."
    },
    {
      question: "How does network scalability behave in a typical BitTorrent P2P file swarm compared to a traditional web server?",
      options: [
        "As more peers join the P2P swarm, the overall upload capacity of the network increases.",
        "As more peers join, the central server's CPU load increases exponentially.",
        "P2P networks cannot scale beyond 10 nodes.",
        "BitTorrent requires every user to purchase server hardware."
      ],
      correctIndex: 0,
      explanation: "P2P swarms are uniquely self-scaling: each downloading peer simultaneously uploads pieces they have already acquired, meaning increased popularity actually expands total bandwidth!"
    },
    {
      question: "Which scenario is BEST suited for a centralized Client-Server architecture?",
      options: [
        "Ad-hoc local file sharing between two smartphones via Bluetooth/Wi-Fi Direct.",
        "Commercial online banking requiring strict ACID transactions, audits, and centralized authentication.",
        "Anonymous distributed file sharing across public torrent swarms.",
        "Direct peer-to-peer cryptocurrency ledger broadcast."
      ],
      correctIndex: 1,
      explanation: "Commercial banking requires strict regulatory compliance, centralized firewalls, rigorous transaction logging, and single-source-of-truth data integrity, making Client-Server the essential choice."
    },
    {
      question: "In multimedia systems, which element is considered non-linear, as defined in our course syllabus?",
      options: [
        "A traditional cassette tape played start to finish.",
        "A feature film shown in a cinema without pauses.",
        "An interactive educational website allowing user-driven navigation and exploration.",
        "A linear television broadcast."
      ],
      correctIndex: 2,
      explanation: "Slide 11 of the multimedia syllabus explicitly identifies websites and interactive e-learning platforms as Non-Linear Multimedia, because users can freely navigate and interact with content rather than following a fixed sequence."
    }
  ];

  let currentQuestionIndex = 0;
  let currentScore = 0;
  let questionAnswered = false;

  const quizQuestionText = document.getElementById('quizQuestionText');
  const quizOptionsContainer = document.getElementById('quizOptionsContainer');
  const quizFeedbackBox = document.getElementById('quizFeedbackBox');
  const quizNextBtn = document.getElementById('quizNextBtn');
  const quizScoreDisplay = document.getElementById('quizScoreDisplay');
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizActiveCard = document.getElementById('quizActiveCard');
  const quizResultsCard = document.getElementById('quizResultsCard');
  const quizFinalScore = document.getElementById('quizFinalScore');
  const quizVerdictTitle = document.getElementById('quizVerdictTitle');
  const quizVerdictText = document.getElementById('quizVerdictText');
  const quizRestartBtn = document.getElementById('quizRestartBtn');

  function loadQuestion(index) {
    questionAnswered = false;
    const q = quizData[index];
    if (!q) return;

    if (quizQuestionText) {
      quizQuestionText.textContent = `Question ${index + 1} of ${quizData.length}: ${q.question}`;
    }

    if (quizProgressFill) {
      const pct = ((index + 1) / quizData.length) * 100;
      quizProgressFill.style.width = `${pct}%`;
    }

    if (quizFeedbackBox) {
      quizFeedbackBox.className = 'quiz-feedback-box';
      quizFeedbackBox.style.display = 'none';
      quizFeedbackBox.innerHTML = '';
    }

    if (quizNextBtn) {
      quizNextBtn.disabled = true;
      quizNextBtn.textContent = index === quizData.length - 1 ? "Complete Quiz" : "Next Question →";
    }

    if (quizOptionsContainer) {
      quizOptionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt-btn';
        btn.innerHTML = `<span class="quiz-opt-letter">${letters[optIdx]}</span> <span>${optText}</span>`;
        btn.addEventListener('click', () => handleOptionSelection(optIdx, btn));
        quizOptionsContainer.appendChild(btn);
      });
    }
  }

  function handleOptionSelection(selectedIndex, clickedBtn) {
    if (questionAnswered) return;
    questionAnswered = true;

    const q = quizData[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correctIndex;
    const allOptBtns = quizOptionsContainer.querySelectorAll('.quiz-opt-btn');

    allOptBtns.forEach((btn, idx) => {
      btn.classList.add('locked');
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      }
    });

    if (isCorrect) {
      currentScore++;
      audio.playSuccess();
      clickedBtn.classList.add('correct');
      if (quizFeedbackBox) {
        quizFeedbackBox.className = 'quiz-feedback-box correct';
        quizFeedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${q.explanation}`;
      }
    } else {
      audio.playError();
      clickedBtn.classList.add('wrong');
      if (quizFeedbackBox) {
        quizFeedbackBox.className = 'quiz-feedback-box wrong';
        quizFeedbackBox.innerHTML = `<strong>✕ Incorrect.</strong> ${q.explanation}`;
      }
    }

    if (quizScoreDisplay) {
      quizScoreDisplay.textContent = `Score: ${currentScore} / ${quizData.length}`;
    }

    if (quizNextBtn) {
      quizNextBtn.disabled = false;
    }
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      audio.playClick();
      if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
      } else {
        showQuizResults();
      }
    });
  }

  function showQuizResults() {
    if (quizActiveCard) quizActiveCard.style.display = 'none';
    if (quizResultsCard) quizResultsCard.style.display = 'block';

    const pct = Math.round((currentScore / quizData.length) * 100);
    if (quizFinalScore) quizFinalScore.textContent = `${currentScore} / ${quizData.length} (${pct}%)`;

    if (pct >= 80) {
      audio.playSuccess();
      if (quizVerdictTitle) quizVerdictTitle.textContent = "🏆 Master Network Architect!";
      if (quizVerdictText) quizVerdictText.textContent = "Outstanding achievement! You demonstrated thorough mastery of both Peer-to-Peer and Client-Server architectures, including design principles and multimedia systems.";
    } else if (pct >= 50) {
      if (quizVerdictTitle) quizVerdictTitle.textContent = "🎖️ Network Apprentice";
      if (quizVerdictText) quizVerdictText.textContent = "Solid comprehension! You have a firm grasp of networking essentials. Review the comparison matrix and interactive simulators to master the fine details.";
    } else {
      if (quizVerdictTitle) quizVerdictTitle.textContent = "📚 Network Explorer";
      if (quizVerdictText) quizVerdictText.textContent = "A great start to your networking journey! Re-read the architectural advantages, review the comparison table, and retry the quiz.";
    }
  }

  if (quizRestartBtn) {
    quizRestartBtn.addEventListener('click', () => {
      audio.playClick();
      currentQuestionIndex = 0;
      currentScore = 0;
      if (quizScoreDisplay) quizScoreDisplay.textContent = `Score: 0 / ${quizData.length}`;
      if (quizResultsCard) quizResultsCard.style.display = 'none';
      if (quizActiveCard) quizActiveCard.style.display = 'block';
      loadQuestion(0);
    });
  }

  // Initialize Quiz Question 1
  loadQuestion(0);

  // =========================================================================
  // 10. RESPONSIVE NAVIGATION & SCROLL OBSERVER
  // =========================================================================
  const mobileToggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      audio.playClick();
      navMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active section scroll spy
  const observedSections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    observedSections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

});
