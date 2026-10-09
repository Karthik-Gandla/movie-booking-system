const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[36m%s\x1b[0m', '   CinePass - MERN Movie Ticket Booking System       ');
console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('Starting Backend API and Frontend Vite server...\n');

const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

function pipeOutput(child, prefix, color) {
  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${color}${prefix}\x1b[0m ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`${color}${prefix} (err)\x1b[0m ${line}`);
      }
    });
  });
}

pipeOutput(backend, '[BACKEND]', '\x1b[32m');
pipeOutput(frontend, '[FRONTEND]', '\x1b[35m');

function cleanup() {
  console.log('\nShutting down dev servers...');
  if (isWin) {
    if (backend.pid) spawn('taskkill', ['/pid', backend.pid, '/f', '/t']);
    if (frontend.pid) spawn('taskkill', ['/pid', frontend.pid, '/f', '/t']);
  } else {
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
  }
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
