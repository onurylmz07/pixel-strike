import { W, H } from "./constants.js";
import {
  buildGunSprite,
  buildMuzzleFlash,
  buildEnemyFrames,
} from "./sprites.js";

const gunSprite = buildGunSprite();
const muzzleFlash = buildMuzzleFlash();
const enemyFrames = buildEnemyFrames();

export function drawArena(ctx) {
  ctx.fillStyle = "#121a16";
  ctx.fillRect(0, 0, W, H);

  const tile = 40;
  ctx.strokeStyle = "#1a2820";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += tile) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += tile) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }

  // arena border
  ctx.strokeStyle = "#2a4036";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  // corner accents
  ctx.fillStyle = "#f0c75e";
  ctx.fillRect(0, 0, 12, 3);
  ctx.fillRect(0, 0, 3, 12);
  ctx.fillRect(W - 12, 0, 12, 3);
  ctx.fillRect(W - 3, 0, 3, 12);
  ctx.fillRect(0, H - 3, 12, 3);
  ctx.fillRect(0, H - 12, 3, 12);
  ctx.fillRect(W - 12, H - 3, 12, 3);
  ctx.fillRect(W - 3, H - 12, 3, 12);
}

export function drawPlayer(ctx, player) {
  ctx.save();
  ctx.translate(player.x, player.y);

  if (player.invuln > 0 && Math.floor(player.invuln * 20) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }

  ctx.rotate(player.angle);

  // Engine exhaust pulse behind the craft
  const pulse = Math.floor(player.anim * (player.moving ? 1 : 0.4)) % 4;
  const exhaustColors = ["#ff6b4a", "#ff9f1c", "#ffe066", "#fff8c0"];
  ctx.fillStyle = exhaustColors[pulse];
  ctx.fillRect(-26, -4, 6 + (pulse % 2), 3);
  ctx.fillRect(-26, 2, 6 + ((pulse + 1) % 2), 3);
  if (player.moving) {
    ctx.fillStyle = "#fff8c0";
    ctx.fillRect(-30, -2, 4, 2);
    ctx.fillRect(-30, 1, 4, 2);
  }

  // Fancy fighter aircraft (replaces the old gun)
  ctx.drawImage(gunSprite, -16, -18, 56, 36);

  if (player.muzzle > 0) {
    ctx.drawImage(muzzleFlash, 32, -12, 24, 24);
  }

  ctx.restore();
}

export function drawEnemy(ctx, enemy) {
  const frame = enemyFrames[Math.floor(enemy.anim) % enemyFrames.length];
  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  let scale = 1;
  if (enemy.dying > 0) {
    scale = enemy.dying / 0.25;
    ctx.globalAlpha = scale;
  }

  ctx.scale(scale * 2, scale * 2);
  if (enemy.hitFlash > 0) {
    ctx.filter = "brightness(2.5)";
  }
  ctx.drawImage(frame, -8, -8);
  ctx.filter = "none";
  ctx.restore();
}

export function drawBullet(ctx, bullet) {
  ctx.fillStyle = "#f0c75e";
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, bullet.radius + 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff8c0";
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, bullet.radius - 0.5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawAimReticle(ctx, mouse) {
  ctx.strokeStyle = "rgba(240, 199, 94, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mouse.x - 12, mouse.y);
  ctx.lineTo(mouse.x - 4, mouse.y);
  ctx.moveTo(mouse.x + 4, mouse.y);
  ctx.lineTo(mouse.x + 12, mouse.y);
  ctx.moveTo(mouse.x, mouse.y - 12);
  ctx.lineTo(mouse.x, mouse.y - 4);
  ctx.moveTo(mouse.x, mouse.y + 4);
  ctx.lineTo(mouse.x, mouse.y + 12);
  ctx.stroke();
}
