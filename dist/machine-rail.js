'use strict';
(() => {
  const rail = document.querySelector('.machine-photo-rail');
  if (!rail) return;

  const cards = [...rail.querySelectorAll('.machine-photo-card')];
  if (cards.length < 2) return;

  const track = document.createElement('div');
  track.className = 'machine-photo-track';
  const group = document.createElement('div');
  group.className = 'machine-photo-group';
  cards.forEach(card => group.append(card));

  const cloneGroup = group.cloneNode(true);
  cloneGroup.setAttribute('aria-hidden', 'true');
  cloneGroup.querySelectorAll('a').forEach(link => link.tabIndex = -1);
  track.append(group, cloneGroup);
  rail.append(track);
})();
