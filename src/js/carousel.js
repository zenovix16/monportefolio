export function initCarousel({ track, prevBtn, nextBtn, progressTrack, progressFill, scrollAmount, showProgress }) {
  prevBtn?.addEventListener("click", () => track.scrollBy({ left: -scrollAmount, behavior: "smooth" }));
  nextBtn?.addEventListener("click", () => track.scrollBy({ left: scrollAmount, behavior: "smooth" }));

  if (!showProgress || !progressTrack) return;
  progressTrack.classList.remove("hidden");

  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 0;
    progressFill.style.width = `${Math.max(18, ratio * 100)}%`;
  };
  track.addEventListener("scroll", update, { passive: true });
  update();
}
