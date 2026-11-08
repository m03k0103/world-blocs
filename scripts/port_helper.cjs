const fs = require('fs');
const path = require('path');
const net = require('net');
const http = require('http');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT_FILE = path.join(ROOT_DIR, '.server_port');
const PID_FILE = path.join(ROOT_DIR, '.server_pid');
const PORTS_JSON_PATH = 'D:\\dev\\Orchestration\\ports.json';

const DEFAULT_PRIMARY = 8006;
const DEFAULT_FALLBACK = 8056;

/**
 * D:\dev\Orchestration\ports.json から World の設定を取得
 */
function loadPortConfig() {
  let primary = DEFAULT_PRIMARY;
  let fallback = DEFAULT_FALLBACK;

  try {
    if (fs.existsSync(PORTS_JSON_PATH)) {
      const raw = fs.readFileSync(PORTS_JSON_PATH, 'utf8');
      const data = JSON.parse(raw);
      if (data.projects && data.projects.World) {
        const w = data.projects.World;
        if (Number.isInteger(Number(w.port))) {
          primary = Number(w.port);
        }
        if (Number.isInteger(Number(w.fallback_port))) {
          fallback = Number(w.fallback_port);
        }
      }
    }
  } catch (_) {
    // ports.json 読み込み失敗時はデフォルト値にフォールバック
  }

  return { primary, fallback };
}

/**
 * 指定ポートで HTTP レスポンスがあるか検証
 */
function checkHttpAlive(port, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, { timeout: timeoutMs }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500);
      res.resume();
    });
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * 指定ポートを LISTEN しているプロセスの PID を取得
 */
function getListeningPid(port) {
  try {
    const out = execSync('netstat -ano', { encoding: 'utf8' });
    const target = `:${port} `;
    for (const line of out.split('\n')) {
      if (line.includes(target) && line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(Number(pid)) && Number(pid) > 0) {
          return Number(pid);
        }
      }
    }
  } catch (_) {}
  return null;
}

/**
 * 指定ポートへの TCP 接続試行（使用中なら true）
 */
function checkTcpConnect(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(250);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

/**
 * 指定ポートがバインド可能か（空いているか）判定
 */
async function isPortAvailable(port) {
  if (await checkTcpConnect(port)) {
    return false;
  }

  for (const host of ['127.0.0.1', '0.0.0.0']) {
    const bindable = await new Promise((resolve) => {
      const server = net.createServer();
      server.unref();
      server.once('error', () => resolve(false));
      server.listen({ port, host, exclusive: true }, () => {
        server.close(() => resolve(true));
      });
    });
    if (!bindable) return false;
  }
  return true;
}

/**
 * 挙動1: 既存サーバーの稼働チェック
 */
async function checkRunning() {
  if (!fs.existsSync(PORT_FILE)) {
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(PORT_FILE, 'utf8').trim();
    const port = Number(content);
    if (!port || isNaN(port)) {
      process.exit(1);
    }

    const alive = await checkHttpAlive(port, 1500);
    if (alive) {
      console.log(port);
      process.exit(0);
    } else {
      // 稼働していない古いファイルをクリーンアップ
      try { fs.unlinkSync(PORT_FILE); } catch (_) {}
      try { fs.unlinkSync(PID_FILE); } catch (_) {}
      process.exit(1);
    }
  } catch (_) {
    process.exit(1);
  }
}

/**
 * 利用可能な空きポートを探索
 */
async function getPort() {
  const { primary, fallback } = loadPortConfig();

  // 1. プライマリポート (8006)
  if (await isPortAvailable(primary)) {
    console.log(primary);
    process.exit(0);
  }

  // 2. フォールバックポート (8056)
  if (await isPortAvailable(fallback)) {
    console.log(fallback);
    process.exit(0);
  }

  // 3. 8057〜8099 の範囲で探索
  for (let p = fallback + 1; p < 8100; p++) {
    if (await isPortAvailable(p)) {
      console.log(p);
      process.exit(0);
    }
  }

  console.error(`[ERROR] No available port found (primary: ${primary}, fallback: ${fallback}).`);
  process.exit(1);
}

/**
 * サーバー起動待機（HTTP レディネスチェック）および PID 記録
 */
function waitReady(portStr) {
  const port = Number(portStr) || DEFAULT_PRIMARY;
  const start = Date.now();
  const maxWait = 15000;

  function poll() {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      console.log(`Server is ready on port ${port} (HTTP ${res.statusCode})`);
      res.resume();

      // ポートをバインドしている真のサーバー PID を記録
      const pid = getListeningPid(port);
      if (pid) {
        fs.writeFileSync(PID_FILE, String(pid), 'utf8');
        console.log(`[INFO] Server PID ${pid} saved to .server_pid.`);
      }
      process.exit(0);
    });

    req.on('error', () => {
      if (Date.now() - start > maxWait) {
        console.log(`[WARN] Server initialization timeout on port ${port}`);
        const pid = getListeningPid(port);
        if (pid) {
          fs.writeFileSync(PID_FILE, String(pid), 'utf8');
        }
        process.exit(0);
      }
      setTimeout(poll, 250);
    });
  }

  poll();
}

// CLI コマンドディスパッチ
const command = process.argv[2];
if (command === 'check-running') {
  checkRunning();
} else if (command === 'get-port') {
  getPort();
} else if (command === 'wait-ready') {
  waitReady(process.argv[3]);
} else {
  console.log('Usage: node scripts/port_helper.cjs [check-running|get-port|wait-ready <port>]');
  process.exit(1);
}
