var footer = document.getElementById("footer");

footer.innerHTML = `
<footer class="footer">
    <div class="container">
    <img class="footer-logo" src="assets/Images/logo.png" alt="FreshFind logo">
      <div class="row g-5">
        <div class="col-lg-5">
          <p>Discover local markets, seasonal produce and useful neighborhood food information in one simple place.</p>
        </div>
        <div class="col-6 col-lg-2">
          <h5>Explore</h5>
          <div class="d-grid gap-2 mt-3"><a href="markets.html">Market Directory</a><a href="produce.html">Produce
              Guide</a><a href="seasonal.html">Seasonal Guide</a><a href="bookmarks.html">Bookmarks</a><a href="feedback.html">Feedback</a><a href="about.html">About Us</a><a
              href="contact.html">Contact Us</a></div>
        </div>
        <div class="col-6 col-lg-2">
          <h5>Quick links</h5>
          <div class="d-grid gap-2 mt-3"><a href="highlights.html">Highlights</a><a href="how-it-works.html">How it
              works</a><a href="find-market.html">Find a market</a></div>
        </div>
        <div class="col-lg-3">
          <h5>Share</h5>
          <p class="mt-3">Recommend a market or seasonal pick to someone nearby.</p>
          <i class="bi bi-facebook"></i>
          <i class="bi bi-twitter-x"></i>
          <i class="bi bi-instagram"></i>
        </div>
      </div>
      <hr class="border-secondary opacity-25 my-5">
      <div class="text-center small"> &copy 2026 FreshFind.</div>
      <div class="footer-clock" id="footerClock"></div>
    </div>
  </footer>
`;

function updateFooterClock() {
  var clockEl = document.getElementById("footerClock");
  if (!clockEl) return;

  var now = new Date();
  var dateText = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  var timeText = now.toLocaleTimeString();

  clockEl.innerHTML = "<strong>" + timeText + "</strong> &middot; " + dateText;
}

updateFooterClock();
setInterval(updateFooterClock, 1000);
