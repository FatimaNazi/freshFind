import React from "react";
import Breadcrumb from "../components/Breadcrumb";

export default function About() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "About Us", active: true }
        ]}
      />

      <section class="page-hero">
        <div class="container">
          <span class="badge-soft">About FreshFind</span>
          <h1 class="mt-3">Making local market discovery simple and reliable</h1>
          <p class="section-sub">A platform built to bring market schedules, stall locations and produce availability together in one clean interface.</p>
        </div>
      </section>

      <section class="section pt-4">
        <div class="container">
          <div class="row g-5 align-items-center">
            <div class="col-lg-6">
              <div class="detail-cover rounded-4 overflow-hidden position-relative">
                <img src="/assets/Images/about.jpg" alt="About FreshFind market community" className="w-100 object-fit-cover" style={{ minHeight: "340px" }} />
                <div class="detail-cover-content p-4 p-md-5">
                  <span class="badge bg-light text-success mb-3">FreshFind</span>
                  <h2 class="display-6 fw-bold">Local markets, useful information, one place.</h2>
                  <p class="mb-0">Discover market schedules, locations and produce without jumping between different sources.</p>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <span class="badge-soft">Our purpose</span>
              <h2 class="section-title display-6 mt-3">Built for everyday market discovery</h2>
              <p class="text-secondary">FreshFind brings farmers markets and seasonal produce information into a clean, searchable experience.</p>
              <p class="text-secondary">Users can filter markets, explore detailed schedules, browse produce categories, bookmark useful entries and share recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Values Section */}
      <section class="section section-soft" id="vision-mission-values">
        <div class="container">
          <div class="text-center mb-5">
            <span class="badge-soft"><i class="bi bi-compass-fill me-1"></i>Guiding Principles</span>
            <h2 class="section-title display-6 mt-3">Vision, Mission &amp; Core Values</h2>
            <p class="section-sub mx-auto mb-0">The core philosophy, purpose, and commitments driving FreshFind's community platform.</p>
          </div>

          <div class="row g-4">
            {/* 1. Our Vision */}
            <div class="col-lg-4">
              <div class="info-card p-4 p-md-5 h-100 shadow-sm border rounded-4 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="product-icon text-success" style={{ background: "linear-gradient(135deg, rgba(44,107,71,0.15), rgba(44,107,71,0.3))", color: "var(--green-800)" }}>
                      <i class="bi bi-eye-fill"></i>
                    </div>
                    <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-bold">Our Vision</span>
                  </div>
                  <h3 class="h4 fw-bold mb-3">A Thriving Local Food Ecosystem</h3>
                  <p class="text-secondary mb-4">
                    To create a transparent, vibrant food landscape across Pakistan where every family has effortless access to farm-fresh, seasonal produce while empowering local growers and sustainable agricultural communities.
                  </p>
                </div>
                <div class="pt-3 border-top">
                  <ul class="list-unstyled mb-0 small text-secondary d-grid gap-2">
                    <li class="d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-success"></i> Direct grower-to-consumer bridge</li>
                    <li class="d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-success"></i> Zero-middleman information transparency</li>
                    <li class="d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-success"></i> Lower food miles &amp; eco-sustainability</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. Our Mission */}
            <div class="col-lg-4">
              <div class="info-card p-4 p-md-5 h-100 shadow-sm border rounded-4 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="product-icon" style={{ background: "linear-gradient(135deg, rgba(224,168,60,0.2), rgba(224,168,60,0.45))", color: "#7a5310" }}>
                      <i class="bi bi-bullseye"></i>
                    </div>
                    <span class="badge bg-warning-subtle text-dark border border-warning-subtle px-3 py-2 fw-bold">Our Mission</span>
                  </div>
                  <h3 class="h4 fw-bold mb-3">Empowering Informed Food Choices</h3>
                  <p class="text-secondary mb-4">
                    To provide a modern, accessible, and reliable digital discovery platform that connects urban consumers with neighborhood farmers markets, real-time operating schedules, produce seasonality guides, and authentic grower stalls.
                  </p>
                </div>
                <div class="pt-3 border-top">
                  <ul class="list-unstyled mb-0 small text-secondary d-grid gap-2">
                    <li class="d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-warning"></i> Accurate, verified market schedules</li>
                    <li class="d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-warning"></i> Comprehensive produce &amp; harvest guide</li>
                    <li class="d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-warning"></i> Geolocation &amp; neighborhood discovery</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Our Values */}
            <div class="col-lg-4">
              <div class="info-card p-4 p-md-5 h-100 shadow-sm border rounded-4 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="product-icon" style={{ background: "linear-gradient(135deg, rgba(13,110,253,0.15), rgba(13,110,253,0.3))", color: "#084298" }}>
                      <i class="bi bi-shield-check"></i>
                    </div>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fw-bold">Our Values</span>
                  </div>
                  <h3 class="h4 fw-bold mb-3">Principles That Guide Every Step</h3>
                  <p class="text-secondary mb-4">
                    We believe trust is cultivated through truth and community focus. Our team operates with unwavering dedication to authenticity, accessibility, environmental respect, and consumer well-being.
                  </p>
                </div>
                <div class="pt-3 border-top">
                  <ul class="list-unstyled mb-0 small text-secondary d-grid gap-2">
                    <li class="d-flex align-items-center gap-2"><i class="bi bi-patch-check-fill text-primary"></i> <strong>Freshness:</strong> Seasonally picked, nutrient-dense nutrition</li>
                    <li class="d-flex align-items-center gap-2"><i class="bi bi-patch-check-fill text-primary"></i> <strong>Community:</strong> Championing local family farms &amp; artisans</li>
                    <li class="d-flex align-items-center gap-2"><i class="bi bi-patch-check-fill text-primary"></i> <strong>Integrity:</strong> Honest schedules, zero sponsored bias</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Provide Section */}
      <section class="section">
        <div class="container">
          <div class="text-center mb-5">
            <span class="badge-soft">What we provide</span>
            <h2 class="section-title mt-3">Everything starts with discovery</h2>
          </div>
          <div class="row g-4">
            <div class="col-md-6 col-lg-3">
              <div class="info-card p-4 h-100">
                <div class="product-icon mb-3"><i class="bi bi-geo-alt"></i></div>
                <h3 class="h5">Market discovery</h3>
                <p class="text-secondary mb-0">Find markets by neighborhood and operating day.</p>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="info-card p-4 h-100">
                <div class="product-icon mb-3"><i class="bi bi-basket2"></i></div>
                <h3 class="h5">Produce guide</h3>
                <p class="text-secondary mb-0">Explore product categories, descriptions and seasons.</p>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="info-card p-4 h-100">
                <div class="product-icon mb-3"><i class="bi bi-star"></i></div>
                <h3 class="h5">Bookmarks</h3>
                <p class="text-secondary mb-0">Keep favorite markets and produce entries together.</p>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="info-card p-4 h-100">
                <div class="product-icon mb-3"><i class="bi bi-share"></i></div>
                <h3 class="h5">Sharing</h3>
                <p class="text-secondary mb-0">Share useful market recommendations with others.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Team Section (5 Members) */}
      <section className="section section-soft" id="team">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-soft"><i className="bi bi-people-fill me-1"></i>Project Team</span>
            <h2 className="section-title display-6 mt-3">The People Behind FreshFind</h2>
            <p className="section-sub mb-2">Meet the dedicated development team who designed and built this discovery platform.</p>
            <span className="badge bg-light text-success border border-success-subtle small"><i className="bi bi-award-fill me-1 text-success"></i>Aptech TechWiz &bull; Development Team</span>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Member 1: Project Manager */}
            <div className="col-md-6 col-lg-4">
              <article className="team-card h-100 p-4 text-center rounded-4 border bg-white shadow-sm position-relative">
                <div className="team-avatar-wrapper mb-3 mx-auto">
                  <img
                    src="/assets/Images/team/noman.jpg"
                    alt="Noman Ali Qazi"
                    className="team-avatar-img"
                  />
                </div>
                <span className="badge bg-success-subtle text-success border border-success-subtle mb-2">Project Manager</span>
                <h4 className="h5 fw-bold mb-1">Noman Ali Qazi</h4>
                <p className="small text-secondary mb-3">Project Lead &amp; Strategy</p>
                <p className="small text-muted mb-4">
                  Coordinates project milestones, user experience research, and local community outreach to ensure seamless farmers market cataloging.
                </p>
                <div className="team-socials d-flex justify-content-center gap-2 pt-2 border-top">
                  <a href="#" className="team-social-btn" aria-label="LinkedIn profile" title="LinkedIn"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="team-social-btn" aria-label="GitHub profile" title="GitHub"><i className="bi bi-github"></i></a>
                  <a href="mailto:noman@freshfind.example" className="team-social-btn" aria-label="Email Noman" title="Email"><i className="bi bi-envelope-fill"></i></a>
                </div>
              </article>
            </div>

            {/* Member 2: Frontend Developer */}
            <div className="col-md-6 col-lg-4">
              <article className="team-card h-100 p-4 text-center rounded-4 border bg-white shadow-sm position-relative">
                <div className="team-avatar-wrapper mb-3 mx-auto">
                  <img
                    src="/assets/Images/team/sufiyan.jpg"
                    alt="Sufiyan ALi"
                    className="team-avatar-img"
                  />
                </div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle mb-2">Frontend Developer</span>
                <h4 className="h5 fw-bold mb-1">Sufiyan ALi</h4>
                <p className="small text-secondary mb-3">Senior Frontend &amp; JS Engineer</p>
                <p className="small text-muted mb-4">
                  Engineered responsive Bootstrap 5 architecture, real-time area searches, geolocation nearest-market finder, and download features.
                </p>
                <div className="team-socials d-flex justify-content-center gap-2 pt-2 border-top">
                  <a href="#" className="team-social-btn" aria-label="LinkedIn profile" title="LinkedIn"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="team-social-btn" aria-label="GitHub profile" title="GitHub"><i className="bi bi-github"></i></a>
                  <a href="mailto:sufiyan@freshfind.example" className="team-social-btn" aria-label="Email Sufiyan" title="Email"><i className="bi bi-envelope-fill"></i></a>
                </div>
              </article>
            </div>

            {/* Member 3: UI/UX Designer */}
            <div className="col-md-6 col-lg-4">
              <article className="team-card h-100 p-4 text-center rounded-4 border bg-white shadow-sm position-relative">
                <div className="team-avatar-wrapper mb-3 mx-auto">
                  <img
                    src="/assets/Images/team/abdul_rehman.jpg"
                    alt="Abdul Rehman"
                    className="team-avatar-img"
                  />
                </div>
                <span className="badge bg-warning-subtle text-dark border border-warning-subtle mb-2">UI/UX Designer</span>
                <h4 className="h5 fw-bold mb-1">Abdul Rehman</h4>
                <p className="small text-secondary mb-3">Lead Interaction &amp; Brand Designer</p>
                <p className="small text-muted mb-4">
                  Designed the fresh brand color system, glassmorphism design tokens, accessible mobile chat interface, and cohesive card hierarchies.
                </p>
                <div className="team-socials d-flex justify-content-center gap-2 pt-2 border-top">
                  <a href="#" className="team-social-btn" aria-label="LinkedIn profile" title="LinkedIn"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="team-social-btn" aria-label="Dribbble profile" title="Dribbble"><i className="bi bi-dribbble"></i></a>
                  <a href="mailto:abdulrehman@freshfind.example" className="team-social-btn" aria-label="Email Abdul Rehman" title="Email"><i className="bi bi-envelope-fill"></i></a>
                </div>
              </article>
            </div>

            {/* Member 4: Backend / Data Developer */}
            <div className="col-md-6 col-lg-4">
              <article className="team-card h-100 p-4 text-center rounded-4 border bg-white shadow-sm position-relative">
                <div className="team-avatar-wrapper mb-3 mx-auto">
                  <img
                    src="/assets/Images/team/basit.jpg"
                    alt="Abdul Basit"
                    className="team-avatar-img"
                  />
                </div>
                <span className="badge bg-info-subtle text-dark border border-info-subtle mb-2">Analyzer</span>
                <h4 className="h5 fw-bold mb-1">Abdul Basit</h4>
                <p className="small text-secondary mb-3">Data Architect &amp; Geodata Lead</p>
                <p className="small text-muted mb-4">
                  Structured JSON schema, verified coordinates for Karachi market zones, and integrated Haversine calculation datasets.
                </p>
                <div className="team-socials d-flex justify-content-center gap-2 pt-2 border-top">
                  <a href="#" className="team-social-btn" aria-label="LinkedIn profile" title="LinkedIn"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="team-social-btn" aria-label="GitHub profile" title="GitHub"><i className="bi bi-github"></i></a>
                  <a href="mailto:basit@freshfind.example" className="team-social-btn" aria-label="Email Abdul Basit" title="Email"><i className="bi bi-envelope-fill"></i></a>
                </div>
              </article>
            </div>

            {/* Member 5: Content & Research Lead */}
            <div className="col-md-6 col-lg-4">
              <article className="team-card h-100 p-4 text-center rounded-4 border bg-white shadow-sm position-relative">
                <div className="team-avatar-wrapper mb-3 mx-auto">
                  <img
                    src="/assets/Images/team/shahbaz.jpg"
                    alt="Shahbaz Khan"
                    className="team-avatar-img"
                  />
                </div>
                <span className="badge bg-secondary-subtle text-dark border border-secondary-subtle mb-2">Content &amp; Research</span>
                <h4 className="h5 fw-bold mb-1">Shahbaz Khan</h4>
                <p className="small text-secondary mb-3">Agricultural Research &amp; Produce Lead</p>
                <p className="small text-muted mb-4">
                  Researched seasonal crop patterns in Sindh, categorized farm-to-table produce taxonomy, and compiled assistant Q&amp;A datasets.
                </p>
                <div className="team-socials d-flex justify-content-center gap-2 pt-2 border-top">
                  <a href="#" className="team-social-btn" aria-label="LinkedIn profile" title="LinkedIn"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="team-social-btn" aria-label="Twitter profile" title="X/Twitter"><i className="bi bi-twitter-x"></i></a>
                  <a href="mailto:shahbaz@freshfind.example" className="team-social-btn" aria-label="Email Shahbaz" title="Email"><i className="bi bi-envelope-fill"></i></a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Approach & Experience */}
      <section class="section">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-6">
              <div class="info-card p-4 p-lg-5 h-100">
                <span class="badge-soft">Our approach</span>
                <h3 class="mt-3">Clear information</h3>
                <p class="text-secondary mb-0">
                  Market names, locations, schedules and produce information are presented in a simple format so users can make their own shopping plans.
                </p>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="info-card p-4 p-lg-5 h-100">
                <span class="badge-soft">Our experience</span>
                <h3 class="mt-3">Designed for mobile and desktop</h3>
                <p class="text-secondary mb-0">
                  FreshFind uses a responsive Bootstrap layout so the same core features remain easy to access on smaller and larger screens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
